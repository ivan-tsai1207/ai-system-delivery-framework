import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import { Ajv2020 } from "ajv/dist/2020.js";

import {
  CANONICAL_SCHEMA_IDS,
  DuplicateSchemaError,
  InvalidSchemaRegistrationError,
  projectContextSchema,
  SchemaRegistry,
  createSchemaRegistry,
} from "../../../dist/schemas/index.js";

const schemaDirectory = new URL("../../../schemas/", import.meta.url);
const fixtureDirectory = new URL("../../fixtures/schemas/", import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

test("registry enumerates all twelve canonical schema IDs in SDD order", () => {
  const registry = createSchemaRegistry();

  assert.equal(CANONICAL_SCHEMA_IDS.length, 12);
  assert.deepEqual(registry.listSchemaIds(), CANONICAL_SCHEMA_IDS);
  assert.deepEqual(registry.enumerate(), CANONICAL_SCHEMA_IDS);
  assert.equal(Object.isFrozen(registry.listSchemaIds()), true);
});

test("registry resolves only exact IDs and returns immutable schema snapshots", () => {
  const registry = createSchemaRegistry();

  for (const schemaId of CANONICAL_SCHEMA_IDS) {
    const schema = registry.resolve(schemaId);
    assert.ok(schema);
    assert.equal(schema.$id, schemaId);
    assert.equal(Object.isFrozen(schema), true);
  }

  assert.equal(registry.resolve("harness.work-item"), undefined);
  assert.equal(registry.resolve("harness.work-item/v1"), undefined);
  assert.equal(registry.resolve("harness.work-item/v3"), undefined);
});

test("registry rejects duplicate IDs before validator fallback can occur", () => {
  assert.throws(
    () => new SchemaRegistry([projectContextSchema, projectContextSchema]),
    (error) => error instanceof DuplicateSchemaError
      && error.code === "DUPLICATE_SCHEMA"
      && /harness\.project-context\/v1/.test(error.message),
  );
});

test("invalid-keyword registration rolls back before a valid same-ID retry", () => {
  const schemaId = "example.invalid-keyword/v1";
  const registry = new SchemaRegistry();

  assert.throws(
    () => registry.register({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: schemaId,
      type: "object",
      invalidKeyword: true,
    }),
    (error) => error instanceof InvalidSchemaRegistrationError
      && error.code === "INVALID_SCHEMA_REGISTRATION",
  );
  assert.equal(registry.resolve(schemaId), undefined);
  assert.deepEqual(registry.listSchemaIds(), []);
  assert.deepEqual(registry.validate(schemaId, {}), {
    status: "UNKNOWN_SCHEMA",
    schemaId,
  });

  registry.register({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: schemaId,
    type: "object",
    properties: { value: { type: "string" } },
  });

  assert.deepEqual(registry.listSchemaIds(), [schemaId]);
  assert.equal(registry.validate(schemaId, { value: "valid" }).status, "VALID");
  assert.equal(registry.validate(schemaId, { value: 1 }).status, "INVALID");
});

test("unresolved-reference registration rolls back before a valid same-ID retry", () => {
  const schemaId = "example.unresolved-reference/v1";
  const registry = new SchemaRegistry();

  assert.throws(
    () => registry.register({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: schemaId,
      type: "object",
      properties: { value: { $ref: "example.missing/v1" } },
    }),
    (error) => error instanceof InvalidSchemaRegistrationError
      && error.code === "INVALID_SCHEMA_REGISTRATION",
  );
  assert.equal(registry.resolve(schemaId), undefined);
  assert.deepEqual(registry.listSchemaIds(), []);
  assert.deepEqual(registry.validate(schemaId, {}), {
    status: "UNKNOWN_SCHEMA",
    schemaId,
  });

  registry.register({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: schemaId,
    type: "object",
    properties: { value: { type: "string" } },
  });

  assert.deepEqual(registry.listSchemaIds(), [schemaId]);
  assert.equal(registry.validate(schemaId, { value: "valid" }).status, "VALID");
  assert.equal(registry.validate(schemaId, { value: 1 }).status, "INVALID");
});

test("registration snapshots caller schemas without mutating or retaining mutable input", () => {
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "example.snapshot/v1",
    type: "object",
    properties: { value: { type: "string" } },
  };
  const before = JSON.stringify(schema);
  const registry = new SchemaRegistry([schema]);

  schema.properties.value.type = "number";

  assert.equal(before, JSON.stringify({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "example.snapshot/v1",
    type: "object",
    properties: { value: { type: "string" } },
  }));
  assert.deepEqual(registry.validate("example.snapshot/v1", { value: "kept" }), {
    status: "VALID",
    schemaId: "example.snapshot/v1",
  });
  assert.equal(registry.validate("example.snapshot/v1", { value: 1 }).status, "INVALID");
});

test("unknown schema and unknown version results are distinct and fail closed", () => {
  const registry = createSchemaRegistry();

  assert.deepEqual(registry.validate("harness.not-registered/v1", {}), {
    status: "UNKNOWN_SCHEMA",
    schemaId: "harness.not-registered/v1",
  });
  assert.deepEqual(registry.validate("not-a-versioned-id", {}), {
    status: "UNKNOWN_SCHEMA",
    schemaId: "not-a-versioned-id",
  });
  assert.deepEqual(registry.validate("harness.work-item/v99", {}), {
    status: "UNKNOWN_VERSION",
    schemaId: "harness.work-item/v99",
    schemaName: "harness.work-item",
    requestedVersion: "v99",
    supportedVersions: ["v2"],
  });
});

test("unknown versions never fall back to a supported validator", async () => {
  const registry = createSchemaRegistry();
  const validV2 = await readJson(new URL("work-item-v2-valid.json", fixtureDirectory));

  assert.equal(registry.validate("harness.work-item/v3", validV2).status, "UNKNOWN_VERSION");
});

test("all JSON artifacts declare Draft 2020-12 and compile with Ajv2020", async () => {
  const filenames = (await readdir(schemaDirectory)).filter((name) => name.endsWith(".schema.json"));
  const artifacts = await Promise.all(
    filenames.map((filename) => readJson(new URL(filename, schemaDirectory))),
  );
  const artifactIds = artifacts.map((schema) => schema.$id);
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false });

  assert.equal(filenames.length, 12);
  assert.deepEqual(new Set(artifactIds), new Set(CANONICAL_SCHEMA_IDS));
  for (const schema of artifacts) {
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.equal(typeof ajv.compile(schema), "function");
  }
});
