import { HarnessError } from "../../../src/errors/index.js";

const error = new HarnessError("HNS-INPUT-001", {
  correlationId: "execution-compile-contract",
  causeCategory: "validation",
  // @ts-expect-error Exit codes are derived from the central registry.
  exitCode: 0,
});

// @ts-expect-error Derived exit codes are immutable.
error.exitCode = 0;

new HarnessError("HNS-RUN-001", {
  correlationId: "execution-compile-contract",
  causeCategory: "runtime",
  // @ts-expect-error Only typed HarnessError causes are accepted.
  cause: new Error("raw vendor error"),
});
