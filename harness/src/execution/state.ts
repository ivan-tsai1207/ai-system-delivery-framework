export const EXECUTION_STATES = [
  "CREATED",
  "CONTEXT_READY",
  "RUNNING",
  "VALIDATING",
  "COMPLETED",
  "BLOCKED_SPEC_GAP",
  "BLOCKED_SPEC_CONFLICT",
  "BLOCKED_PERMISSION",
  "FAILED_GATE",
  "FAILED_RUNTIME",
  "CANCELLED",
] as const;

export type ExecutionState = (typeof EXECUTION_STATES)[number];

export const TERMINAL_EXECUTION_STATES = [
  "COMPLETED",
  "BLOCKED_SPEC_GAP",
  "BLOCKED_SPEC_CONFLICT",
  "BLOCKED_PERMISSION",
  "FAILED_GATE",
  "FAILED_RUNTIME",
  "CANCELLED",
] as const satisfies readonly ExecutionState[];

export type ExecutionStateTransitionFailure = "STALE_EXPECTED_STATE" | "ILLEGAL_TRANSITION";

export interface ExecutionStateTransitionDetail {
  readonly failure: ExecutionStateTransitionFailure;
  readonly current: ExecutionState;
  readonly expected: ExecutionState;
  readonly next: ExecutionState;
}

const STOP_STATES = [
  "BLOCKED_SPEC_GAP",
  "BLOCKED_SPEC_CONFLICT",
  "BLOCKED_PERMISSION",
  "FAILED_RUNTIME",
  "CANCELLED",
] as const satisfies readonly ExecutionState[];

function freezeTransitions(...states: ExecutionState[]): readonly ExecutionState[] {
  return Object.freeze(states);
}

const transitionMap: Readonly<Record<ExecutionState, readonly ExecutionState[]>> = Object.freeze({
  CREATED: freezeTransitions("CONTEXT_READY", ...STOP_STATES),
  CONTEXT_READY: freezeTransitions("RUNNING", ...STOP_STATES),
  RUNNING: freezeTransitions("VALIDATING", ...STOP_STATES),
  VALIDATING: freezeTransitions("COMPLETED", "FAILED_GATE", ...STOP_STATES),
  COMPLETED: freezeTransitions(),
  BLOCKED_SPEC_GAP: freezeTransitions(),
  BLOCKED_SPEC_CONFLICT: freezeTransitions(),
  BLOCKED_PERMISSION: freezeTransitions(),
  FAILED_GATE: freezeTransitions(),
  FAILED_RUNTIME: freezeTransitions(),
  CANCELLED: freezeTransitions(),
});

export const LEGAL_EXECUTION_TRANSITIONS: Readonly<Record<ExecutionState, readonly ExecutionState[]>> =
  transitionMap;

export class ExecutionStateTransitionError extends Error {
  readonly detail: ExecutionStateTransitionDetail;

  constructor(detail: ExecutionStateTransitionDetail) {
    const message = detail.failure === "STALE_EXPECTED_STATE"
      ? `Stale execution state: expected ${detail.expected}, actual ${detail.current}.`
      : `Illegal execution state transition: ${detail.current} -> ${detail.next}.`;
    super(message);
    this.name = "ExecutionStateTransitionError";
    this.detail = Object.freeze({ ...detail });
    Object.freeze(this);
  }
}

export function isTerminalExecutionState(state: ExecutionState): boolean {
  return TERMINAL_EXECUTION_STATES.includes(state as (typeof TERMINAL_EXECUTION_STATES)[number]);
}

export function canTransitionExecutionState(current: ExecutionState, next: ExecutionState): boolean {
  return transitionMap[current].includes(next);
}

export function transitionExecutionState(
  current: ExecutionState,
  expected: ExecutionState,
  next: ExecutionState,
): ExecutionState {
  if (current !== expected) {
    throw new ExecutionStateTransitionError({
      failure: "STALE_EXPECTED_STATE",
      current,
      expected,
      next,
    });
  }
  if (!canTransitionExecutionState(current, next)) {
    throw new ExecutionStateTransitionError({
      failure: "ILLEGAL_TRANSITION",
      current,
      expected,
      next,
    });
  }
  return next;
}
