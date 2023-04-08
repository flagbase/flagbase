import React from 'react';

import { test, expect } from '@playwright/experimental-ct-react';

import Tag from '.';

test.use({ viewport: { width: 500, height: 500 } });

test('tag shows text', async ({ mount }, testInfo) => {
  const component = await mount(<Tag>Generated</Tag>);
  await expect(component).toContainText('Generated');

  await expect(component).toHaveScreenshot('tag.png');
  await testInfo.attach('tag-shows-text', {
    body: await component.screenshot(),
    contentType: 'image/png',
  });
});

test('tag does not have delete button', async ({ mount }, testInfo) => {
  const component = await mount(<Tag>Generated</Tag>);
  const button = await component.getByRole('button').isVisible();
  expect(button).toBe(false);

  await expect(component).toHaveScreenshot('tag-no-delete.png');
  await testInfo.attach('tag-no-delete', {
    body: await component.screenshot(),
    contentType: 'image/png',
  });
});

test('tag has delete button', async ({ mount }, testInfo) => {
  const component = await mount(<Tag onDelete={() => {}}>Generated</Tag>);
  await expect(component.getByRole('button')).toHaveAttribute('type', 'button');
  const button = await component.getByRole('button').isVisible();
  expect(button).toBe(true);

  await expect(component).toHaveScreenshot('tag-delete.png');
  await testInfo.attach('tag-has-delete', {
    body: await component.screenshot(),
    contentType: 'image/png',
  });
});
