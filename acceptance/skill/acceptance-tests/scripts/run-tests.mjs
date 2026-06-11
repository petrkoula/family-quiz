#!/usr/bin/env node
/**
 * run-tests.mjs — agent-friendly Vitest runner.
 *
 * Runs `vitest run` with the JSON reporter, then prints a tiny, deterministic
 * pass/fail summary instead of vitest's verbose human output. The goal is that
 * an agent reads a handful of lines, not a scrolling test log.
 *
 * Usage:
 *   node scripts/run-tests.mjs                       # whole suite
 *   node scripts/run-tests.mjs tests/foo.spec.ts     # one file
 *   node scripts/run-tests.mjs -t "default timer"    # filter by test name
 *   node scripts/run-tests.mjs --parse-only          # re-summarize last run, no re-run
 *   node scripts/run-tests.mjs --results-file=x.json # custom results path (testing)
 *
 * Exit code: 0 if all passed, 1 if any failed or the run could not start.
 */

import { spawnSync } from 'node:child_process'
import { readFileSync, existsSync, rmSync } from 'node:fs'

const rawArgs = process.argv.slice(2)

// --- options ---------------------------------------------------------------
let resultsFile = '.vitest-results.json'
let parseOnly = false
const passthrough = []

for (const arg of rawArgs) {
  if (arg === '--parse-only') parseOnly = true
  else if (arg.startsWith('--results-file=')) resultsFile = arg.slice('--results-file='.length)
  else passthrough.push(arg) // file paths, -t filters, etc. → forwarded to vitest
}

// --- run vitest (unless we're only re-parsing) -----------------------------
if (!parseOnly) {
  if (existsSync(resultsFile)) rmSync(resultsFile)

  const result = spawnSync(
    'npx',
    [
      'vitest', 'run',
      '--reporter=json',
      `--outputFile=${resultsFile}`,
      '--bail=1',
      ...passthrough,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' },
  )

  if (!existsSync(resultsFile)) {
    console.error('ERROR: no results file produced — vitest failed to start (check config/imports above).')
    process.exit(result.status ?? 1)
  }
}

// --- parse + summarize -----------------------------------------------------
if (!existsSync(resultsFile)) {
  console.error(`ERROR: results file not found: ${resultsFile}`)
  process.exit(1)
}

const summary = summarize(JSON.parse(readFileSync(resultsFile, 'utf-8')))
printSummary(summary)
process.exit(summary.failed > 0 ? 1 : 0)

// --- helpers (exported for testing) ----------------------------------------
export function summarize(data) {
  const failures = []
  for (const file of data.testResults ?? []) {
    for (const t of file.assertionResults ?? []) {
      if (t.status === 'failed') {
        const msg = (t.failureMessages?.[0] || 'no message')
          .replace(/\[[0-9;]*m/g, '') // strip ANSI colour codes
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .slice(0, 3)
          .join(' ')
          .slice(0, 300)
        failures.push({
          file: file.name,
          test: t.fullName || [...(t.ancestorTitles ?? []), t.title].filter(Boolean).join(' > '),
          message: msg,
        })
      }
    }
  }
  return {
    total: data.numTotalTests ?? 0,
    passed: data.numPassedTests ?? 0,
    failed: data.numFailedTests ?? failures.length,
    failures,
  }
}

export function printSummary(s) {
  console.log(`TESTS: ${s.passed}/${s.total} passed, ${s.failed} failed`)
  if (s.failures.length) {
    console.log('\nFAILURES:')
    for (const f of s.failures) {
      console.log(`- [${f.file}] ${f.test}\n    ${f.message}`)
    }
  }
}
