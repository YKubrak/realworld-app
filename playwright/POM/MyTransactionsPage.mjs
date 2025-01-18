import BasePage from "./BasePage.mjs";


export default class MyTransactionsPage extends BasePage {
  constructor(page) {
    super(page, '/personal');
    this.trasactionList = page.locator('[data-test="transaction-list"]');
  }
  async openTransaction(transactionId) {
    await this.page.locator(`[data-test="transaction-item-${transactionId}"]`).click();
    await this.page.waitForURL(`/transaction/${transactionId}`);
  }
}