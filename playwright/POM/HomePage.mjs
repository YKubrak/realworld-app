import BasePage from "./BasePage.mjs";
import SideMenuComponent from "./SideMenuComponent.mjs";


export default class HomePage extends BasePage {
  constructor(page) {
    super(page, '/');
    this.fullName = page.locator('[data-test="sidenav-user-full-name"]');
    this.username = page.locator('[data-test="sidenav-username"]');
    this.amountBalance = page.locator('[data-test="sidenav-user-balance"]');
    this.balanceString = page.locator('[data-test="sidenav-user-balance"] + h6');
    this.menu = new SideMenuComponent(page);
    this.transactionList = page.getByTestId("transaction-list");
    this.newTransactionBtn = page.getByTestId("nav-top-new-transaction");
    this.myTransactionBtn = page.locator('[data-test="nav-personal-tab"]');
    this.onboardingNextBtn = page.locator('[data-test="user-onboarding-next"]');
    this.onboardingBankInput = page.locator('[id="bankaccount-bankName-input"]');
    this.onboardingRoutingInput = page.locator('[id="bankaccount-routingNumber-input"]');
    this.onboardingAccountInput = page.locator('[id="bankaccount-accountNumber-input"]');
    this.onboardingSubmitBtn = page.locator('[data-test="bankaccount-submit"]');
  }

  async fillOnboardingForm(bankName, routingNumber, accountNumber){
    await this.onboardingBankInput.fill(bankName);
    await this.onboardingRoutingInput.fill(routingNumber);
    await this.onboardingAccountInput.fill(accountNumber);

  }
  async finishAccOnboarding(bankName, routingNumber, accountNumber) {
    await this.waitLoaded();
    await this.onboardingNextBtn.click();
    await this.fillOnboardingForm(bankName, routingNumber, accountNumber);
    await this.onboardingSubmitBtn.click();
    await this.onboardingNextBtn.click();
  }
}