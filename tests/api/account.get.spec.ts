import { expect, test } from "@playwright/test";
import {
  createValidUser,
  uniqueUsername,
} from "../../utils/api/accountHelpers";
import { generateToken, getUserById } from "../../utils/api/userHelpers";

const validPassword = "ValidPass123!";

test.describe("/Account/v1/User - Get user tests", () => {
  test("Create user and retrieve by ID", async ({ request }) => {
    const username = uniqueUsername();
    const createRes = await createValidUser(request, username, validPassword);
    const createdBody = await createRes.json();
    const userId = createdBody.userID;

    const token = await generateToken(request, username, validPassword);
    const getRes = await getUserById(request, userId, token);

    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.userId).toBe(userId);
    expect(getBody.username).toBe(username);
  });

  test("Get user without ID", async ({ request }) => {
    const username = uniqueUsername();
    await createValidUser(request, username, validPassword);
    const token = await generateToken(request, username, validPassword);

    const res = await getUserById(request, "", token);
    expect(res.status()).toBe(200); // this is returning 200 as per the API design, however, it returns an error (HTML) - should be an error 502
  });

  test("Get user with invalid ID", async ({ request }) => {
    const username = uniqueUsername();
    await createValidUser(request, username, validPassword);
    const token = await generateToken(request, username, validPassword);

    const res = await getUserById(request, "1", token);
    expect(res.status()).toBe(401);
  });

  test.describe("/Account/v1/User - Authorization errors", () => {
    test("Missing Authorization header returns 401", async ({ request }) => {
      const username = uniqueUsername();
      const password = "ValidPass123!";

      const createRes = await createValidUser(request, username, password);
      const body = await createRes.json();
      const userId = body.userID;

      const res = await request.get(
        `https://demoqa.com/Account/v1/User/${userId}`,
        {
          headers: {
            Accept: "application/json",
            // Authorization is deliberately missing
          },
        }
      );

      expect(res.status()).toBe(401);
    });

    test("Malformed Bearer token returns 401", async ({ request }) => {
      const username = uniqueUsername();
      const password = "ValidPass123!";

      const createRes = await createValidUser(request, username, password);
      const body = await createRes.json();
      const userId = body.userID;

      const res = await request.get(
        `https://demoqa.com/Account/v1/User/${userId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer INVALID.TOKEN.12345",
          },
        }
      );

      expect(res.status()).toBe(401);
    });
  });
});
