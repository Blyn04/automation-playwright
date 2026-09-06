import { expect, Locator, Page } from "@playwright/test";
import { DashboardLocators } from "../locator/dashboard.locators";
import { LoginPage } from "./LoginPage";
import chalk from "chalk";

export class DashboardPage {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly container: Locator;
  private readonly loading: Locator;
  private readonly title: Locator;
  private readonly subtitle: Locator;
  private readonly statsGrid: Locator;
  private readonly sidebar: Locator;
  private readonly dashboardMenu: Locator;
  private readonly bookingsMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.container = this.page.locator(DashboardLocators.CONTAINER);
    this.loading = this.page.locator(DashboardLocators.LOADING);
    this.title = this.page.locator(DashboardLocators.TITLE);
    this.subtitle = this.page.locator(DashboardLocators.SUBTITLE);
    this.statsGrid = this.page.locator(DashboardLocators.STATS_GRID);
    this.sidebar = this.page.locator(DashboardLocators.SIDEBAR);
    this.dashboardMenu = this.page.locator(DashboardLocators.MENU_DASHBOARD);
    this.bookingsMenu = this.page.locator(DashboardLocators.MENU_BOOKINGS);
  }

  async loginAndOpenDashboard() {
    try {
      await this.loginPage.navigateToLoginPage();
      await this.loginPage.inputEmailAddress();
      await this.loginPage.inputPassword();
      await this.loginPage.clickLoginButton();
      await this.expectDashboardLoaded();
    } catch (error) {
      console.error(chalk.red(`Error in loginAndOpenDashboard: ${error}`));
      throw error;
    }
  }

  async expectDashboardLoaded() {
    await expect(this.page).toHaveURL(/\/admin\/dashboard/, { timeout: 25_000 });
    await expect(this.loading.or(this.container)).toBeVisible({ timeout: 25_000 });
    await expect(this.container).toBeVisible({ timeout: 45_000 });
    await expect(this.title).toContainText(/Welcome Back/i);
    await expect(this.subtitle).toContainText(/Here's what's happening today/i);
    await expect(this.sidebar).toBeVisible();
    await expect(this.dashboardMenu).toBeVisible();
    await expect(this.statsGrid.locator(DashboardLocators.STAT_CARD).first()).toBeVisible();
    console.log(chalk.blue("✔ Admin dashboard loaded"));
  }

  async openBookingsFromSidebar() {
    try {
      await expect(this.bookingsMenu).toBeVisible();
      await this.bookingsMenu.click();
      await expect(this.page).toHaveURL(/\/admin\/bookings/, { timeout: 15_000 });
      console.log(chalk.green("✔ Opened Bookings from sidebar"));
    } catch (error) {
      console.error(chalk.red(`Error in openBookingsFromSidebar: ${error}`));
      throw error;
    }
  }
}
