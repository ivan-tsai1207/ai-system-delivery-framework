import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  ERROR_CATALOG,
  ERROR_CODES,
  EXIT_CODES,
  EXIT_CODE_REGISTRY,
  HarnessError,
  REDACTED_VALUE,
  assertErrorCatalogIntegrity,
  createHarnessError,
  getErrorDefinition,
  getExitCodeDefinition,
  getExitCodeForError,
  isExitCode,
  isHarnessErrorCode,
} from "../../../dist/errors/index.js";

const EXPECTED_CATALOG = [
  ["HNS-INPUT-001", "INVALID_INPUT", "No after same input", "Maybe", "FAILED_RUNTIME / no start", 2],
  ["HNS-INTAKE-001", "INTENT_UNCLEAR", "Yes after clarification", "Yes", "BLOCKED_MISSING_INFO", 2],
  ["HNS-INTAKE-002", "MISSING_CRITICAL_REQUIREMENT", "Yes after answer", "Yes", "BLOCKED_MISSING_INFO", 2],
  ["HNS-REPO-001", "REPOSITORY_NAME_CONFLICT", "Yes with approved target change", "Yes", "REPO_CREATION_FAILED", 8],
  ["HNS-REPO-002", "REPOSITORY_CREATION_FAILED", "Conditional", "Maybe", "REPO_CREATION_FAILED", 8],
  ["HNS-BOOT-001", "BOOTSTRAP_FAILED", "Conditional from journal", "Maybe", "REPO_CREATION_FAILED / provisioning failed", 8],
  ["HNS-WI-001", "WORK_ITEM_INVALID", "No until corrected", "Maybe", "no execution / FAILED_RUNTIME", 2],
  ["HNS-CTX-001", "CONTEXT_BUILD_FAILED", "Conditional", "Maybe", "FAILED_RUNTIME", 3],
  ["HNS-CTX-002", "MISSING_REQUIRED_CONTEXT", "Yes after context fix", "Maybe", "no start / blocked", 3],
  ["HNS-POL-001", "POLICY_BUILD_FAILED", "Conditional", "Maybe", "FAILED_RUNTIME", 4],
  ["HNS-POL-002", "POLICY_CONFLICT", "No until policy resolved", "Yes when governance conflict", "BLOCKED_PERMISSION / conflict", 4],
  ["HNS-ADP-001", "ADAPTER_UNAVAILABLE", "Yes with compatible adapter", "No", "FAILED_RUNTIME", 5],
  ["HNS-ADP-002", "ADAPTER_CAPABILITY_MISMATCH", "Yes with capability change", "Maybe", "FAILED_RUNTIME", 5],
  ["HNS-ENF-001", "ENFORCEMENT_CAPABILITY_UNAVAILABLE", "No in same environment", "Yes", "no launch / FAILED_RUNTIME", 5],
  ["HNS-PERM-001", "UNAUTHORIZED_WRITE", "No for same operation", "No", "BLOCKED_PERMISSION", 4],
  ["HNS-PERM-002", "UNAUTHORIZED_TOOL", "No for same operation", "No", "BLOCKED_PERMISSION", 4],
  ["HNS-CMD-001", "RESTRICTED_COMMAND", "After valid approval / new task", "Yes when approvable", "running blocked / cancelled", 4],
  ["HNS-SPEC-001", "SPEC_GAP", "After canonical spec update", "Yes", "BLOCKED_SPEC_GAP", 3],
  ["HNS-SPEC-002", "SPEC_CONFLICT", "After authority resolution", "Yes", "BLOCKED_SPEC_CONFLICT", 3],
  ["HNS-GATE-001", "GATE_FAILED", "After artifact correction", "Maybe", "FAILED_GATE", 6],
  ["HNS-RISK-001", "RISK_DOWNGRADE_REJECTED", "New trusted classification only", "Maybe", "BLOCKED_PERMISSION", 4],
  ["HNS-RVW-001", "SELF_APPROVAL_REJECTED", "Yes with independent execution", "No", "no review start / FAILED_GATE", 6],
  ["HNS-RVW-002", "REQUIRED_REVIEW_MISSING", "Yes after assignment / review", "Maybe", "FAILED_GATE", 6],
  ["HNS-RVW-003", "REVIEWED_ARTIFACT_CHANGED", "Yes with new artifact hash / review", "No", "FAILED_GATE", 6],
  ["HNS-FND-001", "OPEN_BLOCKING_FINDING", "Yes after authorized resolution", "Maybe", "FAILED_GATE", 6],
  ["HNS-ASR-001", "DELIVERY_ASSURANCE_FAILED", "Yes after findings / reviews resolved", "Maybe", "FAILED_GATE", 6],
  ["HNS-APR-001", "APPROVAL_REQUIRED", "Yes after decision", "Yes", "waiting / no operation", 7],
  ["HNS-APR-002", "APPROVAL_REJECTED", "No for same operation", "Yes to create new request", "CANCELLED or continue without optional op", 7],
  ["HNS-RUN-001", "RUNTIME_FAILED", "Conditional", "Maybe", "FAILED_RUNTIME", 5],
  ["HNS-AUD-001", "AUDIT_WRITE_FAILED", "No during unsafe continuation", "Yes", "FAILED_RUNTIME + terminate", 5],
];

const EXPECTED_EXIT_REGISTRY = [
  [0, "Success", "Command完成且required gates / writes符合command semantics"],
  [1, "Generic", "未分類internal failure；應視為需要補catalog的defect"],
  [2, "Input / Intake / Work Item", "CLI input、intent、requirement或Work Item invalid"],
  [3, "Spec / Context", "Spec gap / conflict、missing context、context build failure"],
  [4, "Permission / Policy / Command", "Policy conflict、unauthorized operation、restricted command"],
  [5, "Adapter / Enforcement / Runtime / Audit", "Adapter、hard enforcement、process或audit failure"],
  [6, "Gate", "Required Gate failed / needs clarification"],
  [7, "Approval", "Required approval pending、rejected或expired"],
  [8, "Repository / Bootstrap", "Repository target、creation、transaction或bootstrap failure"],
];

const baseOptions = () => ({
  correlationId: "execution-errors-001",
  causeCategory: "validation",
});

test("01 catalog contains exactly the 30 canonical codes in Section 33 order", () => {
  assert.equal(ERROR_CATALOG.length, 30);
  assert.deepEqual(ERROR_CODES, EXPECTED_CATALOG.map(([code]) => code));
  assert.equal(new Set(ERROR_CODES).size, 30);
});

test("02 catalog metadata and exit mappings match every canonical Section 33 row", () => {
  assert.deepEqual(
    ERROR_CATALOG.map(({ code, name, retryable, humanAction, lifecycleMapping, exitCode }) => [
      code,
      name,
      retryable,
      humanAction,
      lifecycleMapping,
      exitCode,
    ]),
    EXPECTED_CATALOG,
  );
});

test("03 every default message exactly matches its canonical Name / Default Message", () => {
  assert.deepEqual(
    ERROR_CATALOG.map(({ name, defaultMessage }) => [name, defaultMessage]),
    EXPECTED_CATALOG.map(([, name]) => [name, name]),
  );
});

test("04 catalog arrays and all entries are frozen", () => {
  assert.equal(Object.isFrozen(ERROR_CATALOG), true);
  assert.equal(Object.isFrozen(ERROR_CODES), true);
  assert.equal(ERROR_CATALOG.every(Object.isFrozen), true);
});

test("05 catalog mutation is rejected without changing canonical state", () => {
  assert.throws(() => ERROR_CATALOG.push({}), TypeError);
  assert.throws(() => {
    ERROR_CATALOG[0].exitCode = 1;
  }, TypeError);
  assert.equal(ERROR_CATALOG.length, 30);
  assert.equal(ERROR_CATALOG[0].exitCode, 2);
});

test("06 exit registry contains exactly the central codes 0 through 8", () => {
  assert.deepEqual(EXIT_CODES, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(EXIT_CODE_REGISTRY.map(({ exitCode }) => exitCode), EXIT_CODES);
});

test("07 exit registry categories and meanings exactly match Section 34", () => {
  assert.deepEqual(
    EXIT_CODE_REGISTRY.map(({ exitCode, category, meaning }) => [exitCode, category, meaning]),
    EXPECTED_EXIT_REGISTRY,
  );
});

test("08 exit registry arrays and definitions are immutable", () => {
  assert.equal(Object.isFrozen(EXIT_CODES), true);
  assert.equal(Object.isFrozen(EXIT_CODE_REGISTRY), true);
  assert.equal(EXIT_CODE_REGISTRY.every(Object.isFrozen), true);
  assert.throws(() => EXIT_CODE_REGISTRY.pop(), TypeError);
});

test("09 every catalog error maps to exactly one registered exit code", () => {
  for (const definition of ERROR_CATALOG) {
    assert.equal(isExitCode(definition.exitCode), true);
    assert.equal(getExitCodeForError(definition.code), definition.exitCode);
    assert.equal(getExitCodeDefinition(definition.exitCode).exitCode, definition.exitCode);
  }
});

test("10 no catalog error silently falls back to Generic exit code 1", () => {
  assert.equal(ERROR_CATALOG.some(({ exitCode }) => exitCode === 1), false);
  assert.equal(getExitCodeDefinition(1).category, "Generic");
});

test("11 lookup predicates and APIs return only canonical definitions", () => {
  assert.equal(isHarnessErrorCode("HNS-SPEC-002"), true);
  assert.equal(isHarnessErrorCode("HNS-UNKNOWN-999"), false);
  assert.equal(isExitCode(8), true);
  assert.equal(isExitCode(9), false);
  assert.equal(getErrorDefinition("HNS-SPEC-002").name, "SPEC_CONFLICT");
});

test("12 repeated lookups are deterministic and do not create mutable copies", () => {
  assert.strictEqual(getErrorDefinition("HNS-AUD-001"), getErrorDefinition("HNS-AUD-001"));
  assert.strictEqual(getExitCodeDefinition(5), getExitCodeDefinition(5));
  assert.equal(Object.isFrozen(getErrorDefinition("HNS-AUD-001")), true);
});

test("13 pure integrity validation accepts the canonical registries", () => {
  const before = JSON.stringify([ERROR_CATALOG, EXIT_CODE_REGISTRY]);
  assert.doesNotThrow(() => assertErrorCatalogIntegrity(ERROR_CATALOG, EXIT_CODE_REGISTRY));
  assert.equal(JSON.stringify([ERROR_CATALOG, EXIT_CODE_REGISTRY]), before);
});

test("14 duplicate error codes fail catalog integrity validation", () => {
  const duplicate = [...ERROR_CATALOG, ERROR_CATALOG[0]];
  assert.throws(
    () => assertErrorCatalogIntegrity(duplicate, EXIT_CODE_REGISTRY),
    /Duplicate Harness error code: HNS-INPUT-001/,
  );
});

test("15 unknown error codes fail catalog integrity validation", () => {
  const unknown = ERROR_CATALOG.map((entry, index) =>
    index === 0 ? { ...entry, code: "HNS-UNKNOWN-999" } : entry,
  );
  assert.throws(
    () => assertErrorCatalogIntegrity(unknown, EXIT_CODE_REGISTRY),
    /Unknown Harness error code in catalog/,
  );
});

test("16 a missing canonical catalog entry fails closed", () => {
  assert.throws(
    () => assertErrorCatalogIntegrity(ERROR_CATALOG.slice(1), EXIT_CODE_REGISTRY),
    /Missing Harness error catalog entry: HNS-INPUT-001/,
  );
});

test("17 duplicate central exit codes fail integrity validation", () => {
  assert.throws(
    () => assertErrorCatalogIntegrity(ERROR_CATALOG, [...EXIT_CODE_REGISTRY, EXIT_CODE_REGISTRY[0]]),
    /Duplicate Harness exit code: 0/,
  );
});

test("18 a missing central exit mapping fails integrity validation", () => {
  const withoutEight = EXIT_CODE_REGISTRY.filter(({ exitCode }) => exitCode !== 8);
  assert.throws(
    () => assertErrorCatalogIntegrity(ERROR_CATALOG, withoutEight),
    /Missing Harness exit-code registry entry: 8/,
  );
});

test("19 an out-of-range central exit mapping fails closed", () => {
  assert.throws(
    () => assertErrorCatalogIntegrity(ERROR_CATALOG, [...EXIT_CODE_REGISTRY, { exitCode: 9 }]),
    /Unknown Harness exit code in registry: 9/,
  );
});

test("20 unknown error-code lookup fails without Generic fallback", () => {
  assert.throws(() => getErrorDefinition("HNS-UNKNOWN-999"), /Unknown Harness error code/);
  assert.throws(
    () => new HarnessError("HNS-UNKNOWN-999", baseOptions()),
    /Unknown Harness error code/,
  );
});

test("21 unknown exit-code lookup fails closed", () => {
  assert.throws(() => getExitCodeDefinition(9), /Unknown Harness exit code: 9/);
});

test("22 HarnessError derives immutable default metadata and correlation fields", () => {
  const error = new HarnessError("HNS-POL-002", {
    correlationId: "session:policy-001",
    causeCategory: "policy.conflict",
  });
  assert.equal(error instanceof Error, true);
  assert.equal(error.name, "POLICY_CONFLICT");
  assert.equal(error.message, "POLICY_CONFLICT");
  assert.equal(error.defaultMessage, "POLICY_CONFLICT");
  assert.equal(error.retryable, "No until policy resolved");
  assert.equal(error.humanAction, "Yes when governance conflict");
  assert.equal(error.lifecycleMapping, "BLOCKED_PERMISSION / conflict");
  assert.equal(error.exitCode, 4);
  assert.equal(error.correlationId, "session:policy-001");
  assert.equal(error.causeCategory, "policy.conflict");
});

test("23 the factory exposes the same typed central behavior", () => {
  const error = createHarnessError("HNS-GATE-001", baseOptions());
  assert.equal(error instanceof HarnessError, true);
  assert.equal(error.exitCode, 6);
  assert.equal(error.name, "GATE_FAILED");
});

test("24 a safe custom message is preserved without changing canonical metadata", () => {
  const error = new HarnessError("HNS-APR-001", {
    ...baseOptions(),
    message: "Approval is required for the requested operation.",
  });
  assert.equal(error.message, "Approval is required for the requested operation.");
  assert.equal(error.defaultMessage, "APPROVAL_REQUIRED");
  assert.equal(error.name, "APPROVAL_REQUIRED");
  assert.equal(error.exitCode, 7);
});

test("25 caller exit-code override is compile-time impossible", () => {
  const tscPath = fileURLToPath(
    new URL("../../../node_modules/typescript/bin/tsc", import.meta.url),
  );
  const fixturePath = fileURLToPath(new URL("./harness-error.types.ts", import.meta.url));
  const result = spawnSync(
    process.execPath,
    [
      tscPath,
      "--ignoreConfig",
      "--noEmit",
      "--strict",
      "--exactOptionalPropertyTypes",
      "--noUncheckedIndexedAccess",
      "--target",
      "ES2024",
      "--lib",
      "ES2024",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      fixturePath,
    ],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("26 caller exit-code override fails closed at runtime", () => {
  assert.throws(
    () => new HarnessError("HNS-INPUT-001", { ...baseOptions(), exitCode: 0 }),
    /Unknown HarnessError option: exitCode/,
  );
});

test("27 raw Error causes are rejected", () => {
  assert.throws(
    () => new HarnessError("HNS-RUN-001", { ...baseOptions(), cause: new Error("vendor") }),
    /cause must be an authentic HarnessError/,
  );
});

test("28 raw objects, vendor-shaped objects, and forged causes are rejected", () => {
  for (const cause of [
    {},
    { vendor: "provider", message: "failure" },
    Object.create(HarnessError.prototype),
  ]) {
    assert.throws(
      () => new HarnessError("HNS-RUN-001", { ...baseOptions(), cause }),
      /cause must be an authentic HarnessError/,
    );
  }
});

test("29 an authentic typed HarnessError cause is accepted", () => {
  const cause = new HarnessError("HNS-CTX-002", baseOptions());
  const error = new HarnessError("HNS-CTX-001", {
    ...baseOptions(),
    causeCategory: "context.missing",
    cause,
  });
  assert.strictEqual(error.cause, cause);
  assert.equal(error.cause.code, "HNS-CTX-002");
});

test("30 nested typed causes serialize recursively with central mappings", () => {
  const root = new HarnessError("HNS-INPUT-001", baseOptions());
  const middle = new HarnessError("HNS-CTX-002", { ...baseOptions(), cause: root });
  const outer = new HarnessError("HNS-CTX-001", { ...baseOptions(), cause: middle });
  const serialized = outer.toJSON();
  assert.equal(serialized.exitCode, 3);
  assert.equal(serialized.cause.exitCode, 3);
  assert.equal(serialized.cause.cause.exitCode, 2);
});

test("31 sensitive key spelling and case variations are recursively redacted", () => {
  const error = new HarnessError("HNS-AUD-001", {
    ...baseOptions(),
    details: {
      token: "one",
      AccessToken: "two",
      refresh_token: "three",
      "api-key": "four",
      AUTHORIZATION: "five",
      Password: "six",
      client_secret: "seven",
      CREDENTIALS: "eight",
      "set-cookie": "nine",
    },
  });
  assert.deepEqual(
    Object.values(error.details),
    Array.from({ length: 9 }, () => REDACTED_VALUE),
  );
});

test("32 nested objects and arrays redact sensitive keys at every depth", () => {
  const error = new HarnessError("HNS-AUD-001", {
    ...baseOptions(),
    details: {
      request: {
        headers: [{ Authorization: "Bearer value" }, { Cookie: "session=value" }],
        response: { body: { refreshToken: "nested" }, status: 401 },
      },
    },
  });
  assert.equal(error.details.request.headers[0].Authorization, REDACTED_VALUE);
  assert.equal(error.details.request.headers[1].Cookie, REDACTED_VALUE);
  assert.equal(error.details.request.response.body.refreshToken, REDACTED_VALUE);
  assert.equal(error.details.request.response.status, 401);
});

test("33 serialized output never contains a synthetic secret under sensitive fields", () => {
  const secret = "SECRET_SHOULD_NOT_APPEAR";
  const cause = new HarnessError("HNS-ADP-001", {
    ...baseOptions(),
    details: { vendor: { apiKey: secret } },
  });
  const error = new HarnessError("HNS-RUN-001", {
    ...baseOptions(),
    details: { authorization: { raw: secret }, safe: "visible" },
    cause,
  });
  const serialized = JSON.stringify(error);
  assert.equal(serialized.includes(secret), false);
  assert.equal(serialized.includes(REDACTED_VALUE), true);
});

test("34 details are snapshots isolated from caller source mutation", () => {
  const source = { request: { path: "/before", password: "hidden" }, attempts: [1, 2] };
  const error = new HarnessError("HNS-RUN-001", { ...baseOptions(), details: source });
  source.request.path = "/after";
  source.attempts.push(3);
  assert.equal(error.details.request.path, "/before");
  assert.deepEqual(error.details.attempts, [1, 2]);
  assert.equal(error.details.request.password, REDACTED_VALUE);
});

test("35 serialized results are frozen and isolated between calls", () => {
  const error = new HarnessError("HNS-INPUT-001", {
    ...baseOptions(),
    details: { field: "role" },
  });
  const first = error.toJSON();
  const second = error.toJSON();
  assert.notStrictEqual(first, second);
  assert.notStrictEqual(first.details, second.details);
  assert.notStrictEqual(first.details, error.details);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.details), true);
  assert.throws(() => {
    first.details.field = "changed";
  }, TypeError);
  assert.equal(second.details.field, "role");
});

test("36 HarnessError instances, details, and nested typed causes are immutable", () => {
  const cause = new HarnessError("HNS-SPEC-001", baseOptions());
  const error = new HarnessError("HNS-GATE-001", { ...baseOptions(), cause });
  assert.equal(Object.isFrozen(error), true);
  assert.equal(Object.isFrozen(error.details), true);
  assert.equal(Object.isFrozen(cause), true);
  assert.throws(() => {
    error.exitCode = 0;
  }, TypeError);
  assert.throws(() => {
    error.message = "changed";
  }, TypeError);
});

test("37 circular, accessor, non-plain, sparse, and unsafe detail values fail closed", () => {
  const circular = {};
  circular.self = circular;
  let accessorRead = false;
  const accessor = {};
  Object.defineProperty(accessor, "value", {
    enumerable: true,
    get() {
      accessorRead = true;
      return "unsafe";
    },
  });
  const sparse = new Array(2);
  sparse[1] = "value";

  for (const details of [
    circular,
    accessor,
    { date: new Date(0) },
    { callback: () => "value" },
    { value: Number.POSITIVE_INFINITY },
    { sparse },
  ]) {
    assert.throws(() => new HarnessError("HNS-INPUT-001", { ...baseOptions(), details }));
  }
  assert.equal(accessorRead, false);
});

test("38 serialization is deterministic across repeated construction and calls", () => {
  const makeError = () =>
    new HarnessError("HNS-AUD-001", {
      correlationId: "execution-repeatable",
      causeCategory: "audit.write",
      message: "Audit record could not be persisted.",
      details: { sequence: 7, credential: "hidden", context: { stable: true } },
    });
  const first = makeError();
  const second = makeError();
  assert.equal(JSON.stringify(first), JSON.stringify(first));
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});
