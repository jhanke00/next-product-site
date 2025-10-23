import { test, expect } from '@playwright/test';

// Use a real productId from mock data that has resources
const productId = '272cc8e2-fc5c-4f8d-a196-011e223480cb';
const productUrl = `http://localhost:3000/products/${productId}`;

test.describe('Learning Resources UI', () => {
  test('lists existing resources', async ({ page }) => {
    await page.goto(productUrl);
    // Should see a section or heading for Learning Resources (h2)
    await expect(page.getByRole('heading', { name: /Learning Resources/i, level: 2 })).toBeVisible();
    // Should list at least one resource from mock data (by title and description)
    await expect(page.getByText('Getting Started with Fantastic Steel Computer')).toBeVisible();
    await expect(page.getByText(/beginner's guide to setup/i)).toBeVisible();
  });

  test('can add a new resource', async ({ page }) => {
    await page.goto(productUrl);
    // Fill out the form using getByLabel for accessible fields
    await page.getByLabel('Title').fill('Playwright Test Resource');
    await page.getByLabel('Type').selectOption('tutorial');
    await page.getByLabel('URL').fill('https://playwright.dev');
    await page.getByLabel('Description').fill('Added by Playwright E2E test');
    await page.getByRole('button', { name: /Add Resource/i }).click();
    // Should see the new resource appear in the list
    await expect(page.getByText('Playwright Test Resource')).toBeVisible();
    await expect(page.getByText('Added by Playwright E2E test')).toBeVisible();
  });
});
