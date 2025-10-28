import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check if the main heading is present
  await expect(page.getByRole('heading', { name: /Full-Stack TypeScript App/i })).toBeVisible();
});

test('has proper page title', async ({ page }) => {
  await page.goto('/');
  
  // Check the page title
  await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
});

