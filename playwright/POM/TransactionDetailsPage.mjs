import BasePage from "./BasePage.mjs";


export default class TransactionDetailsPage extends BasePage {
  constructor(page, transactionId) {
    super(page, `/personal/${transactionId}`);
    this.title = page.locator('[data-test="transaction-detail-header"]');
    this.sender = page.locator(`[data-test="transaction-sender-${transactionId}"]`);
    this.transactionType = page.locator(`[data-test="transaction-action-${transactionId}"]`);
    this.reciever = page.locator(`[data-test="transaction-receiver-${transactionId}"]`);
    this.amount = page.locator(`[data-test="transaction-amount-${transactionId}"]`);
    this.likeCount = page.locator(`[data-test="transaction-like-count-${transactionId}"]`);
  }
}