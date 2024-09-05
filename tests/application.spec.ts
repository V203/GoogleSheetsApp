import { test, expect } from '@playwright/test';

test('should display the correct title', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForTimeout(2000);

  const titleText = await page.title();
  expect(titleText).toContain('GoogleSheetsApp');
});

test('should have a table on the page to display data', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForTimeout(2000);

  const tableLocator = page.locator('table');
  await expect(tableLocator).toBeVisible();
});

test('should have a stepper component on the page', async ({ page }) => {
  await page.goto('http://localhost:4200');

  await page.waitForSelector('mat-horizontal-stepper');
  //   await page.waitForTimeout(2000);

  const stepperLocator = page.locator('mat-horizontal-stepper');
  await expect(stepperLocator).toBeVisible();
});

// test.only('should have a delete button for an entry', async ({ page }) => {
//   await page.goto('http://localhost:4200');

//   await page.waitForSelector('button.mat-mdc-mini-fab');
//   //   await page.waitForTimeout(2000);

//   const deleteButtonLocator = page.locator('button.mat-mdc-mini-fab');
//   const buttonText = deleteButtonLocator.locator('mat-icon');

//   expect(buttonText.textContent()).toBe('delete');
// });

test.only('should delete the last row and update the table', async ({
  page,
}) => {
  await page.goto('http://localhost:4200');
  await page.waitForTimeout(2000);

  const rowsLocator = page.locator('table tbody tr');
  const count = await rowsLocator.count();
  console.log(`Number of elements found: ${count}`);

  const lastRowLocator = rowsLocator.last();
  const deleteButtonLocator = lastRowLocator.locator(
    'button[mat-mdc-mini-fab]'
  );
  await deleteButtonLocator.click();
  //   await page.waitForTimeout(5000);

  // await page.reload();

  const updatedRowsLocator = page.locator('table tbody tr');
  const updatedCount = await updatedRowsLocator.count();
  console.log(`Updated number of elements found: ${updatedCount}`);

  //   expect(await updatedRowsLocator.count()).toBeLessThan(
  //     await rowsLocator.count()
  //   );
});
