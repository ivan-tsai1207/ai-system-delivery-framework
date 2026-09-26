export const HARNESS_CONFIG_SCHEMA_VERSION = "harness.config/v1" as const;

export const CONFIG_VISIBILITIES = ["private", "internal", "public"] as const;
export type ConfigVisibility = (typeof CONFIG_VISIBILITIES)[number];

export const CONFIG_ADAPTERS = ["codex", "claude"] as const;
export type ConfigAdapter = (typeof CONFIG_ADAPTERS)[number];

export type ConfigValidationCode =
  | "INVALID_CONFIG"
  | "UNKNOWN_CONFIG_KEY"
  | "UNSUPPORTED_CONFIG_VERSION"
  | "SECRET_CONFIG_REJECTED"
  | "CONFIG_NARROWING_VIOLATION";

export class ConfigValidationError extends TypeError {
  readonly code: ConfigValidationCode;
  readonly configPath: string;

  constructor(code: ConfigValidationCode, configPath: string, message: string) {
    super(message);
    this.name = "ConfigValidationError";
    this.code = code;
    this.configPath = configPath;
  }
}

export interface FrameworkConfig {
  readonly repository: string;
}

export interface GithubConfig {
  readonly default_owner: string;
  readonly default_visibility: ConfigVisibility;
}

export interface AdapterConfig {
  readonly preference: readonly ConfigAdapter[];
}

export interface AuditConfig {
  readonly path: string;
}

export interface ContextBudgetConfig {
  readonly initial_max_files: number;
  readonly initial_max_sections: number;
  readonly initial_max_bytes: number;
  readonly hard_max_files: number;
  readonly hard_max_sections: number;
  readonly hard_max_bytes: number;
}

export interface TimeoutConfig {
  readonly process_seconds: number;
}

export interface EnvironmentConfig {
  readonly allowlist: readonly string[];
}

export interface HarnessConfig {
  readonly schema_version: typeof HARNESS_CONFIG_SCHEMA_VERSION;
  readonly framework?: Readonly<Partial<FrameworkConfig>>;
  readonly github?: Readonly<Partial<GithubConfig>>;
  readonly adapters?: Readonly<Partial<AdapterConfig>>;
  readonly audit?: Readonly<Partial<AuditConfig>>;
  readonly context?: Readonly<Partial<ContextBudgetConfig>>;
  readonly timeouts?: Readonly<Partial<TimeoutConfig>>;
  readonly environment?: Readonly<Partial<EnvironmentConfig>>;
}

export interface ConfigLayers {
  readonly host?: unknown;
  readonly project?: unknown;
  readonly invocation?: unknown;
}

export interface ChildEnvironmentPolicy {
  readonly baseline: "EMPTY";
  readonly inheritParentEnvironment: false;
  readonly allowlist: readonly string[];
}

const TOP_LEVEL_KEYS = new Set([
  "schema_version",
  "framework",
  "github",
  "adapters",
  "audit",
  "context",
  "timeouts",
  "environment",
]);
const FRAMEWORK_KEYS = new Set(["repository"]);
const GITHUB_KEYS = new Set(["default_owner", "default_visibility"]);
const ADAPTER_KEYS = new Set(["preference"]);
const AUDIT_KEYS = new Set(["path"]);
const CONTEXT_KEYS = new Set([
  "initial_max_files",
  "initial_max_sections",
  "initial_max_bytes",
  "hard_max_files",
  "hard_max_sections",
  "hard_max_bytes",
]);
const TIMEOUT_KEYS = new Set(["process_seconds"]);
const ENVIRONMENT_KEYS = new Set(["allowlist"]);
const ENVIRONMENT_NAME_PATTERN = /^[A-Z_][A-Z0-9_]{0,127}$/;
const SHELL_ESCAPED_LABEL_SEPARATOR_PATTERN = /\\([:=\s._-])/g;
const URL_ENCODED_LABEL_SEPARATOR_PATTERN = /%(2d|2e|5f)/gi;
const SENSITIVE_LABEL_TOKENS = new Set([
  "auth",
  "authorization",
  "bearer",
  "cookie",
  "credential",
  "credentials",
  "jwt",
  "passwd",
  "password",
  "pwd",
  "secret",
  "token",
]);
const SENSITIVE_COMPACT_LABELS = new Set([
  "apikey",
  "authtoken",
  "clientsecret",
  "githubtoken",
  "ghtoken",
  "idtoken",
  "nodeauthtoken",
  "npmtoken",
  "passwordhash",
  "privatekey",
  "refreshtoken",
  "sessiontoken",
  "tokenvalue",
]);
const SENSITIVE_LABEL_TOKEN_SEQUENCES: readonly (readonly string[])[] = [
  ["access", "token"],
  ["api", "key"],
  ["auth", "token"],
  ["client", "secret"],
  ["github", "token"],
  ["id", "token"],
  ["node", "auth", "token"],
  ["npm", "token"],
  ["private", "key"],
  ["refresh", "token"],
  ["session", "token"],
];
const HIGH_CONFIDENCE_CREDENTIAL_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\bBearer\s+[A-Za-z0-9._~+\/-]{8,}={0,2}\b/i,
  /\b(?:gh[pousr]_|github_pat_|sk-(?:proj-)?|xox[baprs]-)[A-Za-z0-9._-]{8,}\b/i,
  /(?:^|[^A-Za-z0-9])glpat-[A-Za-z0-9_-]{20,}(?=$|[^A-Za-z0-9_-])/i,
  /(?:^|[^A-Za-z0-9])AIza[0-9A-Za-z_-]{20,}(?=$|[^0-9A-Za-z_-])/i,
  /(?:^|[^A-Za-z0-9])(?:sk|rk)_(?:live|test)_[0-9A-Za-z]{16,}(?=$|[^0-9A-Za-z])/i,
  /(?:^|[^A-Za-z0-9])whsec_[0-9A-Za-z]{16,}(?=$|[^0-9A-Za-z])/i,
  /(?:^|[^A-Za-z0-9])GOCSPX-[0-9A-Za-z_-]{20,}(?=$|[^0-9A-Za-z_-])/i,
  /(?:^|[^A-Za-z0-9])npm_[0-9A-Za-z]{20,}(?=$|[^0-9A-Za-z])/i,
  /(?:^|[^A-Za-z0-9])SG\.[0-9A-Za-z_-]{16,}\.[0-9A-Za-z_-]{16,}(?=$|[^0-9A-Za-z_-])/i,
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
  /[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s@]+@/i,
];
const DENIED_ENVIRONMENT_EXACT_NAMES = new Set([
  "BASH_ENV",
  "BASHOPTS",
  "CARGO_HOME",
  "CCACHE_PREFIX",
  "CCACHE_PREFIX_CPP",
  "CI_JOB_JWT",
  "CI_JOB_JWT_V2",
  "CI_JOB_TOKEN",
  "CLOUDSDK_CONFIG",
  "CMAKE_C_COMPILER_LAUNCHER",
  "CMAKE_CXX_COMPILER_LAUNCHER",
  "COMPILER_PATH",
  "DATABASE_URL",
  "DOCKER_CONFIG",
  "EDITOR",
  "ENV",
  "GCC_EXEC_PREFIX",
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_ASKPASS",
  "GIT_CONFIG",
  "GIT_CONFIG_GLOBAL",
  "GIT_CONFIG_NOSYSTEM",
  "GIT_CONFIG_SYSTEM",
  "GIT_CREDENTIAL_HELPER",
  "GIT_CREDENTIALS",
  "GIT_DIR",
  "GIT_EDITOR",
  "GIT_EXEC_PATH",
  "GIT_EXTERNAL_DIFF",
  "GIT_INDEX_FILE",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PAGER",
  "GIT_PROXY_COMMAND",
  "GIT_SSH",
  "GIT_SSH_COMMAND",
  "GIT_TERMINAL_PROMPT",
  "GIT_WORK_TREE",
  "GITHUB_TOKEN",
  "JAVA_TOOL_OPTIONS",
  "KUBECONFIG",
  "LD_LIBRARY_PATH",
  "LD_PRELOAD",
  "LIBRARY_PATH",
  "NODE_AUTH_TOKEN",
  "NODE_OPTIONS",
  "NODE_PATH",
  "OCI_CLI_CONFIG_FILE",
  "PAGER",
  "PERL5OPT",
  "PROMPT_COMMAND",
  "PYTHONHOME",
  "PYTHONPATH",
  "PYTHONSTARTUP",
  "RUBYOPT",
  "RUSTC_WRAPPER",
  "RUSTC_WORKSPACE_WRAPPER",
  "RUSTDOCFLAGS",
  "RUSTFLAGS",
  "SHELLOPTS",
  "SHELL",
  "SSH_ASKPASS",
  "TF_CLI_CONFIG_FILE",
  "VISUAL",
  "ZDOTDIR",
  "_JAVA_OPTIONS",
]);
const DENIED_ENVIRONMENT_PREFIXES = [
  "AWS_",
  "AZURE_",
  "CLOUDSDK_",
  "DOCKER_",
  "DYLD_",
  "GCP_",
  "GIT_CONFIG_",
  "GOOGLE_",
  "KUBE_",
  "NPM_",
  "SSH_",
];
const DENIED_ENVIRONMENT_STRUCTURED_PATTERNS = [
  /^CARGO_REGISTRIES_[A-Z0-9_]+_TOKEN$/,
  /^CARGO_TARGET_[A-Z0-9_]+_(?:LINKER|RUNNER|RUSTFLAGS)$/,
  /^(?:C|CPLUS|OBJC)_INCLUDE_PATH$/,
  /^(?:CC|CXX|CPP|LD|AR|AS|NM|OBJCOPY|OBJDUMP|RANLIB|STRIP)$/,
  /^(?:CC|CXX|CPP|LD|AR|AS|NM|OBJCOPY|OBJDUMP|RANLIB|STRIP)_[A-Z0-9_]+$/,
  /^(?:GIT|SSH)_[A-Z0-9_]*(?:ASKPASS|COMMAND|CREDENTIAL|EXEC_PATH|PROXY)[A-Z0-9_]*$/,
];

type MutableFields<Value> = { -readonly [Key in keyof Value]: Value[Key] };

type MutableConfig = {
  schema_version: typeof HARNESS_CONFIG_SCHEMA_VERSION;
  framework?: Partial<MutableFields<FrameworkConfig>>;
  github?: Partial<MutableFields<GithubConfig>>;
  adapters?: Partial<MutableFields<AdapterConfig>>;
  audit?: Partial<MutableFields<AuditConfig>>;
  context?: Partial<MutableFields<ContextBudgetConfig>>;
  timeouts?: Partial<MutableFields<TimeoutConfig>>;
  environment?: Partial<MutableFields<EnvironmentConfig>>;
};

function normalizeLabelSeparators(value: string, decodeUrlSeparators = false): string {
  const shellNormalized = value.replace(SHELL_ESCAPED_LABEL_SEPARATOR_PATTERN, "$1");
  if (!decodeUrlSeparators) return shellNormalized;
  return shellNormalized.replace(URL_ENCODED_LABEL_SEPARATOR_PATTERN, (encoded) => {
    switch (encoded.toLowerCase()) {
      case "%2d": return "-";
      case "%2e": return ".";
      case "%5f": return "_";
      default: return encoded;
    }
  });
}

function normalizeCompactLabel(value: string, decodeUrlSeparators = false): string {
  return normalizeLabelSeparators(value, decodeUrlSeparators)
    .replace(/[^A-Za-z0-9]+/g, "")
    .toLowerCase();
}

function labelTokens(value: string, decodeUrlSeparators = false): readonly string[] {
  const withCaseBoundaries = normalizeLabelSeparators(value, decodeUrlSeparators)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return withCaseBoundaries
    .split(/[^A-Za-z0-9]+/)
    .map((token) => token.toLowerCase())
    .filter((token) => token.length > 0);
}

function hasTokenSequence(tokens: readonly string[], sequence: readonly string[]): boolean {
  if (sequence.length === 0 || tokens.length < sequence.length) return false;
  for (let index = 0; index <= tokens.length - sequence.length; index += 1) {
    let matched = true;
    for (let offset = 0; offset < sequence.length; offset += 1) {
      if (tokens[index + offset] !== sequence[offset]) {
        matched = false;
        break;
      }
    }
    if (matched) return true;
  }
  return false;
}

function isSensitiveLabel(value: string, decodeUrlSeparators = false): boolean {
  const compact = normalizeCompactLabel(value, decodeUrlSeparators);
  if (SENSITIVE_COMPACT_LABELS.has(compact)) return true;
  const tokens = labelTokens(value, decodeUrlSeparators);
  return (
    tokens.some((token) => SENSITIVE_LABEL_TOKENS.has(token)) ||
    SENSITIVE_LABEL_TOKEN_SEQUENCES.some((sequence) => hasTokenSequence(tokens, sequence))
  );
}

function containsHighConfidenceCredential(value: string): boolean {
  return HIGH_CONFIDENCE_CREDENTIAL_PATTERNS.some((pattern) => pattern.test(value));
}

function containsSensitiveAssignment(value: string): boolean {
  const assignmentPatterns = [
    /(?:^|[/?::&#;,\s{[])(?:--?|\/)?"([_A-Za-z](?:[A-Za-z0-9\s._-]|\\[:=\s._-]){0,63})"\s*(?::|=|\\=)\s*(?=["']?[^\s,;&#}\]])/gi,
    /(?:^|[/?::&#;,\s{[])(?:--?|\/)?'([_A-Za-z](?:[A-Za-z0-9\s._-]|\\[:=\s._-]){0,63})'\s*(?::|=|\\=)\s*(?=["']?[^\s,;&#}\]])/gi,
    /(?:^|[/?::&#;,\s{[])(?:--?|\/)?([_A-Za-z](?:[A-Za-z0-9._-]|\\[:=\s._-]){0,63})\s*(?::|=|\\=)\s*(?=["']?[^\s,;&#}\]])/gi,
    /(?:^|[/?::&#;,\s{[])(_[A-Za-z](?:[A-Za-z0-9._-]|\\[:=\s._-]){0,62})\s+(?:"(?:\\.|[^"])+?"|'(?:\\.|[^'])+?'|[^\s,;&]+)/gi,
    /(?:^|[/?::&#;,\s{[])"(_[A-Za-z](?:[A-Za-z0-9._-]|\\[:=\s._-]){0,62})"\s+(?:"(?:\\.|[^"])+?"|'(?:\\.|[^'])+?'|[^\s,;&]+)/gi,
    /(?:^|[/?::&#;,\s{[])'(_[A-Za-z](?:[A-Za-z0-9._-]|\\[:=\s._-]){0,62})'\s+(?:"(?:\\.|[^"])+?"|'(?:\\.|[^'])+?'|[^\s,;&]+)/gi,
    /"(?:\\.|[^"\\\r\n]){0,255}[/?::&#;,{[](_[A-Za-z](?:[A-Za-z0-9._-]|\\[:=\s._-]){0,62})"\s+(?:"(?:\\.|[^"])+?"|'(?:\\.|[^'])+?'|[^\s,;&]+)/gi,
    /'(?:\\.|[^'\\\r\n]){0,255}[/?::&#;,{[](_[A-Za-z](?:[A-Za-z0-9._-]|\\[:=\s._-]){0,62})'\s+(?:"(?:\\.|[^"])+?"|'(?:\\.|[^'])+?'|[^\s,;&]+)/gi,
    /(?:^|[/?::&#;,\s{[])(?:--?|\/)?([_A-Za-z][A-Za-z0-9._-]{0,63})\\\s+(?:"(?:\\.|[^"])+?"|'(?:\\.|[^'])+?'|[^\s,;&]+)/gi,
  ];
  for (const pattern of assignmentPatterns) {
    for (const match of value.matchAll(pattern)) {
      const label = match[1];
      if (label !== undefined && isSensitiveLabel(label)) return true;
    }
  }

  const encodedQueryAssignmentPattern =
    /[?&]([_A-Za-z](?:[A-Za-z0-9._-]|%(?:2d|2e|5f)){0,63})\s*=\s*(?=["']?[^\s,;&#}\]])/gi;
  for (const match of value.matchAll(encodedQueryAssignmentPattern)) {
    const label = match[1];
    if (label !== undefined && isSensitiveLabel(label, true)) return true;
  }

  const cliFlagPattern =
    /(?:^|\s)--([A-Za-z](?:[A-Za-z0-9._-]|\\[:=\s._-]){1,63})(?:\s+|\\\s+)(?:"(?:\\.|[^"])+?"|'(?:\\.|[^'])+?'|[^\s,;&]+)/gi;
  for (const match of value.matchAll(cliFlagPattern)) {
    const label = match[1];
    if (label !== undefined && isSensitiveLabel(label)) return true;
  }
  return false;
}

function containsSecretMaterial(value: string): boolean {
  return (
    containsHighConfidenceCredential(value) ||
    containsSensitiveAssignment(value)
  );
}

function containsSensitiveKeyMaterial(value: string): boolean {
  return isSensitiveLabel(value) || containsSecretMaterial(value);
}

function safePath(parent: string, key: string): string {
  return containsSensitiveKeyMaterial(key) ? "[REDACTED]" : `${parent}.${key}`;
}

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function readRecord(value: unknown, path: string, allowedKeys: ReadonlySet<string>): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value) || !isPlainObject(value)) {
    throw new ConfigValidationError("INVALID_CONFIG", path, `${path} must be a plain object.`);
  }

  const result: Record<string, unknown> = {};
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const key of Reflect.ownKeys(descriptors)) {
    if (typeof key !== "string") {
      throw new ConfigValidationError("UNKNOWN_CONFIG_KEY", path, `${path} must not contain symbol keys.`);
    }
    const keyPath = safePath(path, key);
    if (containsSensitiveKeyMaterial(key)) {
      throw new ConfigValidationError(
        "SECRET_CONFIG_REJECTED",
        keyPath,
        "Secret-bearing config keys are forbidden at [REDACTED].",
      );
    }
    if (!allowedKeys.has(key)) {
      throw new ConfigValidationError(
        "UNKNOWN_CONFIG_KEY",
        keyPath,
        `Unknown config key: ${keyPath}.`,
      );
    }
    const descriptor = descriptors[key];
    if (
      descriptor === undefined ||
      !("value" in descriptor) ||
      descriptor.enumerable !== true
    ) {
      throw new ConfigValidationError(
        "INVALID_CONFIG",
        keyPath,
        `${keyPath} must be an enumerable data property.`,
      );
    }
    result[key] = descriptor.value;
  }
  return result;
}

function readString(value: unknown, path: string): string {
  if (typeof value === "string" && containsSecretMaterial(value)) {
    throw new ConfigValidationError(
      "SECRET_CONFIG_REJECTED",
      path,
      `Secret-like config value rejected at ${path}; value was not retained.`,
    );
  }
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.trim() !== value ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new ConfigValidationError("INVALID_CONFIG", path, `${path} must be a non-empty normalized string.`);
  }
  return value.normalize("NFC");
}

function readPositiveInteger(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new ConfigValidationError("INVALID_CONFIG", path, `${path} must be a positive safe integer.`);
  }
  return value;
}

function readStringArray(
  value: unknown,
  path: string,
  itemValidator: (item: string, itemPath: string) => string,
): readonly string[] {
  if (!Array.isArray(value)) {
    throw new ConfigValidationError("INVALID_CONFIG", path, `${path} must be an array.`);
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const allowedKeys = new Set(["length"]);
  const result: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const key = String(index);
    const descriptor = descriptors[key];
    if (
      descriptor === undefined ||
      !("value" in descriptor) ||
      descriptor.enumerable !== true
    ) {
      throw new ConfigValidationError(
        "INVALID_CONFIG",
        `${path}[${index}]`,
        `${path} must be a dense array of data elements.`,
      );
    }
    allowedKeys.add(key);
    result.push(itemValidator(readString(descriptor.value, `${path}[${index}]`), `${path}[${index}]`));
  }
  for (const key of Reflect.ownKeys(descriptors)) {
    if (typeof key !== "string" || !allowedKeys.has(key)) {
      throw new ConfigValidationError(
        "INVALID_CONFIG",
        path,
        `${path} must not contain symbols or custom properties.`,
      );
    }
  }
  if (new Set(result).size !== result.length) {
    throw new ConfigValidationError("INVALID_CONFIG", path, `${path} must not contain duplicates.`);
  }
  return Object.freeze(result);
}

function freezeConfig(config: MutableConfig): HarnessConfig {
  for (const key of Object.keys(config) as (keyof MutableConfig)[]) {
    const value = config[key];
    if (value !== undefined && typeof value === "object") {
      Object.freeze(value);
    }
  }
  return Object.freeze(config);
}

function assignSection<Section extends object>(
  source: Record<string, unknown>,
  key: string,
  parser: (value: unknown, path: string) => Section,
  target: MutableConfig,
): void {
  if (Object.hasOwn(source, key)) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      value: parser(source[key], `config.${key}`),
      writable: true,
    });
  }
}

function parseFramework(value: unknown, path: string): Partial<MutableFields<FrameworkConfig>> {
  const source = readRecord(value, path, FRAMEWORK_KEYS);
  const result: Partial<MutableFields<FrameworkConfig>> = {};
  if (source.repository !== undefined) result.repository = readString(source.repository, `${path}.repository`);
  return result;
}

function parseGithub(value: unknown, path: string): Partial<MutableFields<GithubConfig>> {
  const source = readRecord(value, path, GITHUB_KEYS);
  const result: Partial<MutableFields<GithubConfig>> = {};
  if (source.default_owner !== undefined) {
    const owner = readString(source.default_owner, `${path}.default_owner`);
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(owner)) {
      throw new ConfigValidationError("INVALID_CONFIG", `${path}.default_owner`, `${path}.default_owner is invalid.`);
    }
    result.default_owner = owner;
  }
  if (source.default_visibility !== undefined) {
    const visibility = readString(source.default_visibility, `${path}.default_visibility`);
    if (!CONFIG_VISIBILITIES.some((candidate) => candidate === visibility)) {
      throw new ConfigValidationError("INVALID_CONFIG", `${path}.default_visibility`, `${path}.default_visibility is invalid.`);
    }
    result.default_visibility = visibility as ConfigVisibility;
  }
  return result;
}

function parseAdapters(value: unknown, path: string): Partial<MutableFields<AdapterConfig>> {
  const source = readRecord(value, path, ADAPTER_KEYS);
  const result: Partial<MutableFields<AdapterConfig>> = {};
  if (source.preference !== undefined) {
    const preference = readStringArray(source.preference, `${path}.preference`, (item, itemPath) => {
      if (!CONFIG_ADAPTERS.some((candidate) => candidate === item)) {
        throw new ConfigValidationError("INVALID_CONFIG", itemPath, `${itemPath} is not a supported adapter.`);
      }
      return item;
    }) as readonly ConfigAdapter[];
    if (preference.length === 0) {
      throw new ConfigValidationError("INVALID_CONFIG", `${path}.preference`, `${path}.preference must not be empty.`);
    }
    result.preference = preference;
  }
  return result;
}

function parseAudit(value: unknown, path: string): Partial<MutableFields<AuditConfig>> {
  const source = readRecord(value, path, AUDIT_KEYS);
  const result: Partial<MutableFields<AuditConfig>> = {};
  if (source.path !== undefined) result.path = readString(source.path, `${path}.path`);
  return result;
}

function parseContext(value: unknown, path: string): Partial<MutableFields<ContextBudgetConfig>> {
  const source = readRecord(value, path, CONTEXT_KEYS);
  const result: Partial<MutableFields<ContextBudgetConfig>> = {};
  for (const key of CONTEXT_KEYS) {
    if (source[key] !== undefined) {
      result[key as keyof ContextBudgetConfig] = readPositiveInteger(source[key], `${path}.${key}`);
    }
  }
  return result;
}

function parseTimeouts(value: unknown, path: string): Partial<MutableFields<TimeoutConfig>> {
  const source = readRecord(value, path, TIMEOUT_KEYS);
  const result: Partial<MutableFields<TimeoutConfig>> = {};
  if (source.process_seconds !== undefined) {
    result.process_seconds = readPositiveInteger(source.process_seconds, `${path}.process_seconds`);
  }
  return result;
}

function isDeniedEnvironmentName(name: string): boolean {
  if (DENIED_ENVIRONMENT_EXACT_NAMES.has(name)) return true;
  if (DENIED_ENVIRONMENT_PREFIXES.some((prefix) => name.startsWith(prefix))) return true;
  if (DENIED_ENVIRONMENT_STRUCTURED_PATTERNS.some((pattern) => pattern.test(name))) return true;

  const tokens = labelTokens(name);
  return (
    tokens.some((token) => SENSITIVE_LABEL_TOKENS.has(token) || token === "prod" || token === "production") ||
    SENSITIVE_LABEL_TOKEN_SEQUENCES.some((sequence) => hasTokenSequence(tokens, sequence))
  );
}

function validateEnvironmentName(item: string, itemPath: string): string {
  if (
    !ENVIRONMENT_NAME_PATTERN.test(item) ||
    isDeniedEnvironmentName(item)
  ) {
    throw new ConfigValidationError(
      "SECRET_CONFIG_REJECTED",
      itemPath,
      `${itemPath} is not eligible for agent-visible environment propagation.`,
    );
  }
  return item;
}

function parseEnvironment(value: unknown, path: string): Partial<MutableFields<EnvironmentConfig>> {
  const source = readRecord(value, path, ENVIRONMENT_KEYS);
  const result: Partial<MutableFields<EnvironmentConfig>> = {};
  if (source.allowlist !== undefined) {
    result.allowlist = readStringArray(source.allowlist, `${path}.allowlist`, validateEnvironmentName);
  }
  return result;
}

function validateContextBounds(config: HarnessConfig): void {
  const context = config.context;
  if (context === undefined) return;
  const pairs = [
    ["initial_max_files", "hard_max_files"],
    ["initial_max_sections", "hard_max_sections"],
    ["initial_max_bytes", "hard_max_bytes"],
  ] as const;
  for (const [initialKey, hardKey] of pairs) {
    const initial = context[initialKey];
    const hard = context[hardKey];
    if (initial !== undefined && hard !== undefined && initial > hard) {
      throw new ConfigValidationError(
        "INVALID_CONFIG",
        `config.context.${initialKey}`,
        `config.context.${initialKey} must not exceed config.context.${hardKey}.`,
      );
    }
  }
}

export function loadHarnessConfig(value: unknown): HarnessConfig {
  const source = readRecord(value, "config", TOP_LEVEL_KEYS);
  if (source.schema_version !== HARNESS_CONFIG_SCHEMA_VERSION) {
    throw new ConfigValidationError(
      "UNSUPPORTED_CONFIG_VERSION",
      "config.schema_version",
      `Only ${HARNESS_CONFIG_SCHEMA_VERSION} is supported.`,
    );
  }

  const result: MutableConfig = { schema_version: HARNESS_CONFIG_SCHEMA_VERSION };
  assignSection(source, "framework", parseFramework, result);
  assignSection(source, "github", parseGithub, result);
  assignSection(source, "adapters", parseAdapters, result);
  assignSection(source, "audit", parseAudit, result);
  assignSection(source, "context", parseContext, result);
  assignSection(source, "timeouts", parseTimeouts, result);
  assignSection(source, "environment", parseEnvironment, result);
  const frozen = freezeConfig(result);
  validateContextBounds(frozen);
  return frozen;
}

export const SECURE_BUILT_IN_CONFIG: HarnessConfig = loadHarnessConfig({
  schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
  github: { default_visibility: "private" },
  adapters: { preference: ["codex", "claude"] },
  context: {
    initial_max_files: 24,
    initial_max_sections: 64,
    initial_max_bytes: 1_048_576,
    hard_max_files: 200,
    hard_max_sections: 1_000,
    hard_max_bytes: 20_971_520,
  },
  environment: { allowlist: [] },
});

function mergeTrusted(base: HarnessConfig, override: HarnessConfig): HarnessConfig {
  const result: MutableConfig = { schema_version: HARNESS_CONFIG_SCHEMA_VERSION };
  const sectionKeys = ["framework", "github", "adapters", "audit", "context", "timeouts", "environment"] as const;
  for (const key of sectionKeys) {
    const baseSection = base[key];
    const overrideSection = override[key];
    if (baseSection !== undefined || overrideSection !== undefined) {
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        value: { ...baseSection, ...overrideSection },
        writable: true,
      });
    }
  }
  const merged = freezeConfig(result);
  validateContextBounds(merged);
  return merged;
}

function narrowingViolation(path: string): never {
  throw new ConfigValidationError(
    "CONFIG_NARROWING_VIOLATION",
    path,
    `${path} may only narrow the preceding config layer.`,
  );
}

function isOrderedSubset(candidate: readonly string[], baseline: readonly string[]): boolean {
  let previousIndex = -1;
  for (const value of candidate) {
    const index = baseline.indexOf(value);
    if (index <= previousIndex) return false;
    previousIndex = index;
  }
  return true;
}

function applyNarrowing(base: HarnessConfig, narrowing: HarnessConfig): HarnessConfig {
  const result = mergeTrusted(base, { schema_version: HARNESS_CONFIG_SCHEMA_VERSION });
  const mutable: MutableConfig = {
    schema_version: HARNESS_CONFIG_SCHEMA_VERSION,
    ...(result.framework === undefined ? {} : { framework: { ...result.framework } }),
    ...(result.github === undefined ? {} : { github: { ...result.github } }),
    ...(result.adapters === undefined ? {} : { adapters: { ...result.adapters } }),
    ...(result.audit === undefined ? {} : { audit: { ...result.audit } }),
    ...(result.context === undefined ? {} : { context: { ...result.context } }),
    ...(result.timeouts === undefined ? {} : { timeouts: { ...result.timeouts } }),
    ...(result.environment === undefined ? {} : { environment: { ...result.environment } }),
  };

  const assertSame = (path: string, candidate: unknown, baseline: unknown): void => {
    if (baseline === undefined || candidate !== baseline) narrowingViolation(path);
  };

  if (narrowing.framework?.repository !== undefined) {
    assertSame("config.framework.repository", narrowing.framework.repository, base.framework?.repository);
  }
  if (narrowing.github?.default_owner !== undefined) {
    assertSame("config.github.default_owner", narrowing.github.default_owner, base.github?.default_owner);
  }
  if (narrowing.github?.default_visibility !== undefined) {
    const baseline = base.github?.default_visibility;
    if (
      baseline === undefined ||
      CONFIG_VISIBILITIES.indexOf(narrowing.github.default_visibility) > CONFIG_VISIBILITIES.indexOf(baseline)
    ) {
      narrowingViolation("config.github.default_visibility");
    }
    if (mutable.github === undefined) mutable.github = {};
    mutable.github.default_visibility = narrowing.github.default_visibility;
  }
  if (narrowing.adapters?.preference !== undefined) {
    const baseline = base.adapters?.preference;
    if (baseline === undefined || !isOrderedSubset(narrowing.adapters.preference, baseline)) {
      narrowingViolation("config.adapters.preference");
    }
    if (mutable.adapters === undefined) mutable.adapters = {};
    mutable.adapters.preference = narrowing.adapters.preference;
  }
  if (narrowing.audit?.path !== undefined) {
    assertSame("config.audit.path", narrowing.audit.path, base.audit?.path);
  }

  for (const key of CONTEXT_KEYS) {
    const candidate = narrowing.context?.[key as keyof ContextBudgetConfig];
    if (candidate !== undefined) {
      const baseline = base.context?.[key as keyof ContextBudgetConfig];
      if (baseline === undefined || candidate > baseline) narrowingViolation(`config.context.${key}`);
      if (mutable.context === undefined) mutable.context = {};
      mutable.context[key as keyof ContextBudgetConfig] = candidate;
    }
  }
  if (narrowing.timeouts?.process_seconds !== undefined) {
    const baseline = base.timeouts?.process_seconds;
    if (baseline === undefined || narrowing.timeouts.process_seconds > baseline) {
      narrowingViolation("config.timeouts.process_seconds");
    }
    if (mutable.timeouts === undefined) mutable.timeouts = {};
    mutable.timeouts.process_seconds = narrowing.timeouts.process_seconds;
  }
  if (narrowing.environment?.allowlist !== undefined) {
    const baseline = base.environment?.allowlist;
    if (baseline === undefined || !isOrderedSubset(narrowing.environment.allowlist, baseline)) {
      narrowingViolation("config.environment.allowlist");
    }
    if (mutable.environment === undefined) mutable.environment = {};
    mutable.environment.allowlist = narrowing.environment.allowlist;
  }

  const narrowed = freezeConfig(mutable);
  validateContextBounds(narrowed);
  return narrowed;
}

export function resolveHarnessConfig(layers: ConfigLayers): HarnessConfig {
  const source = readRecord(layers, "layers", new Set(["host", "project", "invocation"]));
  const host = source.host === undefined ? undefined : loadHarnessConfig(source.host);
  const project = source.project === undefined ? undefined : loadHarnessConfig(source.project);
  const invocation = source.invocation === undefined ? undefined : loadHarnessConfig(source.invocation);

  let effective = host === undefined
    ? SECURE_BUILT_IN_CONFIG
    : mergeTrusted(SECURE_BUILT_IN_CONFIG, host);
  if (project !== undefined) effective = applyNarrowing(effective, project);
  if (invocation !== undefined) effective = applyNarrowing(effective, invocation);
  return effective;
}

export function buildChildEnvironmentPolicy(config: HarnessConfig): ChildEnvironmentPolicy {
  const allowlist = config.environment?.allowlist ?? [];
  for (let index = 0; index < allowlist.length; index += 1) {
    const name = allowlist[index];
    if (name === undefined) continue;
    validateEnvironmentName(name, `config.environment.allowlist[${index}]`);
  }
  return Object.freeze({
    baseline: "EMPTY",
    inheritParentEnvironment: false,
    allowlist: Object.freeze([...allowlist]),
  });
}
