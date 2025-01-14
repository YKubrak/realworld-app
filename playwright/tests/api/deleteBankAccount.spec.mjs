import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

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
  const accCredentials = {
    data: {
      "firstname":`${firstName}`,
      "lastname":`${lastName}`,
      "username":`${username}`,
      "password":`${password}`,
      "confirmPassword":`${password}`
    }
  };
  const loginCredentials = {
    data: {
      "type":"LOGIN",
      "username":`${username}`,
      "password":`${password}`
    }
  };

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
      const bankRequest = {
        data: {
          "operationName":"CreateBankAccount",
          "query":"\n  mutation CreateBankAccount($bankName: String!, $accountNumber: String!, $routingNumber: String!) {\n    createBankAccount(\n      bankName: $bankName\n      accountNumber: $accountNumber\n      routingNumber: $routingNumber\n    ) {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n    }\n  }\n",
          "variables":{
            "userId":`${userId}`,
            "bankName":`${bankName}`,
            "accountNumber":`${accountNumber}`,
            "routingNumber":`${routingNumber}`
          }
        }
      };

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/graphql`, bankRequest);
      bankAccount = await response.json();
      accountId = bankAccount.data.createBankAccount.id;
    });
  });

  test("Deletes a bank account", async ({request}) => {
    await test.step('Deletes a bank account assigned to the account', async () => {
      const deleteRequest = {
        data: {
          "operationName":"DeleteBankAccount",
          "query":"\n  mutation DeleteBankAccount($id: ID!) {\n    deleteBankAccount(id: $id)\n  }\n",
          "variables":{
            "id":`${accountId}`,
          }
        }
      };

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
      const bankListRequest = {
        data: {
          "operationName":"ListBankAccount",
          "query":"\n  query ListBankAccount {\n    listBankAccount {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n      modifiedAt\n    }\n  }\n"
        }
      };

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/graphql`, bankListRequest);
      expect(response.status()).toEqual(200);
      const bankAccountList = await response.json();
      expect(bankAccountList.data.listBankAccount).toContainEqual(expectedAccountList);
    });
  });
});