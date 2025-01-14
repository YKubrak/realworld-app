import { faker } from "@faker-js/faker";

describe('Should register a new account', () => {
  let firstName, lastName, username, password;

  before(() => {
     firstName = faker.person.firstName();
     lastName = faker.person.lastName();
     username = faker.internet.userName();
     password = faker.internet.password();
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('Should create an account', function () {
    cy.registerAccount(firstName, lastName, username, password);
    cy.login(username, password);
    cy.get('[data-test=sidenav-username]').should('exist').contains(username);
  });
});