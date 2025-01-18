import { faker } from "@faker-js/faker";

describe('Creating a comment for a transaction', () => {

  const senderFirstName = faker.person.firstName();
  const senderLastName = faker.person.lastName();
  const senderUsername = faker.internet.userName();
  const senderPassword = faker.internet.password();

  const recipientFirstName = faker.person.firstName();
  const recipientLastName = faker.person.lastName();
  const recipientUsername = faker.internet.userName();
  const recipientPassword = faker.internet.password();

  before(function () {
    cy.signupByApi(senderFirstName, senderLastName, senderUsername, senderPassword);
  });

  it('Create a comment for a transaction', () => {
    const comment = faker.lorem.paragraph();

    cy.signupByApi(recipientFirstName, recipientLastName, recipientUsername, recipientPassword)
      .then(response => {
        cy.loginByApi(senderUsername, senderPassword)
          .then((response) => {
          expect(response.body).to.have.property('user');
          expect(response.body.user).to.have.property('id');
        });

        cy.createTransactionByApi(
          "payment",
          100,
          "Test of comments",
          `${response.body.user.id}`,
        )
          .then(response => {
            const transactionId = response.body.transaction.id;

            cy.addCommentToTransaction(transactionId, comment).then((response) => {
              expect(response.status).to.eq(200);
            });

            cy.api("GET", `${Cypress.env("apiUrl")}/comments/${transactionId}`).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.comments[0].content).to.contain(comment);
            });
          });
      });
  });
});