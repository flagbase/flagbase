import React from 'react'
import { test, expect } from '@playwright/experimental-ct-react'
import Input from '.'
import { strToImagePath } from '../../helpers'
import { PlusCircleFilled } from '@ant-design/icons'

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

test('shows prefix', async ({ mount }, testInfo) => {
    const component = await mount(<Input prefix={PlusCircleFilled} />)
    expect(component.getByTestId('prefix')).toBeTruthy()
    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
})
