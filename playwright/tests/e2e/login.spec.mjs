import { test, expect } from '@playwright/test';
import SignInPage from "../../POM/SignInPage.mjs";
import HomePage from "../../POM/HomePage.mjs";

test.describe('Login with an existing account', ()=> {
  const username = "Zelma9";
  const password = "s3cret";

  test('Login into the account', async ({page})=> {
    await test.step('Fill the sign-in form',async () =>{
      let signInPage = new SignInPage(page);
      await signInPage.navigate();
      await signInPage.signIn(username, password);
    });

    await test.step('Validate we are logged in with valid account', async () =>{
      let homePage = new HomePage(page);
      await expect(homePage.username).toContainText(username);
    })
  })
});