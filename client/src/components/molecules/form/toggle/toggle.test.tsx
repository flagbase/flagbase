import React from 'react';

import { strToImagePath } from '@flagbase/ui';
import { test, expect } from '@playwright/experimental-ct-react';
import { Form, Formik } from 'formik';

import Toggle from './toggle';

const setupFormik = (
  initialValue: boolean,
  label?: string,
  disabled?: boolean,
) => (
  <Formik initialValues={{ toggle: initialValue }} onSubmit={() => {}}>
    <Form className="w-fit">
      <Toggle name="toggle" label={label} disabled={disabled} />
    </Form>
  </Formik>
);

test('toggle with label should render', async ({ mount }, testInfo) => {
  const component = await mount(setupFormik(false, 'Toggle'));
  await expect(component).toContainText('Toggle');
  await takeScreenshot(component, testInfo);
});

test('toggle checked should render', async ({ mount }, testInfo) => {
  const component = await mount(setupFormik(true, 'Toggle'));
  await takeScreenshot(component, testInfo);
});

test('toggle unchecked should render', async ({ mount }, testInfo) => {
  const component = await mount(setupFormik(false, 'Toggle'));
  await takeScreenshot(component, testInfo);
});

test('toggle disabled should render', async ({ mount }, testInfo) => {
  const component = await mount(setupFormik(true, 'Toggle', true));
  await takeScreenshot(component, testInfo);
});

const takeScreenshot = async (component: any, testInfo: any) => {
  await expect(component).toHaveScreenshot(strToImagePath(testInfo.title));
  await testInfo.attach(testInfo.title, {
    body: await component.screenshot(),
    contentType: 'image/png',
  });
};
