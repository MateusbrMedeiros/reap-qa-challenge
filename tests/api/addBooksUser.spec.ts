import { expect, test } from "@playwright/test";
import {
  createValidUser,
  uniqueUsername,
} from "../../utils/api/accountHelpers";
import { addBooksToUser } from "../../utils/api/booksHelpers";
import { generateBasicAuthHeader } from "../../utils/api/userHelpers";

const validIsbn = { isbn: "9781449331818" };
const secondIsbn = { isbn: "9781449365035" };
const fakeIsbn = { isbn: "9999999999999" };

test.describe("POST /BookStore/v1/Books - Add books to user", () => {
  test("Add one valid book to a valid user", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const res = await createValidUser(request, username, password);
    const userId = (await res.json()).userID;
    const auth = generateBasicAuthHeader(username, password);

    const response = await addBooksToUser(request, userId, [validIsbn], auth);

    expect(response.status()).toBe(201);
  });

  test("Add the same book twice should return 401 with error message", async ({
    request,
  }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const res = await createValidUser(request, username, password);
    const userId = (await res.json()).userID;
    const auth = generateBasicAuthHeader(username, password);

    await addBooksToUser(request, userId, [validIsbn], auth);

    const secondRes = await addBooksToUser(request, userId, [validIsbn], auth);
    const body = await secondRes.json();

    expect(secondRes.status()).toBe(400);
    expect(body.message).toContain("ISBN already present");
  });

  test("Add non-existent book should return 400", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const res = await createValidUser(request, username, password);
    const userId = (await res.json()).userID;
    const auth = generateBasicAuthHeader(username, password);

    const invalidRes = await addBooksToUser(request, userId, [fakeIsbn], auth);
    expect(invalidRes.status()).toBe(400);
  });

  test("Add two books to a user successfully", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const res = await createValidUser(request, username, password);
    const userId = (await res.json()).userID;
    const auth = generateBasicAuthHeader(username, password);

    const response = await addBooksToUser(
      request,
      userId,
      [validIsbn, secondIsbn],
      auth
    );

    expect(response.status()).toBe(201);
  });

  test("Add book to invalid user should return 401", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    await createValidUser(request, username, password);
    const auth = generateBasicAuthHeader(username, password);

    const invalidUserId = "00000000-0000-0000-0000-000000000000";
    const response = await addBooksToUser(
      request,
      invalidUserId,
      [validIsbn],
      auth
    );

    expect(response.status()).toBe(401);
  });
});
