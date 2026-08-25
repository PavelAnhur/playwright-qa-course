import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

export default class SummaryReporter implements Reporter {
  private entries: { test: TestCase; result: TestResult }[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.entries.push({ test, result });        // remember each finished test
  }

  onEnd(result: FullResult) {                   // at the very end, summarise
    const count = (s: TestResult["status"]) =>
      this.entries.filter((e) => e.result.status === s).length;
    // "flaky" = passed, but only after a retry
    const flaky = this.entries.filter(
      (e) => e.result.status === "passed" && e.result.retry > 0,
    ).length;

    console.log(`\n  ${result.status} — ✓ ${count("passed")}  ✘ ${count("failed")}  ⤿ flaky ${flaky}`);
    // …plus slowest tests and a per-project breakdown
  }
}
