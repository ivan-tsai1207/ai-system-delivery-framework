import assert from "node:assert/strict";
import test from "node:test";

import {
  assertOneOf,
  defineCoreValue,
  FINDING_SEVERITIES,
  FINDING_STATUSES,
  GATE_IDS,
  GATE_RESULT_STATUSES,
  REVIEW_DECISIONS,
  REVIEW_PROFILES,
  RISK_CLASSES,
  WORK_ITEM_PHASES,
  WORK_ITEM_ROLES,
  WORK_ITEM_STATUSES,
} from "../../../dist/index.js";

test("canonical work item enums match the SDD and Work Item Contract", () => {
  assert.deepEqual(WORK_ITEM_ROLES, [
    "PRODUCT_ARCHITECT",
    "UX_DESIGNER",
    "IMPLEMENTER",
    "REVIEWER",
  ]);
  assert.deepEqual(WORK_ITEM_PHASES, [
    "SPEC",
    "DESIGN",
    "IMPLEMENTATION",
    "REVIEW",
    "RELEASE",
  ]);
  assert.deepEqual(WORK_ITEM_STATUSES, [
    "TODO",
    "IN_PROGRESS",
    "BLOCKED",
    "REVIEW",
    "DONE",
    "CANCELLED",
  ]);
  assert.deepEqual(RISK_CLASSES, ["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
  assert.deepEqual(REVIEW_PROFILES, [
    "SPEC_REVIEWER",
    "UX_REVIEWER",
    "TECH_REVIEWER",
    "QA_REVIEWER",
    "SECURITY_REVIEWER",
    "DELIVERY_ASSURANCE_REVIEWER",
  ]);
  assert.deepEqual(GATE_IDS, [
    "SPEC_GATE",
    "DESIGN_GATE",
    "IMPLEMENTATION_GATE",
    "DELIVERY_ASSURANCE_GATE",
    "RELEASE_GATE",
  ]);
});

test("finding and decision enums remain distinct canonical values", () => {
  assert.deepEqual(FINDING_SEVERITIES, [
    "BLOCKING",
    "MAJOR",
    "MINOR",
    "OBSERVATION",
  ]);
  assert.deepEqual(FINDING_STATUSES, [
    "OPEN",
    "RESOLVED",
    "ACCEPTED_RISK",
    "SUPERSEDED",
  ]);
  assert.deepEqual(REVIEW_DECISIONS, [
    "PASS",
    "REQUEST_CHANGES",
    "BLOCK",
  ]);
  assert.deepEqual(GATE_RESULT_STATUSES, [
    "PASS",
    "FAILED",
    "NEEDS_CLARIFICATION",
  ]);
});

test("assertOneOf accepts canonical enum values and rejects representative invalid values", () => {
  assert.equal(assertOneOf(WORK_ITEM_ROLES, "IMPLEMENTER", "role"), "IMPLEMENTER");
  assert.equal(assertOneOf(GATE_IDS, "IMPLEMENTATION_GATE", "gate"), "IMPLEMENTATION_GATE");

  assert.throws(
    () => assertOneOf(WORK_ITEM_ROLES, "DEVELOPER", "role"),
    /role must be one of:/,
  );
  assert.throws(
    () => assertOneOf(GATE_RESULT_STATUSES, "REQUEST_CHANGES", "gate status"),
    /gate status must be one of:/,
  );
});

test("defineCoreValue freezes representative nested domain values", () => {
  const finding = defineCoreValue({
    schema_version: "harness.finding/v1",
    finding_id: "F-001",
    review_profile: "TECH_REVIEWER",
    owner_role: "IMPLEMENTER",
    work_item_id: "HNS-CORE-002",
    artifact_ref: { kind: "source", path: "harness/src/core/domain.ts" },
    artifact_hash: "sha256:test",
    requirement_references: [
      { kind: "acceptance-criterion", id: "AC-HNS-CORE-002-002", path: "work-items/HNS-CORE-002.md" },
    ],
    description: "Representative finding value.",
    severity: "MINOR",
    evidence_references: ["unit-test"],
    required_action: "None.",
    status: "OPEN",
  });

  assert.equal(Object.isFrozen(finding), true);
  assert.equal(Object.isFrozen(finding.artifact_ref), true);
  assert.equal(Object.isFrozen(finding.requirement_references), true);
  assert.equal(Object.isFrozen(finding.requirement_references[0]), true);
  assert.throws(
    () => {
      finding.evidence_references.push("mutation");
    },
    /extensible|read only|Cannot add property/,
  );
});

test("defineCoreValue preserves shared references inside the immutable snapshot", () => {
  const shared = { value: "shared" };

  const value = defineCoreValue({
    first: shared,
    second: shared,
  });

  assert.equal(value.first, value.second);
  assert.notEqual(value.first, shared);
  assert.equal(Object.isFrozen(shared), false);
  assert.equal(Object.isFrozen(value.first), true);
  assert.equal(Object.isFrozen(value), true);
});

test("defineCoreValue rejects circular mutable input", () => {
  const value = { refs: [] };
  value.refs.push(value);

  assert.throws(
    () => defineCoreValue(value),
    /circular references/,
  );
});

test("defineCoreValue rejects accessor-backed properties without invoking getters", () => {
  let getterCalls = 0;
  const value = {};
  Object.defineProperty(value, "nested", {
    enumerable: true,
    get() {
      getterCalls += 1;
      return {};
    },
  });

  assert.throws(
    () => defineCoreValue(value),
    /data properties, not accessors/,
  );
  assert.equal(getterCalls, 0);
});

test("defineCoreValue rejects fresh-object getters before they can expose mutable values", () => {
  const value = {
    get nested() {
      return {};
    },
  };

  assert.throws(
    () => defineCoreValue(value),
    /data properties, not accessors/,
  );
});

test("defineCoreValue rejects nested accessors in ordinary plain objects", () => {
  const value = {
    ordinary: {
      get nested() {
        return {};
      },
    },
  };

  assert.throws(
    () => defineCoreValue(value),
    /data properties, not accessors/,
  );
});

test("defineCoreValue snapshots proxy dynamic get behavior into immutable data", () => {
  let dynamicGets = 0;
  const proxy = new Proxy({}, {
    get(_target, property) {
      if (property === "nested") {
        dynamicGets += 1;
        return { mutable: true };
      }
      return undefined;
    },
    getOwnPropertyDescriptor(_target, property) {
      if (property === "nested") {
        return {
          configurable: true,
          enumerable: true,
          value: { stable: true },
          writable: true,
        };
      }
      return undefined;
    },
    ownKeys() {
      return ["nested"];
    },
  });

  const value = defineCoreValue(proxy);

  assert.equal(dynamicGets, 0);
  assert.deepEqual(value.nested, { stable: true });
  assert.equal(Object.isFrozen(value), true);
  assert.equal(Object.isFrozen(value.nested), true);
  assert.throws(
    () => {
      value.nested.extra = "mutation";
    },
    /extensible|read only|Cannot add property/,
  );
});

test("defineCoreValue traverses and freezes symbol-keyed data properties", () => {
  const key = Symbol("domain");
  const value = defineCoreValue({
    [key]: { nested: ["value"] },
  });

  assert.deepEqual(value[key].nested, ["value"]);
  assert.equal(Object.isFrozen(value[key]), true);
  assert.equal(Object.isFrozen(value[key].nested), true);
  assert.throws(
    () => {
      value[key].nested.push("mutation");
    },
    /extensible|read only|Cannot add property/,
  );
});

test("defineCoreValue rejects symbol-keyed accessor properties", () => {
  const key = Symbol("domain");
  const value = {};
  Object.defineProperty(value, key, {
    enumerable: true,
    get() {
      return {};
    },
  });

  assert.throws(
    () => defineCoreValue(value),
    /data properties, not accessors/,
  );
});

test("defineCoreValue rejects mutable or unsupported non-plain objects", () => {
  class CustomDomainValue {
    constructor() {
      this.value = "mutable";
    }
  }

  assert.throws(
    () => defineCoreValue({ timestamp: new Date("2026-08-19T00:00:00.000Z") }),
    /primitives, arrays, or plain objects/,
  );
  assert.throws(
    () => defineCoreValue({ values: new Map([["key", "value"]]) }),
    /primitives, arrays, or plain objects/,
  );
  assert.throws(
    () => defineCoreValue({ values: new Set(["value"]) }),
    /primitives, arrays, or plain objects/,
  );
  assert.throws(
    () => defineCoreValue({ value: new CustomDomainValue() }),
    /primitives, arrays, or plain objects/,
  );
  assert.throws(
    () => defineCoreValue({ value() { return "function"; } }),
    /primitives, arrays, or plain objects/,
  );
});
