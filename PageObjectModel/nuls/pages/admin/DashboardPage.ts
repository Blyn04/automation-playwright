import { expect, Locator, Page } from "@playwright/test";
import { DashboardLocators } from "../../locator/admin/dashboard.locators";
import chalk from "chalk";

export class DashboardPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get OKButtonModal() {
    return $(DashboardLocators.OK_BUTTON_MODAL);
  }

  get CalendarTab() {
    return $(DashboardLocators.CALENDAR_TAB);
  }

  get CalendarDate() {
    return $(DashboardLocators.CALENDAR_DATE);
  }

  get CriticalStocksButton() {
    return $(DashboardLocators.CRITICAL_STOCKS_BUTTON);
  }
}

