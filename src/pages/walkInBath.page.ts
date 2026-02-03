import { Page, Locator, expect } from '@playwright/test';
import { HeaderLocationComponent } from '../components/headerLocation.component';
import { SliderComponent } from '../components/slider.component';
import { EstimateFormComponent } from '../components/estimateForm.component';

export class WalkInBathPage {
  readonly page: Page;

  readonly header: HeaderLocationComponent;
  readonly slider: SliderComponent;

  // Two identical quiz forms exist: form-container-1 and form-container-2
  readonly formTop: EstimateFormComponent;
  readonly formBottom: EstimateFormComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderLocationComponent(page);
    this.slider = new SliderComponent(page);

    this.formTop = new EstimateFormComponent(page, page.locator('#form-container-1'));
    this.formBottom = new EstimateFormComponent(page, page.locator('#form-container-2'));
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async clickEstimateYourCostMobileCta() {
    // Mobile CTA: <button ... data-scroll-trigger="">Estimate Your Cost</button>
    await this.page.getByRole('button', { name: 'Estimate Your Cost' }).click();
  }

  async expectLoaded() {
    // Something stable and user-facing
    await expect(
      this.page.getByText('Walk-In Bath Health Benefits', { exact: true })
    ).toBeVisible();
  }
}
