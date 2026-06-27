import { test } from '../PageObjectModel/nuls/fixtures/AuthFixtures';

test.describe('Regression Tests', () => {   
    test('Login Test', async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateToLoginPage();
        await loginPage.inputEmailAddress();
        await loginPage.inputPassword();
        await loginPage.clickLoginButton();

        await dashboardPage.testDashboardPage();
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

    test('Change Profile Photo Test', async ({ loginPage, dashboardPage, profilePage }) => {
        test.setTimeout(60000);

        await loginPage.navigateToLoginPage();
        await loginPage.inputEmailAddress();
        await loginPage.inputPassword();
        await loginPage.clickLoginButton();

        await dashboardPage.clickOKButtonModal();
        await dashboardPage.navigateToProfileFromHeader();
        await profilePage.testChangeProfilePhoto();
    });
});