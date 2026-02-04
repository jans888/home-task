# Playwright Test Automation Framework

This is a comprehensive Playwright test automation framework with Page Object Model (POM) implemented in TypeScript.

## Test Scenarios

Comprehensive end-to-end test scenarios covering:

### Highest Priority Scenarios (Top 5)

These scenarios have the highest priority as they directly impact revenue and lead capture:

1. **Step 1 - ZIP Code (validation + routing)**
   - Critical for determining service availability and routing users appropriately
   
2. **Step 5 - Phone number (required, exactly 10 digits)**
   - Essential for capturing contact information from leads
   
3. **Successful submission - Thank You page**
   - Confirms the complete flow works and users reach the success state
   
4. **Out-of-area flow - Sorry email capture**
   - Captures leads even when service isn't available in their area
   
5. **Landing page and critical UI smoke**
   - Ensures the form works across all devices, maximizing reach

#### Prioritization Logic
- **Revenue Impact**: These scenarios directly gate revenue/lead capture. If ZIP routing, phone validation, or final submission breaks, you lose leads immediately.
- **Complete Funnel Coverage**: They cover both main funnels - in-area: full submit + thank you, and out-of-area: email capture. This covers virtually 100% of user outcomes.
- **Risk & Frequency**: Highest risk + highest impact + highest change frequency. Validation rules, routing logic, and responsive breakpoints are the things that regress most often during UI tweaks.
- **Early Warning**: They serve as good "early warning" tests. If these pass, you have strong confidence the landing/form is functional end-to-end across devices.

### Landing page and critical UI smoke
- Landing page loads without JavaScript errors (console error baseline).
- Header "Available in …" location block renders correctly.
- Mobile sticky CTA "Estimate Your Cost" is visible on small viewport and hidden on desktop.
- Both forms (form-container-1, form-container-2) render with Step 1 visible by default.

### Step 1 – ZIP Code (validation + routing)
#### Validation (required, exactly 5 digits)
- ZIP is empty (required validation).
- ZIP < 5 digits (e.g., 1234).
- ZIP > 5 digits (e.g., 123456).
- ZIP contains non-digits (e.g., 12a45).
- ZIP contains spaces (e.g., 12 345).
- ZIP with leading zeros (e.g., 01234).

#### Routing / availability behavior
- In-service ZIP (e.g., 68901) proceeds to Step 2.
- Out-of-area ZIP (e.g., 11111) routes to the Sorry step (step-sorry).
- Pressing Enter submits the ZIP the same as clicking Next.
- Rapid submit / double-click Next does not cause duplicate transitions or broken state.

### Step 2 – "Why are you interested…" (multi-select, required)
#### Required selection
- Click Next with no options selected.
- Select one option and proceed.
- Select multiple options and proceed ("select all that apply").

#### Selection behavior
- Clicking the card/label toggles the checkbox state.
- Clicking an already-selected option unselects it (toggle).

#### Keyboard usability
- Tab navigation reaches the options and the Next button.
- Space toggles selection.
- Enter submits the step.

### Step 3 – Property type (required + blocking rules)
- Click Next with no selection.
- Select Owned House / Condo → proceeds to Step 4.
- Select Rental Property → shows blocking error message.
- Select Mobile Home → shows blocking error message.

### Step 4 – Name + Email (required + email validation)
#### Required fields
- Click Go To Estimate with both fields empty.
- Name filled, email empty.
- Email filled, name empty.

#### Email validation
- Invalid email format (e.g., not-an-email).
- Valid email (e.g., a@b.com).
- Email with surrounding spaces is handled correctly (e.g., a@b.com).
- Email with plus addressing (e.g., jan+test@gmail.com).

#### Name input robustness
- Name supports hyphen and apostrophe (e.g., O'Neil, Anna-Maria).
- Very long name does not break layout or overflow UI.

### Step 5 – Phone number (required, exactly 10 digits)
#### Required + format validation
- Submit with empty phone.
- 9 digits (e.g., 313555121).
- 11 digits (e.g., 13135551212).
- Non-digit characters (e.g., 313-555-1212, (313)555-1212).
- Phone with spaces.
- Pasting a phone value works as expected.

#### Submission behavior
- Pressing Enter submits the same as clicking Submit Your Request.
- Rapid submit / double submit does not create duplicate requests or stuck UI.

### Successful submission – Thank You page
- Successful full flow redirects to /thankyou.
- Thank you page shows header "Thank you!".
- Thank you page shows "We will be calling within the next 10 minutes …" text.
- Browser Back from thank you does not resubmit automatically and does not break the page.

### Out-of-area flow – Sorry email capture
- Out-of-area ZIP routes to Sorry step.
- Sorry email is required.
- Invalid email is rejected.
- Valid email submission succeeds.
- After submission, confirmation state persists on the page.
- Sorry flow does not redirect to thank you (remains on landing page).

### Two forms on the same page (isolation + parity)
- Form 1 and Form 2 follow identical behavior for Steps 1–5.
- Form state is isolated: interacting with Form 1 does not affect Form 2 (and vice versa).

### Responsive behavior (lead-gen critical)
- Mobile viewport: hero video uses heroVideo-mob... source and correct poster.
- Desktop viewport: hero video uses desktop source/poster.
- General View video swaps source based on breakpoint (mobile vs desktop).
- Form remains usable on mobile widths (inputs visible, buttons reachable, no clipping).
- Slider controls work on desktop (Prev/Next present) and do not block form interaction.

### Accessibility / usability sanity checks (high value, minimal set)
- Each input is reachable via keyboard and tab order is logical.
- Card-style options correctly toggle underlying inputs (Step 2 and Step 3).
- Error messages are perceivable (not color-only) and appear near the relevant field.
- Buttons have correct accessible name/role and are reliably clickable.

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
- GitHub Actions for continuous integration

## Continuous Integration

The project includes GitHub Actions workflows for automated testing:

- **Basic workflow**: `playwright.yml` - Basic CI/CD for pull requests and pushes

Workflows automatically run on:
- Push to `main` or `master` branches
- Pull requests targeting `main` or `master` branches

The workflows:
- Install dependencies and Playwright browsers
- Run all Playwright tests
- Upload test reports and results as artifacts
- Provide cross-platform compatibility testing