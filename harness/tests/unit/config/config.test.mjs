import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ConfigValidationError,
  HARNESS_CONFIG_SCHEMA_VERSION,
  SECURE_BUILT_IN_CONFIG,
  buildChildEnvironmentPolicy,
  loadHarnessConfig,
  resolveHarnessConfig,
} from "../../../dist/config/index.js";

const fixtureDirectory = new URL("../../fixtures/config/", import.meta.url);

async function readJson(name) {
  return JSON.parse(await readFile(new URL(name, fixtureDirectory), "utf8"));
}

test("config loader accepts the exact v1 schema and returns immutable snapshots", async () => {
  const source = await readJson("host-valid.json");
  const config = loadHarnessConfig(source);
  source.context.initial_max_files = 999;
  assert.equal(config.schema_version, HARNESS_CONFIG_SCHEMA_VERSION);
  assert.equal(config.context.initial_max_files, 24);
  assert.equal(Object.isFrozen(config), true);
  assert.equal(Object.isFrozen(config.context), true);
  assert.equal(Object.isFrozen(config.environment.allowlist), true);
});

test("unknown schema versions fail closed without fallback", () => {
  assert.throws(
    () => loadHarnessConfig({ schema_version: "harness.config/v2" }),
    (error) => error instanceof ConfigValidationError && error.code === "UNSUPPORTED_CONFIG_VERSION",
  );
  assert.throws(
    () => loadHarnessConfig({}),
    (error) => error instanceof ConfigValidationError && error.code === "UNSUPPORTED_CONFIG_VERSION",
  );
});

test("unknown top-level and nested keys fail closed", async () => {
  assert.throws(
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, surprise: true }),
    (error) => error instanceof ConfigValidationError && error.code === "UNKNOWN_CONFIG_KEY",
  );
  await assert.rejects(
    async () => loadHarnessConfig(await readJson("unknown-key.json")),
    (error) => error instanceof ConfigValidationError && error.code === "UNKNOWN_CONFIG_KEY",
  );
});

test("secret-bearing keys and values are rejected without echoing raw material", async () => {
  const rawSecret = "github_pat_this-must-never-appear";
  for (const action of [
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, clientSecret: rawSecret }),
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, framework: { repository: rawSecret } }),
    async () => loadHarnessConfig(await readJson("secret-value.json")),
  ]) {
    try {
      await action();
      assert.fail("secret config unexpectedly accepted");
    } catch (error) {
      assert.equal(error instanceof ConfigValidationError, true);
      assert.equal(error.code, "SECRET_CONFIG_REJECTED");
      assert.equal(error.message.includes(rawSecret), false);
    }
  }
});

test("trusted host config overrides built-ins before project narrowing", async () => {
  const host = await readJson("host-valid.json");
  const project = await readJson("project-narrow.json");
  const effective = resolveHarnessConfig({ host, project });
  assert.equal(effective.github.default_visibility, "private");
  assert.deepEqual(effective.adapters.preference, ["codex"]);
  assert.equal(effective.context.initial_max_files, 12);
  assert.equal(effective.context.hard_max_bytes, 10_485_760);
  assert.equal(effective.timeouts.process_seconds, 600);
  assert.deepEqual(effective.environment.allowlist, ["LANG", "TOOL_MODE"]);
  assert.equal(effective.framework.repository, host.framework.repository);
  assert.equal(effective.audit.path, host.audit.path);
});

test("invocation applies a second narrowing-only layer", async () => {
  const effective = resolveHarnessConfig({
    host: await readJson("host-valid.json"),
    project: await readJson("project-narrow.json"),
    invocation: {
      schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
      context: { initial_max_files: 6 },
      timeouts: { process_seconds: 300 },
      environment: { allowlist: ["LANG"] },
    },
  });
  assert.equal(effective.context.initial_max_files, 6);
  assert.equal(effective.timeouts.process_seconds, 300);
  assert.deepEqual(effective.environment.allowlist, ["LANG"]);
});

test("project numeric policy cannot exceed host budgets or timeout", async () => {
  const host = await readJson("host-valid.json");
  for (const project of [
    { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, context: { initial_max_files: 25 } },
    { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, context: { hard_max_bytes: 20_971_521 } },
    { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, timeouts: { process_seconds: 901 } },
  ]) {
    assert.throws(
      () => resolveHarnessConfig({ host, project }),
      (error) => error instanceof ConfigValidationError && error.code === "CONFIG_NARROWING_VIOLATION",
    );
  }
});

test("project identity, audit path, and adapter order cannot change or expand", async () => {
  const host = await readJson("host-valid.json");
  for (const project of [
    { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, framework: { repository: "other-repository" } },
    { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, github: { default_owner: "other-owner" } },
    { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, audit: { path: "/tmp/agent-writable" } },
    { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, adapters: { preference: ["claude", "codex"] } },
  ]) {
    assert.throws(
      () => resolveHarnessConfig({ host, project }),
      (error) => error instanceof ConfigValidationError && error.code === "CONFIG_NARROWING_VIOLATION",
    );
  }
});

test("project visibility can become more restrictive but never more public", () => {
  const host = {
    schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
    github: { default_visibility: "internal" },
  };
  assert.equal(
    resolveHarnessConfig({ host, project: { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, github: { default_visibility: "private" } } }).github.default_visibility,
    "private",
  );
  assert.throws(
    () => resolveHarnessConfig({ host, project: { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, github: { default_visibility: "public" } } }),
    /may only narrow/,
  );
});

test("environment allowlist may only preserve host-approved safe names and order", async () => {
  const host = await readJson("host-valid.json");
  assert.throws(
    () => resolveHarnessConfig({ host, project: { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, environment: { allowlist: ["UNAPPROVED"] } } }),
    /may only narrow/,
  );
  assert.throws(
    () => resolveHarnessConfig({ host, project: { schema_version: HARNESS_CONFIG_SCHEMA_VERSION, environment: { allowlist: ["TOOL_MODE", "LANG"] } } }),
    /may only narrow/,
  );
});

test("cloud, SSH, registry, production, and secret environment names are denied", () => {
  for (const name of ["AWS_REGION", "SSH_AUTH_SOCK", "NPM_CONFIG_USERCONFIG", "GITHUB_TOKEN", "PRODUCTION_MODE", "API_KEY"]) {
    assert.throws(
      () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, environment: { allowlist: [name] } }),
      (error) => error instanceof ConfigValidationError && error.code === "SECRET_CONFIG_REJECTED",
    );
  }
});

test("child environment policy starts empty and contains names only", async () => {
  const effective = resolveHarnessConfig({
    host: await readJson("host-valid.json"),
    project: await readJson("project-narrow.json"),
  });
  const policy = buildChildEnvironmentPolicy(effective);
  assert.deepEqual(policy, {
    baseline: "EMPTY",
    inheritParentEnvironment: false,
    allowlist: ["LANG", "TOOL_MODE"],
  });
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(Object.isFrozen(policy.allowlist), true);
  assert.equal(JSON.stringify(policy).includes("process.env"), false);
});

test("context initial budgets cannot exceed hard ceilings", () => {
  assert.throws(
    () => loadHarnessConfig({
      schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
      context: { initial_max_files: 25, hard_max_files: 24 },
    }),
    /must not exceed/,
  );
});

test("config objects reject accessors, custom classes, symbols, and invalid arrays", () => {
  const accessor = { schema_version: HARNESS_CONFIG_SCHEMA_VERSION };
  Object.defineProperty(accessor, "context", { enumerable: true, get: () => ({}) });
  const symbolConfig = { schema_version: HARNESS_CONFIG_SCHEMA_VERSION };
  symbolConfig[Symbol("hidden")] = true;
  const sparsePreference = new Array(1);
  const customAllowlist = ["LANG"];
  customAllowlist.extra = "TOOL_MODE";
  assert.throws(() => loadHarnessConfig(accessor), /enumerable data property/);
  assert.throws(() => loadHarnessConfig(new (class Config {})()), /plain object/);
  assert.throws(() => loadHarnessConfig(symbolConfig), /symbol keys/);
  assert.throws(
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, adapters: { preference: [] } }),
    /must not be empty/,
  );
  assert.throws(
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, adapters: { preference: sparsePreference } }),
    /dense array/,
  );
  assert.throws(
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, environment: { allowlist: customAllowlist } }),
    /custom properties/,
  );
  assert.throws(
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, audit: { path: "bad\npath" } }),
    /normalized string/,
  );
});

test("secure built-in defaults are small, private, and environment-empty", () => {
  assert.equal(SECURE_BUILT_IN_CONFIG.github.default_visibility, "private");
  assert.equal(SECURE_BUILT_IN_CONFIG.context.initial_max_files, 24);
  assert.equal(SECURE_BUILT_IN_CONFIG.context.hard_max_files, 200);
  assert.deepEqual(SECURE_BUILT_IN_CONFIG.environment.allowlist, []);
  assert.equal(Object.isFrozen(SECURE_BUILT_IN_CONFIG), true);
});
