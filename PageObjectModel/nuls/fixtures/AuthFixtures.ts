import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';

type AuthFixtures = {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
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
});