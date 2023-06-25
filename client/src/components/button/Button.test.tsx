import React from 'react';

import { test, expect } from '@playwright/experimental-ct-react';

import Button from '.';
import { strToImagePath } from '../../helpers';

test.use({ viewport: { width: 500, height: 500 } });
test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach(strToImagePath(testInfo.title), {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('button renders with text', async ({ mount }, testInfo) => {
  const component = await mount(
    <Button placeholder="Enter your name">Primary Button</Button>,
  );
  expect(component.getByPlaceholder('Enter your name')).toBeTruthy();
  await expect(component).toHaveScreenshot(strToImagePath(testInfo.title));
});
