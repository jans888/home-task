import { test as base, expect } from '@playwright/test';
import { WalkInBathPage } from '../../src/pages/walkInBath.page';
import { validFormData, sorryFlowData } from '../../src/data/formTestData';
import { edgeCaseData } from '../../src/data/edgeCaseTestData';

// Define custom fixture type
interface AppFixtures {
  app: WalkInBathPage;
}

// Extend base test with custom fixtures
export const test = base.extend<AppFixtures>({
  // Page object fixture - runs per test
  app: async ({ page }, use) => {
    const app = new WalkInBathPage(page);
    await use(app);
  },
});

// Export test data separately
export { expect, validFormData, edgeCaseData, sorryFlowData };
