export const WORK_ITEM_ROLES = [
  "PRODUCT_ARCHITECT",
  "UX_DESIGNER",
  "IMPLEMENTER",
  "REVIEWER",
] as const;

export type WorkItemRole = (typeof WORK_ITEM_ROLES)[number];

export const WORK_ITEM_PHASES = [
  "SPEC",
  "DESIGN",
  "IMPLEMENTATION",
  "REVIEW",
  "RELEASE",
] as const;

export type WorkItemPhase = (typeof WORK_ITEM_PHASES)[number];

export const WORK_ITEM_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "REVIEW",
  "DONE",
  "CANCELLED",
] as const;

export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number];

export const RISK_CLASSES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export type RiskClass = (typeof RISK_CLASSES)[number];

export const REVIEW_PROFILES = [
  "SPEC_REVIEWER",
  "UX_REVIEWER",
  "TECH_REVIEWER",
  "QA_REVIEWER",
  "SECURITY_REVIEWER",
  "DELIVERY_ASSURANCE_REVIEWER",
] as const;

export type ReviewProfile = (typeof REVIEW_PROFILES)[number];

export const GATE_IDS = [
  "SPEC_GATE",
  "DESIGN_GATE",
  "IMPLEMENTATION_GATE",
  "DELIVERY_ASSURANCE_GATE",
  "RELEASE_GATE",
] as const;

export type GateId = (typeof GATE_IDS)[number];

export const FINDING_SEVERITIES = [
  "BLOCKING",
  "MAJOR",
  "MINOR",
  "OBSERVATION",
] as const;

export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];

export const FINDING_STATUSES = [
  "OPEN",
  "RESOLVED",
  "ACCEPTED_RISK",
  "SUPERSEDED",
] as const;

export type FindingStatus = (typeof FINDING_STATUSES)[number];

export const REVIEW_DECISIONS = [
  "PASS",
  "REQUEST_CHANGES",
  "BLOCK",
] as const;

export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];

export const GATE_RESULT_STATUSES = [
  "PASS",
  "FAILED",
  "NEEDS_CLARIFICATION",
] as const;

export type GateResultStatus = (typeof GATE_RESULT_STATUSES)[number];

export interface ArtifactReference {
  readonly kind: string;
  readonly id?: string;
  readonly path: string;
  readonly anchor?: string;
}

export interface AcceptanceCriterion {
  readonly id: string;
  readonly description: string;
  readonly completed: boolean;
}

export interface WorkItem {
  readonly schema_version: "harness.work-item/v2";
  readonly id: string;
  readonly title: string;
  readonly role: WorkItemRole;
  readonly feature: string;
  readonly phase: WorkItemPhase;
  readonly status: WorkItemStatus;
  readonly spec_version: string;
  readonly design_version: string;
  readonly risk_class: RiskClass;
  readonly review_profile: ReviewProfile | null;
  readonly reviewed_artifact: ArtifactReference | null;
  readonly reviewed_artifact_hash: string | null;
  readonly maker_execution_id: string | null;
  readonly objective: string;
  readonly requirement_references: readonly ArtifactReference[];
  readonly read_scope: readonly string[];
  readonly write_scope: readonly string[];
  readonly forbidden_scope: readonly string[];
  readonly scope: readonly string[];
  readonly out_of_scope: readonly string[];
  readonly acceptance_criteria: readonly AcceptanceCriterion[];
  readonly required_gates: readonly GateId[];
  readonly dependencies: readonly ArtifactReference[];
  readonly blockers: readonly string[];
  readonly notes: readonly string[];
  readonly source_path: string;
  readonly document_hash: string;
}

export interface GateResult {
  readonly gate_id: GateId;
  readonly status: GateResultStatus;
  readonly evidence: readonly string[];
  readonly timestamp: string;
  readonly artifact_hashes: readonly string[];
  readonly reviewer: string;
}

export interface ReviewFinding {
  readonly schema_version: "harness.finding/v1";
  readonly finding_id: string;
  readonly review_profile: ReviewProfile;
  readonly owner_role: WorkItemRole;
  readonly work_item_id: string;
  readonly artifact_ref: ArtifactReference;
  readonly artifact_hash: string;
  readonly requirement_references: readonly ArtifactReference[];
  readonly description: string;
  readonly severity: FindingSeverity;
  readonly evidence_references: readonly string[];
  readonly required_action: string;
  readonly status: FindingStatus;
}

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type Immutable<T> =
  T extends Primitive | ((...args: readonly unknown[]) => unknown)
    ? T
    : T extends readonly (infer Item)[]
      ? readonly Immutable<Item>[]
      : { readonly [Key in keyof T]: Immutable<T[Key]> };

function freezeCoreValue<T>(value: T, seen: WeakSet<object>): Immutable<T> {
  if (value === null || typeof value !== "object") {
    return value as Immutable<T>;
  }

  if (seen.has(value)) {
    throw new TypeError("Core domain values must not contain circular references.");
  }

  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      freezeCoreValue(item, seen);
    }
    return Object.freeze(value) as Immutable<T>;
  }

  for (const key of Object.keys(value) as (keyof T)[]) {
    freezeCoreValue(value[key], seen);
  }

  return Object.freeze(value) as Immutable<T>;
}

export function defineCoreValue<T extends object>(value: T): Immutable<T> {
  return freezeCoreValue(value, new WeakSet<object>());
}

export function isOneOf<const Values extends readonly string[]>(
  values: Values,
  candidate: string,
): candidate is Values[number] {
  return values.includes(candidate);
}

export function assertOneOf<const Values extends readonly string[]>(
  values: Values,
  candidate: string,
  label: string,
): Values[number] {
  if (!isOneOf(values, candidate)) {
    throw new TypeError(`${label} must be one of: ${values.join(", ")}`);
  }

  return candidate;
}
