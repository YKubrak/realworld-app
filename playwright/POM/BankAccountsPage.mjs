import BasePage from "./BasePage.mjs";


export default class BankAccountsPage extends BasePage {
  constructor(page) {
    super(page, '/bankaccounts');
    this.createBtn = page.locator('[data-test="bankaccount-new"]');
    this.deleteBtn = page.locator('[data-test="bankaccount-delete"]');
    this.banksList = page.locator('[data-test="bankaccount-list"]');
    this.bankAccInput = page.locator('[id="bankaccount-bankName-input"]');
    this.routingNumberInput = page.locator('[id="bankaccount-routingNumber-input"]');
    this.accNumberInput = page.locator('[id="bankaccount-accountNumber-input"]');
    this.saveBtn = page.locator('[data-test="bankaccount-submit"]');
  }

  async fillNewBankAccForm(bankName, routingNumber, accountNumber) {
    await this.bankAccInput.fill(bankName);
    await this.routingNumberInput.fill(routingNumber);
    await this.accNumberInput.fill(accountNumber);
  }
  async createNewBankAcc(bankName, routingNumber, accountNumber) {
    await this.createBtn.click();
    await this.fillNewBankAccForm(bankName, routingNumber, accountNumber);
    await this.saveBtn.click();
  }
}