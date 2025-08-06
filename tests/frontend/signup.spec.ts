import { expect, test } from "@playwright/test";
import { generateCorporateLikeEmail } from "../../utils/frontend/email";
import { fillSignupForm, submitSignup } from "../../utils/frontend/formHelpers";
import { generateStrongPassword } from "../../utils/frontend/password";

const SIGNUP_URL = "https://app.ramp.com/sign-up";

test.describe("Sign up scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUP_URL);
    await page.waitForSelector('input[name="email"]');
  });

  test("Valid sign-up", async ({ page }) => {
    await fillSignupForm(
      page,
      generateCorporateLikeEmail(),
      "Mateus",
      "Medeiros",
      generateStrongPassword(14)
    );

    await submitSignup(page, true);

    await Promise.race([
      page.waitForURL(/verify-email/),
      page.waitForSelector("text=Verify your email"),
    ]);
  });

  test("Empty fields", async ({ page }) => {
    await submitSignup(page);
    await expect(page.locator("text=required")).toHaveCount(5);
  });

  test("Invalid email format", async ({ page }) => {
    await fillSignupForm(
      page,
      "invalid-email",
      "Mateus",
      "Medeiros",
      generateStrongPassword(14)
    );
    await submitSignup(page);
    await expect(page.locator("text=Invalid email address")).toBeVisible();
  });

  test("Weak password", async ({ page }) => {
    await fillSignupForm(
      page,
      generateCorporateLikeEmail(),
      "Mateus",
      "Medeiros",
      "weakpass"
    );
    await submitSignup(page);
    await expect(page.locator("text=At least 12 characters")).toBeVisible();
    await expect(
      page.locator("text=At least 1 uppercase character")
    ).toBeVisible();
    await expect(page.locator("text=At least 1 number")).toBeVisible();
  });

  test("Password without lowercase", async ({ page }) => {
    await fillSignupForm(
      page,
      generateCorporateLikeEmail(),
      "Mateus",
      "Medeiros",
      "PASSWORD123!"
    );
    await submitSignup(page);
    await expect(
      page.locator("text=At least 1 lowercase character")
    ).toBeVisible();
  });

  test("Non commonly used password", async ({ page }) => {
    await fillSignupForm(
      page,
      generateCorporateLikeEmail(),
      "Mateus",
      "Medeiros",
      "1234567890!@#"
    );
    await submitSignup(page);
    await expect(
      page.locator("text=Not a commonly used password")
    ).toBeVisible();
  });

  test("Email already registered", async ({ page }) => {
    const reusedEmail = generateCorporateLikeEmail();
    const password = generateStrongPassword(14);

    await fillSignupForm(page, reusedEmail, "Mateus", "Medeiros", password);
    await submitSignup(page);
    await expect(page).toHaveURL(/verify-email/);

    await page.goto(SIGNUP_URL);
    await page.waitForSelector('input[name="email"]');
    await fillSignupForm(page, reusedEmail, "Mateus", "Medeiros", password);
    await submitSignup(page);
    await expect(page).toHaveURL(/sign-in/);
  });
});
