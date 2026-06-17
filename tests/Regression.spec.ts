import { test } from '../PageObjectModel/nuls/fixtures/AuthFixtures';

test.describe('Regression Tests', () => {   
    test('Login Test', async ({ loginPage }) => {
        await loginPage.navigateToLoginPage();
        await loginPage.inputEmailAddress();
        await loginPage.inputPassword();
        await loginPage.clickLoginButton();
    });

    test('Sign Up Test', async ({ signUpPage }) => {
        await signUpPage.navigateToSignUpPage();
        await signUpPage.clickGoToSignUpButton();
        await signUpPage.inputName();
        await signUpPage.inputEmailAddress();
        await signUpPage.inputEmployeeId();
        await signUpPage.selectJobTitle();
        await signUpPage.selectDepartment();
        await signUpPage.checkTermsCheckbox();
        await signUpPage.clickSignUpButton();
    });
});