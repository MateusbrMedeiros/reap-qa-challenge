import { expect, test } from "@playwright/test";

const loginUrl = "https://app.ramp.com/sign-in";

const validEmail = "p5evh@somoj.com";
const validPassword = "CorrectPassword123!";
const invalidPassword = "wrongPassword123!";
const invalidEmail = "invalidEmail";

test.describe("Login Page Scenarios (No real login)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginUrl);
  });

  test('Login attempt with "valid" credentials (simulated)', async ({
    page,
  }) => {
    await page.fill('input[type="email"]', validEmail);
    await page.click('button:has-text("Continue")');
    await page.locator('input[type="password"]').waitFor({ state: "visible" });
    await page.fill('input[type="password"]', validPassword);
    await page.click('button:has-text("Sign in to Ramp")');

    // We can’t assert dashboard, so let's assert UI change or error banner
    await expect(
      page.locator(
        "text=We do not recognize this email password combination. Try again or"
      )
    ).toBeVisible();
  });

  test("Login with wrong password", async ({ page }) => {
    await page.fill('input[type="email"]', validEmail);
    await page.click('button:has-text("Continue")');
    await page.locator('input[type="password"]').waitFor({ state: "visible" });
    await page.fill('input[type="password"]', invalidPassword);
    await page.click('button:has-text("Sign in to Ramp")');

    await expect(
      page.locator(
        "text=We do not recognize this email password combination. Try again or"
      )
    ).toBeVisible();
  });

  test("Login with empty password", async ({ page }) => {
    await page.fill('input[type="email"]', validEmail);
    await page.click('button:has-text("Continue")');
    await page.locator('input[type="password"]').waitFor({ state: "visible" });
    await page.click('button:has-text("Sign in to Ramp")');

    await expect(page).toHaveURL(loginUrl);

    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("Login with invalid email format", async ({ page }) => {
    await page.fill('input[type="email"]', invalidEmail);
    await page.click('button:has-text("Continue")');

    const validationMessage = await page
      .locator('input[type="email"]')
      .evaluate((el) => (el as HTMLInputElement).validationMessage);

    expect(validationMessage).toMatch(/@/);
  });

  test("Password reset flow navigation", async ({ page }) => {
    await page.fill('input[type="email"]', validEmail);
    await page.click('button:has-text("Continue")');
    await page.click("text=Reset password");
    await expect(page).toHaveURL(/forgot-password/i);
  });

  test("Change email address link works", async ({ page }) => {
    await page.fill('input[type="email"]', validEmail);
    await page.click('button:has-text("Continue")');
    await page.click("text=Use a different email");
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
