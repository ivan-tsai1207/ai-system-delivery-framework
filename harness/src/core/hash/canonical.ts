export type CanonicalPrimitive = null | boolean | number | string;

export type CanonicalValue =
  | CanonicalPrimitive
  | readonly CanonicalValue[]
  | { readonly [key: string]: CanonicalValue };

export class CanonicalSerializationError extends TypeError {
  readonly code = "CANONICAL_SERIALIZATION_INVALID" as const;

  constructor(message: string) {
    super(message);
    this.name = "CanonicalSerializationError";
  }
}

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function quote(value: string): string {
  const serialized = JSON.stringify(value.normalize("NFC"));
  if (serialized === undefined) {
    throw new CanonicalSerializationError("Canonical string serialization failed.");
  }
  return serialized;
}

function serializeNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new CanonicalSerializationError("Canonical numbers must be finite.");
  }
  return Object.is(value, -0) ? "0" : String(value);
}

function serializeArray(value: readonly unknown[], active: WeakSet<object>): string {
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const allowedKeys = new Set(["length"]);
  const elements: string[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const key = String(index);
    const descriptor = descriptors[key];
    if (
      descriptor === undefined ||
      !("value" in descriptor) ||
      descriptor.enumerable !== true
    ) {
      throw new CanonicalSerializationError(
        "Canonical arrays must be dense and use enumerable data elements.",
      );
    }
    allowedKeys.add(key);
    elements.push(serializeValue(descriptor.value, active));
  }

  for (const key of Reflect.ownKeys(descriptors)) {
    if (typeof key !== "string" || !allowedKeys.has(key)) {
      throw new CanonicalSerializationError(
        "Canonical arrays must not contain symbols or custom properties.",
      );
    }
  }

  return `[${elements.join(",")}]`;
}

function serializeObject(value: object, active: WeakSet<object>): string {
  if (!isPlainObject(value)) {
    throw new CanonicalSerializationError(
      "Canonical values support only primitives, arrays, and plain objects.",
    );
  }

  const descriptors = Object.getOwnPropertyDescriptors(value);
  const normalized = new Map<string, unknown>();

  for (const key of Reflect.ownKeys(descriptors)) {
    if (typeof key !== "string") {
      throw new CanonicalSerializationError("Canonical objects must not contain symbol keys.");
    }
    const descriptor = descriptors[key];
    if (
      descriptor === undefined ||
      !("value" in descriptor) ||
      descriptor.enumerable !== true
    ) {
      throw new CanonicalSerializationError(
        "Canonical objects must use enumerable data properties.",
      );
    }

    const normalizedKey = key.normalize("NFC");
    if (normalized.has(normalizedKey)) {
      throw new CanonicalSerializationError(
        "Canonical object keys must remain unique after Unicode normalization.",
      );
    }
    normalized.set(normalizedKey, descriptor.value);
  }

  return `{${[...normalized.keys()]
    .sort()
    .map((key) => `${quote(key)}:${serializeValue(normalized.get(key), active)}`)
    .join(",")}}`;
}

function serializeValue(value: unknown, active: WeakSet<object>): string {
  if (value === null) {
    return "null";
  }
  if (typeof value === "string") {
    return quote(value);
  }
  if (typeof value === "number") {
    return serializeNumber(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value !== "object") {
    throw new CanonicalSerializationError(
      "Canonical values must not contain undefined, bigint, symbol, or function values.",
    );
  }
  if (active.has(value)) {
    throw new CanonicalSerializationError("Canonical values must not contain cycles.");
  }

  active.add(value);
  try {
    return Array.isArray(value)
      ? serializeArray(value, active)
      : serializeObject(value, active);
  } finally {
    active.delete(value);
  }
}

export function canonicalStringify(value: unknown): string {
  return serializeValue(value, new WeakSet<object>());
}

export function encodeUtf8(value: string): Uint8Array {
  const bytes: number[] = [];

  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }
    const scalar = codePoint >= 0xd800 && codePoint <= 0xdfff ? 0xfffd : codePoint;
    if (scalar <= 0x7f) {
      bytes.push(scalar);
    } else if (scalar <= 0x7ff) {
      bytes.push(0xc0 | (scalar >>> 6), 0x80 | (scalar & 0x3f));
    } else if (scalar <= 0xffff) {
      bytes.push(
        0xe0 | (scalar >>> 12),
        0x80 | ((scalar >>> 6) & 0x3f),
        0x80 | (scalar & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (scalar >>> 18),
        0x80 | ((scalar >>> 12) & 0x3f),
        0x80 | ((scalar >>> 6) & 0x3f),
        0x80 | (scalar & 0x3f),
      );
    }
  }

  return Uint8Array.from(bytes);
}

export function canonicalUtf8Bytes(value: unknown): Uint8Array {
  return encodeUtf8(canonicalStringify(value));
}
