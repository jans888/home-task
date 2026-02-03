import { test, expect, validFormData } from '../fixtures/appFixtures';

test('Form service available flow', async ({ app, page }) => {

  await test.step('Open landing page', async () => {
    await app.goto('/');
  });

  await test.step('Verify page loaded', async () => {
    await app.expectLoaded();
  });

  await test.step('Enter ZIP code', async () => {
    await app.formTop.step1Next.click();
    await app.formTop.expectOnStep1();
    await app.formTop.enterZipAndContinue('68901');
    await app.formTop.expectOnStep2();
  });

  await test.step('Step 2 is required (must select at least one) then continue', async () => {
    await app.formTop.chooseWhyInterested(validFormData.whyInterested);
    await app.formTop.continueFromWhyInterested();
    await app.formTop.expectOnStep3();
  });

  await test.step('Step 3 is required then continue', async () => {
    await app.formTop.expectOnStep3();

    await app.formTop.choosePropertyType(validFormData.propertyType);

    const step3 = app.formTop.root.locator('.steps.step-3');
    const next = step3.getByRole('button', { name: /^Next/i });

    await expect(next).toBeVisible();
    await expect(next).toBeEnabled();

    await next.scrollIntoViewIfNeeded();
    await next.click();
  });

  await test.step('Name + Email required; Email uses native HTML5 validation', async () => {
    await app.formTop.goToEstimateButton.click();
    await app.formTop.expectOnStep4();

    await app.formTop.nameInput.fill(validFormData.name);
    await app.formTop.emailInput.fill(validFormData.email);

    await expect
      .poll(async () => app.formTop.emailInput.evaluate(el => (el as HTMLInputElement).checkValidity()))
      .toBe(true);

    await app.formTop.submitNameAndEmail();
    await app.formTop.expectOnStep5();
  });

  await test.step('Phone required; must be exactly 10 digits', async () => {
    await app.formTop.fillPhone(validFormData.phone);
    await app.formTop.submitPhone();
  });

  await test.step('Redirected to Thank you page', async () => {
    await app.formTop.expectThankYouPage();
    await expect(page).toHaveURL(/\/thankyou(?:\/)?$/);
    expect(new URL(page.url()).pathname).toBe('/thankyou');
  });
});
