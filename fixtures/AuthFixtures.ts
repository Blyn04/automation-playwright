import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../PageObjectModel/pages/LoginPage';

type AuthFixtures = {
  loginPage: LoginPage;
};

export const test = baseTest.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
    }, 
});