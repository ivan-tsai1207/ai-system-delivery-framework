import { Ajv2020 } from "ajv/dist/2020.js";
import type { ErrorObject, ValidateFunction } from "ajv";

import {
  CANONICAL_SCHEMA_DOCUMENTS,
  type JsonValue,
  type SchemaDocument,
} from "./documents.js";

export const CANONICAL_SCHEMA_IDS = [
  "harness.project-context/v1",
  "harness.work-item/v2",
  "harness.context/v3",
  "harness.policy/v1",
  "harness.execution-profile/v2",
  "harness.audit/v2",
  "harness.bootstrap/v1",
  "harness.risk-assignment/v1",
  "harness.review-assignment/v1",
  "harness.role-evidence/v1",
  "harness.finding/v1",
  "harness.delivery-assurance/v1",
] as const;

export const SCHEMA_IDS = CANONICAL_SCHEMA_IDS;

export type CanonicalSchemaId = (typeof CANONICAL_SCHEMA_IDS)[number];

export const VALIDATION_STATUSES = [
  "VALID",
  "INVALID",
  "MIGRATION_REQUIRED",
  "UNKNOWN_SCHEMA",
  "UNKNOWN_VERSION",
] as const;

export type ValidationStatus = (typeof VALIDATION_STATUSES)[number];

export interface ValidationIssue {
  readonly instancePath: string;
  readonly schemaPath: string;
  readonly code: string;
  readonly message: string;
}

export interface ValidResult {
  readonly status: "VALID";
  readonly schemaId: string;
}

export interface InvalidResult {
  readonly status: "INVALID";
  readonly schemaId: string;
  readonly issues: readonly ValidationIssue[];
}

export interface MigrationRequiredResult {
  readonly status: "MIGRATION_REQUIRED";
  readonly schemaId: "harness.work-item/v1";
  readonly targetSchemaId: "harness.work-item/v2";
  readonly executable: false;
}

export interface UnknownSchemaResult {
  readonly status: "UNKNOWN_SCHEMA";
  readonly schemaId: string;
}

export interface UnknownVersionResult {
  readonly status: "UNKNOWN_VERSION";
  readonly schemaId: string;
  readonly schemaName: string;
  readonly requestedVersion: string;
  readonly supportedVersions: readonly string[];
}

export type ValidationResult =
  | ValidResult
  | InvalidResult
  | MigrationRequiredResult
  | UnknownSchemaResult
  | UnknownVersionResult;

export class DuplicateSchemaError extends Error {
  public readonly code = "DUPLICATE_SCHEMA";

  public constructor(schemaId: string) {
    super(`Schema already registered: ${schemaId}`);
    this.name = "DuplicateSchemaError";
  }
}

export class InvalidSchemaRegistrationError extends Error {
  public readonly code = "INVALID_SCHEMA_REGISTRATION";

  public constructor(message: string) {
    super(message);
    this.name = "InvalidSchemaRegistrationError";
  }
}

const schemaIdPattern = /^(?<name>.+)\/(?<version>v[1-9][0-9]*)$/;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function cloneJsonValue(value: JsonValue): JsonValue {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneJsonValue(item));
  }

  const clone: Record<string, JsonValue> = {};
  for (const [key, item] of Object.entries(value)) {
    clone[key] = cloneJsonValue(item);
  }
  return clone;
}

function isJsonObject(value: JsonValue): value is { readonly [key: string]: JsonValue } {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isSchemaDocument(value: JsonValue): value is SchemaDocument {
  return isJsonObject(value)
    && value.$schema === "https://json-schema.org/draft/2020-12/schema"
    && typeof value.$id === "string"
    && value.$id.length > 0;
}

function freezeJsonValue(value: JsonValue): JsonValue {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      freezeJsonValue(item);
    }
  } else {
    for (const item of Object.values(value)) {
      freezeJsonValue(item);
    }
  }

  return Object.freeze(value);
}

function snapshotSchema(schema: SchemaDocument): SchemaDocument {
  const cloned = cloneJsonValue(schema);
  if (!isSchemaDocument(cloned)) {
    throw new InvalidSchemaRegistrationError(
      "Schema must be a JSON object with a non-empty $id and the Draft 2020-12 dialect.",
    );
  }

  freezeJsonValue(cloned);
  return cloned;
}

function normalizeIssues(errors: readonly ErrorObject[] | null | undefined): readonly ValidationIssue[] {
  const issues = (errors ?? []).map((error) => ({
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    code: error.keyword,
    message: error.message ?? "Schema validation failed.",
  }));

  issues.sort((left, right) =>
    compareText(left.instancePath, right.instancePath)
    || compareText(left.schemaPath, right.schemaPath)
    || compareText(left.code, right.code)
    || compareText(left.message, right.message));

  return Object.freeze(issues.map((issue) => Object.freeze(issue)));
}

function parseVersionedId(schemaId: string): { readonly name: string; readonly version: string } | undefined {
  const match = schemaIdPattern.exec(schemaId);
  const name = match?.groups?.name;
  const version = match?.groups?.version;
  return name === undefined || version === undefined ? undefined : { name, version };
}

export class SchemaRegistry {
  readonly #ajv: Ajv2020;
  readonly #schemas = new Map<string, SchemaDocument>();
  readonly #validators = new Map<string, ValidateFunction<unknown>>();

  public constructor(schemas: readonly SchemaDocument[] = []) {
    this.#ajv = new Ajv2020({
      allErrors: true,
      strict: true,
      validateFormats: false,
    });

    for (const schema of schemas) {
      this.register(schema);
    }
  }

  public register(schema: SchemaDocument): void {
    const snapshot = snapshotSchema(schema);
    const schemaId = snapshot.$id;
    if (this.#schemas.has(schemaId)) {
      throw new DuplicateSchemaError(schemaId);
    }

    let validator: ValidateFunction<unknown>;
    try {
      validator = this.#ajv.compile(snapshot);
    } catch (error: unknown) {
      this.#ajv.removeSchema(schemaId);
      const message = error instanceof Error ? error.message : "Unknown schema compilation failure.";
      throw new InvalidSchemaRegistrationError(`Unable to register ${schemaId}: ${message}`);
    }

    this.#schemas.set(schemaId, snapshot);
    this.#validators.set(schemaId, validator);
  }

  public listSchemaIds(): readonly string[] {
    return Object.freeze([...this.#schemas.keys()]);
  }

  public enumerate(): readonly string[] {
    return this.listSchemaIds();
  }

  public resolve(schemaId: string): SchemaDocument | undefined {
    return this.#schemas.get(schemaId);
  }

  public validate(schemaId: string, value: unknown): ValidationResult {
    if (schemaId === "harness.work-item/v1") {
      return Object.freeze({
        status: "MIGRATION_REQUIRED",
        schemaId,
        targetSchemaId: "harness.work-item/v2",
        executable: false,
      });
    }

    const validator = this.#validators.get(schemaId);
    if (validator === undefined) {
      return this.#unknownResult(schemaId);
    }

    if (validator(value)) {
      return Object.freeze({ status: "VALID", schemaId });
    }

    return Object.freeze({
      status: "INVALID",
      schemaId,
      issues: normalizeIssues(validator.errors),
    });
  }

  public validateDocument(value: unknown): ValidationResult {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return Object.freeze({ status: "UNKNOWN_SCHEMA", schemaId: "" });
    }

    const descriptor = Object.getOwnPropertyDescriptor(value, "schema_version");
    if (descriptor === undefined || !("value" in descriptor) || typeof descriptor.value !== "string") {
      return Object.freeze({ status: "UNKNOWN_SCHEMA", schemaId: "" });
    }

    return this.validate(descriptor.value, value);
  }

  #unknownResult(schemaId: string): UnknownSchemaResult | UnknownVersionResult {
    const parsed = parseVersionedId(schemaId);
    if (parsed === undefined) {
      return Object.freeze({ status: "UNKNOWN_SCHEMA", schemaId });
    }

    const supportedVersions = [...this.#schemas.keys()]
      .map((candidate) => parseVersionedId(candidate))
      .filter((candidate): candidate is { readonly name: string; readonly version: string } => candidate !== undefined)
      .filter((candidate) => candidate.name === parsed.name)
      .map((candidate) => candidate.version);

    if (supportedVersions.length === 0) {
      return Object.freeze({ status: "UNKNOWN_SCHEMA", schemaId });
    }

    supportedVersions.sort(compareText);
    return Object.freeze({
      status: "UNKNOWN_VERSION",
      schemaId,
      schemaName: parsed.name,
      requestedVersion: parsed.version,
      supportedVersions: Object.freeze(supportedVersions),
    });
  }
}

export function createSchemaRegistry(): SchemaRegistry {
  return new SchemaRegistry(CANONICAL_SCHEMA_DOCUMENTS);
}

export const canonicalSchemaRegistry = createSchemaRegistry();

export function validateSchema(schemaId: string, value: unknown): ValidationResult {
  return canonicalSchemaRegistry.validate(schemaId, value);
}

export function validateDocument(value: unknown): ValidationResult {
  return canonicalSchemaRegistry.validateDocument(value);
}
