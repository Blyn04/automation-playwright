import { Page } from "@playwright/test";

const RETRYABLE = /ERR_ABORTED|frame was detached|NS_BINDING_ABORTED|Timeout/i;

export async function gotoApp(page: Page, url: string) {
  const target = url.trim();
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45_000 });
      return;
    } catch (error) {
      lastError = error;
      if (attempt === 3 || !RETRYABLE.test(String(error))) {
        throw error;
      }
    }
  }

  throw lastError;
}
