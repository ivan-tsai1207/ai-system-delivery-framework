import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createSchemaRegistry } from "../../../dist/schemas/index.js";

const fixtureDirectory = new URL("../../fixtures/schemas/", import.meta.url);

async function fixture(name) {
  return JSON.parse(await readFile(new URL(name, fixtureDirectory), "utf8"));
}

test("work item v1 is recognized only as a non-executable migration source", async () => {
  const registry = createSchemaRegistry();
  const legacy = await fixture("work-item-v1-legacy.json");
  const before = JSON.stringify(legacy);

  const result = registry.validateDocument(legacy);

  assert.deepEqual(result, {
    status: "MIGRATION_REQUIRED",
    schemaId: "harness.work-item/v1",
    targetSchemaId: "harness.work-item/v2",
    executable: false,
  });
  assert.notEqual(result.status, "VALID");
  assert.equal(JSON.stringify(legacy), before);
  assert.equal("risk_class" in legacy, false);
  assert.equal("review_profile" in legacy, false);
});

test("valid work item v2 passes exact and document-directed validation", async () => {
  const registry = createSchemaRegistry();
  const value = await fixture("work-item-v2-valid.json");

  assert.deepEqual(registry.validate("harness.work-item/v2", value), {
    status: "VALID",
    schemaId: "harness.work-item/v2",
  });
  assert.deepEqual(registry.validateDocument(value), {
    status: "VALID",
    schemaId: "harness.work-item/v2",
  });
});

test("work item v2 missing fields and invalid enums are INVALID", async () => {
  const registry = createSchemaRegistry();
  const missing = registry.validate(
    "harness.work-item/v2",
    await fixture("work-item-v2-missing-required.json"),
  );
  const invalidEnum = registry.validate(
    "harness.work-item/v2",
    await fixture("work-item-v2-invalid-enum.json"),
  );

  assert.equal(missing.status, "INVALID");
  assert.ok(missing.issues.some((issue) => issue.code === "required"));
  assert.equal(invalidEnum.status, "INVALID");
  assert.ok(invalidEnum.issues.some((issue) => issue.code === "enum"));
});

test("work item wrong schema version is invalid for v2 and unknown for document dispatch", async () => {
  const registry = createSchemaRegistry();
  const wrongVersion = await fixture("work-item-v2-wrong-schema-version.json");

  const exactResult = registry.validate("harness.work-item/v2", wrongVersion);
  assert.equal(exactResult.status, "INVALID");
  assert.ok(exactResult.issues.some((issue) => issue.code === "const"));
  assert.deepEqual(registry.validateDocument(wrongVersion), {
    status: "UNKNOWN_VERSION",
    schemaId: "harness.work-item/v3",
    schemaName: "harness.work-item",
    requestedVersion: "v3",
    supportedVersions: ["v2"],
  });
});

test("validation is repeatable, stable, and does not mutate input", async () => {
  const registry = createSchemaRegistry();
  const value = await fixture("work-item-v2-invalid-enum.json");
  const before = JSON.stringify(value);

  const first = registry.validate("harness.work-item/v2", value);
  const second = registry.validate("harness.work-item/v2", value);

  assert.deepEqual(second, first);
  assert.equal(JSON.stringify(value), before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.status, "INVALID");
  assert.equal(Object.isFrozen(first.issues), true);
});
