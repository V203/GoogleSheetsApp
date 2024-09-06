import { test, expect } from '@playwright/test';

test('should display the correct title', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  await expect(page).toHaveTitle(/GoogleSheetsApp/);
});

test('should display the app title in the nav bar', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForSelector('nav h1', { state: 'visible' });
  const heading = await page.textContent('nav h1');

  expect(heading.trim()).toBe('G-Sheet App');
});

test('should display the material stepper on the page', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForSelector('mat-horizontal-stepper', { state: 'visible' });
  const stepper = await page.isVisible('mat-horizontal-stepper');

  expect(stepper).toBe(true);
});

test('should display the table on the page', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForSelector('table.mat-mdc-table', { state: 'visible' });
  const table = await page.isVisible('table.mat-mdc-table');

  expect(table).toBe(true);
});

// test('should have a delete button for an entry', async ({ page }) => {
//   await page.goto('http://localhost:4200');

//   await page.waitForSelector('button.mat-mdc-mini-fab');

//   const deleteButtonLocator = page.locator('button.mat-mdc-mini-fab');
//   const buttonText = deleteButtonLocator.locator('mat-icon');

//   expect(buttonText.textContent()).toBe('delete');
// });

// test('should delete the last row and update the table', async ({
//   page,
// }) => {
//   await page.goto('http://localhost:4200');
//   await page.waitForTimeout(2000);

//   const rowsLocator = page.locator('table tbody tr');
//   const count = await rowsLocator.count();
//   console.log(`Number of elements found: ${count}`);

//   const lastRowLocator = rowsLocator.last();
//   const deleteButtonLocator = lastRowLocator.locator(
//     'button[mat-mdc-mini-fab]'
//   );
//   await deleteButtonLocator.click();

//   const updatedRowsLocator = page.locator('table tbody tr');
//   const updatedCount = await updatedRowsLocator.count();
//   console.log(`Updated number of elements found: ${updatedCount}`);

//     expect(await updatedRowsLocator.count()).toBeLessThan(
//       await rowsLocator.count()
//     );
// });
