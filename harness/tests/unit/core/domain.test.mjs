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

test("defineCoreValue rejects circular mutable input", () => {
  const value = { refs: [] };
  value.refs.push(value);

  assert.throws(
    () => defineCoreValue(value),
    /circular references/,
  );
});
