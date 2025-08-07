import { expect, test } from "@playwright/test";
import {
  createUserRaw,
  createValidUser,
  uniqueUsername,
} from "../../utils/api/accountHelpers";

const validPassword = "ValidPass123!";
const maxLengthString = "a".repeat(256);
let username: string;

test.beforeEach(() => {
  username = uniqueUsername();
});

test.describe("/Account/v1/User - Negative scenarios", () => {
  test("Create user without username", async ({ request }) => {
    const res = await createUserRaw(request, { password: validPassword });
    expect(res.status()).toBe(400);
  });

  test("Create user with empty username and password", async ({ request }) => {
    const res = await createUserRaw(request, { userName: "", password: "" });
    expect(res.status()).toBe(400);
  });

  test("Create duplicate user", async ({ request }) => {
    const duplicateUser = uniqueUsername();
    await createValidUser(request, duplicateUser, validPassword);
    const res = await createUserRaw(request, {
      userName: duplicateUser,
      password: validPassword,
    });
    expect(res.status()).toBe(406);

    const body = await res.json();
    expect(body.message).toContain("User exists!");
  });

  test("Create user with overly long username (may return 502)", async ({
    request,
  }) => {
    const res = await createUserRaw(request, {
      userName: maxLengthString,
      password: validPassword,
    });
    expect([400, 502]).toContain(res.status());
  });

  test("Create user with incorrect data types (may return 502)", async ({
    request,
  }) => {
    const res = await createUserRaw(request, {
      userName: 12345,
      password: true,
    } as any);
    expect([400, 502]).toContain(res.status());
  });

  test("Create user with malformed JSON (may return 502)", async ({
    request,
  }) => {
    const rawReq = await request.fetch("https://demoqa.com/Account/v1/User", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: "{userName:'abc',password:'123'}", // invalid JSON
    });
    expect([400, 502]).toContain(rawReq.status());
  });

  test("Create user without Content-Type header (may return 502)", async ({
    request,
  }) => {
    const res = await createUserRaw(
      request,
      { userName: username, password: validPassword },
      {} // no headers
    );
    expect([400, 502]).toContain(res.status());
  });
});
