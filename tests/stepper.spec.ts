import { test, expect } from '@playwright/test';

test('should add data using stepper form', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForSelector('mat-horizontal-stepper', { state: 'visible' });
  const stepper = await page.isVisible('mat-horizontal-stepper');

  expect(stepper).toBe(true);

  const steps = [
    { label: 'Name', formControl: 'name' },
    { label: 'Last Name', formControl: 'last_name' },
    { label: 'Email', formControl: 'email' },
  ];

  for (const [index, step] of steps.entries()) {
    const stepHeader = page.locator(
      `mat-step-header[id="cdk-step-label-0-${index}"]`
    );
    await expect(stepHeader).toBeVisible();

    const formField = page.locator(
      `mat-form-field[formcontrolname="${step.formControl}"]`
    );
    await expect(formField).toBeVisible();

    if (index < steps.length - 1) {
      const nextButton = await page.locator('button[matsteppernext]');
      await nextButton.click();

      await page.waitForSelector(
        `mat-horizontal-stepper-content[id="cdk-step-content-0-${index + 1}"]`,
        { state: 'visible' }
      );
    }
  }

  const finishButton = await page.locator(
    'button[matsteppernext][color="primary"]'
  );
  await expect(finishButton).toBeVisible();
});
