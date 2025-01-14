describe('Should log in with existing account', () => {
  let users;

  before(() => {
    cy.fixture('users').then(data => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.login(users.testuser.username, users.testuser.password);
  });

  it('Should see account details', function () {
    cy.get('[data-test=sidenav-username]').should('exist')
      .contains(users.testuser.username);
    cy.get('[data-test=sidenav-user-full-name]').should('exist')
      .contains(users.testuser.fullname);
  });

  it('Should see account balance', function () {
    cy.get('[data-test=sidenav-user-balance]').should('exist')
      .contains(users.testuser.balance);
  });

  it('Should see account transactions history', function () {
    cy.intercept("GET", "/transactions").as("openTransactions");
    cy.get('[data-test=nav-personal-tab]').click();
    cy.wait("@openTransactions")

    cy.get(`[data-test=transaction-item-${users.testuser.transactionExample.transactionId}]`)
      .should('exist')
      .contains(users.testuser.transactionExample.payment)
  });

  it('Should see account transactions details', function () {
    cy.intercept("GET", "/transactions").as("openTransactions");
    cy.get('[data-test=nav-personal-tab]').click();
    cy.wait("@openTransactions")

    cy.get(`[data-test=transaction-item-${users.testuser.transactionExample.transactionId}]`)
      .should('exist')
      .click();

    cy.get(`[data-test=transaction-detail-header]`)
      .should('exist')
      .contains("Transaction Detail");
    cy.get(`[data-test=transaction-sender-${users.testuser.transactionExample.transactionId}]`)
      .should('exist')
      .contains(users.testuser.transactionExample.senderName);
    cy.get(`[data-test=transaction-action-${users.testuser.transactionExample.transactionId}]`)
      .should('exist')
      .contains(users.testuser.transactionExample.transactionType);
    cy.get(`[data-test=transaction-receiver-${users.testuser.transactionExample.transactionId}]`)
      .should('exist')
      .contains(users.testuser.transactionExample.recieverName);
    cy.get(`[data-test=transaction-amount-${users.testuser.transactionExample.transactionId}]`)
      .should('exist')
      .contains(users.testuser.transactionExample.transactionAmount);
    cy.get(`[data-test=transaction-like-count-${users.testuser.transactionExample.transactionId}]`)
      .should('exist')
      .contains(users.testuser.transactionExample.transactionLikeCount);
  });
})