import { Page, Locator, expect } from '@playwright/test';

export class SliderComponent {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('[data-main-slider]');
  }

  get prevButton() {
    // <button class="slick-prev" aria-label="Previous">Previous</button>
    return this.root.getByRole('button', { name: 'Previous' });
  }

  get nextButton() {
    return this.root.getByRole('button', { name: 'Next' });
  }

  get activeSlideImage() {
    // Active slide has slick-current slick-active
    return this.root.locator('.slick-slide.slick-current.slick-active img[alt="slider-img"]');
  }

  async next() {
    await this.nextButton.click();
  }

  async prev() {
    await this.prevButton.click();
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
    await expect(this.activeSlideImage).toBeVisible();
  }
}
