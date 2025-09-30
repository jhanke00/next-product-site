import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main heading and description', async ({ page }) => {
    await expect(page.getByText('Products from A to Z')).toBeVisible();
    await expect(page.getByText('Our broad product portfolio includes many world-famous brands')).toBeVisible();
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search product...');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();
  });

  test('should display products by category', async ({ page }) => {
    // Check that products are grouped by category (use first() to avoid strict mode issues)
    await expect(page.getByText('Active Ingredients').first()).toBeVisible();
    await expect(page.getByText('Herbicides').first()).toBeVisible();

    // Check that at least some products are visible
    const productCount = await page.locator('.grid .bg-white').count();
    expect(productCount).toBeGreaterThan(2);
  });

  test('should show empty state for no results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search product...');

    // Search for non-existent product
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(500);

    // Should show empty state
    await expect(page.getByText('No products found matching your search.')).toBeVisible();
    await expect(page.getByText('Try different search terms.')).toBeVisible();

    // No product cards should be visible
    await expect(page.locator('.grid .bg-white')).toHaveCount(0);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Should still display main content
    await expect(page.getByText('Products from A to Z')).toBeVisible();
    await expect(page.getByPlaceholder('Search product...')).toBeVisible();

    // Products should still be visible
    const productCount = await page.locator('.grid .bg-white').count();
    expect(productCount).toBeGreaterThan(0);
  });
});
