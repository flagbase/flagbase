import React from 'react'
import { test, expect } from '@playwright/experimental-ct-react'
import Notification from '.'
import { strToImagePath } from '../../helpers'

test.use({ viewport: { width: 500, height: 500 } })

test('notification shows success with text', async ({ mount }, testInfo) => {
    const component = await mount(<Notification type="success" show title="Success" content="This was a triumph" />)
    await expect(component).toContainText('Success')
    await expect(component).toContainText('This was a triumph')
    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
    await testInfo.attach(strToImagePath(testInfo.title), {
        body: await component.screenshot(),
        contentType: 'image/png',
    })
})

test('notification shows error with text', async ({ mount }, testInfo) => {
    const component = await mount(<Notification type="error" show title="Error" content="Houston we have a problem" />)
    await expect(component).toContainText('Error')
    await expect(component).toContainText('Houston we have a problem')
    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
    await testInfo.attach(strToImagePath(testInfo.title), {
        body: await component.screenshot(),
        contentType: 'image/png',
    })
})

test('notification shows warning with text', async ({ mount }, testInfo) => {
    const component = await mount(<Notification type="warning" show title="Warning" content="This is not a drill" />)
    await expect(component).toContainText('Warning')
    await expect(component).toContainText('This is not a drill')
    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
    await testInfo.attach(strToImagePath(testInfo.title), {
        body: await component.screenshot(),
        contentType: 'image/png',
    })
})

test('notification shows info with text', async ({ mount }, testInfo) => {
    const component = await mount(
        <Notification type="info" show title="Info" content="All your base are belong to us" />
    )
    await expect(component).toContainText('Info')
    await expect(component).toContainText('All your base are belong to us')
    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
    await testInfo.attach(strToImagePath(testInfo.title), {
        body: await component.screenshot(),
        contentType: 'image/png',
    })
})

test('notification hidden after 3 seconds', async ({ mount, page }, testInfo) => {
    const component = await mount(
        <Notification type="success" show title="Success" content="This was a triumph" timeout={100} />
    )
    await expect(component).toContainText('Success')
    await expect(component).toContainText('This was a triumph')

    await page.waitForTimeout(200)

    await expect(component).not.toContainText('Success')
    await expect(component).not.toContainText('This was a triumph')

    await expect(component).toHaveScreenshot(strToImagePath(testInfo.title))
    await testInfo.attach(strToImagePath(testInfo.title), {
        body: await component.screenshot(),
        contentType: 'image/png',
    })
})
