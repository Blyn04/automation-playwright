import { test, expect } from '../PageObjectModel/nuls/fixtures/AuthFixtures';


// NULS
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

test.describe('Negative Sign Up Tests', () => {

  test.beforeEach(async ({ signUpPage }) => {
    await signUpPage.navigateToSignUpPage();
    await signUpPage.clickGoToSignUpButton();
  });

  test('Sign up with invalid email format', async ({ signUpPage }) => {
    await signUpPage.fillName('Test Name');
    await signUpPage.fillEmailAddress('invalid-email', false);
    await signUpPage.fillEmployeeId('12-3456');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();

    await expect(signUpPage.submitButton).toBeEnabled();
    await signUpPage.clickSignUpButton();
    
    const isValid = await signUpPage.emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
    
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up with invalid employee ID format', async ({ signUpPage, page }) => {
    await signUpPage.fillName('Test Name');
    await signUpPage.fillEmailAddress('test@students.nu-moa.edu.ph');
    await signUpPage.fillEmployeeId('12-3', false);
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();

    await expect(signUpPage.submitButton).toBeEnabled();
    await signUpPage.clickSignUpButton();
    
    await expect(page.getByText('Invalid employee ID format. Use ##-#### (e.g., 12-3456).')).toBeVisible();
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up with unauthorized email domain', async ({ signUpPage, page }) => {
    await signUpPage.fillName('Test Name');
    await signUpPage.fillEmailAddress('test@example.com');
    await signUpPage.fillEmployeeId('12-3456');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();

    await expect(signUpPage.submitButton).toBeEnabled();
    await signUpPage.clickSignUpButton();

    await expect(page.getByText('Only @nu-moa.edu.ph and @students.nu-moa.edu.ph email addresses are allowed.')).toBeVisible();
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up with missing name', async ({ signUpPage }) => {
    await signUpPage.fillEmailAddress('test@students.nu-moa.edu.ph');
    await signUpPage.fillEmployeeId('12-3456');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();

    await expect(signUpPage.nameField).toHaveValue('');
    await expect(signUpPage.submitButton).toBeEnabled();
    await signUpPage.clickSignUpButton();
    
    const isValid = await signUpPage.nameField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
    
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up with missing email', async ({ signUpPage }) => {
    await signUpPage.fillName('Test Name');
    await signUpPage.fillEmployeeId('12-3456');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();

    await expect(signUpPage.emailField).toHaveValue('');
    await expect(signUpPage.submitButton).toBeEnabled();
    await signUpPage.clickSignUpButton();
    
    const isValid = await signUpPage.emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
    
    await expect(signUpPage.submitButton).toBeVisible();
  });

  test('Sign up with missing employee ID', async ({ signUpPage }) => {
    await signUpPage.fillName('Test Name');
    await signUpPage.fillEmailAddress('test@students.nu-moa.edu.ph');
    await signUpPage.selectJobTitleOption('Dean');
    await signUpPage.selectDepartmentOption('SAH');
    await signUpPage.checkTermsCheckbox();

    await expect(signUpPage.employeeIdField).toHaveValue('');
    await expect(signUpPage.submitButton).toBeEnabled();
    await signUpPage.clickSignUpButton();
    
    const isValid = await signUpPage.employeeIdField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
    
    await expect(signUpPage.submitButton).toBeVisible();
  });

});

test.describe('Negative Inventory Tests', () => {

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    test.setTimeout(90000);
    await loginPage.navigateToLoginPage();
    await loginPage.inputEmailAddress();
    await loginPage.inputPassword();
    await loginPage.clickLoginButton();
    await dashboardPage.navigateToInventory();
  });

  test('Add inventory item with empty name', async ({ inventoryPage, page }) => {
    await inventoryPage.clickAddItemToInventory();

    await inventoryPage.fillItemDescription('Valid description');
    await inventoryPage.selectCategory('Equipment');
    await inventoryPage.selectAutomaticId();
    await inventoryPage.fillQuantity('25');
    await inventoryPage.fillStockRoomNumber('1010');
    await inventoryPage.fillShelves('TO');
    await inventoryPage.fillRow('10');

    await expect(inventoryPage.nameField).toHaveValue('');
    await inventoryPage.submitButton.click();

    await expect(page.locator('.ant-modal')).toBeVisible();
    await expect(inventoryPage.nameField).toHaveValue('');
  });

  test('Add inventory item with empty quantity', async ({ inventoryPage, page }) => {
    await inventoryPage.clickAddItemToInventory();

    await inventoryPage.fillItemName('Valid name');
    await inventoryPage.fillItemDescription('Valid description');
    await inventoryPage.selectCategory('Equipment');
    await inventoryPage.selectAutomaticId();
    await inventoryPage.fillStockRoomNumber('1010');
    await inventoryPage.fillShelves('TO');
    await inventoryPage.fillRow('10');

    await expect(inventoryPage.quantityField).toHaveValue('');
    await inventoryPage.submitButton.click();

    await expect(page.locator('.ant-modal')).toBeVisible();
    await expect(inventoryPage.quantityField).toHaveValue('');
  });

  test('Add inventory item with spaces only in name', async ({ inventoryPage, page }) => {
    await inventoryPage.clickAddItemToInventory();

    await inventoryPage.fillItemName('   ');
    await inventoryPage.fillItemDescription('Valid description');
    await inventoryPage.selectCategory('Equipment');
    await inventoryPage.selectAutomaticId();
    await inventoryPage.fillQuantity('25');
    await inventoryPage.fillStockRoomNumber('1010');
    await inventoryPage.fillShelves('TO');
    await inventoryPage.fillRow('10');

    await inventoryPage.submitButton.click();

    await expect(page.locator('.ant-modal')).toBeVisible();
    await expect(inventoryPage.nameField).toHaveValue('   ');
  });

  test('Add inventory item with negative quantity', async ({ inventoryPage }) => {
    await inventoryPage.clickAddItemToInventory();

    await inventoryPage.fillItemName('Valid name');
    await inventoryPage.fillItemDescription('Valid description');
    await inventoryPage.selectCategory('Equipment');
    await inventoryPage.selectAutomaticId();

    await inventoryPage.quantityField.fill('-5');
    await expect(inventoryPage.quantityField).toHaveValue('5');
  });

});

test.describe('Negative Requisition Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    test.setTimeout(120000);
    await loginPage.navigateToLoginPage();
    await loginPage.inputUserEmailAddress();
    await loginPage.inputUserPassword();
    await loginPage.clickLoginButton();
    await dashboardPage.navigateToRequisition();
  });

  test('Finalize button is disabled without any form input', async ({ requisitionPage }) => {
    await expect(requisitionPage.finalizeBtn).toBeVisible();
    await expect(requisitionPage.finalizeBtn).toBeDisabled();
  });

  test('Finalize button is disabled without selecting a date', async ({ requisitionPage }) => {
    await requisitionPage.selectItem();
    await requisitionPage.selectProgram();
    await requisitionPage.selectTimeFrom();
    await requisitionPage.selectTimeTo();
    await requisitionPage.fillRoom();
    await requisitionPage.selectCourseCode();
    await requisitionPage.selectUsageType();

    await expect(requisitionPage.dateField).toHaveValue('');
    await expect(requisitionPage.finalizeBtn).toBeDisabled();
  });

  test('Finalize button is disabled without entering a room number', async ({ requisitionPage }) => {
    await requisitionPage.selectItem();
    await requisitionPage.selectDateNeeded();
    await requisitionPage.selectProgram();
    await requisitionPage.selectTimeFrom();
    await requisitionPage.selectTimeTo();
    await requisitionPage.selectCourseCode();
    await requisitionPage.selectUsageType();

    await expect(requisitionPage.roomField).toHaveValue('');
    await expect(requisitionPage.finalizeBtn).toBeDisabled();
  });

});

