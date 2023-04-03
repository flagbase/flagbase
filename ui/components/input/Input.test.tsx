import React from 'react'
import { test, expect } from '@playwright/experimental-ct-react'
import Input from '.'
import { strToImagePath } from '../../helpers'
import { PlusCircleIcon } from '@heroicons/react/24/solid'

test.use({ viewport: { width: 500, height: 500 } })
test.afterEach(async ({ page }, testInfo) => {
    await testInfo.attach(strToImagePath(testInfo.title), {
        body: await page.screenshot(),
        contentType: 'image/png',
    })
})

test('shows placeholder if value is empty', async ({ mount }, testInfo) => {
    const component = await mount(<Input placeholder="Enter your name" />)
    expect(component.getByPlaceholder('Enter your name')).toBeTruthy()
    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
})

test.skip('shows prefix', async ({ mount }, testInfo) => {
    const component = await mount(<Input prefix={PlusCircleIcon} placeholder="Enter your name" />)
    // expect(component.getByTestId('prefix')).toBeTruthy()
    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
})
