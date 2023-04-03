import { expect, test } from '@playwright/experimental-ct-react'
import { strToImagePath } from '../../../helpers'

test.afterEach(async ({ page }, testInfo) => {
    await testInfo.attach(strToImagePath(testInfo.title), {
        body: await page.screenshot(),
        contentType: 'image/png',
    })
})

test('has title', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Instances | Flagbase/)
})
