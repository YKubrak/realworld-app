import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import SignUpPage from "../../POM/SignUpPage.mjs";
import SignInPage from "../../POM/SignInPage.mjs";
import HomePage from "../../POM/HomePage.mjs";

test.describe('Create a new account', ()=> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.userName();
  const password = faker.internet.password();

  test('Create a new account', async ({page})=> {
    await test.step('Open the sign-up form, fill it and click submit', async () => {
      let signUpPage = new SignUpPage(page);
      await signUpPage.navigate();
      await signUpPage.signUp(username, password, firstName, lastName);
    });

    await test.step('Validate the account is created and we can login with this new account', async ()=> {
      let signInPage = new SignInPage(page);
      await signInPage.navigate();
      await signInPage.signIn(username, password);

      let homePage = new HomePage(page);
      await expect(homePage.username).toContainText(username);
    })
  })
});