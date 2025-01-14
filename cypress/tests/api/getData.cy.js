describe('Api tests for getting data', () => {
  let users;

  before(() => {
    cy.fixture('users').then(data => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.loginByApi(users.testuser.username, users.testuser.password);
  });

  it('Gets a list of bank accounts for user', () => {
    const bankRequest = {
        "operationName":"ListBankAccount","query":"\n  query ListBankAccount {\n    listBankAccount {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n      modifiedAt\n    }\n  }\n"
      };
    cy.api({
      method: 'POST',
      url: `${Cypress.env("apiUrl")}/graphql`,
      body: bankRequest
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.data.listBankAccount[0]).to.deep.equal(users.testuser.bankAccount);
    });
  });

  it('Get a user profile by username', () => {
    cy.api({
      method: 'GET',
      url: `${Cypress.env("apiUrl")}/users/search?q=${users.testuser.getUser.username}`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.results[0]).to.deep.equal(users.testuser.getUser);
    });
  });

  it('Gets list of users', () => {
    cy.api({
      method: 'GET',
      url: `${Cypress.env("apiUrl")}/users`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.results).to.deep.include.members(users.testuser.listOfUsers);
    });
  });
});