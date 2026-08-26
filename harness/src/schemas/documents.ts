export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export interface SchemaDocument {
  readonly $schema: "https://json-schema.org/draft/2020-12/schema";
  readonly $id: string;
  readonly [key: string]: JsonValue;
}

const draft = "https://json-schema.org/draft/2020-12/schema" as const;
const nonEmptyString = { type: "string", minLength: 1 } as const;
const stringArray = { type: "array", items: nonEmptyString } as const;
const sha256 = {
  type: "string",
  pattern: "^sha256:[0-9a-f]{64}$",
} as const;
const timestamp = {
  type: "string",
  pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\\.[0-9]+)?(?:Z|[+-][0-9]{2}:[0-9]{2})$",
} as const;

const workItemRole = {
  enum: ["PRODUCT_ARCHITECT", "UX_DESIGNER", "IMPLEMENTER", "REVIEWER"],
} as const;
const makerRole = {
  enum: ["PRODUCT_ARCHITECT", "UX_DESIGNER", "IMPLEMENTER", "MULTIPLE"],
} as const;
const workItemPhase = {
  enum: ["SPEC", "DESIGN", "IMPLEMENTATION", "REVIEW", "RELEASE"],
} as const;
const workItemStatus = {
  enum: ["TODO", "IN_PROGRESS", "BLOCKED", "REVIEW", "DONE", "CANCELLED"],
} as const;
const riskClass = { enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] } as const;
const reviewProfile = {
  enum: [
    "SPEC_REVIEWER",
    "UX_REVIEWER",
    "TECH_REVIEWER",
    "QA_REVIEWER",
    "SECURITY_REVIEWER",
    "DELIVERY_ASSURANCE_REVIEWER",
  ],
} as const;
const gateId = {
  enum: [
    "SPEC_GATE",
    "DESIGN_GATE",
    "IMPLEMENTATION_GATE",
    "DELIVERY_ASSURANCE_GATE",
    "RELEASE_GATE",
  ],
} as const;
const gateResultStatus = {
  enum: ["PASS", "FAILED", "NEEDS_CLARIFICATION"],
} as const;

const nullable = (schema: JsonValue) => ({
  anyOf: [schema, { type: "null" }],
}) as const;

const artifactReference = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "path"],
  properties: {
    kind: nonEmptyString,
    id: nonEmptyString,
    path: nonEmptyString,
    anchor: nonEmptyString,
  },
} as const;

const artifactReferenceArray = {
  type: "array",
  items: artifactReference,
} as const;

const evidenceCheck = {
  type: "object",
  additionalProperties: false,
  required: ["id", "method", "result"],
  properties: {
    id: nonEmptyString,
    method: nonEmptyString,
    result: nonEmptyString,
    evidence_reference: nonEmptyString,
  },
} as const;

const gateResult = {
  type: "object",
  additionalProperties: false,
  required: ["gate_id", "status", "evidence", "timestamp", "artifact_hashes", "reviewer"],
  properties: {
    gate_id: gateId,
    status: gateResultStatus,
    evidence: stringArray,
    timestamp,
    artifact_hashes: { type: "array", items: sha256 },
    reviewer: nonEmptyString,
  },
} as const;

const reviewAssignmentProperties = {
  schema_version: { const: "harness.review-assignment/v1" },
  assignment_id: nonEmptyString,
  work_item_id: nonEmptyString,
  risk_class: riskClass,
  review_profile: reviewProfile,
  maker_role: makerRole,
  maker_execution_ids: { type: "array", minItems: 1, uniqueItems: true, items: nonEmptyString },
  reviewed_artifact: artifactReference,
  reviewed_artifact_hash: sha256,
  required_checks: stringArray,
  required_evidence: stringArray,
  assignment_hash: sha256,
} as const;

const reviewAssignmentRequired = [
  "schema_version",
  "assignment_id",
  "work_item_id",
  "risk_class",
  "review_profile",
  "maker_role",
  "maker_execution_ids",
  "reviewed_artifact",
  "reviewed_artifact_hash",
  "required_checks",
  "required_evidence",
  "assignment_hash",
] as const;

export const projectContextSchema = {
  $schema: draft,
  $id: "harness.project-context/v1",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "project_id", "project_name", "project_slug", "intent", "summary",
    "business_goal", "target_users", "user_roles", "primary_workflows", "core_features",
    "constraints", "platforms", "integrations", "data_sources", "security_requirements",
    "non_functional_requirements", "known_unknowns", "assumptions", "out_of_scope",
    "preferred_stack", "repository", "status", "revision", "updated_at",
  ],
  properties: {
    schema_version: { const: "harness.project-context/v1" },
    project_id: nonEmptyString,
    project_name: nonEmptyString,
    project_slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    intent: { const: "NEW_PROJECT" },
    summary: nonEmptyString,
    business_goal: nonEmptyString,
    target_users: stringArray,
    user_roles: stringArray,
    primary_workflows: stringArray,
    core_features: stringArray,
    constraints: stringArray,
    platforms: stringArray,
    integrations: stringArray,
    data_sources: stringArray,
    security_requirements: stringArray,
    non_functional_requirements: stringArray,
    known_unknowns: stringArray,
    assumptions: stringArray,
    out_of_scope: stringArray,
    preferred_stack: {
      type: "object",
      additionalProperties: false,
      required: ["recommendation", "reason", "constraints", "alternatives_considered"],
      properties: {
        recommendation: nonEmptyString,
        reason: nonEmptyString,
        constraints: stringArray,
        alternatives_considered: stringArray,
      },
    },
    repository: {
      type: "object",
      additionalProperties: false,
      required: ["provider", "owner", "name", "visibility", "default_branch", "development_branch"],
      properties: {
        provider: { const: "github" },
        owner: nonEmptyString,
        name: nonEmptyString,
        visibility: { enum: ["private", "public"] },
        default_branch: { const: "main" },
        development_branch: { const: "develop" },
      },
    },
    status: {
      enum: [
        "RECEIVED", "CLASSIFIED", "DISCOVERY", "REQUIREMENTS_READY", "PROJECT_PROPOSED",
        "AWAITING_REPO_APPROVAL", "REPO_PROVISIONING", "SPEC_GENERATION", "SPEC_REVIEW",
        "READY_FOR_DESIGN", "BLOCKED_MISSING_INFO", "BLOCKED_CONFLICT", "REPO_CREATION_FAILED",
        "SPEC_GATE_FAILED", "CANCELLED",
      ],
    },
    revision: { type: "integer", minimum: 0 },
    updated_at: timestamp,
  },
} as const satisfies SchemaDocument;

export const workItemSchema = {
  $schema: draft,
  $id: "harness.work-item/v2",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "id", "title", "role", "feature", "phase", "status", "spec_version",
    "design_version", "risk_class", "review_profile", "reviewed_artifact",
    "reviewed_artifact_hash", "maker_execution_id", "objective", "requirement_references",
    "read_scope", "write_scope", "forbidden_scope", "scope", "out_of_scope",
    "acceptance_criteria", "required_gates", "dependencies", "blockers", "notes",
    "source_path", "document_hash",
  ],
  properties: {
    schema_version: { const: "harness.work-item/v2" },
    id: nonEmptyString,
    title: nonEmptyString,
    role: workItemRole,
    feature: nonEmptyString,
    phase: workItemPhase,
    status: workItemStatus,
    spec_version: nonEmptyString,
    design_version: nonEmptyString,
    risk_class: riskClass,
    review_profile: nullable(reviewProfile),
    reviewed_artifact: nullable(artifactReference),
    reviewed_artifact_hash: nullable(sha256),
    maker_execution_id: nullable(nonEmptyString),
    objective: nonEmptyString,
    requirement_references: artifactReferenceArray,
    read_scope: stringArray,
    write_scope: stringArray,
    forbidden_scope: stringArray,
    scope: stringArray,
    out_of_scope: stringArray,
    acceptance_criteria: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "description", "completed"],
        properties: {
          id: nonEmptyString,
          description: nonEmptyString,
          completed: { type: "boolean" },
        },
      },
    },
    required_gates: { type: "array", uniqueItems: true, items: gateId },
    dependencies: artifactReferenceArray,
    blockers: stringArray,
    notes: stringArray,
    source_path: nonEmptyString,
    document_hash: sha256,
  },
  allOf: [
    {
      if: { properties: { role: { const: "REVIEWER" } }, required: ["role"] },
      then: {
        properties: {
          review_profile: reviewProfile,
          reviewed_artifact: artifactReference,
          reviewed_artifact_hash: sha256,
        },
      },
      else: {
        properties: {
          review_profile: { type: "null" },
          reviewed_artifact: { type: "null" },
          reviewed_artifact_hash: { type: "null" },
          maker_execution_id: { type: "null" },
        },
      },
    },
    {
      if: {
        properties: {
          role: { const: "REVIEWER" },
          review_profile: { not: { const: "DELIVERY_ASSURANCE_REVIEWER" } },
        },
        required: ["role", "review_profile"],
      },
      then: { properties: { maker_execution_id: nonEmptyString } },
    },
  ],
} as const satisfies SchemaDocument;

const contextManifestEntry = {
  type: "object",
  additionalProperties: false,
  required: ["path", "content_sha256", "reason", "tier"],
  properties: {
    path: nonEmptyString,
    section: nonEmptyString,
    anchor: nonEmptyString,
    content_sha256: sha256,
    reason: nonEmptyString,
    tier: { enum: ["TIER_0_BOOTSTRAP", "TIER_1_MANDATORY", "TIER_2_ON_DEMAND"] },
    full_document_fallback_reason: nonEmptyString,
  },
} as const;

const contextBudget = {
  type: "object",
  additionalProperties: false,
  required: ["max_bytes", "max_files", "max_sections"],
  properties: {
    max_bytes: { type: "integer", minimum: 0 },
    max_files: { type: "integer", minimum: 0 },
    max_sections: { type: "integer", minimum: 0 },
  },
} as const;

export const contextSchema = {
  $schema: draft,
  $id: "harness.context/v3",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "execution_id", "task_id", "role", "risk_class", "feature", "phase",
    "bootstrap_context", "governance_context", "delivery_context", "source_context",
    "design_context", "work_item", "excluded_context", "deferred_context", "initial_budget",
    "hard_safety_ceiling", "context_usage", "spec_versions", "context_hash",
  ],
  properties: {
    schema_version: { const: "harness.context/v3" },
    execution_id: nonEmptyString,
    task_id: nonEmptyString,
    role: workItemRole,
    risk_class: riskClass,
    review_profile: reviewProfile,
    feature: nonEmptyString,
    phase: workItemPhase,
    bootstrap_context: { type: "array", items: contextManifestEntry },
    governance_context: { type: "array", items: contextManifestEntry },
    delivery_context: { type: "array", items: contextManifestEntry },
    source_context: { type: "array", items: contextManifestEntry },
    design_context: { type: "array", items: contextManifestEntry },
    work_item: contextManifestEntry,
    excluded_context: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["path", "reason"],
        properties: { path: nonEmptyString, reason: nonEmptyString },
      },
    },
    deferred_context: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["path", "reason"],
        properties: { path: nonEmptyString, reason: nonEmptyString },
      },
    },
    initial_budget: contextBudget,
    hard_safety_ceiling: contextBudget,
    context_usage: {
      type: "object", additionalProperties: false, required: ["bytes", "files", "sections"],
      properties: {
        bytes: { type: "integer", minimum: 0 },
        files: { type: "integer", minimum: 0 },
        sections: { type: "integer", minimum: 0 },
      },
    },
    spec_versions: { type: "object", additionalProperties: { type: "string" } },
    context_hash: sha256,
  },
} as const satisfies SchemaDocument;

const policyArrayMap = {
  type: "object",
  additionalProperties: false,
  required: ["allow", "deny"],
  properties: { allow: stringArray, deny: stringArray },
} as const;
const filesystemPolicy = {
  type: "object",
  additionalProperties: false,
  required: ["read", "write", "deny_write"],
  properties: { read: stringArray, write: stringArray, deny_write: stringArray },
} as const;
const commandPolicy = {
  type: "object",
  additionalProperties: false,
  required: ["safe_read", "development_write", "restricted"],
  properties: { safe_read: stringArray, development_write: stringArray, restricted: stringArray },
} as const;
const environmentPolicy = {
  type: "object",
  additionalProperties: false,
  required: ["allowed", "denied"],
  properties: { allowed: stringArray, denied: stringArray },
} as const;

export const policySchema = {
  $schema: draft,
  $id: "harness.policy/v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "policy_hash", "sources", "filesystem", "tools", "commands", "environment", "approval_required"],
  properties: {
    schema_version: { const: "harness.policy/v1" },
    policy_hash: sha256,
    sources: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["path", "sha256"],
        properties: { path: nonEmptyString, sha256 },
      },
    },
    filesystem: filesystemPolicy,
    tools: policyArrayMap,
    commands: commandPolicy,
    environment: environmentPolicy,
    approval_required: {
      type: "object", additionalProperties: false, required: ["operations"],
      properties: { operations: stringArray },
    },
  },
} as const satisfies SchemaDocument;

export const executionProfileSchema = {
  $schema: draft,
  $id: "harness.execution-profile/v2",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "profile_hash", "execution", "repository", "work_item", "context",
    "filesystem", "tools", "commands", "environment", "gates", "adapter_requirements", "audit",
  ],
  properties: {
    schema_version: { const: "harness.execution-profile/v2" },
    profile_hash: sha256,
    execution: {
      type: "object", additionalProperties: false,
      required: ["execution_id", "task_id", "role", "risk_class", "feature", "phase", "adapter"],
      properties: {
        execution_id: nonEmptyString, task_id: nonEmptyString, role: workItemRole,
        risk_class: riskClass, review_profile: reviewProfile, feature: nonEmptyString,
        phase: workItemPhase, adapter: nonEmptyString,
      },
    },
    repository: {
      type: "object", additionalProperties: false,
      required: ["identity", "root", "branch", "commit_before"],
      properties: { identity: nonEmptyString, root: nonEmptyString, branch: nonEmptyString, commit_before: nonEmptyString },
    },
    work_item: {
      type: "object", additionalProperties: false, required: ["path", "hash"],
      properties: { path: nonEmptyString, hash: sha256 },
    },
    context: {
      type: "object", additionalProperties: false, required: ["manifest_ref", "context_hash"],
      properties: { manifest_ref: nonEmptyString, context_hash: sha256 },
    },
    filesystem: filesystemPolicy,
    tools: policyArrayMap,
    commands: commandPolicy,
    environment: environmentPolicy,
    gates: {
      type: "object", additionalProperties: false, required: ["required"],
      properties: { required: { type: "array", uniqueItems: true, items: gateId } },
    },
    review: {
      type: "object", additionalProperties: false,
      required: ["assignment_ref", "assignment_hash", "maker_execution_ids", "reviewed_artifact_hash"],
      properties: {
        assignment_ref: nonEmptyString, assignment_hash: sha256,
        maker_execution_ids: { type: "array", items: nonEmptyString }, reviewed_artifact_hash: sha256,
      },
    },
    adapter_requirements: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["capability", "minimum"],
        properties: {
          capability: {
            enum: [
              "filesystem_read_control", "filesystem_write_control", "tool_allowlist", "tool_denylist",
              "command_interception", "network_control", "approval_flow", "event_stream",
              "working_directory_control", "termination",
            ],
          },
          minimum: { enum: ["hard", "soft"] },
        },
      },
    },
    audit: {
      type: "object", additionalProperties: false,
      required: ["sink", "redaction_policy", "required_fields"],
      properties: { sink: nonEmptyString, redaction_policy: nonEmptyString, required_fields: stringArray },
    },
  },
} as const satisfies SchemaDocument;

const executionState = {
  enum: [
    "CREATED", "CONTEXT_READY", "RUNNING", "VALIDATING", "COMPLETED", "BLOCKED_SPEC_GAP",
    "BLOCKED_SPEC_CONFLICT", "BLOCKED_PERMISSION", "FAILED_GATE", "FAILED_RUNTIME", "CANCELLED",
  ],
} as const;

export const auditSchema = {
  $schema: draft,
  $id: "harness.audit/v2",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "execution_id", "task_id", "profile_hash", "events_hash", "gate_results",
    "approvals", "role_evidence_refs", "review_assignment_refs", "finding_refs", "commit_before",
    "final_status", "finalized_at",
  ],
  properties: {
    schema_version: { const: "harness.audit/v2" },
    execution_id: nonEmptyString,
    task_id: nonEmptyString,
    profile_hash: sha256,
    events_hash: sha256,
    gate_results: { type: "array", items: gateResult },
    approvals: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["request", "decision", "decided_at", "decided_by"],
        properties: {
          request: {
            type: "object", additionalProperties: false,
            required: ["approval_id", "execution_id", "operation", "operation_hash", "risk_class", "reason", "requested_at", "expires_at", "policy_hash"],
            properties: {
              approval_id: nonEmptyString, execution_id: nonEmptyString, operation: nonEmptyString,
              operation_hash: sha256, risk_class: nonEmptyString, reason: nonEmptyString,
              requested_at: timestamp, expires_at: timestamp, policy_hash: sha256,
            },
          },
          decision: { enum: ["APPROVED", "REJECTED", "EXPIRED"] },
          decided_at: timestamp,
          decided_by: nonEmptyString,
        },
      },
    },
    role_evidence_refs: stringArray,
    review_assignment_refs: stringArray,
    finding_refs: stringArray,
    delivery_assurance_ref: nonEmptyString,
    commit_before: nonEmptyString,
    commit_after: nonEmptyString,
    final_status: executionState,
    finalized_at: timestamp,
  },
} as const satisfies SchemaDocument;

export const bootstrapSchema = {
  $schema: draft,
  $id: "harness.bootstrap/v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "framework", "operations", "manifest_hash"],
  properties: {
    schema_version: { const: "harness.bootstrap/v1" },
    framework: {
      type: "object", additionalProperties: false, required: ["repository", "commit_sha"],
      properties: { repository: nonEmptyString, commit_sha: nonEmptyString, release: nonEmptyString },
    },
    operations: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["id", "kind", "target", "required"],
        properties: {
          id: nonEmptyString,
          kind: { enum: ["COPY", "GENERATE", "CREATE_DIRECTORY", "OPTIONAL", "EXCLUDE"] },
          source: nonEmptyString,
          target: nonEmptyString,
          condition: nonEmptyString,
          required: { type: "boolean" },
          hash: sha256,
        },
      },
    },
    manifest_hash: sha256,
  },
} as const satisfies SchemaDocument;

export const riskAssignmentSchema = {
  $schema: draft,
  $id: "harness.risk-assignment/v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "risk_class", "trigger_ids", "source_hashes", "classifier_version", "assignment_hash"],
  properties: {
    schema_version: { const: "harness.risk-assignment/v1" },
    risk_class: riskClass,
    trigger_ids: stringArray,
    source_hashes: { type: "array", items: sha256 },
    classifier_version: nonEmptyString,
    assignment_hash: sha256,
  },
} as const satisfies SchemaDocument;

export const reviewAssignmentSchema = {
  $schema: draft,
  $id: "harness.review-assignment/v1",
  type: "object",
  additionalProperties: false,
  required: reviewAssignmentRequired,
  properties: reviewAssignmentProperties,
} as const satisfies SchemaDocument;

export const roleEvidenceSchema = {
  $schema: draft,
  $id: "harness.role-evidence/v1",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "evidence_id", "execution_id", "work_item_id", "role", "artifact_refs",
    "artifact_hashes", "spec_references", "checks_performed", "tests_performed", "findings",
    "known_limitations", "result", "timestamp",
  ],
  properties: {
    schema_version: { const: "harness.role-evidence/v1" },
    evidence_id: nonEmptyString,
    execution_id: nonEmptyString,
    work_item_id: nonEmptyString,
    role: workItemRole,
    review_profile: reviewProfile,
    artifact_refs: artifactReferenceArray,
    artifact_hashes: { type: "array", items: sha256 },
    spec_references: artifactReferenceArray,
    checks_performed: { type: "array", items: evidenceCheck },
    tests_performed: { type: "array", items: evidenceCheck },
    findings: stringArray,
    known_limitations: stringArray,
    result: { enum: ["READY_FOR_REVIEW", "BLOCKED", "PASS", "REQUEST_CHANGES", "BLOCK"] },
    timestamp,
    commit_hash: nonEmptyString,
    changed_files: stringArray,
    diff_scope: stringArray,
    typecheck: evidenceCheck,
    lint: evidenceCheck,
    unit_test: evidenceCheck,
    integration_test: evidenceCheck,
    build: evidenceCheck,
    security_check: evidenceCheck,
  },
  allOf: [
    {
      if: { properties: { role: { const: "REVIEWER" } }, required: ["role"] },
      then: { properties: { review_profile: reviewProfile }, required: ["review_profile"] },
      else: { not: { required: ["review_profile"] } },
    },
  ],
} as const satisfies SchemaDocument;

export const findingSchema = {
  $schema: draft,
  $id: "harness.finding/v1",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "finding_id", "review_profile", "owner_role", "work_item_id", "artifact_ref",
    "artifact_hash", "requirement_references", "description", "severity", "evidence_references",
    "required_action", "status",
  ],
  properties: {
    schema_version: { const: "harness.finding/v1" },
    finding_id: nonEmptyString,
    review_profile: reviewProfile,
    owner_role: workItemRole,
    work_item_id: nonEmptyString,
    artifact_ref: artifactReference,
    artifact_hash: sha256,
    requirement_references: artifactReferenceArray,
    description: nonEmptyString,
    severity: { enum: ["BLOCKING", "MAJOR", "MINOR", "OBSERVATION"] },
    evidence_references: stringArray,
    required_action: nonEmptyString,
    status: { enum: ["OPEN", "RESOLVED", "ACCEPTED_RISK", "SUPERSEDED"] },
  },
} as const satisfies SchemaDocument;

export const deliveryAssuranceSchema = {
  $schema: draft,
  $id: "harness.delivery-assurance/v1",
  type: "object",
  additionalProperties: false,
  required: [
    "schema_version", "delivery_id", "project", "commit", "reviewed_work_items",
    "required_reviews", "completed_review_evidence", "gate_results", "open_findings",
    "accepted_risk_references", "evidence_references", "result", "reviewer",
    "reviewer_execution_id", "timestamp",
  ],
  properties: {
    schema_version: { const: "harness.delivery-assurance/v1" },
    delivery_id: nonEmptyString,
    project: nonEmptyString,
    commit: nonEmptyString,
    reviewed_work_items: stringArray,
    required_reviews: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: reviewAssignmentRequired, properties: reviewAssignmentProperties,
      },
    },
    completed_review_evidence: stringArray,
    gate_results: { type: "array", items: gateResult },
    open_findings: stringArray,
    accepted_risk_references: stringArray,
    evidence_references: stringArray,
    result: { enum: ["PASS", "REQUEST_CHANGES", "BLOCKED"] },
    reviewer: nonEmptyString,
    reviewer_execution_id: nonEmptyString,
    timestamp,
  },
} as const satisfies SchemaDocument;

export const CANONICAL_SCHEMA_DOCUMENTS = [
  projectContextSchema,
  workItemSchema,
  contextSchema,
  policySchema,
  executionProfileSchema,
  auditSchema,
  bootstrapSchema,
  riskAssignmentSchema,
  reviewAssignmentSchema,
  roleEvidenceSchema,
  findingSchema,
  deliveryAssuranceSchema,
] as const satisfies readonly SchemaDocument[];
