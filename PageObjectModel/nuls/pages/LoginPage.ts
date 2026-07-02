import { expect, Locator, Page } from "@playwright/test";
import { LoginPageLocators } from "../locator/login.locators";
import chalk from "chalk";

export class LoginPage {
  private readonly page: Page;
  private readonly emailAddressInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailAddressInput = this.page.locator(LoginPageLocators.EMAIL_INPUT);
    this.passwordInput = this.page.locator(LoginPageLocators.PASSWORD_INPUT);
    this.loginButton = this.page.locator(LoginPageLocators.LOGIN_BUTTON);
  }

  async navigateToLoginPage() {
    const webUrl = process.env.WEB_URL as string;
    try {
      if (!webUrl) {
        throw new Error("WEB_URL is not set");
      }
        await this.page.goto(webUrl);
        console.log(chalk.green(`✔ Navigated to ${webUrl}`));

    } catch (error) {
        console.error(chalk.red(`Error in navigateToLoginPage: ${error}`));
        throw error;
    }
  }

  async inputEmailAddress() {
    const emailAddress = process.env.EMAIL_ADDRESS as string;

    try {
      if (!emailAddress) {
        throw new Error("EMAIL_ADDRESS is not set");
      }

      await this.fillEmailAddress(emailAddress);

      console.log(chalk.green("✔ Email input successful"));

    } catch (error) {
      console.error(chalk.red(`Error in inputEmailAddress: ${error}`));
      throw error;
    }
  }

  async inputUserEmailAddress() {
    const emailAddress = process.env.USER_EMAIL_ADDRESS as string;

    try {
      if (!emailAddress) {
        throw new Error("USER_EMAIL_ADDRESS is not set");
      }

      await this.fillEmailAddress(emailAddress);

      console.log(chalk.green("✔ User email input successful"));
    } catch (error) {
      console.error(chalk.red(`Error in inputUserEmailAddress: ${error}`));
      throw error;
    }
  }

  async fillEmailAddress(emailAddress: string, assertValue = true) {
    await expect(this.emailAddressInput).toBeVisible();
    await expect(this.emailAddressInput).toBeEnabled();

    await this.emailAddressInput.fill(emailAddress);

    if (assertValue) {
      await expect(this.emailAddressInput).toHaveValue(emailAddress);
    }
  }

  async inputPassword() {
    const password = process.env.PASSWORD as string;

    try {
      if (!password) {
        throw new Error("PASSWORD is not set");
      }

      await this.fillPassword(password);

      console.log(chalk.green("✔ Password input successful"));

    } catch (error) {
      console.error(chalk.red(`Error in inputPassword: ${error}`));
      throw error;
    }
  }

  async inputUserPassword() {
    const password = (process.env.USER_PASSWORD ?? process.env.PASSWORD) as string;

    try {
      if (!password) {
        throw new Error("USER_PASSWORD or PASSWORD is not set");
      }

      await this.fillPassword(password);

      console.log(chalk.green("✔ User password input successful"));
    } catch (error) {
      console.error(chalk.red(`Error in inputUserPassword: ${error}`));
      throw error;
    }
  }

  async fillPassword(password: string, assertValue = true) {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();

    await this.passwordInput.fill(password);

    if (assertValue) {
      await expect(this.passwordInput).toHaveValue(password);
    }
  }

  async clickLoginButton() {
    try {
      await expect(this.loginButton).toBeVisible();
      await expect(this.loginButton).toBeEnabled();
      await expect(this.loginButton).toHaveText(/Login/i);

      await this.loginButton.click();

      console.log(chalk.green("✔ Login button clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in clickLoginButton: ${error}`));
      throw error;
    }
  }

  async doubleClickLoginButton() {
    try {
      await expect(this.loginButton).toBeVisible();
      await expect(this.loginButton).toBeEnabled();
      await expect(this.loginButton).toHaveText(/Login/i);

      await this.loginButton.dblclick();

      console.log(chalk.green("✔ Login button double-clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in doubleClickLoginButton: ${error}`));
      throw error;
    }
  }

  get emailField() {
    return this.emailAddressInput;
  }

  get passwordField() {
    return this.passwordInput;
  }

  get submitButton() {
    return this.loginButton;
  }

  async testFinalLoginPage() {
    try {
      await this.inputEmailAddress();
      await this.inputPassword();
      await this.clickLoginButton();

      await this.page.waitForLoadState("networkidle");

      console.log(chalk.blue("✔ Login flow completed"));

    } catch (error) {
      console.error(chalk.red(`Login flow failed: ${error}`));
      throw error;
    }
  }
}