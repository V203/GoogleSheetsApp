import { test, expect } from '@playwright/test';

test('should add data using stepper form', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForSelector('mat-horizontal-stepper', { state: 'visible' });
  const stepper = await page.isVisible('mat-horizontal-stepper');

  expect(stepper).toBe(true);

  const formData = [
    { formControl: 'name', value: 'John' },
    { formControl: 'last_name', value: 'Doe' },
    { formControl: 'email', value: 'john.doe@example.com' },
  ];

  for (const [index, data] of formData.entries()) {
    const formField = page.locator(
      `input[formcontrolname="${data.formControl}"]`
    );
    await formField.waitFor({ state: 'visible' });
    await expect(formField).toBeVisible();

    if (index < formData.length - 1) {
      const currentStepContent = page.locator(
        `mat-horizontal-stepper .mat-horizontal-stepper-content:not(.mat-horizontal-stepper-content-inactive)`
      );

      const nextButton = currentStepContent.locator('button[matsteppernext]');
      await nextButton.waitFor({ state: 'visible' });
      await nextButton.click();
    }
  }

  const finishButton = await page.locator('button[type="submit"]');
  await finishButton.waitFor({ state: 'visible' });
  await expect(finishButton).toBeVisible();
});
