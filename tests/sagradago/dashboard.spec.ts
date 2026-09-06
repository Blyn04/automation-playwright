import { test } from "../../PageObjectModel/sagradago/fixtures/AuthFixtures";

test.describe("SagradaGo Admin Dashboard", () => {
  test("Sign in as admin and open the dashboard", async ({ dashboardPage }) => {
    test.setTimeout(90_000);

    await dashboardPage.loginAndOpenDashboard();
    await dashboardPage.openBookingsFromSidebar();
  });
});
