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

function assertSecretRejectedWithoutDisclosure(action, secretMaterial) {
  assert.throws(action, (error) => {
    assert.equal(error instanceof ConfigValidationError, true);
    assert.equal(error.code, "SECRET_CONFIG_REJECTED");
    for (const surface of [error.message, error.stack ?? "", error.configPath, JSON.stringify(error)]) {
      assert.equal(surface.includes(secretMaterial), false);
    }
    return true;
  });
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

test("normalized secret assignment markers fail closed without disclosing values", () => {
  const rawSecret = "hns-core-005-secret-sentinel";
  for (const marker of ["api_key", "apikey", "authorization", "cookie", "private_key", "privatekey"]) {
    const rawValue = `https://example.invalid/repository?${marker}=${rawSecret}`;
    assert.throws(
      () => loadHarnessConfig({
        schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
        framework: { repository: rawValue },
      }),
      (error) => {
        assert.equal(error instanceof ConfigValidationError, true);
        assert.equal(error.code, "SECRET_CONFIG_REJECTED");
        assert.equal(error.message.includes(rawSecret), false);
        assert.equal(error.message.includes(rawValue), false);
        assert.equal(error.configPath.includes(rawSecret), false);
        return true;
      },
    );
  }
});

test("provider credentials fail closed without leaking through error surfaces", () => {
  for (const secret of [
    ["glpat", "hnsCore005SecuritySentinel001"].join("-"),
    ["AI", "za", "HnsCore005SecuritySentinel001"].join(""),
    ["sk", "live", "HnsCore005SecuritySentinel001"].join("_"),
  ]) {
    assertSecretRejectedWithoutDisclosure(
      () => loadHarnessConfig({
        schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
        framework: { repository: secret },
      }),
      secret,
    );
  }
});

test("quoted, compact, case, and separator secret assignments fail closed", () => {
  const sentinel = "hnsCore005AssignmentSentinel001";
  for (const value of [
    `api_key=${sentinel}`,
    `"Api-Key" = "${sentinel}"`,
    `AUTHORIZATION='${sentinel}'`,
    `cookie:${sentinel}`,
    `private.key = "${sentinel}"`,
    `TOKENVALUE=${sentinel}`,
    `password_hash='${sentinel}'`,
    `clientSecret="${sentinel}"`,
    `credential-value=${sentinel}`,
  ]) {
    assertSecretRejectedWithoutDisclosure(
      () => loadHarnessConfig({
        schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
        framework: { repository: value },
      }),
      sentinel,
    );
  }
});

test("secret-shaped unknown keys are redacted before entering any error surface", () => {
  const sentinel = "hnsCore005UnknownKeySentinel001";
  for (const key of [
    `github_pat_${sentinel}`,
    ["glpat", sentinel].join("-"),
    ["AI", "za", sentinel].join(""),
    ["sk", "live", sentinel].join("_"),
    `client-credential-${sentinel}`,
  ]) {
    assert.throws(
      () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, [key]: true }),
      (error) => {
        assert.equal(error instanceof ConfigValidationError, true);
        assert.equal(error.code, "SECRET_CONFIG_REJECTED");
        assert.equal(error.configPath, "[REDACTED]");
        for (const surface of [error.message, error.stack ?? "", error.configPath, JSON.stringify(error)]) {
          assert.equal(surface.includes(key), false);
          assert.equal(surface.includes(sentinel), false);
        }
        return true;
      },
    );
  }

  assert.throws(
    () => loadHarnessConfig({ schema_version: HARNESS_CONFIG_SCHEMA_VERSION, surprise_option: true }),
    (error) => {
      assert.equal(error instanceof ConfigValidationError, true);
      assert.equal(error.code, "UNKNOWN_CONFIG_KEY");
      assert.equal(error.configPath, "config.surprise_option");
      assert.match(error.message, /config\.surprise_option/);
      return true;
    },
  );
});

test("ordinary repository and path text remains valid", () => {
  const config = loadHarnessConfig({
    schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
    framework: { repository: "https://github.com/example/token-parsing-guide.git" },
    audit: { path: "/var/lib/harness/glpat-overview/AIza-reference/sk_live_examples" },
  });
  assert.equal(config.framework.repository, "https://github.com/example/token-parsing-guide.git");
  assert.equal(config.audit.path, "/var/lib/harness/glpat-overview/AIza-reference/sk_live_examples");
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

test("JWT bearer environment names are denied while safe child names remain narrowable", () => {
  for (const name of ["CI_JOB_JWT", "CI_JOB_JWT_V2"]) {
    assert.throws(
      () => buildChildEnvironmentPolicy(loadHarnessConfig({
        schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
        environment: { allowlist: [name] },
      })),
      (error) => error instanceof ConfigValidationError && error.code === "SECRET_CONFIG_REJECTED",
    );
  }

  const host = loadHarnessConfig({
    schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
    environment: { allowlist: ["LANG", "TOOL_MODE"] },
  });
  assert.deepEqual(buildChildEnvironmentPolicy(host).allowlist, ["LANG", "TOOL_MODE"]);

  const project = resolveHarnessConfig({
    host,
    project: {
      schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
      environment: { allowlist: ["LANG"] },
    },
  });
  assert.deepEqual(buildChildEnvironmentPolicy(project).allowlist, ["LANG"]);
});

test("credential-source and process-injection environment classes are denied", () => {
  for (const name of [
    "KUBECONFIG",
    "CLOUDSDK_CONFIG",
    "GIT_SSH_COMMAND",
    "GIT_ASKPASS",
    "NODE_OPTIONS",
    "LD_PRELOAD",
    "DYLD_INSERT_LIBRARIES",
    "BASH_ENV",
    "ENV",
    "TF_CLI_CONFIG_FILE",
    "OCI_CLI_CONFIG_FILE",
    "DOCKER_CONFIG",
    "GIT_CREDENTIAL_HELPER",
    "PYTHONSTARTUP",
    "JAVA_TOOL_OPTIONS",
    "DYLD_LIBRARY_PATH",
    "PROMPT_COMMAND",
  ]) {
    assert.throws(
      () => buildChildEnvironmentPolicy(loadHarnessConfig({
        schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
        environment: { allowlist: [name] },
      })),
      (error) => error instanceof ConfigValidationError && error.code === "SECRET_CONFIG_REJECTED",
    );
  }
});

test("explicit safe environment names remain immutable and narrowable", () => {
  const safeNames = ["LANG", "LC_ALL", "TOOL_MODE", "CI_JOB_ID", "HARNESS_COLOR"];
  const host = loadHarnessConfig({
    schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
    environment: { allowlist: safeNames },
  });
  const policy = buildChildEnvironmentPolicy(host);
  assert.deepEqual(policy.allowlist, safeNames);
  assert.equal(Object.isFrozen(host), true);
  assert.equal(Object.isFrozen(host.environment), true);
  assert.equal(Object.isFrozen(host.environment.allowlist), true);
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(Object.isFrozen(policy.allowlist), true);

  const narrowed = resolveHarnessConfig({
    host,
    project: {
      schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
      environment: { allowlist: ["LANG", "TOOL_MODE", "HARNESS_COLOR"] },
    },
  });
  assert.deepEqual(buildChildEnvironmentPolicy(narrowed).allowlist, ["LANG", "TOOL_MODE", "HARNESS_COLOR"]);
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
