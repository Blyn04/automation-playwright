import { expect, Locator, Page } from "@playwright/test";
import { DashboardLocators } from "../../locator/admin/dashboard.locators";
import { ProfileLocators } from "../../locator/profile.locators";
import chalk from "chalk";

export class DashboardPage {
  private readonly page: Page;
  private readonly okButtonModal: Locator;
  private readonly closeButtonModal: Locator;
  private readonly inventoryMenu: Locator;
  private readonly adminPanel: Locator;
  private readonly userProfileHeader: Locator;
  private readonly profileMenu: Locator;
  private readonly requisitionMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    this.okButtonModal = this.page.locator(DashboardLocators.OK_BUTTON_MODAL);
    this.closeButtonModal = this.page.locator(DashboardLocators.CLOSE_BUTTON_MODAL);
    this.adminPanel = this.page.locator(DashboardLocators.ADMIN_PANEL);
    this.inventoryMenu = this.page.locator(DashboardLocators.INVENTORY_MENU);
    this.requisitionMenu = this.page.locator(DashboardLocators.REQUISITION_MENU);
    this.userProfileHeader = this.page.locator(DashboardLocators.USER_PROFILE_HEADER);
    this.profileMenu = this.page.locator(ProfileLocators.PROFILE_MENU);
  }

  async clickOKButtonModal() {
    try {
      await expect(this.okButtonModal).toBeVisible();
      await expect(this.okButtonModal).toBeEnabled();

      await this.okButtonModal.click();

      console.log(chalk.green("✔ OK button clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in clickOKButtonModal: ${error}`));
      throw error;
    }
  }

  async clickCloseButtonModal() {
    try {
      await expect(this.closeButtonModal).toBeVisible();
      await expect(this.closeButtonModal).toBeEnabled();

      await this.closeButtonModal.click();

      console.log(chalk.green("✔ Close button clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickCloseButtonModal: ${error}`));
      throw error;
    }
  }

  async dismissPostLoginModals() {
    try {
      await this.clickOKButtonModal();
      await this.clickCloseButtonModal();

      console.log(chalk.green("✔ Post-login modals dismissed"));
    } catch (error) {
      console.error(chalk.red(`Error in dismissPostLoginModals: ${error}`));
      throw error;
    }
  }

  async clickAdminPanel() {
    try {
        await expect(this.adminPanel).toBeVisible();
        await expect(this.adminPanel).toBeEnabled();

        await this.adminPanel.click();

        console.log(chalk.green("✔ Admin Panel expanded"));

    } catch (error) {
        console.error(chalk.red(`Error in clickAdminPanel: ${error}`));
        throw error;
    }
  }

  async clickInventoryMenu() {
    try {
      await expect(this.inventoryMenu).toBeVisible();
      await expect(this.inventoryMenu).toBeEnabled();

      await this.inventoryMenu.click();

      console.log(chalk.green("✔ Inventory menu clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in clickInventoryMenu: ${error}`));
      throw error;
    }
  }

  async clickUserProfileHeader() {
    try {
      await expect(this.userProfileHeader).toBeVisible();
      await expect(this.userProfileHeader).toBeEnabled();

      await this.userProfileHeader.click();

      console.log(chalk.green("✔ User profile header clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in clickUserProfileHeader: ${error}`));
      throw error;
    }
  }

  async clickProfileMenu() {
    try {
      await expect(this.profileMenu).toBeVisible();
      await expect(this.profileMenu).toBeEnabled();

      await this.profileMenu.click();

      console.log(chalk.green("✔ Profile menu clicked"));

    } catch (error) {
      console.error(chalk.red(`Error in clickProfileMenu: ${error}`));
      throw error;
    }
  }

  async navigateToProfileFromHeader() {
    try {
      await this.clickUserProfileHeader();

      await expect(this.page.locator(ProfileLocators.PROFILE_PAGE_HEADER)).toBeVisible();
      await expect(this.page.locator(ProfileLocators.CHANGE_PHOTO_BUTTON)).toBeVisible();

      console.log(chalk.blue("✔ Successfully navigated to Profile from header"));

    } catch (error) {
      console.error(chalk.red(`Profile navigation failed: ${error}`));
      throw error;
    }
  }

  get okButton() {
    return this.okButtonModal;
  }

  get inventory() {
    return this.inventoryMenu;
  }

  async clickRequisitionMenu() {
    try {
      await expect(this.requisitionMenu).toBeVisible();
      await expect(this.requisitionMenu).toBeEnabled();

      await this.requisitionMenu.click();

      console.log(chalk.green("✔ Requisition menu clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickRequisitionMenu: ${error}`));
      throw error;
    }
  }

  async navigateToInventory() {
    try {
      await this.dismissPostLoginModals();
      await this.clickAdminPanel();
      await expect(this.inventoryMenu).toBeVisible();
      await this.clickInventoryMenu();

      await expect(this.inventoryMenu).toBeVisible();

      console.log(chalk.blue("✔ Successfully navigated to Inventory"));
    } catch (error) {
      console.error(chalk.red(`Inventory navigation failed: ${error}`));
      throw error;
    }
  }

  async navigateToRequisition() {
    try {
      await this.dismissPostLoginModals();
      await expect(this.requisitionMenu).toBeVisible();
      await this.clickRequisitionMenu();

      console.log(chalk.blue("✔ Successfully navigated to Requisition"));
    } catch (error) {
      console.error(chalk.red(`Requisition navigation failed: ${error}`));
      throw error;
    }
  }

  async testDashboardPage() {
    try {
      await this.navigateToInventory();

    } catch (error) {
      console.error(chalk.red(`Dashboard navigation failed: ${error}`));
      throw error;
    }
  }
}