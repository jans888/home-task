import { Page, Locator, expect } from '@playwright/test';

export class HeaderLocationComponent {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('.header.header_type2');
  }

  get city() {
    // Best option here is the data-location-city-and-state hook (stable data-*)
    return this.root.locator('[data-location-city-and-state]');
  }

  async expectCity(expected: string) {
    await expect(this.city).toHaveText(new RegExp(`\\b${expected}\\b`));
  }
}
