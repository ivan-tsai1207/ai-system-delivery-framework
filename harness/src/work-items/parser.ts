import { fromMarkdown } from "mdast-util-from-markdown";

import {
  GATE_IDS,
  REVIEW_PROFILES,
  RISK_CLASSES,
  WORK_ITEM_PHASES,
  WORK_ITEM_ROLES,
  WORK_ITEM_STATUSES,
  defineCoreValue,
  isOneOf,
  type ArtifactReference,
  type GateId,
  type ReviewProfile,
  type WorkItem,
  type WorkItemPhase,
  type WorkItemRole,
} from "../core/domain.js";
import { encodeUtf8, sha256Hex } from "../core/hash/index.js";

interface AstPosition {
  readonly start?: { readonly offset?: number };
  readonly end?: { readonly offset?: number };
}

interface AstNode {
  readonly type: string;
  readonly value?: unknown;
  readonly depth?: unknown;
  readonly ordered?: unknown;
  readonly checked?: unknown;
  readonly children?: readonly AstNode[];
  readonly position?: AstPosition;
}

export interface WorkItemParseErrorDetail {
  readonly path: string;
  readonly section?: string;
  readonly field?: string;
  readonly expected: string;
  readonly actual?: string;
  readonly error_code: "HNS-WI-001";
}

export type WorkItemParseResult =
  | Readonly<{ readonly ok: true; readonly value: WorkItem }>
  | Readonly<{ readonly ok: false; readonly error: readonly WorkItemParseErrorDetail[] }>;

export interface CanonicalReferenceTarget {
  readonly path: string;
  readonly anchors?: readonly string[];
  readonly reviewed_artifact_hash?: string;
}

export interface WorkItemParseContext {
  readonly canonical_targets: readonly CanonicalReferenceTarget[];
}

type ErrorInput = Omit<WorkItemParseErrorDetail, "path" | "error_code">;

const METADATA_FIELDS = [
  "Schema Version",
  "ID",
  "Title",
  "Role",
  "Feature",
  "Phase",
  "Status",
  "Spec Version",
  "Design Version",
  "Risk Class",
  "Review Profile",
  "Reviewed Artifact",
  "Reviewed Artifact Hash",
  "Maker Execution ID",
] as const;

const REQUIRED_SECTIONS = [
  "Objective",
  "Requirement References",
  "Read Scope",
  "Write Scope",
  "Forbidden Scope",
  "Scope",
  "Out of Scope",
  "Acceptance Criteria",
  "Required Gates",
  "Dependencies",
  "Blockers",
  "Notes",
] as const;

const REQUIREMENT_REFERENCE_FIELDS = [
  "Requirement IDs",
  "Feature Spec",
  "Screen IDs / Screen Specs",
  "ADR",
  "Architecture / SDD sections",
  "Review / Evidence references",
] as const;

const DEFAULT_PHASE_GATE: Readonly<Partial<Record<WorkItemPhase, GateId>>> = Object.freeze({
  SPEC: "SPEC_GATE",
  DESIGN: "DESIGN_GATE",
  IMPLEMENTATION: "IMPLEMENTATION_GATE",
  RELEASE: "RELEASE_GATE",
});

const GATE_PATHS: Readonly<Record<GateId, string>> = Object.freeze({
  SPEC_GATE: ".ai/gates/spec-gate.md",
  DESIGN_GATE: ".ai/gates/design-gate.md",
  IMPLEMENTATION_GATE: ".ai/gates/implementation-gate.md",
  DELIVERY_ASSURANCE_GATE: ".ai/gates/delivery-assurance-gate.md",
  RELEASE_GATE: ".ai/gates/release-gate.md",
});

const REVIEW_HASH_PATTERN = /^sha256:[0-9a-f]{64}$/;
const WORK_ITEM_ID_PATTERN = /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const ACCEPTANCE_CRITERION_SUFFIX = /^[0-9]{3}$/;
const WINDOWS_ABSOLUTE_PATH = /^[A-Za-z]:[\\/]/;
const URL_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;

function textOf(node: AstNode): string {
  if (typeof node.value === "string") {
    return node.value;
  }
  return (node.children ?? []).map((child) => textOf(child)).join("");
}

function inlineCodeValues(node: AstNode): readonly string[] {
  const values: string[] = [];
  const visit = (current: AstNode): void => {
    if (current.type === "inlineCode" && typeof current.value === "string") {
      values.push(current.value.trim());
    }
    for (const child of current.children ?? []) {
      visit(child);
    }
  };
  visit(node);
  return values;
}

function nodeSlice(markdown: string, node: AstNode): string | undefined {
  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;
  return typeof start === "number" && typeof end === "number"
    ? markdown.slice(start, end)
    : undefined;
}

function splitTableRow(line: string): readonly string[] | undefined {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
    return undefined;
  }

  const cells: string[] = [];
  let cell = "";
  let escaped = false;
  let codeFenceLength = 0;

  for (let index = 1; index < trimmed.length - 1; index += 1) {
    const character = trimmed[index];
    if (character === undefined) {
      continue;
    }
    if (escaped) {
      cell += character;
      escaped = false;
      continue;
    }
    if (character === "\\") {
      cell += character;
      escaped = true;
      continue;
    }
    if (character === "`") {
      let runLength = 1;
      while (trimmed[index + runLength] === "`") {
        runLength += 1;
      }
      if (codeFenceLength === 0) {
        codeFenceLength = runLength;
      } else if (codeFenceLength === runLength) {
        codeFenceLength = 0;
      }
      cell += "`".repeat(runLength);
      index += runLength - 1;
      continue;
    }
    if (character === "|" && codeFenceLength === 0) {
      cells.push(cell.trim());
      cell = "";
      continue;
    }
    cell += character;
  }
  cells.push(cell.trim());
  return cells;
}

function normalizeCell(value: string): string {
  const trimmed = value.trim();
  let normalized = trimmed;
  if (trimmed.length >= 2 && trimmed.startsWith("`") && trimmed.endsWith("`")) {
    const opening = trimmed.match(/^`+/)?.[0] ?? "";
    const closing = trimmed.match(/`+$/)?.[0] ?? "";
    if (opening.length === closing.length) {
      normalized = trimmed.slice(opening.length, -closing.length).trim();
    }
  }
  return normalized.replace(/\\\|/g, "|").normalize("NFC");
}

function parseMetadataTable(source: string):
  | ReadonlyMap<string, string>
  | Readonly<{ readonly malformed: string }> {
  const lines = source.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const rows = lines.map((line) => splitTableRow(line));
  if (rows.some((row) => row === undefined || row.length !== 2)) {
    return { malformed: "Metadata table must contain exactly two cells per row." };
  }
  const typedRows = rows as readonly (readonly string[])[];
  if (normalizeCell(typedRows[0]?.[0] ?? "") !== "Field" || normalizeCell(typedRows[0]?.[1] ?? "") !== "Value") {
    return { malformed: "Metadata table header must be Field | Value." };
  }
  const separator = typedRows[1];
  if (separator === undefined || !separator.every((cell) => /^:?-{3,}:?$/.test(cell.trim()))) {
    return { malformed: "Metadata table must contain a Markdown separator row." };
  }

  const result = new Map<string, string>();
  for (const row of typedRows.slice(2)) {
    const field = normalizeCell(row[0] ?? "");
    const value = normalizeCell(row[1] ?? "");
    if (field.length === 0 || result.has(field)) {
      return { malformed: `Metadata field is empty or duplicated: ${field || "<empty>"}.` };
    }
    result.set(field, value);
  }
  return result;
}

function isMalformedTable(
  value: ReadonlyMap<string, string> | Readonly<{ readonly malformed: string }>,
): value is Readonly<{ readonly malformed: string }> {
  return "malformed" in value;
}

function normalizeRepositoryPath(value: string): string | undefined {
  const candidate = value.trim().normalize("NFC");
  if (
    candidate.length === 0
    || candidate.includes("\\")
    || candidate.includes("\0")
    || candidate.startsWith("/")
    || WINDOWS_ABSOLUTE_PATH.test(candidate)
    || URL_SCHEME.test(candidate)
  ) {
    return undefined;
  }
  const segments = candidate.split("/");
  if (segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")) {
    return undefined;
  }
  return candidate;
}

function normalizeScopePattern(value: string): string | undefined {
  const normalized = normalizeRepositoryPath(value);
  if (normalized === undefined) {
    return undefined;
  }
  const segments = normalized.split("/");
  if (segments.some((segment) =>
    segment !== "*"
    && segment !== "**"
    && (/[*?\[\]{}]/.test(segment) || segment.startsWith("!") || /[+@]\(/.test(segment)))) {
    return undefined;
  }
  return normalized;
}

function patternsMayOverlap(left: string, right: string): boolean {
  const leftSegments = left.split("/");
  const rightSegments = right.split("/");
  const visit = (leftIndex: number, rightIndex: number, seen: Set<string>): boolean => {
    const key = `${leftIndex}:${rightIndex}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    if (leftIndex === leftSegments.length && rightIndex === rightSegments.length) {
      return true;
    }
    const leftPart = leftSegments[leftIndex];
    const rightPart = rightSegments[rightIndex];
    if (leftPart === "**") {
      return visit(leftIndex + 1, rightIndex, seen)
        || (rightIndex < rightSegments.length && visit(leftIndex, rightIndex + 1, seen));
    }
    if (rightPart === "**") {
      return visit(leftIndex, rightIndex + 1, seen)
        || (leftIndex < leftSegments.length && visit(leftIndex + 1, rightIndex, seen));
    }
    if (leftPart === undefined || rightPart === undefined) {
      return false;
    }
    if (leftPart === "*" || rightPart === "*" || leftPart === rightPart) {
      return visit(leftIndex + 1, rightIndex + 1, seen);
    }
    return false;
  };
  return visit(0, 0, new Set<string>());
}

function listItems(nodes: readonly AstNode[]): readonly AstNode[] | undefined {
  const meaningful = nodes.filter((node) => node.type !== "html");
  if (meaningful.length !== 1 || meaningful[0]?.type !== "list" || meaningful[0].ordered === true) {
    return undefined;
  }
  return meaningful[0].children ?? [];
}

function singleParagraphText(nodes: readonly AstNode[]): string | undefined {
  const meaningful = nodes.filter((node) => node.type !== "html");
  if (meaningful.length === 0 || meaningful.some((node) => node.type !== "paragraph")) {
    return undefined;
  }
  const value = meaningful.map((node) => textOf(node).trim()).join("\n\n").normalize("NFC");
  return value.length > 0 ? value : undefined;
}

function parseCheckbox(item: AstNode): Readonly<{ checked: boolean; text: string }> | undefined {
  const text = textOf(item).trim();
  const marker = /^\[([ xX])\]\s+/.exec(text);
  if (marker === null) {
    return undefined;
  }
  return { checked: marker[1]?.toLowerCase() === "x", text: text.slice(marker[0].length) };
}

function referenceFromToken(kind: string, token: string, anchor?: string): ArtifactReference | undefined {
  const value = token.trim().normalize("NFC");
  if (value === "N/A" || value === "None") {
    return undefined;
  }
  if (value.startsWith("AC-")) {
    return anchor === undefined
      ? { kind, id: value, path: value }
      : { kind, id: value, path: value, anchor };
  }
  if (WORK_ITEM_ID_PATTERN.test(value) && (kind === "dependency" || kind === "evidence")) {
    return anchor === undefined
      ? { kind, id: value, path: `work-items/${value}.md` }
      : { kind, id: value, path: `work-items/${value}.md`, anchor };
  }
  if (WORK_ITEM_ID_PATTERN.test(value)) {
    return anchor === undefined
      ? { kind, id: value, path: value }
      : { kind, id: value, path: value, anchor };
  }
  if (value.includes("@") && !value.includes("/")) {
    return anchor === undefined ? { kind, path: value } : { kind, path: value, anchor };
  }
  const path = normalizeRepositoryPath(value);
  if (path === undefined) {
    return undefined;
  }
  return anchor === undefined ? { kind, path } : { kind, path, anchor };
}

function requirementKind(field: string): string {
  switch (field) {
    case "Requirement IDs": return "requirement";
    case "Feature Spec": return "feature-spec";
    case "Screen IDs / Screen Specs": return "screen-spec";
    case "ADR": return "adr";
    case "Architecture / SDD sections": return "architecture";
    case "Review / Evidence references": return "evidence";
    default: return "reference";
  }
}

function extractTrailingAnchor(item: AstNode, finalToken: string): string | undefined {
  const text = textOf(item).trim();
  const index = text.lastIndexOf(finalToken);
  if (index < 0) {
    return undefined;
  }
  const suffix = text.slice(index + finalToken.length).trim().replace(/^[：:;,-]+\s*/, "");
  return suffix.length > 0 ? suffix.normalize("NFC") : undefined;
}

function canonicalTargetMap(
  context: WorkItemParseContext | undefined,
  addError: (input: ErrorInput) => void,
): ReadonlyMap<string, Readonly<{
  readonly anchors: ReadonlySet<string>;
  readonly reviewed_artifact_hash?: string;
}>> {
  const targets = new Map<string, Readonly<{
    readonly anchors: ReadonlySet<string>;
    readonly reviewed_artifact_hash?: string;
  }>>();
  for (const target of context?.canonical_targets ?? []) {
    const path = normalizeRepositoryPath(target.path);
    if (path === undefined || targets.has(path)) {
      addError({
        field: "canonical_targets",
        expected: "unique safe repository-relative canonical target paths",
        actual: target.path,
      });
      continue;
    }
    const anchors = new Set<string>();
    let valid = true;
    for (const anchorInput of target.anchors ?? []) {
      const anchor = anchorInput.trim().normalize("NFC");
      if (anchor.length === 0 || anchors.has(anchor)) {
        addError({
          field: "canonical_targets",
          expected: "unique non-empty anchors per canonical target",
          actual: `${target.path}#${anchorInput}`,
        });
        valid = false;
      } else {
        anchors.add(anchor);
      }
    }
    if (target.reviewed_artifact_hash !== undefined && !REVIEW_HASH_PATTERN.test(target.reviewed_artifact_hash)) {
      addError({
        field: "canonical_targets",
        expected: "reviewed_artifact_hash as sha256:<64 lowercase hex>",
        actual: `${target.path}#${target.reviewed_artifact_hash}`,
      });
      valid = false;
    }
    if (valid) {
      targets.set(path, Object.freeze({
        anchors,
        ...(target.reviewed_artifact_hash === undefined
          ? {}
          : { reviewed_artifact_hash: target.reviewed_artifact_hash }),
      }));
    }
  }
  return targets;
}

function requiresCanonicalResolution(reference: ArtifactReference): boolean {
  if (reference.kind === "requirement") {
    return false;
  }
  if (reference.kind === "dependency" && reference.path.includes("@") && !reference.path.endsWith(".md")) {
    return false;
  }
  return reference.path.includes("/") || reference.path.endsWith(".md");
}

function validateCanonicalReference(
  reference: ArtifactReference,
  targets: ReadonlyMap<string, Readonly<{
    readonly anchors: ReadonlySet<string>;
    readonly reviewed_artifact_hash?: string;
  }>>,
  section: string,
  field: string | undefined,
  addError: (input: ErrorInput) => void,
): boolean {
  if (!requiresCanonicalResolution(reference)) {
    return true;
  }
  const target = targets.get(reference.path);
  if (target === undefined) {
    addError({
      section,
      ...(field === undefined ? {} : { field }),
      expected: "registered canonical artifact path",
      actual: reference.path,
    });
    return false;
  }
  if (reference.anchor !== undefined && !target.anchors.has(reference.anchor)) {
    addError({
      section,
      ...(field === undefined ? {} : { field }),
      expected: `registered anchor for ${reference.path}`,
      actual: reference.anchor,
    });
    return false;
  }
  return true;
}

export class WorkItemParser {
  parse(sourcePathInput: string, markdown: string, context?: WorkItemParseContext): WorkItemParseResult {
    const errors: WorkItemParseErrorDetail[] = [];
    const sourcePath = normalizeRepositoryPath(sourcePathInput);
    const addError = (input: ErrorInput): void => {
      errors.push(Object.freeze({
        path: sourcePathInput,
        ...input,
        error_code: "HNS-WI-001" as const,
      }));
    };
    const canonicalTargets = canonicalTargetMap(context, addError);

    if (sourcePath === undefined || !/^work-items\/[^/]+\.md$/.test(sourcePath)) {
      addError({ field: "path", expected: "canonical repository-relative work-items/<ID>.md path", actual: sourcePathInput });
    }
    if (typeof markdown !== "string" || markdown.trim().length === 0) {
      addError({ expected: "non-empty Work Item Markdown", actual: typeof markdown });
      return this.failure(errors);
    }

    let root: AstNode;
    try {
      root = fromMarkdown(markdown) as unknown as AstNode;
    } catch (error: unknown) {
      addError({ expected: "well-formed Markdown AST", actual: error instanceof Error ? error.name : "parse failure" });
      return this.failure(errors);
    }
    const children = root.children ?? [];
    const contractHeadings = children.filter(
      (node) => node.type === "heading" && node.depth === 1 && textOf(node).trim() === "Work Item Contract",
    );
    if (contractHeadings.length !== 1) {
      addError({ expected: "exactly one level-1 Work Item Contract heading", actual: String(contractHeadings.length) });
    }

    const metadataCandidates = children.filter((node) => {
      if (node.type !== "paragraph") {
        return false;
      }
      const source = nodeSlice(markdown, node);
      return source !== undefined && /^\s*\|\s*Field\s*\|\s*Value\s*\|/i.test(source);
    });
    let metadata = new Map<string, string>();
    if (metadataCandidates.length !== 1) {
      addError({ section: "Metadata", expected: "exactly one Field/Value metadata table", actual: String(metadataCandidates.length) });
    } else {
      const metadataCandidate = metadataCandidates[0];
      const tableSource = metadataCandidate === undefined ? undefined : nodeSlice(markdown, metadataCandidate);
      const parsed = tableSource === undefined ? { malformed: "Metadata table has no source position." } : parseMetadataTable(tableSource);
      if (isMalformedTable(parsed)) {
        addError({ section: "Metadata", expected: "well-formed canonical metadata table", actual: parsed.malformed });
      } else {
        metadata = new Map(parsed);
      }
    }

    const metadataFieldSet = new Set<string>(METADATA_FIELDS);
    for (const field of metadata.keys()) {
      if (!metadataFieldSet.has(field)) {
        addError({ section: "Metadata", field, expected: "canonical metadata field", actual: "unknown field" });
      }
    }
    for (const field of METADATA_FIELDS) {
      const value = metadata.get(field);
      if (value === undefined || value.length === 0) {
        addError({ section: "Metadata", field, expected: "required non-empty value", actual: value ?? "missing" });
      }
    }

    const sectionNodes = new Map<string, readonly AstNode[]>();
    const sectionStarts = children
      .map((node, index) => ({ node, index }))
      .filter(({ node }) => node.type === "heading" && node.depth === 2);
    const sectionNames = new Set<string>(REQUIRED_SECTIONS);
    for (let index = 0; index < sectionStarts.length; index += 1) {
      const current = sectionStarts[index];
      if (current === undefined) {
        continue;
      }
      const name = textOf(current.node).trim();
      if (!sectionNames.has(name)) {
        addError({ section: name || "<empty>", expected: "canonical Work Item section", actual: "unknown section" });
        continue;
      }
      if (sectionNodes.has(name)) {
        addError({ section: name, expected: "section appears exactly once", actual: "duplicate" });
        continue;
      }
      const nextIndex = sectionStarts[index + 1]?.index ?? children.length;
      sectionNodes.set(name, children.slice(current.index + 1, nextIndex));
    }
    for (const section of REQUIRED_SECTIONS) {
      if (!sectionNodes.has(section)) {
        addError({ section, expected: "required section", actual: "missing" });
      }
    }

    const metadataValue = (field: string): string => metadata.get(field) ?? "";
    const schemaVersion = metadataValue("Schema Version");
    if (schemaVersion !== "harness.work-item/v2") {
      addError({ section: "Metadata", field: "Schema Version", expected: "harness.work-item/v2", actual: schemaVersion });
    }
    const id = metadataValue("ID");
    if (!WORK_ITEM_ID_PATTERN.test(id)) {
      addError({ section: "Metadata", field: "ID", expected: "non-empty canonical Work Item ID", actual: id });
    }
    if (sourcePath !== undefined && sourcePath !== `work-items/${id}.md`) {
      addError({ section: "Metadata", field: "ID", expected: sourcePath.slice("work-items/".length, -3), actual: id });
    }

    const roleText = metadataValue("Role");
    const phaseText = metadataValue("Phase");
    const statusText = metadataValue("Status");
    const riskText = metadataValue("Risk Class");
    if (!isOneOf(WORK_ITEM_ROLES, roleText)) {
      addError({ section: "Metadata", field: "Role", expected: WORK_ITEM_ROLES.join(" | "), actual: roleText });
    }
    if (!isOneOf(WORK_ITEM_PHASES, phaseText)) {
      addError({ section: "Metadata", field: "Phase", expected: WORK_ITEM_PHASES.join(" | "), actual: phaseText });
    }
    if (!isOneOf(WORK_ITEM_STATUSES, statusText)) {
      addError({ section: "Metadata", field: "Status", expected: WORK_ITEM_STATUSES.join(" | "), actual: statusText });
    }
    if (!isOneOf(RISK_CLASSES, riskText)) {
      addError({ section: "Metadata", field: "Risk Class", expected: RISK_CLASSES.join(" | "), actual: riskText });
    }

    const reviewProfileText = metadataValue("Review Profile");
    const reviewedArtifactText = metadataValue("Reviewed Artifact");
    const reviewedHashText = metadataValue("Reviewed Artifact Hash");
    const makerExecutionIdText = metadataValue("Maker Execution ID");
    let reviewProfile: ReviewProfile | null = null;
    let reviewedArtifact: ArtifactReference | null = null;
    let reviewedArtifactHash: string | null = null;
    let makerExecutionId: string | null = null;
    const role = isOneOf(WORK_ITEM_ROLES, roleText) ? roleText : undefined;
    if (role === "REVIEWER") {
      if (!isOneOf(REVIEW_PROFILES, reviewProfileText)) {
        addError({ section: "Metadata", field: "Review Profile", expected: REVIEW_PROFILES.join(" | "), actual: reviewProfileText });
      } else {
        reviewProfile = reviewProfileText;
      }
      const artifactPath = normalizeRepositoryPath(reviewedArtifactText);
      if (artifactPath === undefined || artifactPath.includes("*")) {
        addError({ section: "Metadata", field: "Reviewed Artifact", expected: "safe repository-relative artifact path", actual: reviewedArtifactText });
      } else {
        const artifactReference = { kind: "reviewed-artifact", path: artifactPath };
        if (validateCanonicalReference(artifactReference, canonicalTargets, "Metadata", "Reviewed Artifact", addError)) {
          const targetHash = canonicalTargets.get(artifactPath)?.reviewed_artifact_hash;
          if (targetHash === undefined) {
            addError({
              section: "Metadata",
              field: "Reviewed Artifact",
              expected: "registered canonical target with reviewed artifact hash metadata",
              actual: artifactPath,
            });
          } else {
            reviewedArtifact = artifactReference;
          }
        }
      }
      if (!REVIEW_HASH_PATTERN.test(reviewedHashText)) {
        addError({ section: "Metadata", field: "Reviewed Artifact Hash", expected: "sha256:<64 lowercase hex>", actual: reviewedHashText });
      } else {
        const registeredHash = reviewedArtifact === null
          ? undefined
          : canonicalTargets.get(reviewedArtifact.path)?.reviewed_artifact_hash;
        if (registeredHash !== undefined && reviewedHashText !== registeredHash) {
          addError({
            section: "Metadata",
            field: "Reviewed Artifact Hash",
            expected: registeredHash,
            actual: reviewedHashText,
          });
        } else {
          reviewedArtifactHash = reviewedHashText;
        }
      }
      if (reviewProfileText === "DELIVERY_ASSURANCE_REVIEWER") {
        makerExecutionId = makerExecutionIdText === "N/A" ? null : makerExecutionIdText;
      } else if (makerExecutionIdText === "N/A" || makerExecutionIdText.length === 0) {
        addError({ section: "Metadata", field: "Maker Execution ID", expected: "non-N/A maker execution ID", actual: makerExecutionIdText });
      } else {
        makerExecutionId = makerExecutionIdText;
      }
    } else if ([reviewProfileText, reviewedArtifactText, reviewedHashText, makerExecutionIdText].some((value) => value !== "N/A")) {
      addError({ section: "Metadata", field: "review-only fields", expected: "all N/A for non-REVIEWER", actual: "one or more values are not N/A" });
    }

    const objective = singleParagraphText(sectionNodes.get("Objective") ?? []);
    if (objective === undefined) {
      addError({ section: "Objective", expected: "non-empty paragraph content", actual: "missing or non-paragraph content" });
    }

    const requirementReferences: ArtifactReference[] = [];
    const requirementItems = listItems(sectionNodes.get("Requirement References") ?? []);
    const presentRequirementFields = new Set<string>();
    if (requirementItems === undefined) {
      addError({ section: "Requirement References", expected: "one unordered list", actual: "malformed section" });
    } else {
      for (const item of requirementItems) {
        const text = textOf(item).trim();
        const separatorIndex = Math.min(...[text.indexOf(":"), text.indexOf("：")].filter((value) => value >= 0));
        if (!Number.isFinite(separatorIndex)) {
          addError({ section: "Requirement References", expected: "label: reference", actual: text });
          continue;
        }
        const field = text.slice(0, separatorIndex).trim();
        if (!new Set<string>(REQUIREMENT_REFERENCE_FIELDS).has(field) || presentRequirementFields.has(field)) {
          addError({ section: "Requirement References", field, expected: "unique canonical reference field", actual: presentRequirementFields.has(field) ? "duplicate" : "unknown" });
          continue;
        }
        presentRequirementFields.add(field);
        const tokens = inlineCodeValues(item);
        const valueText = text.slice(separatorIndex + 1).trim();
        if (tokens.length === 0 && valueText !== "N/A") {
          addError({ section: "Requirement References", field, expected: "N/A or one or more inline-code references", actual: valueText });
          continue;
        }
        if (tokens.includes("N/A") && (tokens.length !== 1 || valueText !== "N/A")) {
          addError({ section: "Requirement References", field, expected: "N/A alone or concrete references", actual: valueText });
          continue;
        }
        const anchor = tokens.length > 0 ? extractTrailingAnchor(item, tokens[tokens.length - 1] ?? "") : undefined;
        const seenReferences = new Set<string>();
        for (const token of tokens) {
          if (token === "N/A") {
            continue;
          }
          const reference = referenceFromToken(requirementKind(field), token, token === tokens[tokens.length - 1] ? anchor : undefined);
          if (reference === undefined) {
            addError({ section: "Requirement References", field, expected: "resolvable safe reference", actual: token });
          } else {
            const key = `${reference.kind}\0${reference.id ?? ""}\0${reference.path}\0${reference.anchor ?? ""}`;
            if (seenReferences.has(key)) {
              addError({ section: "Requirement References", field, expected: "unique references", actual: token });
            } else {
              seenReferences.add(key);
              if (validateCanonicalReference(reference, canonicalTargets, "Requirement References", field, addError)) {
                requirementReferences.push(reference);
              }
            }
          }
        }
      }
      for (const field of REQUIREMENT_REFERENCE_FIELDS) {
        if (!presentRequirementFields.has(field)) {
          addError({ section: "Requirement References", field, expected: "required reference field", actual: "missing" });
        }
      }
    }

    const parseStringList = (
      section: string,
      normalizer: (value: string) => string | undefined = (value) => value.trim().normalize("NFC") || undefined,
      noneMeansEmpty = false,
      preferInlineCode = false,
    ): string[] => {
      const items = listItems(sectionNodes.get(section) ?? []);
      if (items === undefined) {
        addError({ section, expected: "one unordered list", actual: "malformed section" });
        return [];
      }
      const values: string[] = [];
      for (const item of items) {
        const codeValues = inlineCodeValues(item);
        if (preferInlineCode && codeValues.length > 1) {
          addError({ section, expected: "at most one inline-code value per item", actual: textOf(item).trim() });
          continue;
        }
        const value = preferInlineCode && codeValues[0] !== undefined
          ? codeValues[0]
          : textOf(item).trim();
        if (noneMeansEmpty && value === "None") {
          if (items.length !== 1) {
            addError({ section, expected: "None as the only list item", actual: "None mixed with values" });
          }
          continue;
        }
        const normalized = normalizer(value);
        if (normalized === undefined) {
          addError({ section, expected: "valid non-empty list item", actual: value });
        } else if (values.includes(normalized)) {
          addError({ section, expected: "unique list items", actual: normalized });
        } else {
          values.push(normalized);
        }
      }
      if (!noneMeansEmpty && values.length === 0) {
        addError({ section, expected: "at least one list item", actual: "empty" });
      }
      return values;
    };

    const readScope = parseStringList("Read Scope", normalizeScopePattern, false, true);
    const writeScope = parseStringList("Write Scope", normalizeScopePattern, false, true);
    const forbiddenScope = parseStringList("Forbidden Scope", normalizeScopePattern, false, true);
    const scope = parseStringList("Scope");
    const outOfScope = parseStringList("Out of Scope");
    const blockers = parseStringList("Blockers", undefined, true);
    const notes = parseStringList("Notes", undefined, true);
    for (const writePattern of writeScope) {
      for (const forbiddenPattern of forbiddenScope) {
        if (patternsMayOverlap(writePattern, forbiddenPattern)) {
          addError({ section: "Write Scope", field: writePattern, expected: "no overlap with Forbidden Scope", actual: forbiddenPattern });
        }
      }
    }

    const acceptanceCriteria: Array<{ id: string; description: string; completed: boolean }> = [];
    const acceptanceItems = listItems(sectionNodes.get("Acceptance Criteria") ?? []);
    if (acceptanceItems === undefined || acceptanceItems.length === 0) {
      addError({ section: "Acceptance Criteria", expected: "non-empty unordered checkbox list", actual: "malformed or empty" });
    } else {
      const ids = new Set<string>();
      for (const item of acceptanceItems) {
        const checkbox = parseCheckbox(item);
        const codeValues = inlineCodeValues(item);
        const criterionId = codeValues[0] ?? "";
        if (checkbox === undefined || codeValues.length === 0) {
          addError({ section: "Acceptance Criteria", expected: "checkbox item beginning with an inline-code AC ID", actual: textOf(item).trim() });
          continue;
        }
        const expectedPrefix = `AC-${id}-`;
        const suffix = criterionId.startsWith(expectedPrefix) ? criterionId.slice(expectedPrefix.length) : "";
        if (!ACCEPTANCE_CRITERION_SUFFIX.test(suffix) || ids.has(criterionId)) {
          addError({ section: "Acceptance Criteria", field: criterionId, expected: `unique AC-${id}-NNN`, actual: ids.has(criterionId) ? "duplicate" : criterionId });
          continue;
        }
        const criterionIndex = checkbox.text.indexOf(criterionId);
        const description = criterionIndex !== 0
          ? ""
          : checkbox.text.slice(criterionIndex + criterionId.length).replace(/^[：:]\s*/, "").trim().normalize("NFC");
        if (description.length === 0) {
          addError({ section: "Acceptance Criteria", field: criterionId, expected: "non-empty description", actual: "empty" });
          continue;
        }
        ids.add(criterionId);
        acceptanceCriteria.push({ id: criterionId, description, completed: checkbox.checked });
      }
    }
    if (statusText === "DONE" && acceptanceCriteria.some((criterion) => !criterion.completed)) {
      addError({ section: "Acceptance Criteria", expected: "all criteria checked when Status is DONE", actual: "one or more unchecked" });
    }

    const gateTexts = parseStringList("Required Gates");
    const requiredGates: GateId[] = [];
    for (const gateText of gateTexts) {
      if (!isOneOf(GATE_IDS, gateText) || GATE_PATHS[gateText] === undefined) {
        addError({ section: "Required Gates", expected: `canonical resolvable Gate ID: ${GATE_IDS.join(" | ")}`, actual: gateText });
      } else {
        requiredGates.push(gateText);
      }
    }
    const phase = isOneOf(WORK_ITEM_PHASES, phaseText) ? phaseText : undefined;
    const defaultGate = phase === undefined ? undefined : DEFAULT_PHASE_GATE[phase];
    if (defaultGate !== undefined && !requiredGates.includes(defaultGate)) {
      addError({ section: "Required Gates", expected: `${defaultGate} for ${phase}`, actual: requiredGates.join(", ") });
    }
    if (phase === "REVIEW" && requiredGates.length === 0) {
      addError({ section: "Required Gates", expected: "explicit reviewed-artifact Gate for REVIEW", actual: "empty" });
    }
    if (reviewProfile === "DELIVERY_ASSURANCE_REVIEWER" && !requiredGates.includes("DELIVERY_ASSURANCE_GATE")) {
      addError({ section: "Required Gates", expected: "DELIVERY_ASSURANCE_GATE", actual: requiredGates.join(", ") });
    }

    const dependencyTexts = parseStringList("Dependencies", undefined, true, true);
    const dependencies: ArtifactReference[] = [];
    for (const dependency of dependencyTexts) {
      const token = dependency.replace(/^`|`$/g, "").trim();
      const reference = referenceFromToken("dependency", token);
      if (reference === undefined) {
        addError({ section: "Dependencies", expected: "safe Work Item, artifact, or exact package dependency", actual: dependency });
      } else if (validateCanonicalReference(reference, canonicalTargets, "Dependencies", undefined, addError)) {
        dependencies.push(reference);
      }
    }

    const featureSpecReferences = requirementReferences.filter((reference) => reference.kind === "feature-spec");
    const screenReferences = requirementReferences.filter((reference) => reference.kind === "screen-spec");
    if (phase === "DESIGN" && featureSpecReferences.length === 0) {
      addError({ section: "Requirement References", field: "Feature Spec", expected: "DESIGN traces to a Feature Spec", actual: "N/A" });
    }
    if (phase === "IMPLEMENTATION" && screenReferences.length > 0 && metadataValue("Design Version") === "N/A") {
      addError({ section: "Metadata", field: "Design Version", expected: "non-N/A when IMPLEMENTATION has UI dependencies", actual: "N/A" });
    }
    if (phase === "REVIEW" && role !== "REVIEWER") {
      addError({ section: "Metadata", field: "Role", expected: "REVIEWER for REVIEW phase", actual: roleText });
    }
    if (role === "REVIEWER" && phase !== "REVIEW") {
      addError({ section: "Metadata", field: "Phase", expected: "REVIEW for REVIEWER role", actual: phaseText });
    }

    if (errors.length > 0) {
      return this.failure(errors);
    }

    const value = defineCoreValue({
      schema_version: "harness.work-item/v2" as const,
      id,
      title: metadataValue("Title").normalize("NFC"),
      role: role as WorkItemRole,
      feature: metadataValue("Feature").normalize("NFC"),
      phase: phase as WorkItemPhase,
      status: statusText as WorkItem["status"],
      spec_version: metadataValue("Spec Version").normalize("NFC"),
      design_version: metadataValue("Design Version").normalize("NFC"),
      risk_class: riskText as WorkItem["risk_class"],
      review_profile: reviewProfile,
      reviewed_artifact: reviewedArtifact,
      reviewed_artifact_hash: reviewedArtifactHash,
      maker_execution_id: makerExecutionId,
      objective: objective as string,
      requirement_references: requirementReferences,
      read_scope: readScope,
      write_scope: writeScope,
      forbidden_scope: forbiddenScope,
      scope,
      out_of_scope: outOfScope,
      acceptance_criteria: acceptanceCriteria,
      required_gates: requiredGates,
      dependencies,
      blockers,
      notes,
      source_path: sourcePath as string,
      document_hash: `sha256:${sha256Hex(encodeUtf8(markdown))}`,
    }) as WorkItem;

    return Object.freeze({ ok: true, value });
  }

  private failure(errors: readonly WorkItemParseErrorDetail[]): WorkItemParseResult {
    const compare = (left: string, right: string): number => left < right ? -1 : left > right ? 1 : 0;
    const sorted = [...errors].sort((left, right) =>
      compare(left.section ?? "", right.section ?? "")
      || compare(left.field ?? "", right.field ?? "")
      || compare(left.expected, right.expected)
      || compare(left.actual ?? "", right.actual ?? ""));
    return Object.freeze({ ok: false, error: Object.freeze(sorted) });
  }
}

const defaultParser = new WorkItemParser();

export function parseWorkItem(
  sourcePath: string,
  markdown: string,
  context?: WorkItemParseContext,
): WorkItemParseResult {
  return defaultParser.parse(sourcePath, markdown, context);
}
