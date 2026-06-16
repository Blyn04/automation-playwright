import { test } from '../fixtures/AuthFixtures';

test.describe('Regression Tests', () => {   
    test('Login Test', async ({ loginPage }) => {
        await loginPage.navigateToLoginPage();
        await loginPage.inputEmailAddress();
        await loginPage.inputPassword();
        await loginPage.clickLoginButton();
    });
});