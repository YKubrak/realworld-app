import { test, expect } from '@playwright/test';

test.describe('Login with an existing account', ()=> {
  const username = "Zelma9";
  const password = "s3cret";

  test('Login into the account', async ({page})=> {
    await test.step('Fill the sign-in form',async () =>{
      await page.goto('/signin');
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('[data-test="signin-submit"]').click()
      await page.waitForURL('/');
    });

    await test.step('Validate we are logged in with valid account', async () =>{
      await expect(page.locator('[data-test="sidenav-username"]')).toContainText(username);
    })
  })
});