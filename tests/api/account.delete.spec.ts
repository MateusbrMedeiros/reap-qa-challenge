import { expect, test } from "@playwright/test";
import {
  createValidUser,
  delay,
  deleteUser,
  uniqueUsername,
} from "../../utils/api/accountHelpers";
import { generateToken } from "../../utils/api/userHelpers";

test.describe("/Account/v1/User - DELETE", () => {
  test("Delete a valid user", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";

    const createRes = await createValidUser(request, username, password);
    const { userID } = await createRes.json();
    const token = await generateToken(request, username, password);

    const res = await deleteUser(request, userID, token);
    expect(res.status()).toBe(204);
  });

  test("Error when deleting invalid user ID", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";

    await createValidUser(request, username, password);
    await delay(3000);
    const token = await generateToken(request, username, password);

    const invalidId = "00000000-0000-0000-0000-000000000000";
    const res = await deleteUser(request, invalidId, token);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.message).toContain("User Id not correct!");
  });

  test("Error 404 when user ID is empty", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";

    await createValidUser(request, username, password);
    await delay(3000);
    const token = await generateToken(request, username, password);

    const res = await request.delete(`https://demoqa.com/Account/v1/User/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    expect(res.status()).toBe(404);
  });

  test("Error 401 when Authorization header is missing", async ({
    request,
  }) => {
    const randomId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

    const res = await request.delete(
      `https://demoqa.com/Account/v1/User/${randomId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log("Response:", res.status(), await res.text());
    expect(res.status()).toBe(401);
  });

  test("Error 401 when using a malformed token", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";

    const createRes = await createValidUser(request, username, password);
    const { userID } = await createRes.json();

    const res = await request.delete(
      `https://demoqa.com/Account/v1/User/${userID}`,
      {
        headers: {
          Authorization: "Bearer malformed.token.here",
          Accept: "application/json",
        },
      }
    );
    expect(res.status()).toBe(401);
  });

  test("Error when deleting already deleted user", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";

    const createRes = await createValidUser(request, username, password);
    const { userID } = await createRes.json();
    await delay(1000);
    const token = await generateToken(request, username, password);

    const firstDelete = await deleteUser(request, userID, token);
    expect(firstDelete.status()).toBe(204);

    const secondDelete = await deleteUser(request, userID, token);
    const body = await secondDelete.json();

    expect(secondDelete.status()).toBe(200);
    expect(body.message).toContain("User Id not correct!");
  });
});
