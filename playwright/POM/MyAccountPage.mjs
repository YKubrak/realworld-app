import BasePage from "./BasePage.mjs";


export default class MyAccountPage extends BasePage {
  constructor(page) {
    super(page, '/user/settings');
    this.firstName = page.locator('[data-test="user-settings-firstName-input"]');
    this.lastName = page.locator('[data-test="user-settings-lastName-input"]');
    this.email = page.locator('[data-test="user-settings-email-input"]');
    this.phone = page.locator('[data-test="user-settings-phoneNumber-input"]');
    this.submitBtn = page.locator('[data-test="user-settings-submit"]');
  }

  async fillUserSettingsForm(firstName, lastName, email, phoneNumber) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.phone.fill(phoneNumber);

  }
  async updateUserSettings(firstName, lastName, email, phoneNumber) {
    await this.fillUserSettingsForm(firstName, lastName, email, phoneNumber);
    await this.submitBtn.click();
  }
}