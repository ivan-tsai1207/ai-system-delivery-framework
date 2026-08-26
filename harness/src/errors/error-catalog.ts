import {
  EXIT_CODES,
  EXIT_CODE_REGISTRY,
  type ExitCode,
  type ExitCodeDefinition,
} from "./exit-code-registry.js";

const ERROR_CATALOG_DEFINITIONS = [
  { code: "HNS-INPUT-001", name: "INVALID_INPUT", defaultMessage: "INVALID_INPUT", retryable: "No after same input", humanAction: "Maybe", lifecycleMapping: "FAILED_RUNTIME / no start", exitCode: 2 },
  { code: "HNS-INTAKE-001", name: "INTENT_UNCLEAR", defaultMessage: "INTENT_UNCLEAR", retryable: "Yes after clarification", humanAction: "Yes", lifecycleMapping: "BLOCKED_MISSING_INFO", exitCode: 2 },
  { code: "HNS-INTAKE-002", name: "MISSING_CRITICAL_REQUIREMENT", defaultMessage: "MISSING_CRITICAL_REQUIREMENT", retryable: "Yes after answer", humanAction: "Yes", lifecycleMapping: "BLOCKED_MISSING_INFO", exitCode: 2 },
  { code: "HNS-REPO-001", name: "REPOSITORY_NAME_CONFLICT", defaultMessage: "REPOSITORY_NAME_CONFLICT", retryable: "Yes with approved target change", humanAction: "Yes", lifecycleMapping: "REPO_CREATION_FAILED", exitCode: 8 },
  { code: "HNS-REPO-002", name: "REPOSITORY_CREATION_FAILED", defaultMessage: "REPOSITORY_CREATION_FAILED", retryable: "Conditional", humanAction: "Maybe", lifecycleMapping: "REPO_CREATION_FAILED", exitCode: 8 },
  { code: "HNS-BOOT-001", name: "BOOTSTRAP_FAILED", defaultMessage: "BOOTSTRAP_FAILED", retryable: "Conditional from journal", humanAction: "Maybe", lifecycleMapping: "REPO_CREATION_FAILED / provisioning failed", exitCode: 8 },
  { code: "HNS-WI-001", name: "WORK_ITEM_INVALID", defaultMessage: "WORK_ITEM_INVALID", retryable: "No until corrected", humanAction: "Maybe", lifecycleMapping: "no execution / FAILED_RUNTIME", exitCode: 2 },
  { code: "HNS-CTX-001", name: "CONTEXT_BUILD_FAILED", defaultMessage: "CONTEXT_BUILD_FAILED", retryable: "Conditional", humanAction: "Maybe", lifecycleMapping: "FAILED_RUNTIME", exitCode: 3 },
  { code: "HNS-CTX-002", name: "MISSING_REQUIRED_CONTEXT", defaultMessage: "MISSING_REQUIRED_CONTEXT", retryable: "Yes after context fix", humanAction: "Maybe", lifecycleMapping: "no start / blocked", exitCode: 3 },
  { code: "HNS-POL-001", name: "POLICY_BUILD_FAILED", defaultMessage: "POLICY_BUILD_FAILED", retryable: "Conditional", humanAction: "Maybe", lifecycleMapping: "FAILED_RUNTIME", exitCode: 4 },
  { code: "HNS-POL-002", name: "POLICY_CONFLICT", defaultMessage: "POLICY_CONFLICT", retryable: "No until policy resolved", humanAction: "Yes when governance conflict", lifecycleMapping: "BLOCKED_PERMISSION / conflict", exitCode: 4 },
  { code: "HNS-ADP-001", name: "ADAPTER_UNAVAILABLE", defaultMessage: "ADAPTER_UNAVAILABLE", retryable: "Yes with compatible adapter", humanAction: "No", lifecycleMapping: "FAILED_RUNTIME", exitCode: 5 },
  { code: "HNS-ADP-002", name: "ADAPTER_CAPABILITY_MISMATCH", defaultMessage: "ADAPTER_CAPABILITY_MISMATCH", retryable: "Yes with capability change", humanAction: "Maybe", lifecycleMapping: "FAILED_RUNTIME", exitCode: 5 },
  { code: "HNS-ENF-001", name: "ENFORCEMENT_CAPABILITY_UNAVAILABLE", defaultMessage: "ENFORCEMENT_CAPABILITY_UNAVAILABLE", retryable: "No in same environment", humanAction: "Yes", lifecycleMapping: "no launch / FAILED_RUNTIME", exitCode: 5 },
  { code: "HNS-PERM-001", name: "UNAUTHORIZED_WRITE", defaultMessage: "UNAUTHORIZED_WRITE", retryable: "No for same operation", humanAction: "No", lifecycleMapping: "BLOCKED_PERMISSION", exitCode: 4 },
  { code: "HNS-PERM-002", name: "UNAUTHORIZED_TOOL", defaultMessage: "UNAUTHORIZED_TOOL", retryable: "No for same operation", humanAction: "No", lifecycleMapping: "BLOCKED_PERMISSION", exitCode: 4 },
  { code: "HNS-CMD-001", name: "RESTRICTED_COMMAND", defaultMessage: "RESTRICTED_COMMAND", retryable: "After valid approval / new task", humanAction: "Yes when approvable", lifecycleMapping: "running blocked / cancelled", exitCode: 4 },
  { code: "HNS-SPEC-001", name: "SPEC_GAP", defaultMessage: "SPEC_GAP", retryable: "After canonical spec update", humanAction: "Yes", lifecycleMapping: "BLOCKED_SPEC_GAP", exitCode: 3 },
  { code: "HNS-SPEC-002", name: "SPEC_CONFLICT", defaultMessage: "SPEC_CONFLICT", retryable: "After authority resolution", humanAction: "Yes", lifecycleMapping: "BLOCKED_SPEC_CONFLICT", exitCode: 3 },
  { code: "HNS-GATE-001", name: "GATE_FAILED", defaultMessage: "GATE_FAILED", retryable: "After artifact correction", humanAction: "Maybe", lifecycleMapping: "FAILED_GATE", exitCode: 6 },
  { code: "HNS-RISK-001", name: "RISK_DOWNGRADE_REJECTED", defaultMessage: "RISK_DOWNGRADE_REJECTED", retryable: "New trusted classification only", humanAction: "Maybe", lifecycleMapping: "BLOCKED_PERMISSION", exitCode: 4 },
  { code: "HNS-RVW-001", name: "SELF_APPROVAL_REJECTED", defaultMessage: "SELF_APPROVAL_REJECTED", retryable: "Yes with independent execution", humanAction: "No", lifecycleMapping: "no review start / FAILED_GATE", exitCode: 6 },
  { code: "HNS-RVW-002", name: "REQUIRED_REVIEW_MISSING", defaultMessage: "REQUIRED_REVIEW_MISSING", retryable: "Yes after assignment / review", humanAction: "Maybe", lifecycleMapping: "FAILED_GATE", exitCode: 6 },
  { code: "HNS-RVW-003", name: "REVIEWED_ARTIFACT_CHANGED", defaultMessage: "REVIEWED_ARTIFACT_CHANGED", retryable: "Yes with new artifact hash / review", humanAction: "No", lifecycleMapping: "FAILED_GATE", exitCode: 6 },
  { code: "HNS-FND-001", name: "OPEN_BLOCKING_FINDING", defaultMessage: "OPEN_BLOCKING_FINDING", retryable: "Yes after authorized resolution", humanAction: "Maybe", lifecycleMapping: "FAILED_GATE", exitCode: 6 },
  { code: "HNS-ASR-001", name: "DELIVERY_ASSURANCE_FAILED", defaultMessage: "DELIVERY_ASSURANCE_FAILED", retryable: "Yes after findings / reviews resolved", humanAction: "Maybe", lifecycleMapping: "FAILED_GATE", exitCode: 6 },
  { code: "HNS-APR-001", name: "APPROVAL_REQUIRED", defaultMessage: "APPROVAL_REQUIRED", retryable: "Yes after decision", humanAction: "Yes", lifecycleMapping: "waiting / no operation", exitCode: 7 },
  { code: "HNS-APR-002", name: "APPROVAL_REJECTED", defaultMessage: "APPROVAL_REJECTED", retryable: "No for same operation", humanAction: "Yes to create new request", lifecycleMapping: "CANCELLED or continue without optional op", exitCode: 7 },
  { code: "HNS-RUN-001", name: "RUNTIME_FAILED", defaultMessage: "RUNTIME_FAILED", retryable: "Conditional", humanAction: "Maybe", lifecycleMapping: "FAILED_RUNTIME", exitCode: 5 },
  { code: "HNS-AUD-001", name: "AUDIT_WRITE_FAILED", defaultMessage: "AUDIT_WRITE_FAILED", retryable: "No during unsafe continuation", humanAction: "Yes", lifecycleMapping: "FAILED_RUNTIME + terminate", exitCode: 5 },
] as const;

export type ErrorCatalogEntry = Readonly<(typeof ERROR_CATALOG_DEFINITIONS)[number]>;
export type HarnessErrorCode = ErrorCatalogEntry["code"];
export type HarnessErrorName = ErrorCatalogEntry["name"];
export type RetryableSemantics = ErrorCatalogEntry["retryable"];
export type HumanActionSemantics = ErrorCatalogEntry["humanAction"];
export type LifecycleMapping = ErrorCatalogEntry["lifecycleMapping"];

export interface ErrorCatalogValidationEntry {
  readonly code: string;
  readonly exitCode: number;
}

export interface ExitCodeValidationEntry {
  readonly exitCode: number;
}

export const ERROR_CATALOG: readonly ErrorCatalogEntry[] = Object.freeze(
  ERROR_CATALOG_DEFINITIONS.map((definition) => Object.freeze({ ...definition })),
);

export const ERROR_CODES: readonly HarnessErrorCode[] = Object.freeze(
  ERROR_CATALOG.map((definition) => definition.code),
);

export function isHarnessErrorCode(candidate: unknown): candidate is HarnessErrorCode {
  return (
    typeof candidate === "string" &&
    ERROR_CODES.some((errorCode) => errorCode === candidate)
  );
}

export function assertErrorCatalogIntegrity(
  catalog: readonly ErrorCatalogValidationEntry[],
  exitRegistry: readonly ExitCodeValidationEntry[],
): void {
  if (!Array.isArray(catalog) || !Array.isArray(exitRegistry)) {
    throw new TypeError("Harness error catalog and exit registry must be arrays.");
  }

  const registeredExitCodes = new Set<number>();
  for (const definition of exitRegistry) {
    if (!Number.isInteger(definition.exitCode) || !EXIT_CODES.includes(definition.exitCode as ExitCode)) {
      throw new TypeError(`Unknown Harness exit code in registry: ${String(definition.exitCode)}`);
    }
    if (registeredExitCodes.has(definition.exitCode)) {
      throw new TypeError(`Duplicate Harness exit code: ${definition.exitCode}`);
    }
    registeredExitCodes.add(definition.exitCode);
  }

  for (const exitCode of EXIT_CODES) {
    if (!registeredExitCodes.has(exitCode)) {
      throw new TypeError(`Missing Harness exit-code registry entry: ${exitCode}`);
    }
  }

  const registeredErrorCodes = new Set<string>();
  for (const definition of catalog) {
    if (!isHarnessErrorCode(definition.code)) {
      throw new TypeError(`Unknown Harness error code in catalog: ${String(definition.code)}`);
    }
    if (registeredErrorCodes.has(definition.code)) {
      throw new TypeError(`Duplicate Harness error code: ${definition.code}`);
    }
    if (!registeredExitCodes.has(definition.exitCode)) {
      throw new TypeError(
        `Missing Harness exit-code mapping for ${definition.code}: ${String(definition.exitCode)}`,
      );
    }
    registeredErrorCodes.add(definition.code);
  }

  for (const errorCode of ERROR_CODES) {
    if (!registeredErrorCodes.has(errorCode)) {
      throw new TypeError(`Missing Harness error catalog entry: ${errorCode}`);
    }
  }
}

assertErrorCatalogIntegrity(ERROR_CATALOG, EXIT_CODE_REGISTRY);

const errorDefinitionsByCode: ReadonlyMap<HarnessErrorCode, ErrorCatalogEntry> = new Map(
  ERROR_CATALOG.map((definition) => [definition.code, definition]),
);

export function getErrorDefinition(code: HarnessErrorCode): ErrorCatalogEntry {
  if (!isHarnessErrorCode(code)) {
    throw new TypeError(`Unknown Harness error code: ${String(code)}`);
  }

  const definition = errorDefinitionsByCode.get(code);
  if (definition === undefined) {
    throw new TypeError(`Missing Harness error catalog entry: ${code}`);
  }

  return definition;
}

export function getExitCodeForError(code: HarnessErrorCode): ExitCode {
  return getErrorDefinition(code).exitCode;
}

export type { ExitCodeDefinition };
