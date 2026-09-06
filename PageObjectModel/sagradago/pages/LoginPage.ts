import { expect, Locator, Page } from "@playwright/test";
import { LoginPageLocators } from "../locator/login.locators";
import { getEnv, getSagradaGoUrl } from "../utils/env";
import { gotoApp } from "../utils/navigation";
import chalk from "chalk";

export class LoginPage {
  private readonly page: Page;
  private readonly signInHeaderButton: Locator;
  private readonly emailAddressInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly profilePic: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInHeaderButton = this.page.locator(LoginPageLocators.SIGN_IN_HEADER_BUTTON);
    this.emailAddressInput = this.page.locator(LoginPageLocators.EMAIL_INPUT);
    this.passwordInput = this.page.locator(LoginPageLocators.PASSWORD_INPUT);
    this.loginButton = this.page.locator(LoginPageLocators.SIGN_IN_BUTTON);
    this.errorMessage = this.page.locator(LoginPageLocators.ERROR_MESSAGE);
    this.profilePic = this.page.locator(LoginPageLocators.PROFILE_PIC);
  }

  async navigateToLoginPage() {
    try {
      await gotoApp(this.page, getSagradaGoUrl());
      await expect(this.signInHeaderButton).toBeVisible({ timeout: 15_000 });
      await this.signInHeaderButton.click();
      await expect(this.page.locator(LoginPageLocators.TITLE)).toHaveText(/Sign In/i);
      await expect(this.emailAddressInput).toBeVisible({ timeout: 15_000 });
      console.log(chalk.green(`✔ Opened SagradaGo sign-in`));
    } catch (error) {
      console.error(chalk.red(`Error in navigateToLoginPage: ${error}`));
      throw error;
    }
  }

  async inputEmailAddress() {
    const emailAddress = getEnv("SAGRADA_EMAIL_ADDRESS") || getEnv("EMAIL_ADDRESS");

    try {
      if (!emailAddress) {
        throw new Error("SAGRADA_EMAIL_ADDRESS or EMAIL_ADDRESS is not set");
      }

      await this.fillEmailAddress(emailAddress);
      console.log(chalk.green("✔ Email input successful"));
    } catch (error) {
      console.error(chalk.red(`Error in inputEmailAddress: ${error}`));
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
    const password = getEnv("SAGRADA_PASSWORD") || getEnv("PASSWORD");

    try {
      if (!password) {
        throw new Error("SAGRADA_PASSWORD or PASSWORD is not set");
      }

      await this.fillPassword(password);
      console.log(chalk.green("✔ Password input successful"));
    } catch (error) {
      console.error(chalk.red(`Error in inputPassword: ${error}`));
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
      await expect(this.loginButton).toHaveText(/Sign In/i);
      await this.loginButton.click();
      console.log(chalk.green("✔ Sign In button clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickLoginButton: ${error}`));
      throw error;
    }
  }

  async expectLoginSuccess() {
    const errorVisible = this.errorMessage.waitFor({ state: "visible", timeout: 20_000 }).then(async () => {
      throw new Error(`Login failed: ${(await this.errorMessage.textContent())?.trim() || "unknown error"}`);
    });

    await Promise.race([
      this.profilePic.waitFor({ state: "visible", timeout: 20_000 }),
      this.page.waitForURL(/\/admin/, { timeout: 20_000 }),
      errorVisible,
    ]);

    await expect(this.page.locator(LoginPageLocators.TITLE)).toBeHidden();
    console.log(chalk.blue("✔ Login flow completed"));
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

  get loginError() {
    return this.errorMessage;
  }
}
