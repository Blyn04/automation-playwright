import { expect, Locator, Page } from "@playwright/test";
import { SignUpPageLocators } from "../locator/signup.locators";
import { gotoApp } from "../utils/navigation";
import chalk from "chalk";

export class SignUpPage {
  private readonly page: Page;
  private readonly nameInput: Locator;
  private readonly emailAddressInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly jobTitleInput: Locator;
  private readonly departmentInput: Locator;
  private readonly termsCheckbox: Locator;
  private readonly signUpButton: Locator;
  private readonly goToSignUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = this.page.locator(SignUpPageLocators.NAME_INPUT);
    this.emailAddressInput = this.page.locator(SignUpPageLocators.EMAIL_INPUT);
    this.employeeIdInput = this.page.locator(SignUpPageLocators.EMPLOYEE_ID_INPUT);
    this.jobTitleInput = this.page.locator(SignUpPageLocators.JOB_TITLE_DROPDOWN);
    this.departmentInput = this.page.locator(SignUpPageLocators.DEPARTMENT_DROPDOWN);
    this.termsCheckbox = this.page.locator(SignUpPageLocators.TERMS_CHECKBOX);
    this.signUpButton = this.page.locator(SignUpPageLocators.SIGN_UP_BUTTON);
    this.goToSignUpButton = this.page.locator(SignUpPageLocators.GO_TO_SIGN_UP_BUTTON);
  }

  async navigateToSignUpPage() {
    const webUrl = process.env.WEB_URL?.trim();
    try {
      if (!webUrl) {
        throw new Error("WEB_URL is not set");
      }
      await gotoApp(this.page, webUrl);
      await expect(this.goToSignUpButton).toBeVisible({ timeout: 15_000 });
      console.log(chalk.green(`✔ Navigated to ${webUrl}`));

    } catch (error) {
      console.error(chalk.red(`Error in navigateToSignUpPage: ${error}`));
      throw error;
    }
  }

  async clickGoToSignUpButton() {
    try {
      await expect(this.goToSignUpButton).toBeVisible();
      await expect(this.goToSignUpButton).toBeEnabled();

      await this.goToSignUpButton.click();

      console.log(chalk.green("✔ Sign up link clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in clickGoToSignUpButton: ${error}`));
      throw error;
    }
  }

  async inputName() {
    const name = process.env.NAME as string;

    try {
      if (!name) {
        throw new Error("NAME is not set");
      }

      await expect(this.nameInput).toBeVisible();
      await expect(this.nameInput).toBeEnabled();
      await expect(this.nameInput).toBeEmpty();

      await this.nameInput.fill(name);

      await expect(this.nameInput).toHaveValue(name);

      console.log(chalk.green("✔ Name input successful"));

    } catch (error) {
      console.error(chalk.red(`Error in inputName: ${error}`));
      throw error;
    }
  }

  async inputEmailAddress() {
    const emailAddress = process.env.EMAIL_ADDRESS as string;

    try {
      if (!emailAddress) {
        throw new Error("EMAIL_ADDRESS is not set");
      }

      await expect(this.emailAddressInput).toBeVisible();
      await expect(this.emailAddressInput).toBeEnabled();
      await expect(this.emailAddressInput).toBeEmpty();

      await this.emailAddressInput.fill(emailAddress);

      await expect(this.emailAddressInput).toHaveValue(emailAddress);

      console.log(chalk.green("✔ Email input successful"));

    } catch (error) {
      console.error(chalk.red(`Error in inputEmailAddress: ${error}`));
      throw error;
    }
  }

  async inputEmployeeId() {
    const employeeId = process.env.EMPLOYEE_ID as string;

    try {
      if (!employeeId) {
        throw new Error("EMPLOYEE_ID is not set");
      }

      await expect(this.employeeIdInput).toBeVisible();
      await expect(this.employeeIdInput).toBeEnabled();
      await expect(this.employeeIdInput).toBeEmpty();

      await this.employeeIdInput.fill(employeeId);

      await expect(this.employeeIdInput).toHaveValue(employeeId);

      console.log(chalk.green("✔ Employee ID input successful"));

    } catch (error) {
      console.error(chalk.red(`Error in inputEmployeeId: ${error}`));
      throw error;
    }
  }

  async selectJobTitle() {
    const jobTitle = process.env.JOB_TITLE as string;

    try {
      if (!jobTitle) {
        throw new Error("JOB_TITLE is not set");
      }

      await expect(this.jobTitleInput).toBeVisible();
      await expect(this.jobTitleInput).toBeEnabled();

      await this.jobTitleInput.selectOption(jobTitle);

      await expect(this.jobTitleInput).toHaveValue(jobTitle);

      console.log(chalk.green("✔ Job title selected successfully"));

    } catch (error) {
      console.error(chalk.red(`Error in selectJobTitle: ${error}`));
      throw error;
    }
  }

  async selectDepartment() {
    const department = process.env.DEPARTMENT as string;

    try {
      if (!department) {
        throw new Error("DEPARTMENT is not set");
      }

      await expect(this.departmentInput).toBeVisible();
      await expect(this.departmentInput).toBeEnabled();

      await this.departmentInput.selectOption(department);

      await expect(this.departmentInput).toHaveValue(department);

      console.log(chalk.green("✔ Department selected successfully"));

    } catch (error) {
      console.error(chalk.red(`Error in selectDepartment: ${error}`));
      throw error;
    }
  }

  async checkTermsCheckbox() {
    try {
      await expect(this.termsCheckbox).toBeVisible();
      await expect(this.termsCheckbox).toBeEnabled();
      await expect(this.termsCheckbox).not.toBeChecked();

      await this.termsCheckbox.check();

      await expect(this.termsCheckbox).toBeChecked();

      console.log(chalk.green("✔ Terms checkbox checked successfully"));

    } catch (error) {
      console.error(chalk.red(`Error in checkTermsCheckbox: ${error}`));
      throw error;
    }
  }

  async clickSignUpButton() {
    try {
      await expect(this.signUpButton).toBeVisible();
      await expect(this.signUpButton).toBeEnabled();
      await expect(this.signUpButton).toHaveText(/Sign up/i);

      await this.signUpButton.click();

      console.log(chalk.green("✔ Sign up button clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in clickSignUpButton: ${error}`));
      throw error;
    }
  }

  async fillName(name: string, assertValue = true) {
    await expect(this.nameInput).toBeVisible();
    await expect(this.nameInput).toBeEnabled();
    await this.nameInput.fill(name);
    if (assertValue) {
      await expect(this.nameInput).toHaveValue(name);
    }
  }

  async fillEmailAddress(email: string, assertValue = true) {
    await expect(this.emailAddressInput).toBeVisible();
    await expect(this.emailAddressInput).toBeEnabled();
    await this.emailAddressInput.fill(email);
    if (assertValue) {
      await expect(this.emailAddressInput).toHaveValue(email);
    }
  }

  async fillEmployeeId(employeeId: string, assertValue = true) {
    await expect(this.employeeIdInput).toBeVisible();
    await expect(this.employeeIdInput).toBeEnabled();
    await this.employeeIdInput.fill(employeeId);
    if (assertValue) {
      await expect(this.employeeIdInput).toHaveValue(employeeId);
    }
  }

  async selectJobTitleOption(jobTitle: string) {
    await expect(this.jobTitleInput).toBeVisible();
    await expect(this.jobTitleInput).toBeEnabled();
    await this.jobTitleInput.selectOption(jobTitle);
    await expect(this.jobTitleInput).toHaveValue(jobTitle);
  }

  async selectDepartmentOption(department: string) {
    await expect(this.departmentInput).toBeVisible();
    await expect(this.departmentInput).toBeEnabled();
    await this.departmentInput.selectOption(department);
    await expect(this.departmentInput).toHaveValue(department);
  }

  async uncheckTermsCheckbox() {
    await expect(this.termsCheckbox).toBeVisible();
    await expect(this.termsCheckbox).toBeEnabled();
    await this.termsCheckbox.uncheck();
    await expect(this.termsCheckbox).not.toBeChecked();
  }

  get nameField() {
    return this.nameInput;
  }

  get emailField() {
    return this.emailAddressInput;
  }

  get employeeIdField() {
    return this.employeeIdInput;
  }

  get jobTitleField() {
    return this.jobTitleInput;
  }

  get departmentField() {
    return this.departmentInput;
  }

  get termsCheckboxField() {
    return this.termsCheckbox;
  }

  get submitButton() {
    return this.signUpButton;
  }

  async testFinalSignUpPage() {
    try {
      await this.navigateToSignUpPage();
      await this.clickGoToSignUpButton();
      await this.inputName();
      await this.inputEmailAddress();
      await this.inputEmployeeId();
      await this.selectJobTitle();
      await this.selectDepartment();
      await this.checkTermsCheckbox();
      await this.clickSignUpButton();

      await this.page.waitForLoadState("networkidle");

      console.log(chalk.blue("✔ Sign up flow completed"));

    } catch (error) {
      console.error(chalk.red(`Sign up flow failed: ${error}`));
      throw error;
    }
  }
}

