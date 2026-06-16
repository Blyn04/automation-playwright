import { test, expect } from '../fixtures/AuthFixtures';

test.describe('Edge Case Login Tests', () => {

  test('Login with very long email', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const longEmail = 'a'.repeat(300) + '@test.com';

    await loginPage.inputEmailAddress.fill(longEmail);
    await loginPage.inputPassword.fill('ValidPassword123!');
    await loginPage.clickLoginButton();

    await expect(loginPage.inputEmailAddress).toHaveValue(longEmail);
  });

  test('Login with spaces only', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.inputEmailAddress.fill('   ');
    await loginPage.inputPassword.fill('   ');
    await loginPage.clickLoginButton();

    await expect(loginPage.inputEmailAddress).toHaveValue('   ');
  });

  test('Login with special characters', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    // await loginPage.inputEmailAddress.fill('!@#$%^&*()@test.com');
    // await loginPage.inputPassword.fill('!@#$%^&*');
    await loginPage.clickLoginButton();

    await expect(loginPage.inputEmailAddress).toHaveValue('!@#$%^&*()@test.com');
  });

  test('Double click login button (rapid click)', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.inputEmailAddress();
    await loginPage.inputPassword();

    // await loginPage.loginButton.click();
    await loginPage.clickLoginButton(); 

    await expect(loginPage.clickLoginButton).toBeVisible();
  });

});