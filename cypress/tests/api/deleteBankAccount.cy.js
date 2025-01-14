import { faker } from "@faker-js/faker";

describe('Deleting a bank account', () => {
  let userId;
  let accountId;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const bankName = faker.company.name();
  const accountNumber = faker.string.numeric(9);
  const routingNumber = faker.string.numeric(9);

  before(() => {
    cy.signupByApi(firstName, lastName, username, password);
    cy.loginByApi(username, password).then((response) => {
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('id');
      userId = response.body.user.id;
    });

    cy.api("POST", `${Cypress.env("apiUrl")}/graphql`, {
        "operationName":"CreateBankAccount",
        "query":"\n  mutation CreateBankAccount($bankName: String!, $accountNumber: String!, $routingNumber: String!) {\n    createBankAccount(\n      bankName: $bankName\n      accountNumber: $accountNumber\n      routingNumber: $routingNumber\n    ) {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n    }\n  }\n",
        "variables":{
          "userId":`${userId}`,
          "bankName":`${bankName}`,
          "accountNumber":`${accountNumber}`,
          "routingNumber":`${routingNumber}`
        }
      },
    ).then(response => {
      expect(response.body.data.createBankAccount).to.have.property('id');
      accountId = response.body.data.createBankAccount.id;
    });

  });

  it('Deletes a bank account', () => {
    cy.api("POST", `${Cypress.env("apiUrl")}/graphql`, {
      "operationName":"DeleteBankAccount",
      "query":"\n  mutation DeleteBankAccount($id: ID!) {\n    deleteBankAccount(id: $id)\n  }\n",
      "variables":{
        "id":`${accountId}`
      }
    }
    ).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.contain({deleteBankAccount:true});
    })
  });
});