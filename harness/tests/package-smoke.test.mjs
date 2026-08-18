import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { HARNESS_PACKAGE_NAME } from "../dist/index.js";

const packageRoot = new URL("../", import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, packageRoot), "utf8"));
}

test("compiled package loads through ESM", () => {
  assert.equal(HARNESS_PACKAGE_NAME, "@ivan-tsai1207/ai-system-delivery-harness");
});

test("package metadata pins the Node 24 LTS baseline", async () => {
  const packageJson = await readJson("package.json");

  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.engines.node, ">=24.19.0 <25");
  assert.equal(packageJson.engines.npm, ">=11.17.0 <12");
  assert.equal(packageJson.packageManager, "npm@11.17.0");
  assert.deepEqual(Object.keys(packageJson.devDependencies), ["typescript"]);
});

test("TypeScript configuration keeps strict Node-compatible settings", async () => {
  const tsconfig = await readJson("tsconfig.json");
  const options = tsconfig.compilerOptions;

  assert.equal(options.target, "ES2024");
  assert.equal(options.module, "NodeNext");
  assert.equal(options.moduleResolution, "NodeNext");
  assert.equal(options.strict, true);
  assert.equal(options.allowJs, false);
  assert.equal(options.skipLibCheck, false);
  assert.equal(options.noEmitOnError, true);
});
