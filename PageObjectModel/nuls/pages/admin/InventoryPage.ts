import { expect, Locator, Page } from "@playwright/test";
import { InventoryLocators } from "../../locator/admin/inventory.locators";
import chalk from "chalk";

export class InventoryPage {
  private readonly page: Page;
  private readonly filterCategorySelect: Locator;
  private readonly downloadQrCodeButton: Locator;
  private readonly modalWrap: Locator;
  private readonly addItemButton: Locator;
  private readonly itemNameInput: Locator;
  private readonly itemDescriptionInput: Locator;
  private readonly categorySelect: Locator;
  private readonly automaticIdRadio: Locator;
  private readonly quantityInput: Locator;
  private readonly stockRoomInput: Locator;
  private readonly shelvesInput: Locator;
  private readonly rowInput: Locator;
  private readonly addToInventoryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterCategorySelect = this.page.locator(InventoryLocators.FILTER_CATEGORY_SELECT);
    this.downloadQrCodeButton = this.page.locator(InventoryLocators.DOWNLOAD_QR_CODE_BUTTON);
    this.modalWrap = this.page.locator(InventoryLocators.MODAL_WRAP);
    this.addItemButton = this.page.locator(InventoryLocators.ADD_ITEM_BUTTON);
    this.itemNameInput = this.page.locator(InventoryLocators.ITEM_NAME_INPUT);
    this.itemDescriptionInput = this.page.locator(InventoryLocators.ITEM_DESCRIPTION_INPUT);
    this.categorySelect = this.page.locator(InventoryLocators.CATEGORY_SELECT);
    this.automaticIdRadio = this.page.locator(InventoryLocators.AUTOMATIC_ID_RADIO);
    this.quantityInput = this.page.locator(InventoryLocators.QUANTITY_INPUT);
    this.stockRoomInput = this.page.locator(InventoryLocators.STOCK_ROOM_INPUT);
    this.shelvesInput = this.page.locator(InventoryLocators.SHELVES_INPUT);
    this.rowInput = this.page.locator(InventoryLocators.ROW_INPUT);
    this.addToInventoryButton = this.page.locator(InventoryLocators.ADD_TO_INVENTORY_BUTTON);
  }

  private async selectAntOption(trigger: Locator, optionText: string) {
    await expect(trigger).toBeVisible();
    await trigger.click();

    const dropdown = this.page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden)");
    const option = dropdown
      .locator(InventoryLocators.ANT_SELECT_OPTION)
      .filter({ hasText: optionText });

    await expect(option).toBeVisible();
    await option.click();
  }

  async filterByCategory(category = "Equipment") {
    try {
      await this.selectAntOption(this.filterCategorySelect, category);

      console.log(chalk.green(`✔ Filtered by category: ${category}`));
    } catch (error) {
      console.error(chalk.red(`Error in filterByCategory: ${error}`));
      throw error;
    }
  }

  async selectTableRow(rowKey = "EQP20") {
    try {
      const row = this.page.locator(InventoryLocators.TABLE_ROW_BY_KEY(rowKey));

      await expect(row).toBeVisible();
      await row.click();

      console.log(chalk.green(`✔ Selected table row: ${rowKey}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectTableRow: ${error}`));
      throw error;
    }
  }

  async downloadQrCode() {
    try {
      await expect(this.downloadQrCodeButton).toBeVisible();
      await expect(this.downloadQrCodeButton).toBeEnabled();

      const downloadPromise = this.page.waitForEvent("download");
      await this.downloadQrCodeButton.click();
      await downloadPromise;

      console.log(chalk.green("✔ QR Code downloaded"));
    } catch (error) {
      console.error(chalk.red(`Error in downloadQrCode: ${error}`));
      throw error;
    }
  }

  async closeModalByClickingOutside() {
    try {
      await expect(this.modalWrap).toBeVisible();

      await this.modalWrap.click({ position: { x: 10, y: 10 } });
      await expect(this.page.locator(InventoryLocators.MODAL)).toBeHidden();

      console.log(chalk.green("✔ Modal closed by clicking outside"));
    } catch (error) {
      console.error(chalk.red(`Error in closeModalByClickingOutside: ${error}`));
      throw error;
    }
  }

  async clickAddItemToInventory() {
    try {
      await expect(this.addItemButton).toBeVisible();
      await expect(this.addItemButton).toBeEnabled();

      await this.addItemButton.click();

      console.log(chalk.green("✔ Add Item to Inventory clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickAddItemToInventory: ${error}`));
      throw error;
    }
  }

  async fillItemName(itemName?: string) {
    const name = itemName ?? process.env.INVENTORY_ITEM_NAME ?? `Automation Item ${Date.now()}`;

    try {
      await expect(this.itemNameInput).toBeVisible();
      await this.itemNameInput.fill(name);
      await expect(this.itemNameInput).toHaveValue(name);

      console.log(chalk.green("✔ Item name entered"));
    } catch (error) {
      console.error(chalk.red(`Error in fillItemName: ${error}`));
      throw error;
    }
  }

  async fillItemDescription(description?: string) {
    const itemDescription =
      description ?? process.env.INVENTORY_ITEM_DESCRIPTION ?? "Automation test equipment item";

    try {
      await expect(this.itemDescriptionInput).toBeVisible();
      await this.itemDescriptionInput.fill(itemDescription);
      await expect(this.itemDescriptionInput).toHaveValue(itemDescription);

      console.log(chalk.green("✔ Item description entered"));
    } catch (error) {
      console.error(chalk.red(`Error in fillItemDescription: ${error}`));
      throw error;
    }
  }

  async selectCategory(category = "Equipment") {
    try {
      await this.selectAntOption(this.categorySelect, category);

      console.log(chalk.green(`✔ Category selected: ${category}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectCategory: ${error}`));
      throw error;
    }
  }

  async selectAutomaticId() {
    try {
      await expect(this.automaticIdRadio).toBeVisible();
      await this.automaticIdRadio.check();
      await expect(this.automaticIdRadio).toBeChecked();

      console.log(chalk.green("✔ Automatic ID selected"));
    } catch (error) {
      console.error(chalk.red(`Error in selectAutomaticId: ${error}`));
      throw error;
    }
  }

  async fillQuantity(quantity?: string) {
    const qty = quantity ?? process.env.INVENTORY_QUANTITY ?? "25";

    try {
      await expect(this.quantityInput).toBeVisible();
      await this.quantityInput.fill(qty);
      await expect(this.quantityInput).toHaveValue(qty);

      console.log(chalk.green("✔ Quantity entered"));
    } catch (error) {
      console.error(chalk.red(`Error in fillQuantity: ${error}`));
      throw error;
    }
  }

  async fillStockRoomNumber(stockRoom = "1010") {
    try {
      await expect(this.stockRoomInput).toBeVisible();
      await this.stockRoomInput.fill(stockRoom);
      await expect(this.stockRoomInput).toHaveValue(stockRoom);

      console.log(chalk.green("✔ Stock room number entered"));
    } catch (error) {
      console.error(chalk.red(`Error in fillStockRoomNumber: ${error}`));
      throw error;
    }
  }

  async fillShelves(shelves = "TO") {
    try {
      await expect(this.shelvesInput).toBeVisible();
      await this.shelvesInput.fill(shelves);
      await expect(this.shelvesInput).toHaveValue(shelves);

      console.log(chalk.green("✔ Shelves entered"));
    } catch (error) {
      console.error(chalk.red(`Error in fillShelves: ${error}`));
      throw error;
    }
  }

  async fillRow(row = "10") {
    try {
      await expect(this.rowInput).toBeVisible();
      await this.rowInput.fill(row);
      await expect(this.rowInput).toHaveValue(row);

      console.log(chalk.green("✔ Row entered"));
    } catch (error) {
      console.error(chalk.red(`Error in fillRow: ${error}`));
      throw error;
    }
  }

  async clickAddToInventory() {
    try {
      await expect(this.addToInventoryButton).toBeVisible();
      await expect(this.addToInventoryButton).toBeEnabled();

      await this.addToInventoryButton.click();

      console.log(chalk.green("✔ Add to Inventory submitted"));
    } catch (error) {
      console.error(chalk.red(`Error in clickAddToInventory: ${error}`));
      throw error;
    }
  }

  async fillAddItemForm() {
    await this.fillItemName();
    await this.fillItemDescription();
    await this.selectCategory("Equipment");
    await this.selectAutomaticId();
    await this.fillQuantity();
    await this.fillStockRoomNumber("1010");
    await this.fillShelves("TO");
    await this.fillRow("10");
  }

  async testInventoryFlow() {
    try {
      await expect(this.filterCategorySelect).toBeVisible();

      await this.filterByCategory("Equipment");
      await this.selectTableRow("EQP20");
      await this.downloadQrCode();
      await this.closeModalByClickingOutside();

      await this.clickAddItemToInventory();
      await this.fillAddItemForm();
      await this.clickAddToInventory();

      console.log(chalk.blue("✔ Inventory flow completed"));
    } catch (error) {
      console.error(chalk.red(`Inventory flow failed: ${error}`));
      throw error;
    }
  }
}
