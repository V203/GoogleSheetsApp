import { test, expect } from '@playwright/test';

test('should display the correct spreadsheet title', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForTimeout(2000);

  const titleElement = await page.locator('h1');
  const titleText = await titleElement.textContent();

  expect(titleText).toContain('Spread sheet title : g-sheet');
});
