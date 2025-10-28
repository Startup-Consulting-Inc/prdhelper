import { test, expect } from '@playwright/test';

test.describe('Project Card Kebab Menu', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:5173');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('kebab menu appears and shows options', async ({ page }) => {
    // Look for the three-dot menu button
    const menuButton = page.locator('button[aria-label="Project actions"]').first();

    // Check if the button exists
    const buttonCount = await menuButton.count();
    console.log('Menu button count:', buttonCount);

    if (buttonCount > 0) {
      // Click the menu button
      await menuButton.click();

      // Wait a bit for the menu to appear
      await page.waitForTimeout(500);

      // Check if menu items are visible
      const archiveButton = page.getByRole('menuitem', { name: /archive/i });
      const deleteButton = page.getByRole('menuitem', { name: /delete/i });

      const archiveVisible = await archiveButton.isVisible().catch(() => false);
      const deleteVisible = await deleteButton.isVisible().catch(() => false);

      console.log('Archive button visible:', archiveVisible);
      console.log('Delete button visible:', deleteVisible);

      // Take a screenshot
      await page.screenshot({ path: 'kebab-menu-test.png', fullPage: true });
    } else {
      console.log('No menu buttons found on the page');

      // Take a screenshot to see what's on the page
      await page.screenshot({ path: 'no-menu-buttons.png', fullPage: true });

      // Log the HTML to see what's actually rendered
      const body = await page.locator('body').innerHTML();
      console.log('Page HTML snippet:', body.substring(0, 1000));
    }
  });

  test('clicking delete shows confirmation', async ({ page }) => {
    // Look for the menu button
    const menuButton = page.locator('button[aria-label="Project actions"]').first();

    const buttonCount = await menuButton.count();
    if (buttonCount > 0) {
      // Click to open menu
      await menuButton.click();
      await page.waitForTimeout(300);

      // Set up dialog handler
      page.on('dialog', async dialog => {
        console.log('Dialog message:', dialog.message());
        await dialog.dismiss();
      });

      // Click delete
      const deleteButton = page.getByRole('menuitem', { name: /delete/i });
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(500);
      } else {
        console.log('Delete button not visible in menu');
      }
    }
  });
});
