import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
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

    test('Create new transaction for friend', async ({ page }) => {
        // Click text=Friends
        await page.locator('text=Friends').click();
        await expect(page).toHaveURL('http://localhost:3000/contacts');
        // Click [data-test="transaction-list-filter-amount-range-button"]
        await page.locator('[data-test="transaction-list-filter-amount-range-button"]').click();
        // Click [data-test="transaction-list-filter-amount-range-slider"]
        await page.locator('[data-test="transaction-list-filter-amount-range-slider"]').click();
        // Click #amount-range-popover > div >> nth=0
        await page.locator('#amount-range-popover > div').nth(2).click();
        // Click [data-test="transaction-list-empty-create-transaction-button"]
        await page.locator('[data-test="transaction-list-empty-create-transaction-button"]').click();
        await expect(page).toHaveURL('http://localhost:3000/transaction/new');
        // Click [data-test="user-list-item-t45AiwidW"] img
        await page.locator('[data-test="user-list-item-t45AiwidW"] img').click();
        // Fill [placeholder="Amount"]
        await page.locator('[placeholder="Amount"]').fill('1');
        // Click [placeholder="Add a note"]
        await page.locator('[placeholder="Add a note"]').click();
        // Fill [placeholder="Add a note"]
        await page.locator('[placeholder="Add a note"]').fill('Test');
        // Click [data-test="transaction-create-submit-request"]
        await page.locator('[data-test="transaction-create-submit-request"]').click();
        // Click [data-test="new-transaction-return-to-transactions"]
        await page.locator('[data-test="new-transaction-return-to-transactions"]').click();
    });
});
