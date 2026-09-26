import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CanonicalHashMismatchError,
  CanonicalSerializationError,
  REDACTED_HASH_CONTEXT,
  canonicalStringify,
  canonicalUtf8Bytes,
  encodeUtf8,
  hashCanonicalValue,
  sha256Hex,
  verifyCanonicalHash,
} from "../../../../dist/core/hash/index.js";

const fixtureDirectory = new URL("../../../fixtures/config/", import.meta.url);

async function readJson(name) {
  return JSON.parse(await readFile(new URL(name, fixtureDirectory), "utf8"));
}

test("canonical serialization sorts keys and emits no insignificant whitespace", () => {
  assert.equal(
    canonicalStringify({ z: 2, a: { y: true, x: null }, list: [3, "two"] }),
    '{"a":{"x":null,"y":true},"list":[3,"two"],"z":2}',
  );
});

test("equivalent Unicode normalization forms produce byte-identical UTF-8", () => {
  const composed = canonicalUtf8Bytes({ label: "Caf\u00e9", "r\u00e9sum\u00e9": true });
  const decomposed = canonicalUtf8Bytes({ label: "Cafe\u0301", "re\u0301sume\u0301": true });
  assert.deepEqual(decomposed, composed);
});

test("canonical identity is independent of fixture path and source key order", async () => {
  const first = await readJson("canonical-a.json");
  const second = await readJson("canonical-b.json");
  assert.notEqual(new URL("canonical-a.json", fixtureDirectory).pathname, new URL("canonical-b.json", fixtureDirectory).pathname);
  assert.deepEqual(canonicalUtf8Bytes(first), canonicalUtf8Bytes(second));
  assert.equal(hashCanonicalValue(first), hashCanonicalValue(second));
});

test("SHA-256 matches published empty and abc vectors", () => {
  assert.equal(sha256Hex([]), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  assert.equal(sha256Hex(encodeUtf8("abc")), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

test("SHA-256 processes multiple blocks using the standard long vector", () => {
  assert.equal(
    sha256Hex(encodeUtf8("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")),
    "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
  );
});

test("UTF-8 encoding is deterministic for ASCII, BMP, and astral code points", () => {
  assert.deepEqual([...encodeUtf8("A\u00e9\ud83d\ude00")], [0x41, 0xc3, 0xa9, 0xf0, 0x9f, 0x98, 0x80]);
  assert.deepEqual([...encodeUtf8("\ud800")], [0xef, 0xbf, 0xbd]);
});

test("ordering changes do not change canonical SHA-256", () => {
  assert.equal(
    hashCanonicalValue({ beta: [2, 1], alpha: "value" }),
    hashCanonicalValue({ alpha: "value", beta: [2, 1] }),
  );
});

test("verifyCanonicalHash accepts an exact lowercase SHA-256", () => {
  const value = { accepted: true };
  const expected = hashCanonicalValue(value);
  assert.equal(verifyCanonicalHash(value, expected), expected);
});

test("hash mismatch diagnostics expose hashes but redact artifact context and input", () => {
  const secretInput = { payload: "do-not-leak-this-value" };
  assert.throws(
    () => verifyCanonicalHash(secretInput, "0".repeat(64)),
    (error) => {
      assert.equal(error instanceof CanonicalHashMismatchError, true);
      assert.equal(error.code, "CANONICAL_HASH_MISMATCH");
      assert.equal(error.diagnostic.artifactContext, REDACTED_HASH_CONTEXT);
      assert.equal(error.diagnostic.expectedSha256, "0".repeat(64));
      assert.equal(error.diagnostic.actualSha256, hashCanonicalValue(secretInput));
      assert.equal(JSON.stringify(error).includes("do-not-leak-this-value"), false);
      assert.equal(error.message.includes("do-not-leak-this-value"), false);
      return true;
    },
  );
});

test("invalid expected hash formats fail closed before comparison", () => {
  assert.throws(() => verifyCanonicalHash({}, "ABC"), /64 lowercase hexadecimal/);
  assert.throws(() => verifyCanonicalHash({}, "A".repeat(64)), /64 lowercase hexadecimal/);
});

test("acyclic shared references are accepted without introducing identity metadata", () => {
  const shared = { value: "shared" };
  assert.equal(
    canonicalStringify({ first: shared, second: shared }),
    '{"first":{"value":"shared"},"second":{"value":"shared"}}',
  );
});

test("true cycles fail closed", () => {
  const circular = {};
  circular.self = circular;
  assert.throws(() => canonicalStringify(circular), CanonicalSerializationError);
});

test("non-canonical JavaScript values fail closed", () => {
  assert.throws(() => canonicalStringify({ value: undefined }), CanonicalSerializationError);
  assert.throws(() => canonicalStringify({ value: Number.NaN }), /finite/);
  assert.throws(() => canonicalStringify({ value: Number.POSITIVE_INFINITY }), /finite/);
  assert.throws(() => canonicalStringify(new Date()), /plain objects/);
  assert.throws(() => canonicalStringify([, "sparse"]), /dense/);
});

test("accessors, symbols, and normalized-key collisions fail closed", () => {
  const accessor = {};
  Object.defineProperty(accessor, "value", { enumerable: true, get: () => "unsafe" });
  const symbolValue = { okay: true };
  symbolValue[Symbol("hidden")] = false;
  const collision = { "\u00e9": 1, "e\u0301": 2 };
  assert.throws(() => canonicalStringify(accessor), /data properties/);
  assert.throws(() => canonicalStringify(symbolValue), /symbol keys/);
  assert.throws(() => canonicalStringify(collision), /unique after Unicode normalization/);
});

test("negative zero is normalized to zero", () => {
  assert.equal(canonicalStringify({ value: -0 }), '{"value":0}');
  assert.equal(hashCanonicalValue({ value: -0 }), hashCanonicalValue({ value: 0 }));
});
