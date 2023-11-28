import React from 'react';

import { strToImagePath } from '@flagbase/ui';
import { test, expect } from '@playwright/experimental-ct-react';

import Table from '.';
import { tableSampleColumns, tableSampleData } from './table.scenarios';

test.use({ viewport: { width: 500, height: 500 } });
test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach(strToImagePath(testInfo.title), {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('table renders', async ({ mount }, testInfo) => {
  const component = await mount(
    <Table data={tableSampleData} columns={tableSampleColumns} />,
  );
  expect(component.getByPlaceholder('Enter your name')).toBeTruthy();
  await expect(component).toHaveScreenshot(strToImagePath(testInfo.title));
});
