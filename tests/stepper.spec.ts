import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

test('should add data using stepper form', async ({ browser }) => {
  const context: BrowserContext = await browser.newContext();
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page: Page = await context.newPage();

  await page.goto('http://localhost:4200');
  await page.waitForSelector('mat-horizontal-stepper', { state: 'visible' });
  expect(await page.isVisible('mat-horizontal-stepper')).toBe(true);

  const formData = [
    { formControl: 'name', value: 'John' },
    { formControl: 'last_name', value: 'Doe' },
    { formControl: 'email', value: 'johndoe@example.com' },
  ];

  for (const [index, data] of formData.entries()) {
    const formField = page.locator(
      `input[formcontrolname="${data.formControl}"]`
    );
    await formField.waitFor({ state: 'visible' });
    await formField.fill(data.value);

    if (index < formData.length - 1) {
      const currentStepContent = page.locator(
        `mat-horizontal-stepper .mat-horizontal-stepper-content:not(.mat-horizontal-stepper-content-inactive)`
      );

      const nextButton = currentStepContent.locator('button[matsteppernext]');
      await nextButton.waitFor({ state: 'visible' });
      await nextButton.click();
    }
  }
  const finishButton = page.locator('button[type="submit"]');
  await finishButton.waitFor({ state: 'visible' });
  await finishButton.click();

  await context.tracing.stop({ path: 'trace.zip' });
  await context.close();
});
