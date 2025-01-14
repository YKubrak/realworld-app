import { faker } from "@faker-js/faker";

describe('Should register a new account', () => {
  let firstName, lastName, username, password, bankName, routingNumber, accountNumber;

  before(() => {
  });

  beforeEach(() => {
    firstName = faker.person.firstName();
    lastName = faker.person.lastName();
    username = faker.internet.userName();
    password = faker.internet.password();
    bankName = faker.company.name();
    routingNumber = faker.string.numeric(9);
    accountNumber = faker.string.numeric(9);

    cy.registerAccount(firstName, lastName, username, password);
    cy.login(username, password);
    cy.finishAccountOnboarding(bankName, routingNumber, accountNumber);
    cy.visit('/');
  });

  it('Should update account user settings', function () {
    let updatedFirstName = faker.person.firstName();
    let updatedLastName = faker.person.lastName();
    let fullName = (`${updatedFirstName} ${updatedLastName.charAt(0)}`);
    let email = faker.internet.email();
    let phoneNumber = faker.string.numeric(9);

    cy.getBySel("sidenav-user-settings").click();

    cy.getBySel("user-settings-firstName-input").clear().type(updatedFirstName);
    cy.getBySel("user-settings-lastName-input").clear().type(updatedLastName);
    cy.getBySel("user-settings-email-input").type(email);
    cy.getBySel("user-settings-phoneNumber-input").type(phoneNumber);
    cy.getBySel("user-settings-submit").click();

    cy.getBySel("sidenav-home").click();
    cy.getBySel("sidenav-user-full-name").contains(fullName);

    cy.getBySel("sidenav-user-settings").click();
    cy.getBySel("user-settings-firstName-input").should('have.value', updatedFirstName);
    cy.getBySel("user-settings-lastName-input").should('have.value', updatedLastName);
    cy.getBySel("user-settings-email-input").should('have.value', email);
    cy.getBySel("user-settings-phoneNumber-input").should('have.value', phoneNumber);
  });

  it('Should add new bank account', function () {
    let newBankName = faker.company.name();
    let newRoutingNumber = faker.string.numeric(9);
    let newAccountNumber = faker.string.numeric(9);

    cy.getBySel("sidenav-bankaccounts").click();
    cy.getBySel("bankaccount-new").click();

    cy.getBySel("bankaccount-bankName-input").type(newBankName);
    cy.getBySel("bankaccount-routingNumber-input").type(newRoutingNumber);
    cy.getBySel("bankaccount-accountNumber-input").type(newAccountNumber);
    cy.getBySel("bankaccount-submit").click();

    cy.getBySel("bankaccount-list").contains(newBankName);
  });

  it('Should delete bank account', function () {
    cy.getBySel("sidenav-bankaccounts").click();
    cy.getBySel("bankaccount-delete").click();

    cy.getBySel("bankaccount-list").contains(`${bankName} (Deleted)`);
  });
});