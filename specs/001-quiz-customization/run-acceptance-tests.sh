#!/bin/bash
##
# Acceptance Test Runner for Quiz Customization Feature
#
# Runs the complete acceptance pipeline:
# 1. Parse spec.md into spec.json IR (using dae_gherkin.py)
# 2. Generate Taiko tests from IR (using generator.js)
# 3. Execute generated tests
#
# Usage:
#   ./run-acceptance-tests.sh           # Run all tests
#   ./run-acceptance-tests.sh --headed  # Run with visible browser
##

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directories
FEATURE_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$FEATURE_DIR/../.." && pwd)"
BUILD_DIR="$FEATURE_DIR/.build"
GENERATED_DIR="$BUILD_DIR/generated"
SPEC_FILE="$FEATURE_DIR/spec.md"
IR_FILE="$BUILD_DIR/spec.json"

echo -e "${BLUE}🎯 Quiz Customization Acceptance Test Pipeline${NC}"
echo "Feature: $FEATURE_DIR"
echo ""

# Step 1: Parse spec.md to IR
echo -e "${GREEN}Step 1: Parsing spec.md to IR...${NC}"
python "$PROJECT_ROOT/dae_gherkin.py" "$SPEC_FILE" "$IR_FILE"

if [ ! -f "$IR_FILE" ]; then
  echo -e "${RED}Error: Failed to generate IR at $IR_FILE${NC}"
  exit 1
fi

echo ""

# Step 2: Generate tests from IR
echo -e "${GREEN}Step 2: Generating Taiko tests from IR...${NC}"
node "$PROJECT_ROOT/acceptance/generator.js" "$IR_FILE" "$GENERATED_DIR"

if [ ! -d "$GENERATED_DIR" ]; then
  echo -e "${RED}Error: Failed to generate tests in $GENERATED_DIR${NC}"
  exit 1
fi

echo ""

# Step 3: Run generated tests
echo -e "${GREEN}Step 3: Running generated acceptance tests...${NC}"

# Check if headed mode requested
HEADLESS_FLAG=""
if [ "${1:-}" = "--headed" ] || [ "${1:-}" = "--interactive" ]; then
  HEADLESS_FLAG="HEADLESS=false"
  echo "Running in HEADED mode (browser visible)"
else
  HEADLESS_FLAG="HEADLESS=true"
  echo "Running in HEADLESS mode"
fi

# Count tests
TEST_COUNT=$(find "$GENERATED_DIR" -name "*.test.js" | wc -l)
echo "Found $TEST_COUNT test files"
echo ""

# Run each generated test
PASSED=0
FAILED=0

for test_file in "$GENERATED_DIR"/*.test.js; do
  if [ -f "$test_file" ]; then
    test_name=$(basename "$test_file")
    echo -e "${BLUE}Running: $test_name${NC}"

    if env $HEADLESS_FLAG node "$test_file"; then
      PASSED=$((PASSED + 1))
      echo -e "${GREEN}✓ PASSED${NC}"
    else
      FAILED=$((FAILED + 1))
      echo -e "${RED}✗ FAILED${NC}"
    fi
    echo ""
  fi
done

# Summary
echo ""
echo "========================================"
echo -e "${BLUE}Test Summary${NC}"
echo "========================================"
echo "Total:  $TEST_COUNT tests"
echo -e "${GREEN}Passed: $PASSED${NC}"

if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Failed: $FAILED${NC}"
  echo ""
  echo "Screenshots saved to: vue-app/tests/screenshots/"
  exit 1
else
  echo -e "${RED}Failed: $FAILED${NC}"
  echo ""
  echo -e "${GREEN}🎉 All acceptance tests passed!${NC}"
  exit 0
fi
