import { test, expect } from '@playwright/test';
import SignInPage from "../../POM/SignInPage.mjs";
import HomePage from "../../POM/HomePage.mjs";
import MyTransactionsPage from "../../POM/MyTransactionsPage.mjs";
import TransactionDetailsPage from "../../POM/TransactionDetailsPage.mjs";
import { TEST_DATA } from "../../dict/testData.mjs";

test.describe('Correct data can be seen in the app', ()=> {
  let signInPage;
  let homePage;
  let myTransactionsPage;
  let transactionDetailsPage;
  const username = TEST_DATA.testuser.username;
  const password = TEST_DATA.testuser.password;
  const firstname = TEST_DATA.testuser.firstname;
  const lastname = TEST_DATA.testuser.lastname;
  const transactionId = TEST_DATA.testuser.transactionExample.transactionId;
  const transactionPath = TEST_DATA.testuser.transactionExample.payment;
  const transactionAmount= TEST_DATA.testuser.transactionExample.transactionAmount;
  const transactionLikeCount = TEST_DATA.testuser.transactionExample.transactionLikeCount;
  const senderName = TEST_DATA.testuser.transactionExample.senderName;

  test.beforeEach(async ({page})=> {
    signInPage = new SignInPage(page);
    await signInPage.navigate();
    await signInPage.signIn(username, password);
    homePage = new HomePage(page);
  });

  test('Should see account details', async ({page})=> {
    const fullName = (`${firstname} ${lastname.charAt(0)}`);

    await test.step('Validate account details can be seen',async () =>{
      await expect(homePage.fullName).toContainText(fullName);
      await expect(homePage.username).toContainText(username);
    });
  });

  test('Should see account balance', async ({page})=> {
    const currentBalance = TEST_DATA.testuser.balance;
    const balanceString = "Account Balance";

    await test.step('Validate account balance can be seen',async () =>{
      await expect(homePage.amountBalance).toContainText(currentBalance);
      await expect(homePage.balanceString).toContainText(balanceString);
    });
  });

  test('Should see account transactions history', async ({page})=> {
    await test.step('Open the personal transactions history', async () =>{
      await homePage.myTransactionBtn.click();
      myTransactionsPage = new MyTransactionsPage(page);
      await myTransactionsPage.waitLoaded();
    });

    await test.step('Validate transactions history can be seen',async () =>{
      await myTransactionsPage.trasactionList.isVisible();
      await expect(page.locator(`[data-test="transaction-item-${transactionId}"]`))
        .toContainText(`Payment: ${transactionPath}`);
    });
  });

  test('Should see account transaction details', async ({page})=> {
    const recieverName = TEST_DATA.testuser.transactionExample.recieverName;

    await test.step('Open the personal transactions history and click on transaction', async () =>{
      await homePage.myTransactionBtn.click();
      myTransactionsPage = new MyTransactionsPage(page);
      await myTransactionsPage.waitLoaded();
      await myTransactionsPage.openTransaction(transactionId);
    });

    await test.step('Validate transaction details can be seen',async () =>{
      transactionDetailsPage = new TransactionDetailsPage(page, transactionId);
      await expect(transactionDetailsPage.title)
        .toContainText("Transaction Detail");
      await expect(transactionDetailsPage.sender)
        .toContainText(senderName);
      await expect(transactionDetailsPage.transactionType)
        .toContainText(" paid ");
      await expect(transactionDetailsPage.reciever)
        .toContainText(recieverName);
      await expect(transactionDetailsPage.amount)
        .toContainText(transactionAmount);
      await expect(transactionDetailsPage.likeCount)
        .toContainText(transactionLikeCount);
    });
  });
});