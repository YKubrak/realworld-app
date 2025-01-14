import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Create a new account', ()=> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.userName();
  const password = faker.internet.password();

  test('Create a new account', async ({page})=> {
    await test.step('Open the sign-up form, fill it and click submit', async () => {
      await page.goto('/signup');
      await page.locator('input[name="firstName"]').fill(firstName);
      await page.locator('input[name="lastName"]').fill(lastName);
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('input[name="confirmPassword"]').fill(password);
      await page.locator('[data-test="signup-submit"]').click()
      await page.waitForURL('/signin')
    });

    await test.step('Validate the account is created and we can login with this new account', async ()=> {
      await page.waitForURL('/signin')
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('[data-test="signin-submit"]').click();
      await page.waitForURL('/');
      await expect(page.locator('[data-test="sidenav-username"]')).toContainText(username);
    })
  })
});