#!/usr/bin/env node
// Unified test runner contract for humans and agents (see TESTING.md).
//
//   yarn test                                  # all suites (parallel)
//   yarn test tests/quiz-card-reload.spec.js   # one suite
//   (yarn vitest-run-suite is an alias)
//
// Exit 0  -> all tests passed; prints a one-line summary, nothing to read.
// Exit !0 -> prints "FAILURES: <file>" where <file> is a compact, processed
//            report (failed tests + messages) meant to be read directly.
// Raw vitest JSON is kept next to it for deeper digging.

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve, basename, relative } from 'node:path';

const suite = process.argv[2] || null;
const suiteName = suite ? basename(suite).replace(/\.(spec|test)\.js$/, '') : 'all';

const resultsDir = resolve('test-results');
mkdirSync(resultsDir, { recursive: true });
const rawFile = resolve(resultsDir, `${suiteName}.json`);
const failFile = resolve(resultsDir, `${suiteName}.failures.txt`);

// Stale artifacts from a previous run must not survive a green run.
rmSync(rawFile, { force: true });
rmSync(failFile, { force: true });

const vitestBin = resolve('node_modules', 'vitest', 'vitest.mjs');
const args = [vitestBin, 'run', ...(suite ? [suite] : []), '--reporter=json', `--outputFile=${rawFile}`];
const run = spawnSync(process.execPath, args, { encoding: 'utf8' });

function fail(message, details) {
  writeFileSync(failFile, details, 'utf8');
  console.error(message);
  console.error(`FAILURES: ${relative(process.cwd(), failFile)}`);
  process.exit(run.status || 1);
}

if (!existsSync(rawFile)) {
  // vitest crashed before producing a report (bad path, syntax error in config...)
  fail(
    'ERROR: vitest produced no JSON report',
    `vitest exited with ${run.status}\n\n--- stdout ---\n${run.stdout}\n\n--- stderr ---\n${run.stderr}\n`,
  );
}

const report = JSON.parse(readFileSync(rawFile, 'utf8'));

if (report.success) {
  console.log(
    `OK: ${report.numPassedTests}/${report.numTotalTests} tests passed ` +
      `(${report.testResults.length} file${report.testResults.length === 1 ? '' : 's'})`,
  );
  process.exit(0);
}

const lines = [
  `${report.numFailedTests}/${report.numTotalTests} tests failed` +
    (report.numPendingTests ? `, ${report.numPendingTests} pending` : ''),
  '',
];
for (const file of report.testResults) {
  const failed = file.assertionResults.filter((t) => t.status === 'failed');
  if (!failed.length && file.status !== 'failed') continue;

  lines.push(`FILE: ${relative(process.cwd(), file.name)}`);
  if (!file.assertionResults.length && file.message) {
    // Collection-level error (test file did not even load).
    lines.push(file.message, '');
    continue;
  }
  for (const test of failed) {
    lines.push(`  FAIL: ${test.fullName}`);
    for (const msg of test.failureMessages || []) {
      lines.push(
        ...msg.split('\n').map((l) => `    ${l}`),
      );
    }
    lines.push('');
  }
}
lines.push(`(raw report: ${relative(process.cwd(), rawFile)})`);

fail(`FAIL: ${report.numFailedTests}/${report.numTotalTests} tests failed`, lines.join('\n') + '\n');
