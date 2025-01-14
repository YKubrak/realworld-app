import { test, expect } from '@playwright/test';

test.describe('Correct data can be seen in the app', ()=> {
  const username = "Zelma9";
  const password = "s3cret";
  const firstname = "Katelin";
  const lastname = "Herzog";

  test.beforeEach(async ({page})=> {
    await page.goto('/signin');
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('[data-test="signin-submit"]').click()
    await page.waitForURL('/');
  });

  test('Should see account details', async ({page})=> {
    const fullName = (`${firstname} ${lastname.charAt(0)}`);

    await test.step('Validate account details can be seen',async () =>{
      await expect(page.locator('[data-test="sidenav-user-full-name"]')).toContainText(fullName);
      await expect(page.locator('[data-test="sidenav-username"]')).toContainText(username);
    });
  });

  test('Should see account balance', async ({page})=> {
    const currentBalance = "$1,878.12";
    const balanceString = "Account Balance";

    await test.step('Validate account balance can be seen',async () =>{
      await expect(page.locator('[data-test="sidenav-user-balance"]')).toContainText(currentBalance);
      await expect(page.locator('[data-test="sidenav-user-balance"] + h6')).toContainText(balanceString);
    });
  });

  test('Should see account transactions history', async ({page})=> {
    const exampleTransaction= "Payment: mhKmSKllAl to AMuFaCffm";

    await test.step('Open the personal transactions history', async () =>{
      await page.locator('[data-test="nav-personal-tab"]').click();
      await page.waitForURL('/personal');
    });

    await test.step('Validate transactions history can be seen',async () =>{
      await page.locator('[data-test="transaction-list"]').isVisible();
      await expect(page.locator('[data-test="transaction-item-PDdAUKgMr35"]'))
        .toContainText(exampleTransaction);
    });
  });

  test('Should see account transaction details', async ({page})=> {
    const transactionId = "PDdAUKgMr35";
    const transactionAmount= "-$62.48"
    const transactionLikeCount = "0";
    const senderName = "Marisol Bins";
    const recieverName = `${firstname} ${lastname}`;

    await test.step('Open the personal transactions history and click on transaction', async () =>{
      await page.locator('[data-test="nav-personal-tab"]').click();
      await page.waitForURL('/personal');
      await page.locator(`[data-test="transaction-item-${transactionId}"]`).click();
      await page.waitForURL(`/transaction/${transactionId}`);
    });

    await test.step('Validate transaction details can be seen',async () =>{
      await expect(page.locator('[data-test="transaction-detail-header"]'))
        .toContainText("Transaction Detail");
      await expect(page.locator(`[data-test="transaction-sender-${transactionId}"]`))
        .toContainText(senderName);
      await expect(page.locator(`[data-test="transaction-action-${transactionId}"]`))
        .toContainText(" paid ");
      await expect(page.locator(`[data-test="transaction-receiver-${transactionId}"]`))
        .toContainText(recieverName);
      await expect(page.locator(`[data-test="transaction-amount-${transactionId}"]`))
        .toContainText(transactionAmount);
      await expect(page.locator(`[data-test="transaction-like-count-${transactionId}"]`))
        .toContainText(transactionLikeCount);
    });
  });
});