import { expect, test } from "@playwright/test";
import {
  createValidUser,
  uniqueUsername,
} from "../../utils/api/accountHelpers";
import {
  addBooksToUser,
  updateBookForUser,
} from "../../utils/api/booksHelpers";
import { generateBasicAuthHeader } from "../../utils/api/userHelpers";

test.describe("PUT /BookStore/v1/Books/{ISBN} - Update book for user", () => {
  const initialIsbn = "9781449331818";
  const newIsbn = "9781449365035";

  test("Successfully update a book for a valid user", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const auth = generateBasicAuthHeader(username, password);

    const createRes = await createValidUser(request, username, password);
    const userId = (await createRes.json()).userID;

    await addBooksToUser(request, userId, [{ isbn: initialIsbn }], auth);

    const updateRes = await updateBookForUser(
      request,
      initialIsbn,
      { userId, isbn: newIsbn },
      auth
    );

    expect(updateRes.status()).toBe(200);
  });

  test("Attempt to update a non-existent book", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const auth = generateBasicAuthHeader(username, password);

    const createRes = await createValidUser(request, username, password);
    const userId = (await createRes.json()).userID;

    const updateRes = await updateBookForUser(
      request,
      "0000000000000",
      { userId, isbn: newIsbn },
      auth
    );

    expect(updateRes.status()).toBe(400);
  });

  test("Update with invalid authorization", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const auth = generateBasicAuthHeader(username, password);

    const createRes = await createValidUser(request, username, password);
    const userId = (await createRes.json()).userID;

    await addBooksToUser(request, userId, [{ isbn: initialIsbn }], auth);

    const fakeAuth = "Basic invalid.auth.header";

    const updateRes = await updateBookForUser(
      request,
      initialIsbn,
      { userId, isbn: newIsbn },
      fakeAuth
    );

    expect(updateRes.status()).toBe(401);
  });

  test("Update with invalid ISBN format", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const auth = generateBasicAuthHeader(username, password);

    const createRes = await createValidUser(request, username, password);
    const userId = (await createRes.json()).userID;

    await addBooksToUser(request, userId, [{ isbn: initialIsbn }], auth);

    const invalidIsbn = "not-a-real-isbn";

    const updateRes = await updateBookForUser(
      request,
      initialIsbn,
      { userId, isbn: invalidIsbn },
      auth
    );

    expect(updateRes.status()).toBe(400);
  });

  test("Update book for non-existent user", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const auth = generateBasicAuthHeader(username, password);

    const fakeUserId = "00000000-0000-0000-0000-000000000000";

    const updateRes = await updateBookForUser(
      request,
      initialIsbn,
      { userId: fakeUserId, isbn: newIsbn },
      auth
    );

    expect(updateRes.status()).toBe(401);
  });
});
