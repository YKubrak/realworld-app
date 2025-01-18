import BasePage from "./BasePage.mjs";


export default class SignInPage extends BasePage {
  constructor(page) {
    super(page, '/signin');
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.signinBtn = page.locator('button[type="submit"]');
  }

  async fillLoginForm(login, password) {
    await this.usernameInput.fill(login);
    await this.passwordInput.fill(password);
  }

  async signIn(login, password) {
    await this.fillLoginForm(login, password);
    await this.signinBtn.click();
  }
}