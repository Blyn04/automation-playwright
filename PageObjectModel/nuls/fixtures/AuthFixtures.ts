import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { InventoryPage } from '../pages/admin/InventoryPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RequisitionPage } from '../pages/RequisitionPage';

type AuthFixtures = {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  dashboardPage: DashboardPage;
  inventoryPage: InventoryPage;
  profilePage: ProfilePage;
  requisitionPage: RequisitionPage;
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

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await use(profilePage);
  },

  requisitionPage: async ({ page }, use) => {
    const requisitionPage = new RequisitionPage(page);
    await use(requisitionPage);
  },
});