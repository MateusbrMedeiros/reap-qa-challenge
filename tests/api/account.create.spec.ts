import { expect, test } from "@playwright/test";
import {
  createUserRaw,
  generateRandomUsernameWithSpecialChars,
  uniqueUsername,
} from "../../utils/api/accountHelpers";

const validPassword = "ValidPass123!";
let username: string;

test.beforeEach(() => {
  username = uniqueUsername();
});

test.describe("/Account/v1/User - Valid user creation", () => {
  test("Create a valid user with valid password", async ({ request }) => {
    const res = await createUserRaw(request, {
      userName: username,
      password: validPassword,
    });
    expect(res.status()).toBe(201);
  });

  test("Create user with special characters in username", async ({
    request,
  }) => {
    const specialUsername = generateRandomUsernameWithSpecialChars(10);
    const res = await createUserRaw(request, {
      userName: specialUsername,
      password: validPassword,
    });
    expect(res.status()).toBe(201);
  });

  test("Ensure password is never returned in response", async ({ request }) => {
    const res = await createUserRaw(request, {
      userName: username,
      password: validPassword,
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.password).toBeUndefined();
  });
});
