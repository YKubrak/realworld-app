import BaseComponent from "./BaseComponent.mjs";

export default class SideMenuComponent extends BaseComponent {
  constructor(page) {
    super(page);
    this.homeBtn = page.locator('[data-test="sidenav-home"]');
    this.myAccountBtn = page.locator('[data-test="sidenav-user-settings"]');
    this.bankAccountsBtn = page.locator('[data-test="sidenav-bankaccounts"]');
    this.notificationsBtn = page.getByTestId("sidenav-notifications");
    this.logoutBtn = page.getByTestId("sidenav-signout");
  }
}