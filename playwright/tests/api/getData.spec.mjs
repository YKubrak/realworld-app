import { test, expect } from '@playwright/test';

test.describe("Api tests for getting data", () => {
  const loginCredentials = {
    data: {
      "type":"LOGIN",
      "username":"Zelma9",
      "password":"s3cret"
    }
  };

  test.beforeEach(async ({request}) => {
    const login = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/login`,loginCredentials);
    expect(login.status()).toEqual(200);
  })

  test("Gets a list of bank accounts for user", async ({request}) => {
    let bankAccount;
    const expectedAccountList = [
      {
        id: 'uzu-v-QUqN8',
        uuid: 'ee93164a-a452-4833-83bb-e1e7b7174c5d',
        userId: 'AMuFaCffm',
        bankName: 'Murray, Rice and Willms Bank',
        accountNumber: '4456034548',
        routingNumber: '242513221',
        isDeleted: false,
        createdAt: '2024-03-05T19:00:49.170Z',
        modifiedAt: '2024-10-27T19:56:02.328Z'
      }
    ];

    await test.step('Send a request get request for a list of bank accounts', async () => {
      const bankRequest = {
        data: {
          "operationName":"ListBankAccount","query":"\n  query ListBankAccount {\n    listBankAccount {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n      modifiedAt\n    }\n  }\n"
        }
      };
      const response = await request.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/graphql`, bankRequest);
      bankAccount = await response.json();
    });

    await test.step('Validate the bank data is correct', async () => {
      expect(bankAccount.data.listBankAccount).toEqual(expectedAccountList);
    });
  });

  test('Get a user profile by username', async ({request})=> {
    let userProfile;
    const expectedProfile = [
        {
          "id": "tWjDPFBJcY",
          "uuid": "2dc479e6-f777-4152-b7b9-89d21205f681",
          "firstName": "Chasity",
          "lastName": "Prosacco",
          "username": "Leora_Lesch73",
          "password": "$2a$10$oLUtAz9e1X99g5.iwwosn.7itemgvuPZGJsY4.NeB7coDk1kNrY.6",
          "email": "Orin_Rowe@gmail.com",
          "phoneNumber": "986-470-1989",
          "avatar": "https://avatars.dicebear.com/api/human/tWjDPFBJcY.svg",
          "defaultPrivacyLevel": "contacts",
          "balance": 128858,
          "createdAt": "2024-06-28T03:23:45.295Z",
          "modifiedAt": "2024-10-27T21:55:03.498Z"
        }
      ];

    await test.step('Search for a profile by username', async () => {
      const response = await request.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/users/search?q=Leora_Lesch73`);
      userProfile = await response.json();
    });

    await test.step('Validate the data is correct', async () => {
      expect(userProfile.results).toEqual(expectedProfile);
    });
  });

  test('Gets list of users', async ({request})=> {
    let userList;
    const expectedUserList = [
      {
        id: 'ltaTqqaXJw',
        uuid: 'e9121868-205a-473b-8a8a-386891fb7a33',
        firstName: 'Joanny',
        lastName: 'Hayes',
        username: 'Alexandre20',
        password: '$2a$10$oLUtAz9e1X99g5.iwwosn.7itemgvuPZGJsY4.NeB7coDk1kNrY.6',
        email: 'Johnson.Heidenreich@hotmail.com',
        phoneNumber: '619-276-4204',
        avatar: 'https://avatars.dicebear.com/api/human/ltaTqqaXJw.svg',
        defaultPrivacyLevel: 'contacts',
        balance: 191113,
        createdAt: '2024-08-30T14:57:40.011Z',
        modifiedAt: '2024-10-27T18:33:33.368Z'
      },
      {
        id: '4ErOUDeYxp',
        uuid: '171b5ae6-55ab-4d9c-8a9b-48901cc9c633',
        firstName: 'Elinor',
        lastName: 'Flatley',
        username: 'Addie.Mraz45',
        password: '$2a$10$oLUtAz9e1X99g5.iwwosn.7itemgvuPZGJsY4.NeB7coDk1kNrY.6',
        email: 'Kane.Batz@yahoo.com',
        phoneNumber: '698-982-7284',
        avatar: 'https://avatars.dicebear.com/api/human/4ErOUDeYxp.svg',
        defaultPrivacyLevel: 'public',
        balance: 185936,
        createdAt: '2024-04-02T10:36:42.428Z',
        modifiedAt: '2024-10-28T06:04:38.035Z'
      }
    ];

    await test.step('Search for a profile by username', async () => {
      const response = await request.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/users`);
      userList = await response.json();
    });

    await test.step('Validate the data is correct', async () => {
      expect(userList.results).toContainEqual(expectedUserList[0]);
      expect(userList.results).toContainEqual(expectedUserList[1]);
    });
  });
});