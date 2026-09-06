import { expect, Locator, Page } from "@playwright/test";
import { ForgotPasswordLocators } from "../locator/forgotPassword.locators";
import { getEnv } from "../utils/env";
import { LoginPage } from "./LoginPage";
import chalk from "chalk";

export class ForgotPasswordPage {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly modal: Locator;
  private readonly emailInput: Locator;
  private readonly errorMessage: Locator;
  private readonly sendButton: Locator;
  private readonly subtitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.modal = this.page
      .locator("h1.modal-title", { hasText: /^Forgot Password$/ })
      .locator("xpath=ancestor::div[contains(@class,'modal-card')][1]");
    this.emailInput = this.modal.locator(ForgotPasswordLocators.EMAIL_INPUT);
    this.errorMessage = this.modal.locator(ForgotPasswordLocators.ERROR_MESSAGE);
    this.sendButton = this.modal.locator(ForgotPasswordLocators.SEND_BUTTON);
    this.subtitle = this.modal.locator(ForgotPasswordLocators.SUBTITLE);
  }

  async navigateToForgotPassword() {
    try {
      await this.loginPage.navigateToLoginPage();
      await this.loginPage.clickForgotPasswordLink();
      await expect(this.modal.locator(ForgotPasswordLocators.TITLE).first()).toHaveText(/Forgot Password/i);
      await expect(this.emailInput).toBeVisible();
      console.log(chalk.green("✔ Opened SagradaGo forgot password"));
    } catch (error) {
      console.error(chalk.red(`Error in navigateToForgotPassword: ${error}`));
      throw error;
    }
  }

  async inputEmailAddress() {
    const emailAddress = getEnv("SAGRADA_EMAIL_ADDRESS") || getEnv("EMAIL_ADDRESS");

    try {
      if (!emailAddress) {
        throw new Error("SAGRADA_EMAIL_ADDRESS or EMAIL_ADDRESS is not set");
      }

      await expect(this.emailInput).toBeVisible();
      await expect(this.emailInput).toBeEnabled();
      await this.emailInput.fill(emailAddress);
      await expect(this.emailInput).toHaveValue(emailAddress);
      console.log(chalk.green("✔ Forgot-password email input successful"));
    } catch (error) {
      console.error(chalk.red(`Error in inputEmailAddress: ${error}`));
      throw error;
    }
  }

  async clickSendButton() {
    try {
      await expect(this.sendButton).toBeVisible();
      await expect(this.sendButton).toBeEnabled();
      await expect(this.sendButton).toHaveText(/Send/i);
      await this.sendButton.click();
      console.log(chalk.green("✔ Send reset email clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickSendButton: ${error}`));
      throw error;
    }
  }

  async expectResetEmailSent() {
    await expect(this.errorMessage.or(this.subtitle)).toBeVisible({ timeout: 30_000 });

    if (await this.errorMessage.isVisible()) {
      throw new Error(
        `Forgot password failed: ${(await this.errorMessage.textContent())?.trim() || "unknown error"}`,
      );
    }

    await expect(this.subtitle).toContainText(/Password reset email has been sent/i);
    await expect(this.sendButton).toHaveText(/^OK$/i);
    console.log(chalk.blue("✔ Forgot password flow completed"));
  }
}
