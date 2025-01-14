import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe("Creating a comment for a transaction", () => {
  let senderId;
  let recipientId;
  let transactionId;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const senderCredentials = {
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
    await test.step('Creating a recipient account', async () => {
      const recipientFirstName = faker.person.firstName();
      const recipientLastName = faker.person.lastName();
      const recipientUsername = faker.internet.userName();
      const recipientPassword = faker.internet.password();
      const recipientCredentials = {
        data: {
          "firstname":`${recipientFirstName}`,
          "lastname":`${recipientLastName}`,
          "username":`${recipientUsername}`,
          "password":`${recipientPassword}`,
          "confirmPassword":`${recipientPassword}`
        }
      };

      const signUp = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/users`,recipientCredentials);
      const accountData = await signUp.json();
      recipientId = accountData.user.id;
      expect(signUp.status()).toEqual(201);
    });

    await test.step('Creating a sender account', async () => {
      const signUp = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/users`,senderCredentials);
      const accountData = await signUp.json();
      senderId = accountData.user.id;
      expect(signUp.status()).toEqual(201);
    });

    await test.step('Login into account', async () => {
      const login = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/login`,loginCredentials);
      const loginData = await login.json();
      senderId = loginData.user.id;
      expect(login.status()).toEqual(200);
    });

    await test.step('Create a transaction', async () => {
      const transactionRequest = {
        data: {
          "transactionType": "payment",
          "amount": "100",
          "description": "Test of comments",
          "senderId": `${senderId}`,
          "receiverId": `${recipientId}`,
        }
      };

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/transactions`, transactionRequest);
      const newTransaction  = await response.json();
      transactionId = newTransaction.transaction.id;
    })
  });

  test('Create a comment for an existing transaction', async ({request}) => {
    const comment = faker.lorem.paragraph();

    await test.step('Add a comment to the transaction', async () => {
      const commentRequest = {
        data: {
          "transactionId":`${transactionId}`,
          "content":`${comment}`
        }
      };

      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/comments/${transactionId}`, commentRequest);
      expect(response.status()).toEqual(200);
    });

    await test.step('Get a transaction and validate that the comment is present', async () => {
      const expectedComment = {
        "id": expect.any(String),
        "uuid": expect.any(String),
        "content": `${comment}`,
        "userId": `${senderId}`,
        "transactionId": `${transactionId}`,
        "createdAt": expect.any(String),
        "modifiedAt": expect.any(String)
      };

      const response = await request.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/comments/${transactionId}`);
      expect(response.status()).toEqual(200);
      const transaction = await response.json();
      expect(transaction.comments).toContainEqual(expectedComment);
    });
  });
});