import { test, expect } from '../PageObjectModel/nuls/fixtures/AuthFixtures';

test.describe('Negative Login Tests', () => {

  test('Login with invalid email format', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    // await loginPage.inputEmailAddress.fill('invalid-email'); 
    // await loginPage.inputPassword.fill('ValidPassword123!');  

    await loginPage.clickLoginButton();
  });

  test('Login with wrong password', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    // await loginPage.inputEmailAddress.fill('test@example.com');
    // await loginPage.inputPassword.fill('wrongpassword');       

    await loginPage.clickLoginButton();
  });

  test('Login with empty email and password', async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();

    // await loginPage.inputEmailAddress.fill('');
    // await loginPage.inputPassword.fill('');

    await loginPage.clickLoginButton();
  });

});