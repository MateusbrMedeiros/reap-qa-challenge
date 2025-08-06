import { Page } from "@playwright/test";

export const selectors = {
  email: 'input[name="email"]',
  firstName: 'input[name="first_name"]',
  lastName: 'input[name="last_name"]',
  password: 'input[type="password"]',
  submitButton: 'button:has-text("Start application")',
  verifyTitle: "text=Verify your email",
};

export async function fillSignupForm(
  page,
  email,
  firstName,
  lastName,
  password
) {
  await page.waitForSelector(selectors.email, { state: "visible" });
  await page.fill(selectors.email, email);

  await page.waitForSelector(selectors.firstName, { state: "visible" });
  await page.fill(selectors.firstName, firstName);

  await page.waitForSelector(selectors.lastName, { state: "visible" });
  await page.fill(selectors.lastName, lastName);

  await page.waitForSelector(selectors.password, { state: "visible" });
  await page.fill(selectors.password, password);
}

export async function submitSignup(
  page: Page,
  waitForSuccess: boolean = false
) {
  await page.waitForSelector(selectors.submitButton, {
    state: "visible",
    timeout: 30000,
  });

  await page.click(selectors.submitButton);

  if (waitForSuccess) {
    try {
      await page.waitForLoadState("domcontentloaded", { timeout: 30000 });

      await Promise.race([
        page.waitForLoadState("networkidle", { timeout: 30000 }),
        page.waitForTimeout(30000),
      ]);
    } catch (error) {
      console.error("Timeout waiting load state:", error);
      throw error;
    }
  }
}
