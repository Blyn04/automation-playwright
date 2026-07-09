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
  private readonly noteInput: Locator;
  private readonly addItemRowButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemSelect = this.page.locator(RequisitionLocators.ITEM_SELECT);
    this.dateNeededInput = this.page.locator(RequisitionLocators.DATE_NEEDED_INPUT);
    this.programSelect = this.page.locator(RequisitionLocators.PROGRAM_SELECT);
    this.timeFromInput = this.page.locator(RequisitionLocators.TIME_FROM_INPUT);
    this.timeToInput = this.page.locator(RequisitionLocators.TIME_TO_INPUT);
    this.roomInput = this.page.locator(RequisitionLocators.ROOM_INPUT);
    this.courseCodeSelect = this.page.locator(RequisitionLocators.COURSE_CODE_SELECT);
    this.usageTypeSelect = this.page.locator(RequisitionLocators.USAGE_TYPE_SELECT);
    this.finalizeButton = this.page.locator(RequisitionLocators.FINALIZE_BUTTON);
    this.confirmSubmitButton = this.page.locator(RequisitionLocators.CONFIRM_SUBMIT_BUTTON);
    this.noteInput = this.page.getByPlaceholder('Leave a note for the custodian');
    this.addItemRowButton = this.page.getByRole('button', { name: 'Add Item Row' });
  }

  private async selectAntOption(trigger: Locator, optionText?: string) {
    await expect(trigger).toBeVisible();

    // Wait for any previous dropdown leave animation to finish
    const leavingDropdown = this.page.locator('.ant-select-dropdown.ant-slide-up-leave');
    await leavingDropdown.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

    await trigger.click();

    const dropdown = this.page.locator(RequisitionLocators.SELECT_DROPDOWN);
    await expect(dropdown.last()).toBeVisible();

    const options = dropdown.last().locator(RequisitionLocators.ANT_SELECT_OPTION);

    if (optionText) {
      const option = options.filter({ hasText: optionText });
      await expect(option.first()).toBeVisible({ timeout: 15000 });

      // DEBUG
      console.log(`=== DEBUG selectAntOption optionText="${optionText}" ===`);
      const html = await dropdown.last().evaluate(el => el.outerHTML).catch(() => "failed to get html");
      console.log("Dropdown HTML:", html);
      const optHtml = await option.first().evaluate(el => el.outerHTML).catch(() => "failed to get option html");
      console.log("Option to click HTML:", optHtml);

      await option.first().click();
      return;
    }

    await expect(options.first()).toBeVisible({ timeout: 15000 });
    await options.first().click();
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

      // Wait for any previous dropdown leave animation to finish
      const leavingDropdown = this.page.locator('.ant-select-dropdown.ant-slide-up-leave');
      await leavingDropdown.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

      await this.itemSelect.click();

      const dropdown = this.page.locator(RequisitionLocators.SELECT_DROPDOWN);
      await expect(dropdown.last()).toBeVisible();

      // Find all options in this dropdown
      const optionsLocator = dropdown.last().locator(RequisitionLocators.ANT_SELECT_OPTION);
      await expect(optionsLocator.first()).toBeVisible({ timeout: 15000 });

      // Let's inspect all options to find a suitable enabled one
      let optionsInfo = await optionsLocator.evaluateAll(els => {
        return els.map(el => ({
          text: el.textContent?.trim() || "",
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

          // Re-open the dropdown
          await this.itemSelect.click();
          await expect(dropdown.last()).toBeVisible();
          await expect(optionsLocator.first()).toBeVisible({ timeout: 15000 });

          // Re-fetch options
          optionsInfo = await optionsLocator.evaluateAll(els => {
            return els.map(el => ({
              text: el.textContent?.trim() || "",
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

      await optionsLocator.nth(targetIndex).click();

      console.log(chalk.green(`✔ Item selected: ${selectedOptionText}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectItem: ${error}`));
      throw error;
    }
  }

  async selectDateNeeded() {
    try {
      await expect(this.dateNeededInput).toBeVisible();
      await this.dateNeededInput.click();

      const dropdown = this.page.locator(RequisitionLocators.PICKER_DROPDOWN);
      await expect(dropdown).toBeVisible();

      // Calculate target date (7 days from now)
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const targetDateStr = `${year}-${month}-${day}`;

      console.log(chalk.blue(`Target date (7 days from now): ${targetDateStr}`));

      const targetCell = dropdown.locator(`.ant-picker-cell[title="${targetDateStr}"]`);
      if (!(await targetCell.isVisible())) {
        console.log(chalk.yellow(`Target date cell for ${targetDateStr} not visible, trying to click next month button`));
        const nextMonthBtn = dropdown.locator(".ant-picker-header-next-btn");
        if (await nextMonthBtn.isVisible()) {
          await nextMonthBtn.click();
        } else {
          const nextBtn = dropdown.locator(".ant-picker-next-btn");
          await nextBtn.click();
        }
        await this.page.waitForTimeout(500);
      }

      await expect(targetCell).toBeVisible();
      await targetCell.click();

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
      await this.programSelect.click();

      const dropdown = this.page.locator(RequisitionLocators.SELECT_DROPDOWN);
      await expect(dropdown.last()).toBeVisible();

      const options = dropdown.last().locator(RequisitionLocators.ANT_SELECT_OPTION);
      await expect(options.first()).toBeVisible({ timeout: 15000 });

      const optionsInfo = await options.evaluateAll(els => {
        return els.map(el => el.textContent?.trim() || "");
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

      await options.nth(targetIndex).click();
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
    const room = roomNumber ?? process.env.REQUISITION_ROOM ?? "101";

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
      const checkbox = this.page.locator('input[type="checkbox"], .ant-checkbox-input').first();
      await checkbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await checkbox.isVisible()) {
        console.log(chalk.blue("Responsibility checkbox detected, checking it..."));
        await checkbox.check();
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
