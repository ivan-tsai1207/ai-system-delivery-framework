import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTION_STATES,
  LEGAL_EXECUTION_TRANSITIONS,
  TERMINAL_EXECUTION_STATES,
  ExecutionStateTransitionError,
  canTransitionExecutionState,
  isTerminalExecutionState,
  transitionExecutionState,
} from "../../../dist/execution/state.js";

const NORMAL_TRANSITIONS = [
  ["CREATED", "CONTEXT_READY"],
  ["CONTEXT_READY", "RUNNING"],
  ["RUNNING", "VALIDATING"],
  ["VALIDATING", "COMPLETED"],
];

const ACTIVE_STATES = ["CREATED", "CONTEXT_READY", "RUNNING", "VALIDATING"];
const COMMON_STOP_STATES = [
  "BLOCKED_SPEC_GAP",
  "BLOCKED_SPEC_CONFLICT",
  "BLOCKED_PERMISSION",
  "FAILED_RUNTIME",
  "CANCELLED",
];

test("execution states match the canonical SDD set exactly", () => {
  assert.deepEqual(EXECUTION_STATES, [
    "CREATED", "CONTEXT_READY", "RUNNING", "VALIDATING", "COMPLETED",
    "BLOCKED_SPEC_GAP", "BLOCKED_SPEC_CONFLICT", "BLOCKED_PERMISSION",
    "FAILED_GATE", "FAILED_RUNTIME", "CANCELLED",
  ]);
  assert.equal(new Set(EXECUTION_STATES).size, 11);
});

test("every canonical normal transition succeeds", () => {
  for (const [current, next] of NORMAL_TRANSITIONS) {
    assert.equal(canTransitionExecutionState(current, next), true);
    assert.equal(transitionExecutionState(current, current, next), next);
  }
});

test("active executions may enter every common fail-closed stop state", () => {
  for (const current of ACTIVE_STATES) {
    for (const next of COMMON_STOP_STATES) {
      assert.equal(canTransitionExecutionState(current, next), true, `${current} -> ${next}`);
      assert.equal(transitionExecutionState(current, current, next), next);
    }
  }
});

test("FAILED_GATE is legal only while validating", () => {
  assert.equal(transitionExecutionState("VALIDATING", "VALIDATING", "FAILED_GATE"), "FAILED_GATE");
  for (const current of ["CREATED", "CONTEXT_READY", "RUNNING"]) {
    assert.equal(canTransitionExecutionState(current, "FAILED_GATE"), false);
  }
});

test("all terminal execution states reject every outgoing transition", () => {
  for (const current of TERMINAL_EXECUTION_STATES) {
    assert.equal(isTerminalExecutionState(current), true);
    assert.deepEqual(LEGAL_EXECUTION_TRANSITIONS[current], []);
    for (const next of EXECUTION_STATES) {
      assert.equal(canTransitionExecutionState(current, next), false);
    }
  }
});

test("normal active states are not terminal", () => {
  for (const state of ACTIVE_STATES) {
    assert.equal(isTerminalExecutionState(state), false);
  }
});

test("self, skipped, and backward transitions fail closed", () => {
  for (const [current, next] of [
    ["CREATED", "CREATED"],
    ["CREATED", "RUNNING"],
    ["RUNNING", "CONTEXT_READY"],
    ["VALIDATING", "RUNNING"],
  ]) {
    assert.throws(
      () => transitionExecutionState(current, current, next),
      (error) => error instanceof ExecutionStateTransitionError
        && error.detail.failure === "ILLEGAL_TRANSITION"
        && error.detail.current === current
        && error.detail.next === next,
    );
  }
});

test("a stale expected state fails before transition legality is considered", () => {
  assert.throws(
    () => transitionExecutionState("RUNNING", "CONTEXT_READY", "RUNNING"),
    (error) => error instanceof ExecutionStateTransitionError
      && error.detail.failure === "STALE_EXPECTED_STATE"
      && error.detail.current === "RUNNING"
      && error.detail.expected === "CONTEXT_READY"
      && error.detail.next === "RUNNING",
  );
});

test("transition graph and failure diagnostics are immutable", () => {
  assert.equal(Object.isFrozen(LEGAL_EXECUTION_TRANSITIONS), true);
  assert.equal(Object.values(LEGAL_EXECUTION_TRANSITIONS).every(Object.isFrozen), true);
  assert.throws(() => LEGAL_EXECUTION_TRANSITIONS.CREATED.push("COMPLETED"), TypeError);

  let captured;
  try {
    transitionExecutionState("COMPLETED", "COMPLETED", "RUNNING");
  } catch (error) {
    captured = error;
  }
  assert.ok(captured instanceof ExecutionStateTransitionError);
  assert.equal(Object.isFrozen(captured), true);
  assert.equal(Object.isFrozen(captured.detail), true);
  assert.throws(() => {
    captured.detail.next = "CREATED";
  }, TypeError);
});
