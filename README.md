# Playwright Test Automation Framework

This is a comprehensive Playwright test automation framework with Page Object Model (POM) implemented in TypeScript.

## Features

- **TypeScript Support**: Full TypeScript configuration with proper typing
- **Page Object Model (POM)**: Organized page objects for maintainable tests
- **Component-Based Architecture**: Reusable UI components within page objects
- **Custom Fixtures**: Shared test fixtures for clean test organization
- **Test Utilities**: Helper methods for common testing scenarios
- **Centralized Test Data**: Organized test data files for consistent values
- **Cross-browser Testing**: Configured for Chromium, Firefox, and WebKit
- **Reporting**: HTML reporting and trace recording

## Project Structure

```
├── src/
│   ├── pages/                    # Page Object classes
│   │   └── walkInBath.page.ts    # Main page object with component composition
│   ├── components/               # Reusable UI components
│   │   ├── estimateForm.component.ts  # Estimate form component with step management
│   │   ├── headerLocation.component.ts # Header location component
│   │   └── slider.component.ts   # Slider component
│   ├── utils/                    # Utility functions
│   │   └── testUtils.ts          # Test utility methods
│   ├── data/                     # Test data files
│   │   ├── formTestData.ts       # Valid form test data
│   │   └── edgeCaseTestData.ts   # Edge case test data
│   └── support/                  # Supporting type definitions
│       └── types.ts              # Type definitions
├── tests/
│   ├── fixtures/                 # Custom test fixtures
│   │   └── appFixtures.ts        # Application fixtures for WalkInBathPage
│   └── e2e/                      # End-to-end test specifications
│       ├── form-out-of-area.spec.ts      # Out-of-area flow tests
│       ├── form-phone-validation.spec.ts # Phone validation tests
│       ├── form-service-available.spec.ts # Service available flow tests
│       ├── form-zip-validation.spec.ts   # ZIP validation tests
│       └── landing-ui-availability.spec.ts # Landing page UI tests
├── playwright.config.ts          # Playwright configuration
├── eslint.config.js              # ESLint configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies and scripts
└── .gitignore                    # Git ignore patterns
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

- Run all tests:
  ```bash
  npx playwright test
  ```

- Run tests in headed mode:
  ```bash
  npx playwright test --headed
  ```

- Run specific test file:
  ```bash
  npx playwright test tests/e2e/form-phone-validation.spec.ts
  ```

- Run tests with UI mode:
  ```bash
  npx playwright test --ui
  ```

- Run tests in debug mode:
  ```bash
  npx playwright test --debug
  ```

- Generate code with Codegen:
  ```bash
  npx playwright codegen
  ```

- View test report:
  ```bash
  npx playwright show-report
  ```

## Configuration

The Playwright configuration is in `playwright.config.ts`. You can modify:
- Test directory location
- Browser configurations
- Timeout settings
- Base URL for your application
- Screenshot and video settings
- Parallel execution settings
- Trace recording options

## Page Object Model Usage

The framework uses POM with component-based architecture to separate page interactions from test logic:

1. Main page objects compose multiple components
2. Components encapsulate specific UI elements and their behaviors
3. Page objects expose component instances for test access
4. Tests interact with components through page objects

Example:
```typescript
// In your test
const app = new WalkInBathPage(page);
await app.formTop.enterZipAndContinue('68901');
await app.formTop.chooseWhyInterested(['Home Safety', 'Mobility']);
```

## Best Practices Implemented

- Component-based architecture with reusable UI elements
- Centralized test data management
- Custom fixtures for consistent test setup
- Semantic step verification methods
- Content-driven locators over brittle CSS class assumptions
- Comprehensive error handling and assertions
- Screenshots on failure
- Type-safe selectors and methods
- ESLint configuration for code quality