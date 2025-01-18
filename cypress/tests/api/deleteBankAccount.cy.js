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
  });

  it('Deletes a bank account', () => {
    cy.loginByApi(username, password)
      .then((response) => {
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.have.property('id');
        userId = response.body.user.id;

        cy.createBankAccByApi(userId, bankName, accountNumber, routingNumber)
          .then(response => {
          expect(response.body.data.createBankAccount).to.have.property('id');
          accountId = response.body.data.createBankAccount.id;

          cy.deleteBankAccByApi(accountId)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.data).to.contain({deleteBankAccount:true});
            })
          })
      });
  });
});