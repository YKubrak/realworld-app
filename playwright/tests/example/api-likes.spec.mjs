import {expect, test} from "@playwright/test";

const apiLikes = 'http://localhost:3000/likes';
const transactionID = 112121212;

test.describe('API-Likes', () => {
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

    test('gets a list of likes for a transaction', async ({ request }) => {
        const newIssue = await request.get(`${apiLikes}`);
        expect(newIssue.ok()).toBeTruthy();
    });

    test('creates a new like for a transaction', async ({ request }) => {
        const newIssue = await request.get(`${apiLikes}/${transactionID}`);
        expect(newIssue.ok()).toBeTruthy();
    });
});
