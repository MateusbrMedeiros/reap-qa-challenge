import { expect, test } from "@playwright/test";
import { createUserRaw, uniqueUsername } from "../../utils/api/accountHelpers";

test.describe("/Account/v1/User - Password validation", () => {
  test("Reject password shorter than 8 characters", async ({ request }) => {
    const res = await createUserRaw(
      request,
      {
        userName: uniqueUsername(),
        password: "Aa1#",
      },
      undefined,
      5000
    );
    expect(res.status()).toBe(400);
  });

  test("Reject password without uppercase letter", async ({ request }) => {
    const res = await createUserRaw(
      request,
      {
        userName: uniqueUsername(),
        password: "password1!",
      },
      undefined,
      5000
    );
    expect(res.status()).toBe(400);
  });

  test("Reject password without lowercase letter", async ({ request }) => {
    const res = await createUserRaw(
      request,
      {
        userName: uniqueUsername(),
        password: "PASSWORD1!",
      },
      undefined,
      2000
    );
    expect(res.status()).toBe(400);
  });

  test("Reject password without digit", async ({ request }) => {
    const res = await createUserRaw(
      request,
      {
        userName: uniqueUsername(),
        password: "Password!!",
      },
      undefined,
      2000
    );
    expect(res.status()).toBe(400);
  });

  test("Reject password without special character", async ({ request }) => {
    const res = await createUserRaw(
      request,
      {
        userName: uniqueUsername(),
        password: "Password1",
      },
      undefined,
      2000
    );
    expect(res.status()).toBe(400);
  });

  test("Accept password that meets all rules", async ({ request }) => {
    const res = await createUserRaw(
      request,
      {
        userName: uniqueUsername(),
        password: "ValidPass1!",
      },
      undefined,
      2000
    );
    expect(res.status()).toBe(201);
  });
});
