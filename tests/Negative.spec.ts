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
    
    // Assert custom JS error message for invalid format
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
    
    // Assert custom JS error message for restricted email domain
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

