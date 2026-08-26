import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { Ajv2020 } from "ajv/dist/2020.js";

const schemaDirectory = new URL("../../../schemas/", import.meta.url);
const fixtureDirectory = new URL("../../fixtures/schemas/", import.meta.url);
const contracts = [
  ["work-item-v2", "work-item-v2"],
  ["review-assignment-v1", "review-assignment"],
  ["role-evidence-v1", "role-evidence"],
  ["finding-v1", "finding"],
  ["delivery-assurance-v1", "delivery-assurance"],
];

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

for (const [schemaName, fixturePrefix] of contracts) {
  test(`${schemaName} JSON artifact agrees with its deterministic fixture matrix`, async () => {
    const schema = await readJson(new URL(`${schemaName}.schema.json`, schemaDirectory));
    const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false });
    const validate = ajv.compile(schema);
    const valid = await readJson(new URL(`${fixturePrefix}-valid.json`, fixtureDirectory));
    const missing = await readJson(new URL(`${fixturePrefix}-missing-required.json`, fixtureDirectory));
    const invalidEnum = await readJson(new URL(`${fixturePrefix}-invalid-enum.json`, fixtureDirectory));
    const wrongVersion = await readJson(new URL(`${fixturePrefix}-wrong-schema-version.json`, fixtureDirectory));

    assert.equal(validate(valid), true);
    assert.equal(validate(missing), false);
    assert.equal(validate(invalidEnum), false);
    assert.equal(validate(wrongVersion), false);
  });
}
