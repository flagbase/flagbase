import { expect, test } from '@playwright/experimental-ct-react';

import { strToImagePath } from '../../../helpers';

const { TEST_INSTANCE_URL, TEST_INSTANCE_KEY, TEST_INSTANCE_SECRET } =
  process.env;

test.beforeAll(() => {
  if (!TEST_INSTANCE_URL || !TEST_INSTANCE_KEY || !TEST_INSTANCE_SECRET) {
    throw new Error('Missing test instance credentials');
  }
});

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
  await page.getByLabel('Name').fill('Flagbase Staging');
  await page.getByLabel('Connection String').click();
  await page.getByLabel('Connection String').fill(TEST_INSTANCE_URL as string);
  await page.getByLabel('Connection String').press('Tab');
  await page.getByLabel('Access Key').fill(TEST_INSTANCE_KEY as string);
  await page.getByLabel('Access Key').press('Tab');
  await page.getByLabel('Access Secret').fill(TEST_INSTANCE_SECRET as string);
  await page.getByRole('button', { name: 'Add Instance' }).click();
  await expect(page.getByText('Successfully added this instance')).toBeVisible({
    timeout: 5000,
  });
});

test('user sees error when connecting with invalid URL', async ({ page }) => {
  await page.goto('http://localhost:3000/instances');
  await page.locator('#remember-me').check();
  await page.getByRole('button', { name: 'Close' }).click();
  await page
    .getByRole('button', { name: 'Join instance', exact: true })
    .click();
  await page.getByLabel('Name').fill('Potato');
  await page.getByLabel('Name').press('Tab');
  await page.getByLabel('Key', { exact: true }).press('Tab');
  await page.getByLabel('Connection String').fill('potato');
  await page.getByLabel('Connection String').press('Tab');
  await expect(
    page.getByText('Please enter a valid Flagbase instance URL'),
  ).toBeVisible();
});

test('user sees error when connecting with invalid access key', async function invalidAccessKey({
  page,
}) {
  await page.goto('http://localhost:3000/instances');
  await page.locator('#remember-me').check();
  await page.getByRole('button', { name: 'Close' }).click();
  await page
    .getByRole('button', { name: 'Join instance', exact: true })
    .click();
  await page.getByLabel('Name').fill('Flagbase Staging');
  await page.getByLabel('Connection String').click();
  await page.getByLabel('Connection String').fill(TEST_INSTANCE_URL as string);
  await page.getByLabel('Connection String').press('Tab');
  await page.getByLabel('Access Key').fill('invalid-key');
  await page.getByLabel('Access Key').press('Tab');
  await page.getByLabel('Access Secret').fill(TEST_INSTANCE_SECRET as string);
  await page.getByRole('button', { name: 'Add Instance' }).click();
  await expect(page.getByText('Could not add this instance')).toBeVisible({
    timeout: 5000,
  });
});

test('user sees error when connecting with invalid access secret', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/instances');
  await page.locator('#remember-me').check();
  await page.getByRole('button', { name: 'Close' }).click();
  await page
    .getByRole('button', { name: 'Join instance', exact: true })
    .click();
  await page.getByLabel('Name').fill('Flagbase Staging');
  await page.getByLabel('Connection String').click();
  await page.getByLabel('Connection String').fill(TEST_INSTANCE_URL as string);
  await page.getByLabel('Connection String').press('Tab');
  await page.getByLabel('Access Key').fill(TEST_INSTANCE_KEY as string);
  await page.getByLabel('Access Key').press('Tab');
  await page.getByLabel('Access Secret').fill('invalid-secret');
  await page.getByRole('button', { name: 'Add Instance' }).click();
  await expect(page.getByText('Could not add this instance')).toBeVisible({
    timeout: 5000,
  });
});
