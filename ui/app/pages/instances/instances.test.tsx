import { expect, test } from '@playwright/experimental-ct-react';
import { strToImagePath } from '../../../helpers';

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach(strToImagePath(testInfo.title), {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Instances | Flagbase/);
});

test('new user sees onboarding modal', async ({ page }) => {
  await page.goto('http://localhost:3000/instances');
  expect(page.getByText('Flagbase Client')).toBeTruthy();
});

test('existing user does not see onboarding modal', async ({ page }) => {
  await page.goto('http://localhost:3000/instances');
  await expect(
    page.getByRole('heading', { name: 'Flagbase Client' }),
    'modal text should be visible',
  ).toBeVisible();

  await page.locator('#remember-me').check();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(
    page.getByRole('heading', { name: 'Flagbase Client' }),
    'modal text should be visible',
  ).not.toBeVisible();
});

test('user can connect to an instance', async ({ page }) => {
  await page.goto('http://localhost:3000/instances');
  await page.locator('#remember-me').check();
  await page.getByRole('button', { name: 'Close' }).click();
  await page
    .getByRole('button', { name: 'Join instance', exact: true })
    .click();
  await page.getByPlaceholder('Flagbase Instance').fill('Flagbase Local');
  await page.getByPlaceholder('Flagbase Instance').press('Tab');
  await page.getByPlaceholder('flagbase-instance').press('Tab');
  await page.getByPlaceholder('URL').fill('http');
  await page.getByPlaceholder('URL').press('Meta+a');
  await page.getByPlaceholder('URL').click();
  await page.getByPlaceholder('URL').press('Meta+a');
  await page.getByPlaceholder('URL').fill('https://api.core.flagbase.xyz');
  await page.getByPlaceholder('URL').press('Tab');
  await page.getByPlaceholder('Key').fill('flagbase-root-access-343fdf');
  await page.getByPlaceholder('Key').press('Tab');
  await page.getByPlaceholder('Secret').fill('G0L4bNFfadfsdf');
  await page.getByRole('button', { name: 'Add Instance' }).click();
  await page.getByPlaceholder('flagbase-instance').click();
  await page.getByPlaceholder('flagbase-instance').fill('flagbase');
  await page.getByRole('button', { name: 'Add Instance' }).click();
  await page.waitForTimeout(5000);
});
