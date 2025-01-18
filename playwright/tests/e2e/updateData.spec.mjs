import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import SignUpPage from "../../POM/SignUpPage.mjs";
import SignInPage from "../../POM/SignInPage.mjs";
import HomePage from "../../POM/HomePage.mjs";
import MyAccountPage from "../../POM/MyAccountPage.mjs";
import BankAccountsPage from "../../POM/BankAccountsPage.mjs";

test.describe('Create a new account', ()=> {
  let homePage;

  let firstName;
  let lastName;
  let username;
  let password;
  let bankName;
  let routingNumber;
  let accountNumber;

  test.beforeEach(async ({page})=> {
    firstName = faker.person.firstName();
    lastName = faker.person.lastName();
    username = faker.internet.userName();
    password = faker.internet.password();
    bankName = faker.company.name();
    routingNumber = faker.string.numeric(9);
    accountNumber = faker.string.numeric(9);

    let signUpPage = new SignUpPage(page);
    signUpPage.navigate();
    await signUpPage.signUp(username, password, firstName, lastName);

    let signInPage = new SignInPage(page);
    await signInPage.signIn(username, password);

    homePage = new HomePage(page);
    await homePage.waitLoaded();
    await homePage.finishAccOnboarding(bankName, routingNumber, accountNumber);
  })

  test('Should update account user settings', async ({page})=> {
    let myAccountPage = new MyAccountPage(page);
    // Creating new data to update user settings
    let updatedFirstName = faker.person.firstName();
    let updatedLastName = faker.person.lastName();
    let email = faker.internet.email();
    let phoneNumber = faker.string.numeric(9);

    await test.step('Open the user settings and update the data', async ()=> {
      await homePage.menu.myAccountBtn.click();
      await myAccountPage.updateUserSettings(updatedFirstName, updatedLastName, email, phoneNumber);
    });

    await test.step('Validate that the user data is updated in the sidebar', async ()=> {
      await homePage.navigate();
      const fullName = (`${updatedFirstName} ${updatedLastName.charAt(0)}`);
      await expect(homePage.fullName).toContainText(fullName);
    });

    await test.step('Validate that the updated user data is present in "My account"', async ()=> {
      await myAccountPage.navigate();
      await expect(myAccountPage.firstName).toHaveValue(updatedFirstName);
      await expect(myAccountPage.lastName).toHaveValue(updatedLastName);
      await expect(myAccountPage.email).toHaveValue(email);
      await expect(myAccountPage.phone).toHaveValue(phoneNumber);
    });
  });

  test('Should add new bank account', async ({page})=> {
    let newBankName;
    let bankAccountsPage;
    await test.step('Adding a bank account', async ()=> {
      newBankName = faker.company.name();
      let newRoutingNumber = faker.string.numeric(9);
      let newAccountNumber = faker.string.numeric(9);

      await homePage.navigate();
      await homePage.menu.bankAccountsBtn.click();
      bankAccountsPage = new BankAccountsPage(page);
      await bankAccountsPage.createNewBankAcc(newBankName, newRoutingNumber, newAccountNumber);

    });
    await test.step('Validating that the bank account is present in the list', async ()=> {
      await expect(bankAccountsPage.banksList).toContainText(newBankName)
    });
  });

  test('Should delete bank account', async ({page})=> {
    let bankAccountsPage;
    await test.step('Delete bank account', async ()=> {
      await homePage.navigate();
      await homePage.menu.bankAccountsBtn.click();
      bankAccountsPage = new BankAccountsPage(page);

      await bankAccountsPage.deleteBtn.click();
    });

    await test.step('Validate that the account is deleted', async ()=> {
      await expect(bankAccountsPage.banksList).toContainText(`${bankName} (Deleted)`)
    });
  });
});