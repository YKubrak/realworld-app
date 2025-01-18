import BasePage from "./BasePage.mjs";


export default class SignUpPage extends BasePage {
  constructor(page) {
    super(page, '/signup');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.signupBtn = page.locator('button[type="submit"]');
  }

  async fillSignupForm(username, password, firstName, lastName) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.signupBtn.click();
  }

  async signUp(username, password, firstName, lastName) {
    await this.fillSignupForm(username, password, firstName, lastName);
    await this.signupBtn.click();
  }
}