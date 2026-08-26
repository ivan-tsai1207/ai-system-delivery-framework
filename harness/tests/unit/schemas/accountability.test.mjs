import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createSchemaRegistry } from "../../../dist/schemas/index.js";

const fixtureDirectory = new URL("../../fixtures/schemas/", import.meta.url);
const contracts = [
  ["review-assignment", "harness.review-assignment/v1", "harness.review-assignment/v2"],
  ["role-evidence", "harness.role-evidence/v1", "harness.role-evidence/v2"],
  ["finding", "harness.finding/v1", "harness.finding/v2"],
  ["delivery-assurance", "harness.delivery-assurance/v1", "harness.delivery-assurance/v2"],
];

async function fixture(name) {
  return JSON.parse(await readFile(new URL(name, fixtureDirectory), "utf8"));
}

for (const [fixturePrefix, schemaId, unknownSchemaId] of contracts) {
  test(`${fixturePrefix} valid fixture passes deterministically`, async () => {
    const registry = createSchemaRegistry();
    const value = await fixture(`${fixturePrefix}-valid.json`);
    const before = JSON.stringify(value);
    const first = registry.validate(schemaId, value);

    assert.deepEqual(first, { status: "VALID", schemaId });
    assert.deepEqual(registry.validate(schemaId, value), first);
    assert.equal(JSON.stringify(value), before);
  });

  test(`${fixturePrefix} missing required field fails with a required issue`, async () => {
    const result = createSchemaRegistry().validate(
      schemaId,
      await fixture(`${fixturePrefix}-missing-required.json`),
    );

    assert.equal(result.status, "INVALID");
    assert.ok(result.issues.some((issue) => issue.code === "required"));
  });

  test(`${fixturePrefix} invalid enum or value fails closed`, async () => {
    const result = createSchemaRegistry().validate(
      schemaId,
      await fixture(`${fixturePrefix}-invalid-enum.json`),
    );

    assert.equal(result.status, "INVALID");
    assert.ok(result.issues.some((issue) => issue.code === "enum" || issue.code === "pattern"));
  });

  test(`${fixturePrefix} wrong schema version is never accepted or downgraded`, async () => {
    const registry = createSchemaRegistry();
    const value = await fixture(`${fixturePrefix}-wrong-schema-version.json`);
    const exactResult = registry.validate(schemaId, value);
    const dispatchResult = registry.validateDocument(value);

    assert.equal(exactResult.status, "INVALID");
    assert.ok(exactResult.issues.some((issue) => issue.code === "const"));
    assert.deepEqual(dispatchResult, {
      status: "UNKNOWN_VERSION",
      schemaId: unknownSchemaId,
      schemaName: schemaId.slice(0, schemaId.lastIndexOf("/")),
      requestedVersion: "v2",
      supportedVersions: ["v1"],
    });
  });
}
