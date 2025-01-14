import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Create a new account', ()=> {
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

    await page.goto('/signup');
    await page.locator('input[name="firstName"]').fill(firstName);
    await page.locator('input[name="lastName"]').fill(lastName);
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('[data-test="signup-submit"]').click();
    await page.waitForURL('/signin');

    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('[data-test="signin-submit"]').click();
    await page.waitForURL('/');
    await page.locator('[data-test="user-onboarding-next"]').click();
    await page.locator('[id="bankaccount-bankName-input"]').fill(bankName);
    await page.locator('[id="bankaccount-routingNumber-input"]').fill(routingNumber);
    await page.locator('[id="bankaccount-accountNumber-input"]').fill(accountNumber);
    await page.locator('[data-test="bankaccount-submit"]').click()
    await page.locator('[data-test="user-onboarding-next"]').click();
    await page.waitForURL('/');
  })

  test('Should update account user settings', async ({page})=> {
    // Creating new data to update user settings
    let updatedFirstName = faker.person.firstName();
    let updatedLastName = faker.person.lastName();
    let email = faker.internet.email();
    let phoneNumber = faker.string.numeric(9);

    await test.step('Open the user settings and update the data', async ()=> {
      await page.locator('[data-test="sidenav-user-settings"]').click();
      await page.waitForURL('/user/settings');

      await page.locator('[data-test="user-settings-firstName-input"]').fill(updatedFirstName);
      await page.locator('[data-test="user-settings-lastName-input"]').fill(updatedLastName);
      await page.locator('[data-test="user-settings-email-input"]').fill(email);
      await page.locator('[data-test="user-settings-phoneNumber-input"]').fill(phoneNumber);
      await page.locator('[data-test="user-settings-submit"]').click();
    });

    await test.step('Validate that the user data is updated in the sidebar', async ()=> {
      await page.locator('[data-test="sidenav-home"]').click();
      const fullName = (`${updatedFirstName} ${updatedLastName.charAt(0)}`);
      await expect(page.locator('[data-test="sidenav-user-full-name"]')).toContainText(fullName);
    });

    await test.step('Validate that the updated user data is present in "My account"', async ()=> {
      await page.locator('[data-test="sidenav-user-settings"]').click();
      await expect(page.locator('[data-test="user-settings-firstName-input"]')).toHaveValue(updatedFirstName);
      await expect(page.locator('[data-test="user-settings-lastName-input"]')).toHaveValue(updatedLastName);
      await expect(page.locator('[data-test="user-settings-email-input"]')).toHaveValue(email);
      await expect(page.locator('[data-test="user-settings-phoneNumber-input"]')).toHaveValue(phoneNumber);
    });
  });

  test('Should add new bank account', async ({page})=> {
    let newBankName;
    await test.step('Adding a bank account', async ()=> {
      newBankName = faker.company.name();
      let newRoutingNumber = faker.string.numeric(9);
      let newAccountNumber = faker.string.numeric(9);

      await page.locator('[data-test="sidenav-bankaccounts"]').click();
      await page.waitForURL('/bankaccounts');

      await page.locator('[data-test="bankaccount-new"]').click();
      await page.waitForURL('bankaccounts/new');
      await page.locator('[id="bankaccount-bankName-input"]').fill(newBankName);
      await page.locator('[id="bankaccount-routingNumber-input"]').fill(newRoutingNumber);
      await page.locator('[id="bankaccount-accountNumber-input"]').fill(newAccountNumber);
      await page.locator('[data-test="bankaccount-submit"]').click();
    });
    await test.step('Validating that the bank account is present in the list', async ()=> {
      await expect(page.locator('[data-test="bankaccount-list"]')).toContainText(newBankName)
    });
  });

  test('Should delete bank account', async ({page})=> {
    await test.step('Delete bank account', async ()=> {
      await page.locator('[data-test="sidenav-bankaccounts"]').click();
      await page.waitForURL('/bankaccounts');
      await page.locator('[data-test="bankaccount-delete"]').click();
    });

    await test.step('Validate that the account is deleted', async ()=> {
      await expect(page.locator('[data-test="bankaccount-list"]')).toContainText(`${bankName} (Deleted)`)
    });
  });
});