import { test, expect, validFormData, edgeCaseData } from '../fixtures/appFixtures';
import { onlyDigits, openLanding, pickPhoneInput, pickSubmit, waitForAcceptedOrRejected, submitAndAssert, setClipboard, pasteInto } from '../../src/utils/testUtils';

import type { WalkInBathPage } from '../../src/pages/walkInBath.page';

async function goToStep5(app: WalkInBathPage) {
  await app.formTop.zipInput.scrollIntoViewIfNeeded();
  await app.formTop.expectOnStep1();
  await app.formTop.enterZipAndContinue(validFormData.zipCode);
  await app.formTop.chooseWhyInterested(validFormData.whyInterested);
  await app.formTop.continueFromWhyInterested();
  await app.formTop.choosePropertyType(validFormData.propertyType);
  await app.formTop.continueFromPropertyType();
  await app.formTop.expectOnStep4();
  await app.formTop.fillNameAndEmail(validFormData.name, validFormData.email);
  await app.formTop.submitNameAndEmail();
  await app.formTop.expectOnStep5();
  return { step5: app.formTop.getStep5() };
}

test.describe('Step 5 - Phone number (required, exactly 10 digits)', () => {
  test('Phone required/format + paste + Enter submit + rapid submit', async ({ app, page, context }) => {
    test.slow();

    await test.step('Open landing (desktop)', async () => {
      await openLanding(app);
    });

    await test.step('Empty phone - rejected, error shown', async () => {
      await openLanding(app);
      const { step5 } = await goToStep5(app);
      const phoneInput = await pickPhoneInput(step5);
      const submit = await pickSubmit(step5);
      await phoneInput.fill(edgeCaseData.invalidPhoneEmpty);
      await submitAndAssert(page, app, phoneInput, submit, 'rejected');
    });

    await test.step('9 digits - rejected, error shown', async () => {
      await openLanding(app);
      const { step5 } = await goToStep5(app);
      const phoneInput = await pickPhoneInput(step5);
      const submit = await pickSubmit(step5);
      await phoneInput.fill(edgeCaseData.invalidPhoneTooShort);
      await submitAndAssert(page, app, phoneInput, submit, 'rejected');
    });

    await test.step('11 digits - accepted if normalized to 10 digits, else error shown', async () => {
      await openLanding(app);
      const { step5 } = await goToStep5(app);
      const phoneInput = await pickPhoneInput(step5);
      const submit = await pickSubmit(step5);
      await phoneInput.fill(edgeCaseData.validPhoneWithLeadingOne);
      await phoneInput.press('Tab');
      const normalizedDigits = onlyDigits(await phoneInput.inputValue());
      const expected: 'accepted' | 'rejected' = normalizedDigits.length === 10 ? 'accepted' : 'rejected';
      await submitAndAssert(page, app, phoneInput, submit, expected);
    });
    
    await test.step('Formatted - accepted if auto-strips, else rejected', async () => {
      await openLanding(app);
      const { step5 } = await goToStep5(app);
      const phoneInput = await pickPhoneInput(step5);
      const submit = await pickSubmit(step5);
      await phoneInput.fill(edgeCaseData.validPhoneFormatted);
      await phoneInput.press('Tab');
      const digits = onlyDigits(await phoneInput.inputValue());
      const expected: 'accepted' | 'rejected' = digits.length === 10 ? 'accepted' : 'rejected';
      await submitAndAssert(page, app, phoneInput, submit, expected);
    });

    await test.step('With spaces - accepted if normalized, else rejected', async () => {
      await openLanding(app);
      const { step5 } = await goToStep5(app);
      const phoneInput = await pickPhoneInput(step5);
      const submit = await pickSubmit(step5);
      await phoneInput.fill(edgeCaseData.validPhoneWithSpaces);
      await phoneInput.press('Tab');
      const digits = onlyDigits(await phoneInput.inputValue());
      const expected: 'accepted' | 'rejected' = digits.length === 10 ? 'accepted' : 'rejected';
      await submitAndAssert(page, app, phoneInput, submit, expected);
    });

    await test.step('Pasting phone value works', async () => {
      await openLanding(app);
      const { step5 } = await goToStep5(app);
      const phoneInput = await pickPhoneInput(step5);
      const submit = await pickSubmit(step5);
      await setClipboard(context, page, edgeCaseData.validPhone);
      await phoneInput.fill('');
      await pasteInto(phoneInput);
      const digits = onlyDigits(await phoneInput.inputValue());
      expect(digits.length).toBe(10);
      await submitAndAssert(page, app, phoneInput, submit, 'accepted');
    });

    await test.step('Enter key submits same as button', async () => {
      await openLanding(app);
      const { step5 } = await goToStep5(app);
      const phoneInput = await pickPhoneInput(step5);
      await phoneInput.fill(edgeCaseData.validPhone);
      await phoneInput.press('Enter');
      const outcome = await waitForAcceptedOrRejected(page, app);
      expect(outcome).toBe('accepted');
      await expect(page.getByRole('heading', { name: /thank you/i }).first()).toBeVisible();
    });
  });
});
