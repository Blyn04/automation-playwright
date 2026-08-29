import { expect, Locator, Page } from "@playwright/test";
import { RequisitionLocators } from "../../locator/user/requisition.locators";
import chalk from "chalk";

export class RequisitionPage {
  private readonly page: Page;
  private readonly itemSelect: Locator;
  private readonly dateNeededInput: Locator;
  private readonly programSelect: Locator;
  private readonly timeFromInput: Locator;
  private readonly timeToInput: Locator;
  private readonly roomInput: Locator;
  private readonly courseCodeSelect: Locator;
  private readonly usageTypeSelect: Locator;
  private readonly finalizeButton: Locator;
  private readonly confirmSubmitButton: Locator;
  private readonly responsibilityCheckbox: Locator;
  private readonly noteInput: Locator;
  private readonly addItemRowButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemSelect = this.page.locator(RequisitionLocators.ITEM_SELECT).first();
    this.dateNeededInput = this.page.locator(RequisitionLocators.DATE_NEEDED_INPUT);
    this.programSelect = this.page.locator(RequisitionLocators.PROGRAM_SELECT);
    this.timeFromInput = this.page.locator(RequisitionLocators.TIME_FROM_INPUT);
    this.timeToInput = this.page.locator(RequisitionLocators.TIME_TO_INPUT);
    this.roomInput = this.page.locator(RequisitionLocators.ROOM_INPUT);
    this.courseCodeSelect = this.page.locator(RequisitionLocators.COURSE_CODE_SELECT);
    this.usageTypeSelect = this.page.locator(RequisitionLocators.USAGE_TYPE_SELECT);
    this.finalizeButton = this.page.locator(RequisitionLocators.FINALIZE_BUTTON);
    this.confirmSubmitButton = this.page.locator(RequisitionLocators.CONFIRM_SUBMIT_BUTTON);
    this.responsibilityCheckbox = this.page.locator(RequisitionLocators.RESPONSIBILITY_CHECKBOX);
    this.noteInput = this.page.getByPlaceholder('Leave a note for the custodian');
    this.addItemRowButton = this.page.getByRole('button', { name: 'Add Item Row' });
  }

  /**
   * Ant Design virtual lists clip options inside overflow:auto holders.
   * Playwright then reports them as hidden even when they are in the DOM and
   * shown in innerText — which is what CI hits on GitHub Actions.
   */
  private dropdownOptions(dropdown: Locator): Locator {
    return dropdown.locator(RequisitionLocators.ANT_SELECT_OPTION);
  }

  private async waitForDropdownOptions(dropdown: Locator): Promise<Locator> {
    await dropdown
      .locator(".ant-spin")
      .waitFor({ state: "hidden", timeout: 15000 })
      .catch(() => {});

    const options = this.dropdownOptions(dropdown);
    await expect(options.first()).toBeAttached({ timeout: 20000 });
    await options.first().scrollIntoViewIfNeeded().catch(() => {});
    return options;
  }

  private async clickDropdownOption(option: Locator) {
    await option.scrollIntoViewIfNeeded().catch(() => {});
    await option.click({ force: true });
  }

  private async openItemSelectDropdown(searchText: string): Promise<Locator> {
    await this.itemSelect.scrollIntoViewIfNeeded();
    await expect(this.itemSelect).toBeVisible();

    await this.page
      .locator(".ant-select-dropdown.ant-slide-up-leave")
      .waitFor({ state: "hidden", timeout: 5000 })
      .catch(() => {});

    const combobox = this.itemSelect.locator('[role="combobox"]');
    await this.itemSelect.locator(".ant-select-selector").click();

    if ((await combobox.getAttribute("aria-expanded")) !== "true") {
      await combobox.click();
    }

    await expect(combobox).toHaveAttribute("aria-expanded", "true", { timeout: 10000 });

    const dropdownId = await combobox.getAttribute("aria-controls");
    const dropdown = dropdownId
      ? this.page.locator(
          `.ant-select-dropdown:not(.ant-select-dropdown-hidden):has(#${dropdownId})`
        )
      : this.page.locator(RequisitionLocators.SELECT_DROPDOWN).last();

    await expect(dropdown).toBeVisible({ timeout: 15000 });

    let options = this.dropdownOptions(dropdown);
    if ((await options.count()) === 0) {
      await this.typeInSelectSearch(this.itemSelect, searchText);
    }

    await this.waitForDropdownOptions(dropdown);

    return dropdown;
  }

  private async typeInSelectSearch(trigger: Locator, text: string) {
    const searchInput = trigger.locator(".ant-select-selection-search-input");
    await searchInput.click();
    await searchInput.fill("");
    await searchInput.pressSequentially(text, { delay: 75 });
  }

  private async openSelectDropdown(trigger: Locator, searchText?: string): Promise<Locator> {
    await trigger.scrollIntoViewIfNeeded();
    await expect(trigger).toBeVisible();

    await this.page
      .locator(".ant-select-dropdown.ant-slide-up-leave")
      .waitFor({ state: "hidden", timeout: 5000 })
      .catch(() => {});

    const combobox = trigger.locator('[role="combobox"]');
    await expect(combobox).toBeVisible();

    await trigger.locator(".ant-select-selector").click();

    if ((await combobox.getAttribute("aria-expanded")) !== "true") {
      await combobox.click();
    }

    await expect(combobox).toHaveAttribute("aria-expanded", "true", { timeout: 10000 });

    if (searchText) {
      await this.typeInSelectSearch(trigger, searchText);
    }

    const dropdownId = await combobox.getAttribute("aria-controls");
    let dropdown = dropdownId
      ? this.page.locator(
          `.ant-select-dropdown:not(.ant-select-dropdown-hidden):has(#${dropdownId})`
        )
      : this.page.locator(RequisitionLocators.SELECT_DROPDOWN).last();

    if (dropdownId && (await dropdown.count()) === 0) {
      await combobox.click();
      await expect(combobox).toHaveAttribute("aria-expanded", "true", { timeout: 10000 });
      dropdown = this.page.locator(
        `.ant-select-dropdown:not(.ant-select-dropdown-hidden):has(#${dropdownId})`
      );
    }

    if ((await dropdown.count()) === 0) {
      dropdown = this.page.locator(RequisitionLocators.SELECT_DROPDOWN).last();
    }

    await expect(dropdown).toBeVisible({ timeout: 15000 });
    await this.waitForDropdownOptions(dropdown);

    return dropdown;
  }

  private async selectAntOption(trigger: Locator, optionText?: string) {
    const dropdown = await this.openSelectDropdown(trigger, optionText);
    const options = this.dropdownOptions(dropdown);

    if (!optionText) {
      await this.clickDropdownOption(options.first());
      return;
    }

    const labels = await options.evaluateAll(els =>
      els.map(el => el.getAttribute("aria-label") || el.textContent?.trim() || "")
    );
    let targetIndex = labels.findIndex(label =>
      label.toLowerCase().includes(optionText.toLowerCase())
    );
    if (targetIndex === -1) {
      targetIndex = 0;
    }

    await this.clickDropdownOption(options.nth(targetIndex));
  }


  private async selectTimeInPanel(panel: Locator, hour: string, minute: string) {
    const columns = panel.locator(".ant-picker-time-panel-column");
    const hourCell = columns.nth(0).locator(".ant-picker-time-panel-cell-inner").filter({ hasText: hour });
    const minuteCell = columns.nth(1).locator(".ant-picker-time-panel-cell-inner").filter({ hasText: minute });

    await expect(hourCell.first()).toBeVisible();
    await hourCell.first().click();
    await expect(minuteCell.first()).toBeVisible();
    await minuteCell.first().click();

    const okButton = panel.locator(".ant-picker-ok button");
    if (await okButton.isVisible()) {
      await okButton.click();
    }
  }

  async selectItem(itemName?: string) {
    const item = itemName ?? process.env.REQUISITION_ITEM ?? "Beaker";

    try {
      await expect(this.itemSelect).toBeVisible();

      const dropdown = await this.openItemSelectDropdown(item);
      let optionsLocator = this.dropdownOptions(dropdown);

      // Let's inspect all options to find a suitable enabled one
      let optionsInfo = await optionsLocator.evaluateAll(els => {
        return els.map(el => ({
          text: el.getAttribute("aria-label") || el.textContent?.trim() || "",
          className: el.className,
          isDisabled: el.classList.contains('ant-select-item-option-disabled')
        }));
      });

      console.log("=== DEBUG Dropdown Options ===");
      console.log(JSON.stringify(optionsInfo, null, 2));

      const isEquipment = (text: string) => {
        const parts = text.split('|');
        return parts.length > 2 && parts[2].trim().toLowerCase() === 'equipment';
      };

      // 1. Try to find an enabled option matching the requested item name AND of type Equipment
      let targetIndex = optionsInfo.findIndex(opt => 
        opt.text.toLowerCase().includes(item.toLowerCase()) && 
        !opt.isDisabled && 
        isEquipment(opt.text)
      );

      // 2. If not found, fall back to the first enabled option that is of type Equipment
      if (targetIndex === -1) {
        targetIndex = optionsInfo.findIndex(opt => !opt.isDisabled && isEquipment(opt.text));
        console.log(chalk.yellow(`⚠ Preferred item "${item}" (Equipment) is not available/enabled. Falling back to first enabled Equipment item.`));
      }

      // 3. If still not found (e.g. all Equipment options are disabled because they're already in the table),
      // we attempt to free one up by deleting an existing Equipment row from the table.
      if (targetIndex === -1) {
        console.log(chalk.yellow("No enabled Equipment options found in dropdown. Attempting to free one up by deleting an existing Equipment row..."));

        const equipmentRowIndex = await this.page.evaluate(() => {
          const rows = Array.from(document.querySelectorAll('table tbody tr'));
          return rows.findIndex(row => {
            const deleteBtn = row.querySelector('button[aria-label="delete"], button:has(span[aria-label="delete"]), button:has(svg)');
            if (!deleteBtn) return false;
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length > 2) {
              const categoryText = cells[2].textContent?.trim() || '';
              return categoryText.toLowerCase() === 'equipment';
            }
            return false;
          });
        });

        if (equipmentRowIndex !== -1) {
          await this.deleteItemRow(equipmentRowIndex);
          await this.page.waitForTimeout(2000);

          const refreshedDropdown = await this.openItemSelectDropdown(item);
          optionsLocator = this.dropdownOptions(refreshedDropdown);

          // Re-fetch options
          optionsInfo = await optionsLocator.evaluateAll(els => {
            return els.map(el => ({
              text: el.getAttribute("aria-label") || el.textContent?.trim() || "",
              className: el.className,
              isDisabled: el.classList.contains('ant-select-item-option-disabled')
            }));
          });

          // Re-evaluate targetIndex
          targetIndex = optionsInfo.findIndex(opt => !opt.isDisabled && isEquipment(opt.text));
        }
      }

      if (targetIndex === -1) {
        throw new Error("No enabled Equipment items found in the select dropdown!");
      }

      const selectedOptionText = optionsInfo[targetIndex].text;
      console.log(chalk.blue(`Selecting item option: "${selectedOptionText}"`));

      await this.clickDropdownOption(optionsLocator.nth(targetIndex));

      console.log(chalk.green(`✔ Item selected: ${selectedOptionText}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectItem: ${error}`));
      throw error;
    }
  }

  async selectDateNeeded() {
    try {
      await expect(this.dateNeededInput).toBeVisible();

      const leavingPicker = this.page.locator('.ant-picker-dropdown.ant-slide-up-leave');
      await leavingPicker.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

      await this.dateNeededInput.click();

      const dropdown = this.page.locator(RequisitionLocators.PICKER_DROPDOWN);
      await expect(dropdown).toBeVisible();

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const targetDateStr = `${year}-${month}-${day}`;

      console.log(chalk.blue(`Target date (7 days from now): ${targetDateStr}`));

      const targetCell = dropdown.locator(
        `.ant-picker-cell[title="${targetDateStr}"]:not(.ant-picker-cell-disabled)`
      );

      let dateSelected = false;
      for (let i = 0; i < 12; i++) {
        if (await targetCell.count() > 0) {
          await targetCell.click();
          dateSelected = true;
          break;
        }

        const nextMonthBtn = dropdown.locator('.ant-picker-header-next-btn');
        await expect(nextMonthBtn).toBeVisible({ timeout: 5000 });
        await nextMonthBtn.click();
        await this.page.waitForTimeout(300);
      }

      if (!dateSelected) {
        throw new Error(`Could not select target date ${targetDateStr} in date picker`);
      }

      await expect(this.dateNeededInput).not.toHaveValue("");

      console.log(chalk.green(`✔ Date needed selected: ${targetDateStr}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectDateNeeded: ${error}`));
      throw error;
    }
  }

  async selectProgram(programName?: string) {
    const program = programName ?? process.env.REQUISITION_PROGRAM;

    try {
      await expect(this.programSelect).toBeVisible();

      const dropdown = await this.openSelectDropdown(this.programSelect, program);
      const options = this.dropdownOptions(dropdown);

      const optionsInfo = await options.evaluateAll(els => {
        return els.map(el => el.getAttribute("aria-label") || el.textContent?.trim() || "");
      });

      console.log("=== DEBUG Program Options ===");
      console.log(JSON.stringify(optionsInfo, null, 2));

      let targetIndex = 0;
      if (program) {
        targetIndex = optionsInfo.findIndex(opt => opt.toLowerCase().includes(program.toLowerCase()));
        if (targetIndex === -1) {
          console.log(chalk.yellow(`⚠ Preferred program "${program}" not found. Defaulting to first option.`));
          targetIndex = 0;
        }
      }

      await this.clickDropdownOption(options.nth(targetIndex));
      console.log(chalk.green(`✔ Program selected: ${optionsInfo[targetIndex]}`));
      
    } catch (error) {
      console.error(chalk.red(`Error in selectProgram: ${error}`));
      throw error;
    }
  }

  async selectTimeFrom(hour = "09", minute = "00") {
    try {
      await expect(this.timeFromInput).toBeVisible();
      await expect(this.timeFromInput).toBeEnabled();

      // Wait for any previous picker leave animation to finish
      const leavingPicker = this.page.locator('.ant-picker-dropdown.ant-slide-up-leave');
      await leavingPicker.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

      await this.timeFromInput.click();

      const panel = this.page.locator(RequisitionLocators.PICKER_DROPDOWN);
      await expect(panel.last()).toBeVisible();
      await this.selectTimeInPanel(panel.last(), hour, minute);

      await expect(this.timeFromInput).not.toHaveValue("");

      console.log(chalk.green(`✔ Time needed from selected: ${hour}:${minute}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectTimeFrom: ${error}`));
      throw error;
    }
  }

  async selectTimeTo(hour = "10", minute = "00") {
    try {
      await expect(this.timeToInput).toBeEnabled();

      // Wait for any previous picker leave animation to finish
      const leavingPicker = this.page.locator('.ant-picker-dropdown.ant-slide-up-leave');
      await leavingPicker.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

      await this.timeToInput.click();

      const panel = this.page.locator(RequisitionLocators.PICKER_DROPDOWN);
      await expect(panel.last()).toBeVisible();
      await this.selectTimeInPanel(panel.last(), hour, minute);

      await expect(this.timeToInput).not.toHaveValue("");

      console.log(chalk.green(`✔ Time needed to selected: ${hour}:${minute}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectTimeTo: ${error}`));
      throw error;
    }
  }


  async fillRoom(roomNumber?: string) {
    const room = roomNumber ?? process.env.REQUISITION_ROOM ?? (Math.floor(Math.random() * 800) + 101).toString();

    try {
      await expect(this.roomInput).toBeVisible();
      await this.roomInput.fill(room);
      await expect(this.roomInput).toHaveValue(room);

      console.log(chalk.green(`✔ Room entered: ${room}`));
    } catch (error) {
      console.error(chalk.red(`Error in fillRoom: ${error}`));
      throw error;
    }
  }

  async selectCourseCode(courseCode?: string) {
    const code = courseCode ?? process.env.REQUISITION_COURSE_CODE;

    try {
      await this.selectAntOption(this.courseCodeSelect, code);
      console.log(chalk.green(`✔ Course code selected${code ? `: ${code}` : ""}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectCourseCode: ${error}`));
      throw error;
    }
  }

  async selectUsageType(usageType?: string) {
    const type = usageType ?? process.env.REQUISITION_USAGE_TYPE ?? "Laboratory Experiment";

    try {
      await expect(this.usageTypeSelect).toBeVisible();
      await this.usageTypeSelect.selectOption({ label: type });

      console.log(chalk.green(`✔ Usage type selected: ${type}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectUsageType: ${error}`));
      throw error;
    }
  }

  async clickFinalize() {
    try {
      await expect(this.finalizeButton).toBeVisible();
      await expect(this.finalizeButton).toBeEnabled();
      await this.finalizeButton.click();

      console.log(chalk.green("✔ Finalize clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickFinalize: ${error}`));
      throw error;
    }
  }

  async clickConfirmAndSubmit() {
    try {
      await this.responsibilityCheckbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await this.responsibilityCheckbox.isVisible()) {
        console.log(chalk.blue("Responsibility checkbox detected, checking it..."));
        await this.responsibilityCheckbox.check();
      }

      await expect(this.confirmSubmitButton).toBeVisible();
      await expect(this.confirmSubmitButton).toBeEnabled();
      await this.confirmSubmitButton.click();

      console.log(chalk.green("✔ Confirm and Submit clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickConfirmAndSubmit: ${error}`));
      throw error;
    }
  }

  async fillRequisitionForm() {
    await this.selectProgram();
    await this.selectDateNeeded();
    await this.selectTimeFrom();
    await this.selectTimeTo();
    await this.fillRoom();
    await this.selectCourseCode();
    await this.selectUsageType();
    await this.selectItem();
  }

  get finalizeBtn() {
    return this.finalizeButton;
  }

  get confirmSubmitBtn() {
    return this.confirmSubmitButton;
  }

  get itemSelectField() {
    return this.itemSelect;
  }

  get dateField() {
    return this.dateNeededInput;
  }

  get roomField() {
    return this.roomInput;
  }

  get noteField() {
    return this.noteInput;
  }

  get addItemRowBtn() {
    return this.addItemRowButton;
  }

  async fillNote(note: string) {
    try {
      await expect(this.noteInput).toBeVisible();
      await this.noteInput.fill(note);

      console.log(chalk.green("✔ Note entered"));
    } catch (error) {
      console.error(chalk.red(`Error in fillNote: ${error}`));
      throw error;
    }
  }

  async clickAddItemRow() {
    try {
      await expect(this.addItemRowButton).toBeVisible();
      await expect(this.addItemRowButton).toBeEnabled();
      await this.addItemRowButton.click();

      console.log(chalk.green("✔ Add Item Row clicked"));
    } catch (error) {
      console.error(chalk.red(`Error in clickAddItemRow: ${error}`));
      throw error;
    }
  }

  async deleteItemRow(index: number) {
    try {
      const deleteButtons = this.page.getByRole('button', { name: 'delete' });
      await expect(deleteButtons.nth(index)).toBeVisible();
      await deleteButtons.nth(index).click();

      console.log(chalk.green(`✔ Item row ${index} deleted`));
    } catch (error) {
      console.error(chalk.red(`Error in deleteItemRow: ${error}`));
      throw error;
    }
  }

  async testRequisitionFlow() {
    try {
      await expect(this.itemSelect).toBeVisible();
      await this.fillRequisitionForm();

      // DEBUG: print all validation errors and page text
      console.log("=== DEBUG: Form State & Validation Errors ===");
      const errors = await this.page.evaluate(() => {
        const errorElements = Array.from(document.querySelectorAll('.ant-form-item-explain, .ant-form-item-explain-error, [role="alert"]'));
        const visibleText = document.body.innerText;
        return {
          errors: errorElements.map(el => el.textContent?.trim()),
          visibleText: visibleText.split('\n').filter(line => line.trim().length > 0)
        };
      });
      console.log(JSON.stringify(errors, null, 2));
      console.log("=========================");

      await this.clickFinalize();
      await this.clickConfirmAndSubmit();

      console.log(chalk.blue("✔ Requisition flow completed"));
    } catch (error) {
      console.error(chalk.red(`Requisition flow failed: ${error}`));
      console.log("=== DEBUG: Page Text on Failure ===");
      const pageText = await this.page.evaluate(() => document.body.innerText).catch(() => "could not get page text");
      console.log(pageText);
      console.log("====================================");
      throw error;
    }
  }
}
