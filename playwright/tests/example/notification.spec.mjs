import { test, expect } from '@playwright/test';

test.describe('Notification', () => {
    test.beforeEach(async ({ page }) => {
        let username = "Zelma9";
        let password = "s3cret";

        await page.goto('http://localhost:3000/signin');
        // Click input[name="username"]
        await page.locator('input[name="username"]').click();
        // Fill input[name="username"]
        await page.locator('input[name="username"]').fill(username);
        // Click input[name="password"]
        await page.locator('input[name="password"]').click();
        // Fill input[name="password"]
        await page.locator('input[name="password"]').fill(password);
        // Click [data-test="signin-submit"]
        await Promise.all([
            page.waitForURL(/*{ url: 'http://localhost:3000/' }*/),
            page.locator('[data-test="signin-submit"]').click()
        ]);
    });

    test('Go to notification', async ({ page }) => {
        // Click [data-test="nav-top-notifications-link"]
        await page.locator('[data-test="nav-top-notifications-link"]').click();
        await expect(page).toHaveURL('http://localhost:3000/notifications');
        // Click text=Notifications >> nth=1
        await page.locator('text=Notifications').nth(1).click();
    });
});
