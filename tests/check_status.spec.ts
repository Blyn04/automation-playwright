import { test, expect } from '../PageObjectModel/nuls/fixtures/AuthFixtures';

test('Check Status Page', async ({ loginPage, dashboardPage, page }) => {
  test.setTimeout(120000);
  await loginPage.navigateToLoginPage();
  await loginPage.inputUserEmailAddress();
  await loginPage.inputUserPassword();
  await loginPage.clickLoginButton();

  await dashboardPage.dismissPostLoginModals();

  console.log("Navigating to Status Page...");
  const statusMenu = page.locator('//li[@role="menuitem"]//span[text()="Status Page"]');
  await expect(statusMenu).toBeVisible();
  await statusMenu.click();
  await page.waitForTimeout(3000);

  console.log("=== STATUS PAGE TEXT ===");
  console.log(await page.evaluate(() => document.body.innerText));
  console.log("========================");

  const rows = await page.locator('table tr').evaluateAll(els => els.map(el => el.textContent?.trim()));
  console.log("Table Rows:");
  console.log(JSON.stringify(rows, null, 2));

  console.log("Navigating to Return Items...");
  const returnMenu = page.locator('//li[@role="menuitem"]//span[text()="Return Items"]');
  await expect(returnMenu).toBeVisible();
  await returnMenu.click();
  await page.waitForTimeout(3000);

  console.log("=== RETURN ITEMS PAGE TEXT ===");
  console.log(await page.evaluate(() => document.body.innerText));
  console.log("========================");

  const returnRows = await page.locator('table tr').evaluateAll(els => els.map(el => el.textContent?.trim()));
  console.log("Return Table Rows:");
  console.log(JSON.stringify(returnRows, null, 2));
});
