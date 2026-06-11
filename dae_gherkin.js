#!/usr/bin/env node
/**
 * DAE Gherkin Parser - Portable spec.md to spec.json IR converter
 * Parses Gherkin-in-markdown and emits a fixed JSON IR for generators.
 *
 * Node.js implementation (equivalent to dae_gherkin.py)
 */

import fs from 'fs';
import path from 'path';

/**
 * Parse Gherkin-in-markdown spec.md into the standard DAE IR.
 */
function parseGherkinMarkdown(content) {
  const lines = content.split('\n');
  const ir = {
    feature: { name: '', description: '' },
    scenarios: [],
    background: [],
  };

  let currentScenario = null;
  let inFeatureDescription = false;
  let inBackground = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trim();

    // Feature header
    if (stripped.startsWith('# Feature:')) {
      ir.feature.name = stripped.substring(10).trim();
      inFeatureDescription = true;
      continue;
    }

    // Background section
    if (stripped === '## Background') {
      inBackground = true;
      inFeatureDescription = false;
      continue;
    }

    // Acceptance Criteria section
    if (stripped === '## Acceptance Criteria') {
      inBackground = false;
      inFeatureDescription = false;
      continue;
    }

    // Scenario header
    const scenarioMatch = stripped.match(/^###\s+Scenario\s+\d+:\s+(.+)/);
    if (scenarioMatch) {
      // Save previous scenario
      if (currentScenario) {
        ir.scenarios.push(currentScenario);
      }

      currentScenario = {
        name: scenarioMatch[1],
        steps: [],
        examples: null,
      };
      inFeatureDescription = false;
      inBackground = false;
      continue;
    }

    // Feature description
    if (inFeatureDescription && stripped && !stripped.startsWith('#')) {
      if (ir.feature.description) {
        ir.feature.description += '\n';
      }
      ir.feature.description += stripped;
    }

    // Background steps
    if (inBackground && stripped && !stripped.startsWith('#')) {
      ir.background.push({
        keyword: 'Background',
        text: stripped,
      });
    }

    // Gherkin steps (Given/When/Then/And)
    const stepMatch = stripped.match(/^\*\*(Given|When|Then|And)\*\*\s+(.+)/);
    if (stepMatch) {
      const keyword = stepMatch[1];
      const text = stepMatch[2].trim();

      const step = {
        keyword: keyword,
        text: text,
        table: null,
      };

      // Check for inline table (steps ending with colon)
      if (text.endsWith(':')) {
        const tableRows = [];
        let j = i + 1;

        // Look ahead for table rows
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine.startsWith('-')) {
            tableRows.push([nextLine.substring(1).trim()]);
            j++;
          } else if (!nextLine || nextLine.startsWith('**')) {
            break;
          } else {
            j++;
          }
        }

        if (tableRows.length > 0) {
          step.table = {
            headers: ['Item'],
            rows: tableRows,
          };
          i = j - 1; // Skip processed table rows
        }
      }

      if (currentScenario) {
        currentScenario.steps.push(step);
      }
    }
  }

  // Save last scenario
  if (currentScenario) {
    ir.scenarios.push(currentScenario);
  }

  return ir;
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: node dae_gherkin.js <spec.md> <output.json>');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  // Parse spec.md
  const content = fs.readFileSync(inputPath, 'utf-8');
  const ir = parseGherkinMarkdown(content);

  // Write IR to JSON
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(ir, null, 2), 'utf-8');

  console.log(`✓ Parsed ${ir.scenarios.length} scenarios from ${inputPath}`);
  console.log(`✓ Written IR to ${outputPath}`);
}

main();
