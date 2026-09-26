import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createSchemaRegistry } from "../../../dist/schemas/index.js";
import { parseWorkItem } from "../../../dist/work-items/index.js";

const fixtureUrl = new URL("../../fixtures/work-items/HNS-FIXTURE-001.md", import.meta.url);
const assignedWorkItemUrl = new URL("../../../../work-items/HNS-EXEC-001.md", import.meta.url);
const packageUrl = new URL("../../../package.json", import.meta.url);
const packageLockUrl = new URL("../../../package-lock.json", import.meta.url);

async function fixture() {
  return readFile(fixtureUrl, "utf8");
}

function expectFailure(result, predicate) {
  assert.equal(result.ok, false);
  assert.ok(result.error.length > 0);
  assert.equal(result.error.every((detail) => detail.error_code === "HNS-WI-001"), true);
  assert.ok(result.error.some(predicate), JSON.stringify(result.error, null, 2));
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.error), true);
}

function replaceOnce(markdown, before, after) {
  assert.ok(markdown.includes(before), `Fixture does not contain ${before}`);
  return markdown.replace(before, after);
}

test("canonical assigned v2 Work Item parses into an immutable normalized value", async () => {
  const markdown = await readFile(assignedWorkItemUrl, "utf8");
  const result = parseWorkItem("work-items/HNS-EXEC-001.md", markdown);

  assert.equal(result.ok, true, result.ok ? undefined : JSON.stringify(result.error));
  const value = result.value;
  assert.equal(value.id, "HNS-EXEC-001");
  assert.equal(value.schema_version, "harness.work-item/v2");
  assert.equal(value.document_hash, "sha256:421d15f66f028803c1068071794124dfb88202a0c4934c3c9560183321d5601b");
  assert.deepEqual(value.required_gates, ["IMPLEMENTATION_GATE"]);
  assert.deepEqual(value.dependencies.map(({ path }) => path), [
    "work-items/HNS-CORE-005.md",
    "mdast-util-from-markdown@2.0.3",
  ]);
  assert.equal(Object.isFrozen(value), true);
  assert.equal(Object.isFrozen(value.acceptance_criteria), true);
  assert.equal(Object.isFrozen(value.acceptance_criteria[0]), true);
  assert.deepEqual(createSchemaRegistry().validateDocument(value), {
    status: "VALID",
    schemaId: "harness.work-item/v2",
  });
  assert.throws(() => value.read_scope.push("mutation"), TypeError);
});

test("equivalent parses are deterministic and preserve checkbox completion", async () => {
  const markdown = await fixture();
  const first = parseWorkItem("work-items/HNS-FIXTURE-001.md", markdown);
  const second = parseWorkItem("work-items/HNS-FIXTURE-001.md", markdown);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.deepEqual(second, first);
  assert.deepEqual(first.value.acceptance_criteria.map(({ completed }) => completed), [false, true]);
  assert.equal(first.value.requirement_references[0].path, "AC-HNS-005");
  assert.equal(first.value.requirement_references[1].anchor, "Section 17");
});

test("document hash binds exact Markdown content", async () => {
  const markdown = await fixture();
  const changed = replaceOnce(markdown, "Exercise the canonical", "Exercise a canonical");
  const first = parseWorkItem("work-items/HNS-FIXTURE-001.md", markdown);
  const second = parseWorkItem("work-items/HNS-FIXTURE-001.md", changed);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.notEqual(first.value.document_hash, second.value.document_hash);
});

test("the Markdown AST dependency is exact-pinned at 2.0.3", async () => {
  const packageMetadata = JSON.parse(await readFile(packageUrl, "utf8"));
  const packageLock = JSON.parse(await readFile(packageLockUrl, "utf8"));

  assert.equal(packageMetadata.dependencies["mdast-util-from-markdown"], "2.0.3");
  assert.equal(packageLock.packages[""].dependencies["mdast-util-from-markdown"], "2.0.3");
  assert.equal(packageLock.packages["node_modules/mdast-util-from-markdown"].version, "2.0.3");
});

test("parser production code has no adapter, enforcement, process, network, or credential capability", async () => {
  const source = await readFile(new URL("../../../src/work-items/parser.ts", import.meta.url), "utf8");

  assert.doesNotMatch(source, /(?:from|import\s*\()["'](?:\.\.\/)*(?:adapters|enforcement|gates|audit)\//);
  assert.doesNotMatch(source, /(?:node:child_process|node:http|node:https|node:net)/);
  assert.doesNotMatch(source, /\bprocess\s*\./);
  assert.doesNotMatch(source, /\b(?:fetch|spawn|writeFile)\s*\(/);
});

test("a valid REVIEWER binding parses with typed artifact identity", async () => {
  let markdown = await fixture();
  markdown = replaceOnce(markdown, "| Role | `IMPLEMENTER` |", "| Role | `REVIEWER` |");
  markdown = replaceOnce(markdown, "| Phase | `IMPLEMENTATION` |", "| Phase | `REVIEW` |");
  markdown = replaceOnce(markdown, "| Review Profile | `N/A` |", "| Review Profile | `TECH_REVIEWER` |");
  markdown = replaceOnce(markdown, "| Reviewed Artifact | `N/A` |", "| Reviewed Artifact | `harness/src/index.ts` |");
  markdown = replaceOnce(markdown, "| Reviewed Artifact Hash | `N/A` |", `| Reviewed Artifact Hash | \`sha256:${"a".repeat(64)}\` |`);
  markdown = replaceOnce(markdown, "| Maker Execution ID | `N/A` |", "| Maker Execution ID | `maker-001` |");

  const result = parseWorkItem("work-items/HNS-FIXTURE-001.md", markdown);
  assert.equal(result.ok, true, result.ok ? undefined : JSON.stringify(result.error));
  assert.equal(result.value.review_profile, "TECH_REVIEWER");
  assert.deepEqual(result.value.reviewed_artifact, { kind: "reviewed-artifact", path: "harness/src/index.ts" });
  assert.equal(result.value.maker_execution_id, "maker-001");
});

test("v1 and unknown schema versions fail closed", async () => {
  const markdown = await fixture();
  for (const version of ["harness.work-item/v1", "harness.work-item/v3"]) {
    const result = parseWorkItem(
      "work-items/HNS-FIXTURE-001.md",
      replaceOnce(markdown, "harness.work-item/v2", version),
    );
    expectFailure(result, (detail) => detail.field === "Schema Version");
  }
});

test("absolute, traversing, noncanonical, and filename-mismatched source paths fail closed", async () => {
  const markdown = await fixture();
  for (const path of [
    "/work-items/HNS-FIXTURE-001.md",
    "../work-items/HNS-FIXTURE-001.md",
    "work-items/../HNS-FIXTURE-001.md",
    "work-items\\HNS-FIXTURE-001.md",
    "docs/HNS-FIXTURE-001.md",
    "work-items/HNS-OTHER-001.md",
  ]) {
    expectFailure(parseWorkItem(path, markdown), (detail) => detail.field === "path" || detail.field === "ID");
  }
});

test("missing, duplicate, and unknown sections fail closed", async () => {
  const markdown = await fixture();
  const missing = markdown.replace(/## Objective\n\nExercise the canonical Work Item parser\.\n\n/, "");
  const duplicate = `${markdown}\n## Objective\n\nDuplicate.\n`;
  const unknown = `${markdown}\n## Surprise\n\nUnknown.\n`;

  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", missing), (detail) => detail.section === "Objective");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", duplicate), (detail) => detail.section === "Objective" && detail.actual === "duplicate");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", unknown), (detail) => detail.section === "Surprise");
});

test("malformed, duplicate, missing, and unknown metadata fail closed", async () => {
  const markdown = await fixture();
  const malformed = replaceOnce(markdown, "| Field | Value |", "| Field | Value | Extra |");
  const duplicatedField = replaceOnce(markdown, "| Title | Parser fixture |", "| Title | Parser fixture |\n| Title | Again |");
  const missingField = markdown.replace("| Feature | `fixture-feature` |\n", "");
  const unknownField = replaceOnce(markdown, "| Feature | `fixture-feature` |", "| Feature | `fixture-feature` |\n| Vendor | `none` |");

  for (const candidate of [malformed, duplicatedField, missingField, unknownField]) {
    expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", candidate), (detail) => detail.section === "Metadata");
  }
});

test("duplicate metadata tables fail closed", async () => {
  const markdown = await fixture();
  const table = markdown.slice(markdown.indexOf("| Field | Value |"), markdown.indexOf("\n\n## Objective"));
  const candidate = markdown.replace("\n\n## Objective", `\n\n${table}\n\n## Objective`);
  expectFailure(
    parseWorkItem("work-items/HNS-FIXTURE-001.md", candidate),
    (detail) => detail.section === "Metadata" && detail.actual === "2",
  );
});

test("invalid metadata enums fail closed without inference", async () => {
  const markdown = await fixture();
  const cases = [
    ["IMPLEMENTER", "DEVELOPER", "Role"],
    ["IMPLEMENTATION", "BUILD", "Phase"],
    ["TODO", "READY", "Status"],
    ["LOW", "NONE", "Risk Class"],
  ];
  for (const [before, after, field] of cases) {
    const candidate = replaceOnce(markdown, `\`${before}\``, `\`${after}\``);
    expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", candidate), (detail) => detail.field === field);
  }
});

test("invalid non-reviewer and reviewer-only bindings fail closed", async () => {
  const markdown = await fixture();
  const nonReviewer = replaceOnce(markdown, "| Review Profile | `N/A` |", "| Review Profile | `TECH_REVIEWER` |");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", nonReviewer), (detail) => detail.field === "review-only fields");

  let reviewer = replaceOnce(markdown, "| Role | `IMPLEMENTER` |", "| Role | `REVIEWER` |");
  reviewer = replaceOnce(reviewer, "| Phase | `IMPLEMENTATION` |", "| Phase | `REVIEW` |");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", reviewer), (detail) => detail.field === "Review Profile");
});

test("unsafe scope and dependency paths fail closed", async () => {
  const markdown = await fixture();
  const scopeEscape = replaceOnce(markdown, "`harness/src/**`", "`../harness/src/**`");
  const dependencyEscape = replaceOnce(markdown, "## Dependencies\n\n- None", "## Dependencies\n\n- `../outside.md`");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", scopeEscape), (detail) => detail.section === "Read Scope");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", dependencyEscape), (detail) => detail.section === "Dependencies");
});

test("Write Scope overlap with Forbidden Scope fails closed", async () => {
  const markdown = await fixture();
  const candidate = replaceOnce(markdown, "`docs/**`", "`harness/src/**`");
  expectFailure(
    parseWorkItem("work-items/HNS-FIXTURE-001.md", candidate),
    (detail) => detail.section === "Write Scope" && detail.expected.includes("no overlap"),
  );
});

test("malformed, duplicate, and mismatched acceptance criteria fail closed", async () => {
  const markdown = await fixture();
  const noCheckbox = replaceOnce(markdown, "- [ ] `AC-HNS-FIXTURE-001-001`", "- `AC-HNS-FIXTURE-001-001`");
  const duplicate = replaceOnce(markdown, "AC-HNS-FIXTURE-001-002", "AC-HNS-FIXTURE-001-001");
  const mismatched = replaceOnce(markdown, "AC-HNS-FIXTURE-001-001", "AC-HNS-OTHER-001-001");
  for (const candidate of [noCheckbox, duplicate, mismatched]) {
    expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", candidate), (detail) => detail.section === "Acceptance Criteria");
  }
});

test("DONE Work Items require every acceptance criterion to be checked", async () => {
  const markdown = replaceOnce(await fixture(), "| Status | `TODO` |", "| Status | `DONE` |");
  expectFailure(
    parseWorkItem("work-items/HNS-FIXTURE-001.md", markdown),
    (detail) => detail.section === "Acceptance Criteria" && detail.expected.includes("Status is DONE"),
  );
});

test("unknown, duplicate, and missing phase Gates fail closed", async () => {
  const markdown = await fixture();
  const unknown = replaceOnce(markdown, "`IMPLEMENTATION_GATE`", "`CUSTOM_GATE`");
  const duplicate = replaceOnce(markdown, "- `IMPLEMENTATION_GATE`", "- `IMPLEMENTATION_GATE`\n- `IMPLEMENTATION_GATE`");
  const missing = replaceOnce(markdown, "- `IMPLEMENTATION_GATE`", "- `SPEC_GATE`");
  for (const candidate of [unknown, duplicate, missing]) {
    expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", candidate), (detail) => detail.section === "Required Gates");
  }
});

test("missing and malformed requirement-reference fields fail closed", async () => {
  const markdown = await fixture();
  const missing = markdown.replace("- ADR: `N/A`\n", "");
  const malformed = replaceOnce(markdown, "- Feature Spec: `N/A`", "- Feature Spec: plain text");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", missing), (detail) => detail.field === "ADR");
  expectFailure(parseWorkItem("work-items/HNS-FIXTURE-001.md", malformed), (detail) => detail.field === "Feature Spec");
});
