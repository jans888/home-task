import { test } from '../fixtures/appFixtures';
import { sorryFlowData } from '../../src/data/formTestData';

test('Out-of-area flow - Sorry email capture', async ({ app }) => {

  await test.step('Open landing page', async () => {
    await app.goto('/');
  });

  await test.step('Verify page loaded', async () => {
    await app.expectLoaded();
  });

  await test.step('Enter out-of-area ZIP and continue', async () => {
    await app.formTop.enterZip(sorryFlowData.outOfAreaZipCode);
    await app.formTop.submitZip();
  });

  await test.step('Sorry flow: capture email', async () => {
    await app.formTop.expectSorryStepVisible();
    await app.formTop.submitSorryEmail(sorryFlowData.email);
  });

  await test.step('Confirmation message is shown', async () => {
    await app.formTop.expectSorryEmailCaptured();
  });
});
