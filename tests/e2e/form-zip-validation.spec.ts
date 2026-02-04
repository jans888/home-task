import { test, expect, edgeCaseData, sorryFlowData } from '../fixtures/appFixtures';

test.describe('Step 1 - ZIP Code (validation + routing)', () => {
  test('required/format validation + availability routing + Enter submit + rapid submit + form isolation', async ({ app, page }) => {

    await test.step('Open landing page + verify loaded', async () => {
      await app.goto('/');
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
    });

    await test.step('ZIP empty - click Next - stays on step 1', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formTop.step1Next.click();
      await app.formTop.expectOnStep1();
    });

    await test.step('ZIP <5 digits - stays on step 1', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formTop.enterZip(edgeCaseData.invalidZipTooShort);
      await app.formTop.submitZip();
      await app.formTop.expectOnStep1();
    });

    await test.step('ZIP >5 digits - stays on step 1', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formTop.enterZip(edgeCaseData.invalidZipTooLong);
      await app.formTop.submitZip();
      await app.formTop.expectOnStep1();
    });

    await test.step('ZIP contains non-digits - stays on step 1', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formTop.enterZip(edgeCaseData.invalidZipNonDigits);
      await app.formTop.submitZip();
      await app.formTop.expectOnStep1();
    });

    await test.step('ZIP contains spaces - invalid OR trimmed; verify behavior', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formTop.enterZip(edgeCaseData.invalidZipWithSpaces);
      await app.formTop.submitZip();

      const step1Visible = await app.formTop.getStep1().isVisible();
      const step2Visible = await app.formTop.getStep2().isVisible();
      expect(step1Visible || step2Visible).toBe(true);

      if (step2Visible) {
        await page.reload();
        await app.expectLoaded();
        await app.formTop.expectOnStep1();
      }
    });

    await test.step('ZIP leading zeros - accepted and proceeds to Step 2', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formTop.enterZipAndContinue(edgeCaseData.validZipLeadingZeros);
      await page.waitForTimeout(600);
      await app.formTop.expectOnStep2();
      await expect(app.formTop.sorryStep).toBeHidden();
    });

    await test.step('In-service ZIP - proceeds to step 2 (not sorry)', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formTop.enterZipAndContinue(edgeCaseData.validZipServiceAvailable);
      await app.formTop.expectOnStep2();
      await expect(app.formTop.sorryStep).not.toBeVisible();
      await app.formTop.expectOnStep2();
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
    });

    await test.step('Out-of-area ZIP - routes to Sorry step', async () => {
      await page.reload();
      await app.expectLoaded();
      await page.waitForTimeout(1500);
      
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
      
      await app.formTop.enterZip(sorryFlowData.outOfAreaZipCode);
      await app.formTop.submitZip();

      await page.waitForTimeout(1200);
      
      await expect(app.formTop.sorryStep).toBeVisible();
      await expect(app.formBottom.sorryStep).toBeVisible();

      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
    });

    await test.step('After typing ZIP, hitting Enter submits same as clicking Next', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      
      await app.formTop.enterZip(edgeCaseData.validZipServiceAvailable);

      await app.formTop.zipInput.press('Enter');
      await app.formTop.expectOnStep2();

      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
    });

    await test.step('Double-click Next / rapid submit doesn’t break (no duplicate transitions, no JS exception)', async () => {
      const pageErrors: string[] = [];
      page.on('pageerror', (err) => pageErrors.push(err.message));

      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      
      await app.formTop.enterZip(edgeCaseData.validZipServiceAvailable);
      await app.formTop.step1Next.dblclick();

      await app.formTop.expectOnStep2();

      expect(pageErrors, `Uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
    });

    await test.step('Submitting ZIP in form 1 only affects form 1 (form 2 remains untouched)', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
      await app.formTop.enterZipAndContinue(edgeCaseData.validZipServiceAvailable);
      await app.formTop.expectOnStep2();
      await app.formBottom.expectOnStep1();
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
    });

    await test.step('Submitting ZIP in form 2 only affects form 2 (form 1 remains untouched)', async () => {
      await page.reload();
      await app.expectLoaded();
      await app.formTop.expectOnStep1();
      await app.formBottom.expectOnStep1();
      await app.formBottom.enterZipAndContinue(edgeCaseData.validZipServiceAvailable);
      await app.formBottom.expectOnStep2();
      await app.formTop.expectOnStep1();
    });
  });
});
