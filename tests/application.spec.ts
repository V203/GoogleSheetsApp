import { test, expect } from '@playwright/test';

test('should contain title on page"', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForTimeout(2000);

  const divLocator = page.locator('div:has-text("g-sheet")');
  await expect(divLocator).toBeVisible();

  const divText = await divLocator.textContent();
  expect(divText).toContain('g-sheet');
});

test('should have a table on the page', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForTimeout(2000);

  const tableLocator = page.locator('table');
  const isTableVisible = await tableLocator.isVisible();

  expect(isTableVisible).toBe(true);
});

test('should have a submit button for updating cells', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForTimeout(2000);

  const submitButtonLocator = page.locator('button[type="submit"]');

  await expect(submitButtonLocator).toBeVisible();
});

test('should have a refresh button', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForTimeout(2000);

  const buttonByIdLocator = page.locator('button[id*="refresh"]');
  const buttonByTextLocator = page.locator('button:has-text("refresh")');
  const isButtonByIdVisible = await buttonByIdLocator.isVisible();
  const isButtonByTextVisible = await buttonByTextLocator.isVisible();

  expect(isButtonByIdVisible || isButtonByTextVisible).toBe(true);
});
