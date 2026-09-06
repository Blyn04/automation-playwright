import { test } from "../../PageObjectModel/sagradago/fixtures/AuthFixtures";

test.describe("SagradaGo Sign Up", () => {
  test("Create an account from the sign-in modal", async ({ signUpPage }) => {
    test.setTimeout(90_000);

    await signUpPage.navigateToSignUpPage();
    await signUpPage.fillRequiredFields();
    await signUpPage.clickSignUpButton();
    await signUpPage.expectSignUpSuccess();
  });
});
