import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../PageObjectModel/pages/LoginPage';
import { SignUpPage } from '../PageObjectModel/pages/SignUpPage';

type AuthFixtures = {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
};

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