import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import NewAccountModel from "../../models/graphql/NewAccountModel.mjs";
import LoginModel from "../../models/graphql/LoginModel.mjs";
import CreateBankAccModel from "../../models/graphql/CreateBankAccModel.mjs";
import DeleteBankAccModel from "../../models/graphql/DeleteBankAccModel.mjs";
import GetBankAccListModel from "../../models/graphql/GetBankAccListModel.mjs";

test.describe("Deleting data", () => {
  let userId;
  let bankAccount;
  let accountId;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const bankName = faker.company.name();
  const accountNumber = faker.string.numeric(9);
  const routingNumber = faker.string.numeric(9);

  const accCredentials = new NewAccountModel(firstName, lastName, username, password);
  const loginCredentials = new LoginModel(username, password);

  test.beforeEach(async ({request}) => {
    await test.step('Creating an account', async () => {
      const signUp = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/users`,accCredentials);
      expect(signUp.status()).toEqual(201);
    });

    await test.step('Login into account', async () => {
      const login = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/login`,loginCredentials);
      const loginData = await login.json();
      userId = loginData.user.id;
      expect(login.status()).toEqual(200);
    });

    await test.step('Add a bank account', async () => {
      const bankRequest = new CreateBankAccModel(userId, bankName, accountNumber, routingNumber);

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/graphql`, bankRequest);
      bankAccount = await response.json();
      accountId = bankAccount.data.createBankAccount.id;
    });
  });

  test("Deletes a bank account", async ({request}) => {
    await test.step('Deletes a bank account assigned to the account', async () => {
      const deleteRequest = new DeleteBankAccModel(accountId);

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/graphql`, deleteRequest);
      expect(response.status()).toEqual(200);
      bankAccount = await response.json();
      expect(bankAccount.data).toEqual({deleteBankAccount:true});
    });

    await test.step('Query the DB, to check if isDeleted flag is true for deleted bank account', async () => {
      const expectedAccountList = {
        "accountNumber": `${accountNumber}`,
        "bankName": `${bankName}`,
        "createdAt": expect.any(String),
        "id": `${accountId}`,
        "isDeleted": true,
        "modifiedAt": expect.any(String),
        "routingNumber": `${routingNumber}`,
        "userId": `${userId}`,
        "uuid": expect.any(String)
      };
      const bankListRequest = new GetBankAccListModel();

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/graphql`, bankListRequest);
      expect(response.status()).toEqual(200);
      const bankAccountList = await response.json();
      expect(bankAccountList.data.listBankAccount).toContainEqual(expectedAccountList);
    });
  });
});