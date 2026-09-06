import { test as baseTest, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

type AuthFixtures = {
  loginPage: LoginPage;
};

export { expect };

export const test = baseTest.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
