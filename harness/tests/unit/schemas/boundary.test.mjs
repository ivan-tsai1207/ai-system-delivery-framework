import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";

const sourceDirectory = new URL("../../../src/schemas/", import.meta.url);
const declarationUrl = new URL("../../../dist/schemas/registry.d.ts", import.meta.url);
const require = createRequire(import.meta.url);

test("registry is pinned to Ajv 8.20.0 and imports the Draft 2020-12 entrypoint", async () => {
  const packagePath = require.resolve("ajv/package.json");
  const packageMetadata = JSON.parse(await readFile(packagePath, "utf8"));
  const registrySource = await readFile(new URL("registry.ts", sourceDirectory), "utf8");

  assert.equal(packageMetadata.version, "8.20.0");
  assert.match(registrySource, /import \{ Ajv2020 \} from "ajv\/dist\/2020\.js"/);
  assert.match(registrySource, /new Ajv2020\(/);
});

test("schema production modules have no adapter, filesystem, process, network, or persistence dependencies", async () => {
  const filenames = (await readdir(sourceDirectory)).filter((name) => name.endsWith(".ts"));
  const sources = await Promise.all(
    filenames.map((filename) => readFile(new URL(filename, sourceDirectory), "utf8")),
  );
  const source = sources.join("\n");

  assert.doesNotMatch(source, /(?:from|import\s*\()["'](?:\.\.\/)*(?:adapters|execution|parser)\//);
  assert.doesNotMatch(source, /(?:node:fs|node:child_process|node:http|node:https|node:net)/);
  assert.doesNotMatch(source, /\bprocess\s*\./);
  assert.doesNotMatch(source, /(?:readFile|writeFile|fetch\s*\(|localStorage|sessionStorage)/);
  assert.match(source, /from "ajv\/dist\/2020\.js"/);
  assert.doesNotMatch(source, /^import\s+Ajv\b/m);
  assert.match(source, /import type \{ ErrorObject, ValidateFunction \} from "ajv"/);
});

test("public validation declarations do not expose Ajv vendor contracts", async () => {
  const declaration = await readFile(declarationUrl, "utf8");

  assert.doesNotMatch(declaration, /\bAjv(?:2020)?\b/);
  assert.doesNotMatch(declaration, /\bErrorObject\b/);
  assert.doesNotMatch(declaration, /\bValidateFunction\b/);
  assert.match(declaration, /status: "VALID"/);
  assert.match(declaration, /status: "INVALID"/);
  assert.match(declaration, /status: "MIGRATION_REQUIRED"/);
  assert.match(declaration, /status: "UNKNOWN_SCHEMA"/);
  assert.match(declaration, /status: "UNKNOWN_VERSION"/);
});
