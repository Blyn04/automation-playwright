import { test, expect } from '../PageObjectModel/nuls/fixtures/AuthFixtures';

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

test.describe('Edge Case Sign Up Tests', () => {

  test.beforeEach(async ({ signUpPage }) => {
    await signUpPage.navigateToSignUpPage();
    await signUpPage.clickGoToSignUpButton();
  });

  test('Sign up with very long name', async ({ signUpPage }) => {
    const longName = 'A'.repeat(100);
    // Passing false to assertValue because the page auto-formats the name to Sentence/Title case
    await signUpPage.fillName(longName, false);
    
    await signUpPage.fillEmailAddress('test@example.com');
    await signUpPage.fillEmployeeId('12-3456');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();
    
    // The application formats the name by converting subsequent characters to lowercase
    const expectedName = 'A' + 'a'.repeat(99);
    await expect(signUpPage.nameField).toHaveValue(expectedName);
    
    await signUpPage.clickSignUpButton();
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up with very long email', async ({ signUpPage }) => {
    const longEmail = 'a'.repeat(300) + '@test.com';
    
    await signUpPage.fillName('Test Name');
    await signUpPage.fillEmailAddress(longEmail);
    await signUpPage.fillEmployeeId('12-3456');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();
    
    await expect(signUpPage.emailField).toHaveValue(longEmail);
    
    await signUpPage.clickSignUpButton();
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up with spaces only', async ({ signUpPage }) => {
    await signUpPage.fillName('   ', false);
    await signUpPage.fillEmailAddress('   ', false);
    await signUpPage.fillEmployeeId('   ', false);
    
    // The sign up button should be disabled for invalid input (spaces only)
    await expect(signUpPage.submitButton).toBeDisabled();
  });

  test('Sign up with special characters in name and employee ID', async ({ signUpPage }) => {
    const specialName = 'Name!@#$';
    const specialEmployeeId = '12-3456!@#$';
    
    // Passing false to assertValue because special characters are stripped by the input fields
    await signUpPage.fillName(specialName, false);
    await signUpPage.fillEmailAddress('test@example.com');
    await signUpPage.fillEmployeeId(specialEmployeeId, false);
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();
    
    // Assert stripped/sanitized values
    await expect(signUpPage.nameField).toHaveValue('Name');
    await expect(signUpPage.employeeIdField).toHaveValue('12-3456');
    
    await signUpPage.clickSignUpButton();
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up without accepting terms and conditions', async ({ signUpPage }) => {
    await signUpPage.fillName('Test User');
    await signUpPage.fillEmailAddress('test@example.com');
    await signUpPage.fillEmployeeId('12-3456');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.uncheckTermsCheckbox();
    
    // The sign up button should be disabled when terms are not accepted
    await expect(signUpPage.submitButton).toBeDisabled();
  });

  test('Sign up with empty fields', async ({ signUpPage }) => {
    // The sign up button should be disabled when fields are empty
    await expect(signUpPage.submitButton).toBeDisabled();
    
    await expect(signUpPage.nameField).toHaveValue('');
    await expect(signUpPage.emailField).toHaveValue('');
    await expect(signUpPage.employeeIdField).toHaveValue('');
  });

});

test.describe('Edge Case Inventory Tests', () => {

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    test.setTimeout(90000);
    await loginPage.navigateToLoginPage();
    await loginPage.inputEmailAddress();
    await loginPage.inputPassword();
    await loginPage.clickLoginButton();
    await dashboardPage.navigateToInventory();
  });

  test('Add inventory item with very long name and description', async ({ inventoryPage }) => {
    await inventoryPage.clickAddItemToInventory();

    const longName = 'A'.repeat(100);
    const longDescription = 'B'.repeat(500);

    await inventoryPage.fillItemName(longName);
    await inventoryPage.fillItemDescription(longDescription);
    await inventoryPage.selectCategory("Equipment");
    await inventoryPage.selectAutomaticId();
    await inventoryPage.fillQuantity("25");
    await inventoryPage.fillStockRoomNumber("1010");
    await inventoryPage.fillShelves("TO");
    await inventoryPage.fillRow("10");

    await expect(inventoryPage.nameField).toHaveValue(longName);
    await expect(inventoryPage.descriptionField).toHaveValue(longDescription);
    await expect(inventoryPage.submitButton).toBeVisible();
  });

});

