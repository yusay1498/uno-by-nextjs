import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/UNO by Next\.js/);
});

test('shows main heading', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /UNO by Next\.js/, level: 1 }),
  ).toBeVisible();
});
