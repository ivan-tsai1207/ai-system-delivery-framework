export const EXIT_CODES = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8] as const);

export type ExitCode = (typeof EXIT_CODES)[number];

export interface ExitCodeDefinition {
  readonly exitCode: ExitCode;
  readonly category: string;
  readonly meaning: string;
}

const EXIT_CODE_DEFINITIONS = [
  {
    exitCode: 0,
    category: "Success",
    meaning: "Command完成且required gates / writes符合command semantics",
  },
  {
    exitCode: 1,
    category: "Generic",
    meaning: "未分類internal failure；應視為需要補catalog的defect",
  },
  {
    exitCode: 2,
    category: "Input / Intake / Work Item",
    meaning: "CLI input、intent、requirement或Work Item invalid",
  },
  {
    exitCode: 3,
    category: "Spec / Context",
    meaning: "Spec gap / conflict、missing context、context build failure",
  },
  {
    exitCode: 4,
    category: "Permission / Policy / Command",
    meaning: "Policy conflict、unauthorized operation、restricted command",
  },
  {
    exitCode: 5,
    category: "Adapter / Enforcement / Runtime / Audit",
    meaning: "Adapter、hard enforcement、process或audit failure",
  },
  {
    exitCode: 6,
    category: "Gate",
    meaning: "Required Gate failed / needs clarification",
  },
  {
    exitCode: 7,
    category: "Approval",
    meaning: "Required approval pending、rejected或expired",
  },
  {
    exitCode: 8,
    category: "Repository / Bootstrap",
    meaning: "Repository target、creation、transaction或bootstrap failure",
  },
] as const satisfies readonly ExitCodeDefinition[];

export const EXIT_CODE_REGISTRY: readonly ExitCodeDefinition[] = Object.freeze(
  EXIT_CODE_DEFINITIONS.map((definition) => Object.freeze({ ...definition })),
);

const exitCodeDefinitionsByCode: ReadonlyMap<ExitCode, ExitCodeDefinition> = new Map(
  EXIT_CODE_REGISTRY.map((definition) => [definition.exitCode, definition]),
);

export function isExitCode(candidate: unknown): candidate is ExitCode {
  return (
    typeof candidate === "number" &&
    Number.isInteger(candidate) &&
    EXIT_CODES.some((exitCode) => exitCode === candidate)
  );
}

export function getExitCodeDefinition(exitCode: ExitCode): ExitCodeDefinition {
  if (!isExitCode(exitCode)) {
    throw new TypeError(`Unknown Harness exit code: ${String(exitCode)}`);
  }

  const definition = exitCodeDefinitionsByCode.get(exitCode);
  if (definition === undefined) {
    throw new TypeError(`Missing Harness exit-code mapping: ${exitCode}`);
  }

  return definition;
}
