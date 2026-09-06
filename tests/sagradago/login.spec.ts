import { test } from "../../PageObjectModel/sagradago/fixtures/AuthFixtures";

test.describe("SagradaGo Login", () => {
  test("Sign in with registered email and password", async ({ loginPage }) => {
    test.setTimeout(60_000);

    await loginPage.navigateToLoginPage();
    await loginPage.inputEmailAddress();
    await loginPage.inputPassword();
    await loginPage.clickLoginButton();
    await loginPage.expectLoginSuccess();
  });
});
