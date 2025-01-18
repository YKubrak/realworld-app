import { test, expect } from '@playwright/test'
import LoginModel from "../../models/graphql/LoginModel.mjs";
import GetBankAccListModel from "../../models/graphql/GetBankAccListModel.mjs";
import { TEST_DATA } from "../../dict/testData.mjs";

test.describe("Api tests for getting data", () => {
  const loginCredentials = new LoginModel(TEST_DATA.testuser.username, TEST_DATA.testuser.password);

  test.beforeEach(async ({request}) => {
    const login = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/login`,loginCredentials);
    expect(login.status()).toEqual(200);
  })

  test("Gets a list of bank accounts for user", async ({request}) => {
    let bankAccount;
    const expectedAccountList = [TEST_DATA.testuser.bankAccount];

    await test.step('Send a get request for a list of bank accounts', async () => {
      const bankRequest = new GetBankAccListModel();

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/graphql`, bankRequest);
      bankAccount = await response.json();
    });

    await test.step('Validate the bank data is correct', async () => {
      expect(bankAccount.data.listBankAccount).toContainEqual(expectedAccountList[0]);
    });
  });

  test('Get a user profile by username', async ({request})=> {
    let userProfile;
    const expectedProfile = [TEST_DATA.testuser.getUser];

    await test.step('Search for a profile by username', async () => {
      const response = await request.get(
        `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/users/search?q=${TEST_DATA.testuser.getUser.username}`
      );
      userProfile = await response.json();
    });

    await test.step('Validate the data is correct', async () => {
      expect(userProfile.results).toContainEqual(expectedProfile[0]);
    });
  });

  test('Gets list of users', async ({request})=> {
    let userList;
    const expectedUserList = TEST_DATA.testuser.listOfUsers;

    await test.step('Search for a profile by username', async () => {
      const response = await request.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/users`);
      userList = await response.json();
    });

    await test.step('Validate the data is correct', async () => {
      expect(userList.results[0]).toEqual(expectedUserList[0]);
      expect(userList.results[1]).toEqual(expectedUserList[1]);
    });
  });
});