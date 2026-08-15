import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create Next App/);
});

test('shows main heading', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /To get started, edit the/ }),
  ).toBeVisible();
});
