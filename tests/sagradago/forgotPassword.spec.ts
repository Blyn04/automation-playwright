import { test } from "../../PageObjectModel/sagradago/fixtures/AuthFixtures";

test.describe("SagradaGo Forgot Password", () => {
  test("Send a password reset email from the sign-in modal", async ({ forgotPasswordPage }) => {
    test.setTimeout(60_000);

    await forgotPasswordPage.navigateToForgotPassword();
    await forgotPasswordPage.inputEmailAddress();
    await forgotPasswordPage.clickSendButton();
    await forgotPasswordPage.expectResetEmailSent();
  });
});
