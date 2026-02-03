/**
 * Utility functions for Playwright E2E tests
 */

import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { WalkInBathPage } from '../pages/walkInBath.page';
// import { FormData } from '../data/formTestData'; // Not currently used but kept for future use

/**
 * Extract only digits from a string
 */
export function onlyDigits(s: string) {
  return s.replace(/\D/g, '');
}

/**
 * Open landing page and wait for it to load
 */
export async function openLanding(app: WalkInBathPage) {
  await app.goto('/');
  await app.expectLoaded();
}

/**
 * Navigate to step 5 (phone step) with valid form data
 * This function should be used carefully as it contains complex form navigation logic
 * that may be better kept in the test file for specific test cases.
 */
// NOTE: This function is commented out as it may be too specific to individual test implementations
// export async function goToStep5(app: WalkInBathPage, formData: FormData) {
//   await app.formTop.zipInput.scrollIntoViewIfNeeded();
//   await app.formTop.expectOnStep1();
  
//   await app.formTop.enterZipAndContinue(formData.zipCode);

//   await app.formTop.chooseWhyInterested(formData.whyInterested);
//   await app.formTop.continueFromWhyInterested();

//   await app.formTop.choosePropertyType(formData.propertyType);
//   await app.formTop.continueFromPropertyType();

//   // Wait for step 4 to be visible and fill name/email
//   await app.formTop.expectOnStep4();
//   await app.formTop.fillNameAndEmail(formData.name, formData.email);
//   await app.formTop.submitNameAndEmail();

//   // Wait for step 5 to be visible
//   await app.formTop.expectOnStep5();

//   return { step5: app.formTop.getStep5() };
// }

/**
 * Pick phone input from step 5
 */
export async function pickPhoneInput(step5: Locator): Promise<Locator> {
  const byPlaceholder = step5.getByPlaceholder(/phone/i);
  if ((await byPlaceholder.count()) > 0) return byPlaceholder.first();

  const byRoleName = step5.getByRole('textbox', { name: /phone/i });
  if ((await byRoleName.count()) > 0) return byRoleName.first();

  const anyTextbox = step5.getByRole('textbox');
  if ((await anyTextbox.count()) > 0) return anyTextbox.first();

  throw new Error('Phone input not found on Step 5');
}

/**
 * Pick submit button from step 5
 */
export async function pickSubmit(step5: Locator): Promise<Locator> {
  const primary = step5.getByRole('button', { name: /submit your request/i });
  if ((await primary.count()) > 0) return primary.first();

  const fallback = step5.getByRole('button', { name: /submit|request|finish|continue|estimate/i });
  if ((await fallback.count()) > 0) return fallback.first();

  throw new Error('Submit button not found on Step 5');
}

/**
 * Set clipboard value
 */
export async function setClipboard(context: BrowserContext, page: Page, value: string) {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate(async (v) => await navigator.clipboard.writeText(v), value);
}

/**
 * Paste into a locator
 */
export async function pasteInto(locator: Locator) {
  await locator.click();
  await locator.press('ControlOrMeta+V');
}

/**
 * Expect phone error to be shown on step 5
 */
export async function expectPhoneErrorShown(step5: Locator) {
  const errorCandidate = step5.locator(
    '[role="alert"], [data-error], [data-error-block], .error, .errorMessage, .inputBlock__error, .fieldError'
  );
  if ((await errorCandidate.count()) > 0) {
    await expect(errorCandidate.first()).toBeVisible();
    return;
  }
  await expect(step5).toContainText(/phone|required|valid|10|digit/i);
}

/**
 * Wait for accepted or rejected outcome
 */
export async function waitForAcceptedOrRejected(page: Page, app: WalkInBathPage): Promise<'accepted' | 'rejected'> {
  const thankYouHeading = page.getByRole('heading', { name: /thank you/i }).first();
  const step5Visible = app.formTop.getStep5(); // Use the new POM method

  const outcome = await Promise.race([
    thankYouHeading
      .waitFor({ state: 'visible' })
      .then(() => 'accepted' as const)
      .catch(() => null),
    step5Visible
      .waitFor({ state: 'visible' })
      .then(() => 'rejected' as const)
      .catch(() => null),
  ]);

  if (outcome) return outcome;

  if (await thankYouHeading.isVisible()) return 'accepted';
  if (await step5Visible.isVisible()) return 'rejected';

  throw new Error('Could not determine submission outcome (neither Thank You nor Step 5 visible)');
}

/**
 * Submit and assert the outcome
 */
export async function submitAndAssert(
  page: Page,
  app: WalkInBathPage,
  phoneInput: Locator,
  submitBtn: Locator,
  expected: 'accepted' | 'rejected'
) {
  await submitBtn.click();

  const outcome = await waitForAcceptedOrRejected(page, app);

  if (expected === 'accepted') {
    expect(outcome).toBe('accepted');
    await expect(page.getByRole('heading', { name: /thank you/i }).first()).toBeVisible();
    return;
  }

  expect(outcome).toBe('rejected');
  const step5Visible = app.formTop.getStep5(); // Use the new POM method
  await expect(step5Visible).toBeVisible();
  await expect(phoneInput).toBeVisible();
  await expectPhoneErrorShown(step5Visible);
}
