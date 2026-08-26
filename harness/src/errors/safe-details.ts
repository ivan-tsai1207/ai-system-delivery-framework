export const REDACTED_VALUE = "[REDACTED]" as const;

export type SafeDetailValue =
  | string
  | number
  | boolean
  | null
  | readonly SafeDetailValue[]
  | { readonly [key: string]: SafeDetailValue };

export type HarnessErrorDetails = Readonly<Record<string, SafeDetailValue>>;
export type HarnessErrorDetailsInput = Readonly<Record<string, SafeDetailValue>>;

const SENSITIVE_KEY_PARTS = new Set([
  "authorization",
  "authorizations",
  "cookie",
  "cookies",
  "credential",
  "credentials",
  "password",
  "passwords",
  "secret",
  "secrets",
  "token",
  "tokens",
]);

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isSensitiveKey(key: string): boolean {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());
  const compact = words.join("");

  if (compact === "apikey" || compact === "accesstoken" || compact === "refreshtoken") {
    return true;
  }

  return words.some((word) => SENSITIVE_KEY_PARTS.has(word));
}

function snapshotSafeValue(
  value: unknown,
  activeTraversal: WeakSet<object>,
  snapshots: WeakMap<object, SafeDetailValue>,
): SafeDetailValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("HarnessError details numbers must be finite.");
    }
    return value;
  }

  if (typeof value !== "object") {
    throw new TypeError("HarnessError details must contain JSON-safe values.");
  }

  if (activeTraversal.has(value)) {
    throw new TypeError("HarnessError details must not contain circular references.");
  }

  const existingSnapshot = snapshots.get(value);
  if (existingSnapshot !== undefined) {
    return existingSnapshot;
  }

  if (!Array.isArray(value) && !isPlainObject(value)) {
    throw new TypeError("HarnessError details must contain only arrays and plain objects.");
  }

  activeTraversal.add(value);

  try {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const symbolKeys = Reflect.ownKeys(descriptors).filter((key) => typeof key === "symbol");
    if (symbolKeys.length > 0) {
      throw new TypeError("HarnessError details must not contain symbol keys.");
    }

    if (Array.isArray(value)) {
      const snapshot: SafeDetailValue[] = [];
      snapshots.set(value, snapshot);

      for (let index = 0; index < value.length; index += 1) {
        const descriptor = descriptors[String(index)];
        if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
          throw new TypeError("HarnessError details arrays must be dense data arrays.");
        }
        snapshot.push(snapshotSafeValue(descriptor.value, activeTraversal, snapshots));
      }

      const allowedKeys = new Set(["length", ...snapshot.map((_, index) => String(index))]);
      for (const key of Object.keys(descriptors)) {
        if (!allowedKeys.has(key)) {
          throw new TypeError("HarnessError details arrays must not contain custom properties.");
        }
      }

      return Object.freeze(snapshot);
    }

    const snapshot: Record<string, SafeDetailValue> = {};
    snapshots.set(value, snapshot);

    for (const key of Object.keys(descriptors)) {
      const descriptor = descriptors[key];
      if (
        descriptor === undefined ||
        !("value" in descriptor) ||
        descriptor.enumerable !== true
      ) {
        throw new TypeError("HarnessError details must use enumerable data properties.");
      }

      const safeValue = isSensitiveKey(key)
        ? REDACTED_VALUE
        : snapshotSafeValue(descriptor.value, activeTraversal, snapshots);
      Object.defineProperty(snapshot, key, {
        configurable: false,
        enumerable: true,
        value: safeValue,
        writable: false,
      });
    }

    return Object.freeze(snapshot);
  } finally {
    activeTraversal.delete(value);
  }
}

export function snapshotHarnessErrorDetails(
  details: HarnessErrorDetailsInput | undefined,
): HarnessErrorDetails {
  if (details === undefined) {
    return Object.freeze({});
  }
  if (details === null || typeof details !== "object" || Array.isArray(details) || !isPlainObject(details)) {
    throw new TypeError("HarnessError details must be a plain object.");
  }

  return snapshotSafeValue(
    details,
    new WeakSet<object>(),
    new WeakMap<object, SafeDetailValue>(),
  ) as HarnessErrorDetails;
}
