import { test, expect } from '../fixtures/AuthFixtures';

test.describe('Edge Case Login Tests', () => {

  test('Login with very long email', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const longEmail = 'a'.repeat(300) + '@test.com';

    await loginPage.fillEmailAddress(longEmail);
    await loginPage.fillPassword('ValidPassword123!');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue(longEmail);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with very long password', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const longPassword = 'P'.repeat(500);

    await loginPage.fillEmailAddress('test@example.com');
    await loginPage.fillPassword(longPassword);
    await loginPage.clickLoginButton();

    await expect(loginPage.passwordField).toHaveValue(longPassword);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with spaces only', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.fillEmailAddress('   ', false);
    await loginPage.fillPassword('   ', false);
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue('');
    await expect(loginPage.passwordField).toHaveValue('');
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with special characters', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const specialEmail = '!@#$%^&*()@test.com';
    const specialPassword = '!@#$%^&*()_+-=';

    await loginPage.fillEmailAddress(specialEmail);
    await loginPage.fillPassword(specialPassword);
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue(specialEmail);
    await expect(loginPage.passwordField).toHaveValue(specialPassword);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with leading and trailing whitespace in email', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const trimmedEmail = 'test@example.com';

    await loginPage.fillEmailAddress(`  ${trimmedEmail}  `, false);
    await loginPage.fillPassword('ValidPassword123!');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue(trimmedEmail);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with plus addressing in email', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const plusEmail = 'user+tag@test.com';

    await loginPage.fillEmailAddress(plusEmail);
    await loginPage.fillPassword('ValidPassword123!');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue(plusEmail);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with uppercase email', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const uppercaseEmail = 'TEST@EXAMPLE.COM';

    await loginPage.fillEmailAddress(uppercaseEmail);
    await loginPage.fillPassword('ValidPassword123!');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue(uppercaseEmail);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with email only and empty password', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.fillEmailAddress('test@example.com');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue('test@example.com');
    await expect(loginPage.passwordField).toHaveValue('');
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login with password only and empty email', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.fillPassword('ValidPassword123!');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue('');
    await expect(loginPage.passwordField).toHaveValue('ValidPassword123!');
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Double click login button (rapid click)', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.fillEmailAddress('test@example.com');
    await loginPage.fillPassword('ValidPassword123!');
    await loginPage.doubleClickLoginButton();

    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.emailField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
  });

});
