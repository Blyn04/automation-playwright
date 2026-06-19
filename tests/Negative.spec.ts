import { test, expect } from '../PageObjectModel/nuls/fixtures/AuthFixtures';

test.describe('Negative Login Tests', () => {

  test('Login with invalid email format', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.fillEmailAddress('invalid-email');
    await loginPage.fillPassword('ValidPassword123!');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue('invalid-email');
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
  });

  test('Login with wrong password', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    const emailAddress = process.env.EMAIL_ADDRESS ?? 'test@example.com';

    await loginPage.fillEmailAddress(emailAddress);
    await loginPage.fillPassword('wrongpassword');
    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue(emailAddress);
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
  });

  test('Login with empty email and password', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    await loginPage.clickLoginButton();

    await expect(loginPage.emailField).toHaveValue('');
    await expect(loginPage.passwordField).toHaveValue('');
    await expect(loginPage.submitButton).toBeVisible();
  });

});
