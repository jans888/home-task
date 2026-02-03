import { Page, Locator, expect } from '@playwright/test';
import type { WhyInterested, PropertyType } from '../support/types';

export class EstimateFormComponent {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }

  // --- Shared / helpers

  private step(stepNumber: 1 | 2 | 3 | 4 | 5) {
    // Step 2: identify by presence of whyInterested checkboxes
    if (stepNumber === 2) {
      return this.root.locator(':scope:has(input[name="whyInterested[]"])');
    }
    // Step 3: identify by presence of typeOfProperty radios
    if (stepNumber === 3) {
      return this.root.locator(':scope:has(input[name="typeOfProperty"])');
    }
    // Fallback for others
    return this.root.locator(`.steps.step-${stepNumber}`);
  }

  // ✅ Public accessors for tests (avoid touching private step())
  getStep2() {
    return this.step(2);
  }

  getStep1() {
    return this.step(1);
  }

  getStep3() {
    return this.step(3);
  }

  getStep4() {
    return this.step(4);
  }

  getStep5() {
    return this.step(5);
  }

  async expectOnStep2() {
    await expect(this.getStep2()).toBeVisible();
  }

  async expectOnStep3() {
    await expect(this.getStep3()).toBeVisible();
  }

  async expectOnStep4() {
    await expect(this.getStep4()).toBeVisible();
  }

  async expectOnStep5() {
    await expect(this.getStep5()).toBeVisible();
  }

  async expectOnStep1() {
    await expect(this.getStep1()).toBeVisible();
  }



  private escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- Step 1 (ZIP)

  get zipInput() {
    return this.getStep1().getByPlaceholder('Enter ZIP Code');
  }

  get step1Next() {
    return this.getStep1().getByRole('button', { name: 'Next' });
  }

  async enterZip(zip: string) {
    await expect(this.zipInput).toBeVisible(); // instead of expect(this.getStep1()).toBeVisible()
    await this.zipInput.fill(zip);
  }

  async submitZip() {
    await this.step1Next.click();
  }

  async enterZipAndContinue(zip: string) {
    await this.enterZip(zip);
    await this.submitZip();
    await this.expectOnStep2();
  }

  // --- Step 2 (Why interested)

  checkbox(label: WhyInterested) {
    // Input may be hidden; keep for state assertion
    return this.getStep2().getByLabel(label, { exact: true });
  }

  option(label: WhyInterested) {
    // Click visible label/card text
    return this.getStep2().getByText(label, { exact: true });
  }

  get step2Next() {
    return this.getStep2().getByRole('button', { name: 'Next' });
  }

  async chooseWhyInterested(values: WhyInterested[]) {
    await this.expectOnStep2();

    for (const v of values) {
      await this.option(v).click();
      await expect(this.checkbox(v)).toBeChecked();
    }
  }

  async continueFromWhyInterested() {
    await this.step2Next.click();
    await this.expectOnStep3();
  }

  // --- Step 3 (Property type)
  
  get step3Next() {
    return this.getStep3().getByRole('button', { name: 'Next' });
  }
  
  get propertyNotSupportedError() {
    // Present in DOM always, but may be empty until triggered
    return this.getStep3().locator('[data-error-block]');
  }
  
  radio(label: PropertyType) {
    // keep for checked assertions (input can be hidden)
    return this.getStep3().getByLabel(label, { exact: true });
  }
  
  propertyOption(label: PropertyType) {
    // click visible card/label text
    return this.getStep3().getByText(label, { exact: true });
  }
  
  async choosePropertyType(value: PropertyType) {
    await this.expectOnStep3();
    
    await this.propertyOption(value).click();
    await expect(this.radio(value)).toBeChecked();
  }
  
  async continueFromPropertyType() {
    await this.step3Next.click();
  }
  
  async expectPropertyTypeRejected() {
    const expected = "Unfortunately, we don't install walk-in tubs in rental and mobile homes.";
    const step3 = this.getStep3();
  
    // 1) If message is rendered as visible text, assert it
    const visibleMsg = step3.getByText(/Unfortunately, we don't install/i);
    if ((await visibleMsg.count()) > 0) {
      await expect(visibleMsg.first()).toBeVisible();
      await expect(visibleMsg.first()).toContainText(expected);
      return;
    }
  
    // 2) Fallback: message stored as attribute on the <form ... data-error-text="...">
    const form = step3.locator('form[name="type_of_property"]');
    await expect(form).toHaveAttribute(
      'data-error-text',
      new RegExp(this.escapeRegExp(expected))
    );
  }

  // --- Step 4 (Name + Email)

  get nameInput() {
    return this.getStep4().getByPlaceholder('Enter Your Name');
  }

  get emailInput() {
    return this.getStep4().getByPlaceholder('Enter Your Email');
  }

  get goToEstimateButton() {
    return this.getStep4().getByRole('button', { name: 'Go To Estimate' });
  }

  async fillNameAndEmail(name: string, email: string) {
    await expect(this.getStep4()).toBeVisible();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
  }

  async submitNameAndEmail() {
    await this.goToEstimateButton.click();
    await this.expectOnStep5();
  }

  // --- Step 5 (Phone)

  get phoneInput() {
    return this.getStep5().getByPlaceholder('(XXX)XXX-XXXX');
  }

  get submitYourRequestButton() {
    return this.getStep5().getByRole('button', { name: 'Submit Your Request' });
  }

  async fillPhone(phone: string) {
    await expect(this.getStep5()).toBeVisible();
    await this.phoneInput.fill(phone);
  }

  async submitPhone() {
    await this.submitYourRequestButton.click();
  }

  // --- Phone validation helpers
  async expectPhoneErrorShown() {
    const step5 = this.getStep5();
    const errorCandidate = step5.locator(
      '[role="alert"], [data-error], [data-error-block], .error, .errorMessage, .inputBlock__error, .fieldError'
    );
    if ((await errorCandidate.count()) > 0) {
      await expect(errorCandidate.first()).toBeVisible();
      return;
    }
    await expect(step5).toContainText(/phone|required|valid|10|digit/i);
  }

  async waitForAcceptedOrRejected(): Promise<'accepted' | 'rejected'> {
    const outcome = await Promise.race([
      this.thankYouHeader
        .waitFor({ state: 'visible' })
        .then(() => 'accepted' as const)
        .catch(() => null),
      this.getStep5()
        .waitFor({ state: 'visible' })
        .then(() => 'rejected' as const)
        .catch(() => null),
    ]);

    if (outcome) return outcome;

    if (await this.thankYouHeader.isVisible()) return 'accepted';
    if (await this.getStep5().isVisible()) return 'rejected';

    throw new Error('Could not determine submission outcome (neither Thank You nor Step 5 visible)');
  }

  // --- Optional: “sorry” flow

  get sorryStep() {
    return this.root.locator('[data-sorry-step]');
  }

  get sorryEmailInput() {
    return this.sorryStep.getByPlaceholder('Email Address');
  }

  get sorrySubmit() {
    return this.sorryStep.getByRole('button', { name: 'Submit' });
  }

  async expectSorryStepVisible() {
    await expect(this.sorryStep).toBeVisible();
    await expect(this.sorryEmailInput).toBeVisible();
    await expect(this.sorrySubmit).toBeVisible();
  }

  async submitSorryEmail(email: string) {
    await this.expectSorryStepVisible();
    await this.sorryEmailInput.fill(email);
    await this.sorrySubmit.click();
  }

  get sorryConfirmationMessage() {
    return this.root.locator('[data-sorry-fade-in]');
  }

  async expectSorryEmailCaptured() {
    await expect(this.sorryConfirmationMessage).toBeVisible();
    await expect(this.sorryConfirmationMessage).toHaveText(
      'Thank you for your interest, we will contact you when our service becomes available in your area!'
    );
  }

  // --- Thank you page

  get thankYouHeader() {
    return this.page.getByRole('heading', { name: 'Thank you!', level: 1 });
  }

  get thankYouCallPromise() {
    return this.page.getByText(/We will be calling within the next/i);
  }

  async expectThankYouPage() {
    await expect(this.thankYouHeader).toBeVisible();
    await expect(this.thankYouCallPromise).toBeVisible();
  }
}
