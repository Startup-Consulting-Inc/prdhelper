#!/bin/bash

# BRD Wizard Test Runner
# Convenient script to run BRD wizard tests in various modes

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 BRD Wizard Test Runner${NC}\n"

# Parse command line arguments
MODE=${1:-"all"}

case $MODE in
  "unit")
    echo -e "${GREEN}Running unit tests for BRD Wizard...${NC}\n"
    npm run test:unit -- src/pages/BRDWizardPage.test.tsx
    ;;
  
  "e2e")
    echo -e "${GREEN}Running E2E tests for BRD Wizard...${NC}\n"
    npm run test:e2e -- brd-wizard.spec.ts
    ;;
  
  "e2e-ui")
    echo -e "${GREEN}Running E2E tests in UI mode...${NC}\n"
    npm run test:e2e:ui -- brd-wizard.spec.ts
    ;;
  
  "e2e-debug")
    echo -e "${GREEN}Running E2E tests in debug mode...${NC}\n"
    npm run test:e2e:debug -- brd-wizard.spec.ts
    ;;
  
  "e2e-headed")
    echo -e "${GREEN}Running E2E tests with visible browser...${NC}\n"
    npx playwright test brd-wizard.spec.ts --headed
    ;;
  
  "watch")
    echo -e "${GREEN}Running unit tests in watch mode...${NC}\n"
    npm run test -- src/pages/BRDWizardPage.test.tsx
    ;;
  
  "coverage")
    echo -e "${GREEN}Running tests with coverage...${NC}\n"
    npm run test:coverage -- src/pages/BRDWizardPage.test.tsx
    ;;
  
  "all")
    echo -e "${GREEN}Running all BRD Wizard tests...${NC}\n"
    echo -e "${YELLOW}1. Unit Tests${NC}"
    npm run test:unit -- src/pages/BRDWizardPage.test.tsx
    echo -e "\n${YELLOW}2. E2E Tests${NC}"
    npm run test:e2e -- brd-wizard.spec.ts
    echo -e "\n${GREEN}✅ All tests completed!${NC}"
    ;;
  
  "help"|"-h"|"--help")
    echo "Usage: ./test-brd-wizard.sh [mode]"
    echo ""
    echo "Available modes:"
    echo "  all         - Run all tests (default)"
    echo "  unit        - Run unit tests only"
    echo "  e2e         - Run E2E tests only"
    echo "  e2e-ui      - Run E2E tests with Playwright UI"
    echo "  e2e-debug   - Run E2E tests in debug mode"
    echo "  e2e-headed  - Run E2E tests with visible browser"
    echo "  watch       - Run unit tests in watch mode"
    echo "  coverage    - Run tests with coverage report"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./test-brd-wizard.sh              # Run all tests"
    echo "  ./test-brd-wizard.sh unit         # Run only unit tests"
    echo "  ./test-brd-wizard.sh e2e-ui       # Run E2E tests with UI"
    ;;
  
  *)
    echo -e "${YELLOW}Unknown mode: $MODE${NC}"
    echo "Run './test-brd-wizard.sh help' for usage information"
    exit 1
    ;;
esac

echo -e "\n${GREEN}✨ Done!${NC}"

