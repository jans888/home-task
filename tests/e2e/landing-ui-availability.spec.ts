import { test, expect } from '../fixtures/appFixtures';
import type { WalkInBathPage } from '../../src/pages/walkInBath.page';

async function openLanding(app: WalkInBathPage) {
  await app.goto('/');
  await app.expectLoaded();
}

test.describe('Landing — critical UI/components availability', () => {
  test('Landing page smoke: critical blocks render and are usable', async ({ app, page }) => {

    await test.step('Open landing (desktop viewport)', async () => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await openLanding(app);
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('Header: location widget is visible (no city assert)', async () => {
      await expect(app.header.root).toBeVisible();
      await expect(app.header.city).toBeVisible();
      await expect(app.header.city).not.toHaveText(/^\s*$/);
    });

    await test.step('Hero: title + testimonial + main video + badge render', async () => {
      await expect(
        page.getByText(/here’s why so many seniors have added this/i, { exact: false })
      ).toBeVisible();

      await expect(
        page.getByText(/it is so easy to walk in/i, { exact: false })
      ).toBeVisible();

      await expect(page.getByAltText(/proudly american/i)).toBeVisible();

      const mainVideo = page.locator('[data-main-video] video.blockVideo__video');
      await expect(mainVideo).toBeVisible();
      await expect(mainVideo).toHaveAttribute('src', /heroVideo/i);

      await expect(page.locator('[data-main-video] .video-button .play')).toBeVisible();
    });

    await test.step('Hero: key benefits list is present (>= 8 items)', async () => {
      const list = page.locator('.hero .blockList.blockList_boxFull');
      await expect(list).toBeVisible();
      const items = list.locator('.blockList__item');
      await expect(items).toHaveCount(10);
      await expect(page.getByText('Hydrotherapy & air jets')).toBeVisible();
      await expect(page.getByText('Fast-drain technology')).toBeVisible();
    });

    await test.step('Falling section: headline + statistic quote render', async () => {
      await expect(
        page.getByText(/stats show bathroom slips and falls/i, { exact: false })
      ).toBeVisible();

      await expect(
        page.getByText(/1\.6 million older adults seek emergency care/i, { exact: false })
      ).toBeVisible();
    });

    await test.step('General view: video block is visible', async () => {
      await expect(
        page.getByText(/every walk-in bath includes professional one-day installation/i, {
          exact: false,
        })
      ).toBeVisible();

      const viewVideo = page.locator('[data-view-video] video.blockVideo__video');
      await expect(viewVideo).toBeVisible();
      await expect(viewVideo).toHaveAttribute('src', /generalView/i);
    });

    await test.step('Health benefits: section header + 8 health cards', async () => {
      await expect(page.getByText('Walk-In Bath Health Benefits')).toBeVisible();
      const cards = page.locator('.healthBlock');
      await expect(cards).toHaveCount(8);
      await expect(page.getByText('Arthritis', { exact: true })).toBeVisible();
      await expect(page.getByText('Insomnia', { exact: true })).toBeVisible();
    });

    await test.step('Slider: main slider + preview slider + arrows exist', async () => {
      await expect(app.slider.root).toBeVisible();
      await app.slider.expectVisible();
      await expect(app.slider.prevButton).toBeVisible();
      await expect(app.slider.nextButton).toBeVisible();
      await expect(app.slider.activeSlideImage).toBeVisible();
    });

    await test.step('Warranty block: badge + title + description render', async () => {
      await expect(page.getByAltText('warranty')).toBeVisible();
      await expect(page.getByText(/our price pro/i, { exact: false })).toBeVisible();
      await expect(
        page.getByText(/the price you receive is the price you’ll pay/i, { exact: false })
      ).toBeVisible();
    });

    await test.step('Form #1: step-1 ZIP input + Next button + secure text are visible', async () => {
      await expect(app.formTop.root).toBeVisible();
      await app.formTop.expectOnStep1();
      await expect(app.formTop.zipInput).toBeVisible();
      await expect(app.formTop.step1Next).toBeVisible();
      const secureCopy = app.formTop.root.locator('span.secure.mt-2').first();
      await expect(secureCopy).toBeVisible();
      await expect(secureCopy).toHaveText(/safe, secure and confidential/i);

      const sideProductImage = app.formTop.root.locator('img.formSide__img');
      await expect(sideProductImage).toHaveCount(1);
          });

    await test.step('Form #2: second form container exists and step-1 is visible', async () => {
      await expect(app.formBottom.root).toBeVisible();
      await app.formBottom.expectOnStep1();
      await expect(app.formBottom.zipInput).toBeVisible();
      await expect(app.formBottom.step1Next).toBeVisible();
    });

    await test.step('Reviews: section exists and show more toggle is clickable', async () => {
      const reviewWrap = page.locator('.reviewWrap');
      await expect(reviewWrap).toBeVisible();
      const toggle = reviewWrap.getByText(/show more/i);
      await expect(toggle).toBeVisible();

      await toggle.click();
      await expect(reviewWrap.locator('.reviewFull')).toBeVisible();
      await expect(reviewWrap.getByText(/show less/i)).toBeVisible();

      await reviewWrap.getByText(/show less/i).click();
      await expect(reviewWrap.locator('.reviewFull')).toBeHidden();
    });

    await test.step('Footer: copyright text is visible', async () => {
      await expect(page.getByText(/©\s*Caps Lock,\s*2026\./i)).toBeVisible();
    });

    await test.step('Mobile-only: scroll CTA appears on small viewport', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload();
      await app.expectLoaded();
      await app.clickEstimateYourCostMobileCta();
      const heroVideo = page.locator('[data-main-video] video.blockVideo__video');
      await expect(heroVideo).toBeVisible();
      await expect(heroVideo).toHaveAttribute('src', /heroVideo-mob|heroVideo/i);
    });
  });
});
