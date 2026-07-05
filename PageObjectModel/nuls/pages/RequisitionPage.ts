import { expect, Locator, Page } from "@playwright/test";
import { RequisitionLocators } from "../locator/requisition.locators";
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
      await this.selectAntOption(this.itemSelect, item);
      console.log(chalk.green(`✔ Item selected: ${item}`));
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

      const enabledDate = dropdown
        .locator(".ant-picker-cell:not(.ant-picker-cell-disabled) .ant-picker-cell-inner")
        .last();

      await expect(enabledDate).toBeVisible();
      await enabledDate.click();

      await expect(this.dateNeededInput).not.toHaveValue("");

      console.log(chalk.green("✔ Date needed selected"));
    } catch (error) {
      console.error(chalk.red(`Error in selectDateNeeded: ${error}`));
      throw error;
    }
  }

  async selectProgram(programName?: string) {
    const program = programName ?? process.env.REQUISITION_PROGRAM;

    try {
      await this.selectAntOption(this.programSelect, program);
      console.log(chalk.green(`✔ Program selected${program ? `: ${program}` : ""}`));
    } catch (error) {
      console.error(chalk.red(`Error in selectProgram: ${error}`));
      throw error;
    }
  }

  async selectTimeFrom(hour = "09", minute = "00") {
    try {
      await expect(this.timeFromInput).toBeVisible();
      await expect(this.timeFromInput).toBeEnabled();
      await this.timeFromInput.click();

      const panel = this.page.locator(RequisitionLocators.PICKER_DROPDOWN);
      await expect(panel).toBeVisible();
      await this.selectTimeInPanel(panel, hour, minute);

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
      await this.timeToInput.click();

      const panel = this.page.locator(RequisitionLocators.PICKER_DROPDOWN);
      await expect(panel).toBeVisible();
      await this.selectTimeInPanel(panel, hour, minute);

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
    await this.selectItem();
    await this.selectDateNeeded();
    await this.selectProgram();
    await this.selectTimeFrom();
    await this.selectTimeTo();
    await this.fillRoom();
    await this.selectCourseCode();
    await this.selectUsageType();
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
      await this.clickFinalize();
      await this.clickConfirmAndSubmit();

      console.log(chalk.blue("✔ Requisition flow completed"));
    } catch (error) {
      console.error(chalk.red(`Requisition flow failed: ${error}`));
      throw error;
    }
  }
}
