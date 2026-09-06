import { test as baseTest, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";

type AuthFixtures = {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  forgotPasswordPage: ForgotPasswordPage;
};

export { expect };

export const test = baseTest.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  signUpPage: async ({ page }, use) => {
    const signUpPage = new SignUpPage(page);
    await use(signUpPage);
  },

  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await use(forgotPasswordPage);
  },
});
