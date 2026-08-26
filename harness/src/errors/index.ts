export {
  ERROR_CATALOG,
  ERROR_CODES,
  assertErrorCatalogIntegrity,
  getErrorDefinition,
  getExitCodeForError,
  isHarnessErrorCode,
  type ErrorCatalogEntry,
  type ErrorCatalogValidationEntry,
  type ExitCodeValidationEntry,
  type HarnessErrorCode,
  type HarnessErrorName,
  type HumanActionSemantics,
  type LifecycleMapping,
  type RetryableSemantics,
} from "./error-catalog.js";
export {
  EXIT_CODES,
  EXIT_CODE_REGISTRY,
  getExitCodeDefinition,
  isExitCode,
  type ExitCode,
  type ExitCodeDefinition,
} from "./exit-code-registry.js";
export {
  HarnessError,
  createHarnessError,
  type HarnessErrorOptions,
  type SerializedHarnessError,
} from "./harness-error.js";
export {
  REDACTED_VALUE,
  type HarnessErrorDetails,
  type HarnessErrorDetailsInput,
  type SafeDetailValue,
} from "./safe-details.js";
