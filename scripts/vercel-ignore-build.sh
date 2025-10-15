#!/bin/bash

# Vercel Ignored Build Step
# This script runs before each deployment to determine if the build should proceed
# Exit code 0: Proceed with deployment
# Exit code 1: Skip deployment

echo "🔍 Running pre-deployment checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any check fails
CHECKS_FAILED=0

# Function to print section headers
print_section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not available${NC}"
    echo -e "${YELLOW}⚠️  Skipping checks - proceeding with deployment${NC}"
    exit 0
fi

# 1. Run Linter
print_section "📝 Running ESLint"
if pnpm run lint; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${RED}❌ Linting failed${NC}"
    CHECKS_FAILED=1
fi

# 2. Run Tests
print_section "🧪 Running Tests"
if pnpm run test:run; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    CHECKS_FAILED=1
fi

# 3. Type Check (optional but recommended)
print_section "🔍 Running Type Check"
if pnpm run typecheck; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Type check failed (warning only)${NC}"
    # Uncomment the line below to fail on type errors
    # CHECKS_FAILED=1
fi

# Final result
print_section "📊 Pre-deployment Check Results"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed - Proceeding with deployment${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed - Skipping deployment${NC}"
    echo ""
    echo "To deploy anyway, you can:"
    echo "1. Fix the failing checks"
    echo "2. Or add [skip ci] to your commit message"
    exit 1
fi
