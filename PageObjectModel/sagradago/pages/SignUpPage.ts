import { expect, Locator, Page } from "@playwright/test";
import { SignUpPageLocators } from "../locator/signup.locators";
import { getEnv, getSagradaGoUrl } from "../utils/env";
import { gotoApp } from "../utils/navigation";
import chalk from "chalk";

export class SignUpPage {
  private readonly page: Page;
  private readonly signInHeaderButton: Locator;
  private readonly goToSignUpButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly middleNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly contactNumberInput: Locator;
  private readonly birthdayInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly retypePasswordInput: Locator;
  private readonly signUpButton: Locator;
  private readonly noticeDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInHeaderButton = this.page.locator(SignUpPageLocators.SIGN_IN_HEADER_BUTTON);
    this.goToSignUpButton = this.page.locator(SignUpPageLocators.GO_TO_SIGN_UP_BUTTON);
    this.firstNameInput = this.page.locator(SignUpPageLocators.FIRST_NAME_INPUT);
    this.middleNameInput = this.page.locator(SignUpPageLocators.MIDDLE_NAME_INPUT);
    this.lastNameInput = this.page.locator(SignUpPageLocators.LAST_NAME_INPUT);
    this.contactNumberInput = this.page.locator(SignUpPageLocators.CONTACT_NUMBER_INPUT);
    this.birthdayInput = this.page.locator(SignUpPageLocators.BIRTHDAY_INPUT);
    this.emailInput = this.page.locator(SignUpPageLocators.EMAIL_INPUT);
    this.passwordInput = this.page.locator(SignUpPageLocators.PASSWORD_INPUT);
    this.retypePasswordInput = this.page.locator(SignUpPageLocators.RETYPE_PASSWORD_INPUT);
    this.signUpButton = this.page.locator(SignUpPageLocators.SIGN_UP_BUTTON);
    this.noticeDialog = this.page.locator(SignUpPageLocators.NOTICE_DIALOG);
  }

  async navigateToSignUpPage() {
    try {
      await gotoApp(this.page, getSagradaGoUrl());
      await expect(this.signInHeaderButton).toBeVisible({ timeout: 15_000 });
      await this.signInHeaderButton.click();
      await this.clickGoToSignUpButton();
      console.log(chalk.green("✔ Opened SagradaGo sign-up"));
    } catch (error) {
      console.error(chalk.red(`Error in navigateToSignUpPage: ${error}`));
      throw error;
    }
  }

  async clickGoToSignUpButton() {
    try {
      await expect(this.goToSignUpButton).toBeVisible();
      await this.goToSignUpButton.click();
      await expect(this.page.locator(SignUpPageLocators.TITLE)).toHaveText(/Create an Account/i);
      await expect(this.firstNameInput).toBeVisible();
      console.log(chalk.green("✔ Sign up link clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickGoToSignUpButton: ${error}`));
      throw error;
    }
  }

  async fillRequiredFields() {
    const stamp = Date.now().toString().slice(-9);
    const firstName = getEnv("FIRST_NAME") || "Berlene";
    const middleName = getEnv("MIDDLE_NAME") || "F";
    const lastName = getEnv("LAST_NAME") || "Bernabe";
    const contact = getEnv("CONTACT_NUMBER") || `09${stamp}`;
    const birthday = getEnv("BIRTHDAY") || "1995-06-15";
    const email = getEnv("SIGNUP_EMAIL") || `sagradago.auto.${stamp}@gmail.com`;
    const password = getEnv("SIGNUP_PASSWORD") || getEnv("SAGRADA_PASSWORD") || "Test1234!";

    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.middleNameInput, middleName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.contactNumberInput, contact);
    await this.fillInput(this.birthdayInput, birthday);
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.fillInput(this.retypePasswordInput, password);

    console.log(chalk.green(`✔ Sign-up fields filled (${email})`));
  }

  private async fillInput(locator: Locator, value: string) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  async clickSignUpButton() {
    try {
      await expect(this.signUpButton).toBeVisible();
      await expect(this.signUpButton).toBeEnabled();
      await expect(this.signUpButton).toHaveText(/Sign Up/i);
      await this.signUpButton.click();
      console.log(chalk.green("✔ Sign Up button clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickSignUpButton: ${error}`));
      throw error;
    }
  }

  async expectSignUpSuccess() {
    await expect(this.noticeDialog).toBeVisible({ timeout: 45_000 });
    const text = ((await this.noticeDialog.innerText()) || "").replace(/\s+/g, " ");
    if (!/Account created/i.test(text)) {
      throw new Error(`Sign up did not succeed: ${text}`);
    }
    console.log(chalk.blue("✔ Sign up flow completed"));
  }
}
