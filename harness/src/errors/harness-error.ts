import {
  getErrorDefinition,
  type HarnessErrorCode,
  type HarnessErrorName,
  type HumanActionSemantics,
  type LifecycleMapping,
  type RetryableSemantics,
} from "./error-catalog.js";
import type { ExitCode } from "./exit-code-registry.js";
import {
  containsSensitiveMarker,
  snapshotHarnessErrorDetails,
  type HarnessErrorDetails,
  type HarnessErrorDetailsInput,
} from "./safe-details.js";

export interface HarnessErrorOptions {
  readonly correlationId: string;
  readonly causeCategory: string;
  readonly message?: string;
  readonly details?: HarnessErrorDetailsInput;
  readonly cause?: HarnessError;
}

export interface SerializedHarnessError {
  readonly code: HarnessErrorCode;
  readonly name: HarnessErrorName;
  readonly message: string;
  readonly defaultMessage: HarnessErrorName;
  readonly retryable: RetryableSemantics;
  readonly humanAction: HumanActionSemantics;
  readonly lifecycleMapping: LifecycleMapping;
  readonly exitCode: ExitCode;
  readonly correlationId: string;
  readonly causeCategory: string;
  readonly details: HarnessErrorDetails;
  readonly cause?: SerializedHarnessError;
}

interface ParsedHarnessErrorOptions {
  readonly correlationId: string;
  readonly causeCategory: string;
  readonly message: string | undefined;
  readonly details: HarnessErrorDetails;
  readonly cause: HarnessError | undefined;
}

const harnessErrorInstances = new WeakSet<object>();
const HARNESS_ERROR_OPTION_KEYS = new Set([
  "correlationId",
  "causeCategory",
  "message",
  "details",
  "cause",
]);
const CORRELATION_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CAUSE_CATEGORY_PATTERN = /^[A-Za-z][A-Za-z0-9]*(?:[._-][A-Za-z0-9]+)*$/;

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function getDataProperty(
  descriptors: PropertyDescriptorMap,
  key: string,
): PropertyDescriptor | undefined {
  const descriptor = descriptors[key];
  if (descriptor !== undefined && !("value" in descriptor)) {
    throw new TypeError(`HarnessError option ${key} must be a data property.`);
  }
  return descriptor;
}

function parseOptions(options: HarnessErrorOptions): ParsedHarnessErrorOptions {
  if (options === null || typeof options !== "object" || !isPlainObject(options)) {
    throw new TypeError("HarnessError options must be a plain object.");
  }

  const descriptors = Object.getOwnPropertyDescriptors(options);
  for (const key of Reflect.ownKeys(descriptors)) {
    if (typeof key !== "string" || !HARNESS_ERROR_OPTION_KEYS.has(key)) {
      throw new TypeError(`Unknown HarnessError option: ${String(key)}`);
    }
    getDataProperty(descriptors, key);
  }

  const correlationId = getDataProperty(descriptors, "correlationId")?.value;
  if (typeof correlationId !== "string" || !CORRELATION_ID_PATTERN.test(correlationId)) {
    throw new TypeError("HarnessError correlationId must be a safe execution/session identifier.");
  }

  const causeCategory = getDataProperty(descriptors, "causeCategory")?.value;
  if (
    typeof causeCategory !== "string" ||
    causeCategory.length > 80 ||
    !CAUSE_CATEGORY_PATTERN.test(causeCategory)
  ) {
    throw new TypeError("HarnessError causeCategory must be a safe vendor-neutral category.");
  }

  const messageDescriptor = getDataProperty(descriptors, "message");
  if (messageDescriptor !== undefined && typeof messageDescriptor.value !== "string") {
    throw new TypeError("HarnessError message must be a string when supplied.");
  }
  if (
    messageDescriptor !== undefined &&
    containsSensitiveMarker(messageDescriptor.value as string)
  ) {
    throw new TypeError("HarnessError custom message contains sensitive text.");
  }

  const detailsDescriptor = getDataProperty(descriptors, "details");
  if (detailsDescriptor !== undefined && detailsDescriptor.value === undefined) {
    throw new TypeError("HarnessError details must be omitted instead of undefined.");
  }
  const details = snapshotHarnessErrorDetails(
    detailsDescriptor?.value as HarnessErrorDetailsInput | undefined,
  );

  const causeDescriptor = getDataProperty(descriptors, "cause");
  if (causeDescriptor !== undefined && !harnessErrorInstances.has(causeDescriptor.value)) {
    throw new TypeError("HarnessError cause must be an authentic HarnessError.");
  }

  return Object.freeze({
    correlationId,
    causeCategory,
    message: messageDescriptor?.value as string | undefined,
    details,
    cause: causeDescriptor?.value as HarnessError | undefined,
  });
}

export class HarnessError extends Error {
  declare readonly message: string;
  declare readonly cause?: HarnessError;
  declare readonly stack?: string;

  override readonly name: HarnessErrorName;
  readonly code: HarnessErrorCode;
  readonly defaultMessage: HarnessErrorName;
  readonly retryable: RetryableSemantics;
  readonly humanAction: HumanActionSemantics;
  readonly lifecycleMapping: LifecycleMapping;
  readonly exitCode: ExitCode;
  readonly correlationId: string;
  readonly causeCategory: string;
  readonly details: HarnessErrorDetails;

  constructor(code: HarnessErrorCode, options: HarnessErrorOptions) {
    const definition = getErrorDefinition(code);
    const parsedOptions = parseOptions(options);
    super(parsedOptions.message ?? definition.defaultMessage);

    this.name = definition.name;
    this.code = definition.code;
    this.defaultMessage = definition.defaultMessage;
    this.retryable = definition.retryable;
    this.humanAction = definition.humanAction;
    this.lifecycleMapping = definition.lifecycleMapping;
    this.exitCode = definition.exitCode;
    this.correlationId = parsedOptions.correlationId;
    this.causeCategory = parsedOptions.causeCategory;
    this.details = parsedOptions.details;

    if (parsedOptions.cause !== undefined) {
      Object.defineProperty(this, "cause", {
        configurable: false,
        enumerable: false,
        value: parsedOptions.cause,
        writable: false,
      });
    }

    harnessErrorInstances.add(this);
    Object.freeze(this);
  }

  toJSON(): SerializedHarnessError {
    const serialized = {
      code: this.code,
      name: this.name,
      message: this.message,
      defaultMessage: this.defaultMessage,
      retryable: this.retryable,
      humanAction: this.humanAction,
      lifecycleMapping: this.lifecycleMapping,
      exitCode: this.exitCode,
      correlationId: this.correlationId,
      causeCategory: this.causeCategory,
      details: snapshotHarnessErrorDetails(this.details),
    };

    if (this.cause === undefined) {
      return Object.freeze(serialized);
    }

    return Object.freeze({
      ...serialized,
      cause: this.cause.toJSON(),
    });
  }
}

export function createHarnessError(
  code: HarnessErrorCode,
  options: HarnessErrorOptions,
): HarnessError {
  return new HarnessError(code, options);
}
