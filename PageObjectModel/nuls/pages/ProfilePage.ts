import { expect, Locator, Page } from "@playwright/test";
import { ProfileLocators } from "../locator/profile.locators";
import path from "path";
import chalk from "chalk";
import fs from "fs";

export class ProfilePage {
  private readonly page: Page;
  private readonly changePhotoButton: Locator;
  private readonly profilePhotoInput: Locator;
  private readonly profilePageHeader: Locator;
  private readonly profileAvatar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.changePhotoButton = this.page.locator(ProfileLocators.CHANGE_PHOTO_BUTTON);
    this.profilePhotoInput = this.page.locator(ProfileLocators.PROFILE_PHOTO_INPUT);
    this.profilePageHeader = this.page.locator(ProfileLocators.PROFILE_PAGE_HEADER);
    this.profileAvatar = this.page.locator(ProfileLocators.PROFILE_AVATAR);
  }

  async verifyProfilePageLoaded() {
    try {
      await expect(this.profilePageHeader).toBeVisible();
      await expect(this.changePhotoButton).toBeVisible();

      console.log(chalk.green("✔ Profile page loaded"));

    } catch (error) {
      console.error(chalk.red(`Error in verifyProfilePageLoaded: ${error}`));
      throw error;
    }
  }

  private resolveProfilePhotoPath(customPath?: string): string {
    if (customPath) {
      return path.isAbsolute(customPath)
        ? customPath
        : path.join(process.cwd(), customPath);
    }

    const envPath = process.env.PROFILE_PHOTO_PATH;
    if (envPath) {
      return envPath;
    }

    // Check POM test-data folder
    const pomTestDataPath = path.join(__dirname, "..", "test-data", "cats.jpg");
    if (fs.existsSync(pomTestDataPath)) {
      return pomTestDataPath;
    }

    // Check root test-data folder
    const rootTestDataPath = path.join(process.cwd(), "test-data", "cats.jpg");
    if (fs.existsSync(rootTestDataPath)) {
      return rootTestDataPath;
    }

    const userProfile = process.env.USERPROFILE || process.env.HOME;
    if (!userProfile) {
      throw new Error("PROFILE_PHOTO_PATH is not set and USERPROFILE/HOME is unavailable");
    }

    return path.join(userProfile, "Downloads", "cats.jpg");
  }

  async changeProfilePhoto(customPath?: string) {
    const imagePath = this.resolveProfilePhotoPath(customPath);

    try {
      await expect(this.changePhotoButton).toBeVisible();
      await expect(this.changePhotoButton).toBeEnabled();

      const fileChooserPromise = this.page.waitForEvent("filechooser");
      await this.changePhotoButton.click();
      console.log(chalk.green("✔ Change Photo clicked"));

      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(imagePath);

      await expect(this.profilePageHeader).toBeVisible();

      console.log(chalk.green(`✔ Profile photo changed with ${imagePath}`));

    } catch (error) {
      console.error(chalk.red(`Error in changeProfilePhoto: ${error}`));
      throw error;
    }
  }

  async testChangeProfilePhoto(customPath?: string) {
    try {
      await this.verifyProfilePageLoaded();
      await this.changeProfilePhoto(customPath);

      console.log(chalk.blue("✔ Profile photo change flow completed"));

    } catch (error) {
      console.error(chalk.red(`Profile photo change flow failed: ${error}`));
      throw error;
    }
  }

  get changePhotoBtn() {
    return this.changePhotoButton;
  }

  get avatar() {
    return this.profileAvatar;
  }
}
