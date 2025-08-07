import { expect, test } from "@playwright/test";
import {
  createValidUser,
  uniqueUsername,
} from "../../utils/api/accountHelpers";
import {
  BASE_URL,
  addBooksToUser,
  deleteAllBooksFromUser,
  deleteSingleBookFromUser,
} from "../../utils/api/booksHelpers";
import {
  generateBasicAuthHeader,
  generateToken,
  getUserById,
} from "../../utils/api/userHelpers";

test.describe("/BookStore/v1/Books - DELETE All Books", () => {
  const validIsbn = { isbn: "9781449331818" };

  test("Successfully delete all books from user", async ({ request }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const user = await createValidUser(request, username, password);
    const token = await generateToken(request, username, password);
    const userId = (await user.json()).userID;
    const auth = generateBasicAuthHeader(username, password);

    await addBooksToUser(request, userId, [validIsbn], auth);

    const res = await deleteAllBooksFromUser(request, userId, token);
    expect(res.status()).toBe(204);
  });

  test("Delete all books from user with empty collection should return 204", async ({
    request,
  }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const user = await createValidUser(request, username, password);
    const token = await generateToken(request, username, password);
    const userId = (await user.json()).userID;
    const auth = generateBasicAuthHeader(username, password);

    const res = await deleteAllBooksFromUser(request, userId, token);
    expect(res.status()).toBe(204);
  });

  test("Delete all books from user with empty userId returns 401", async ({
    request,
  }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    await createValidUser(request, username, password);
    const auth = generateBasicAuthHeader(username, password);

    const res = await deleteAllBooksFromUser(request, "", auth);
    expect(res.status()).toBe(401);
  });

  test("Delete all books from invalid user returns 401", async ({
    request,
  }) => {
    const auth = generateBasicAuthHeader("fakeuser", "fakepass123!");

    const res = await deleteAllBooksFromUser(
      request,
      "00000000-0000-0000-0000-000000000000",
      auth
    );

    expect(res.status()).toBe(401);
  });

  test("Delete all books without auth returns 401", async ({ request }) => {
    const res = await request.delete("https://demoqa.com/BookStore/v1/Books", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        userId: "00000000-0000-0000-0000-000000000000",
      },
    });

    expect(res.status()).toBe(401);
  });

  test("Delete all books with malformed auth returns 401", async ({
    request,
  }) => {
    const res = await request.delete("https://demoqa.com/BookStore/v1/Books", {
      headers: {
        Authorization: "Basic malformed.token==",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        userId: "00000000-0000-0000-0000-000000000000",
      },
    });

    expect(res.status()).toBe(401);
  });

  test.describe("DELETE /BookStore/v1/Book - Delete a single book from user", () => {
    test("Delete a valid book from user should return 204", async ({
      request,
    }) => {
      const username = uniqueUsername();
      const password = "ValidPass123!";
      const createRes = await createValidUser(request, username, password);
      const userId = (await createRes.json()).userID;

      const token = await generateToken(request, username, password);
      const validBook = { isbn: "9781449331818" };

      await addBooksToUser(
        request,
        userId,
        [validBook],
        generateBasicAuthHeader(username, password)
      );

      const res = await deleteSingleBookFromUser(
        request,
        userId,
        validBook.isbn,
        token
      );
      expect(res.status()).toBe(204);
    });

    test("Delete book not in user's collection should return 400", async ({
      request,
    }) => {
      const username = uniqueUsername();
      const password = "ValidPass123!";
      const createRes = await createValidUser(request, username, password);
      const userId = (await createRes.json()).userID;

      const token = await generateToken(request, username, password);
      const res = await deleteSingleBookFromUser(
        request,
        userId,
        "9781449331818",
        token
      );
      expect(res.status()).toBe(400);
    });

    test("Delete with invalid userId should return 400 or 401", async ({
      request,
    }) => {
      const username = uniqueUsername();
      const password = "ValidPass123!";
      await createValidUser(request, username, password);
      const token = await generateToken(request, username, password);

      const res = await deleteSingleBookFromUser(
        request,
        "invalid-user-id",
        "9781449331818",
        token
      );
      expect([400, 401]).toContain(res.status());
    });

    test("Delete book without authorization should return 401", async ({
      request,
    }) => {
      const res = await request.delete(`${BASE_URL}/BookStore/v1/Book`, {
        data: {
          isbn: "9781449331818",
          userId: "any-id",
        },
      });

      expect(res.status()).toBe(401);
    });
  });

  test("Delete the same book twice should return 204 then 400", async ({
    request,
  }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";
    const createRes = await createValidUser(request, username, password);
    const userId = (await createRes.json()).userID;

    const token = await generateToken(request, username, password);
    const auth = generateBasicAuthHeader(username, password);
    const validBook = { isbn: "9781449331818" };

    await addBooksToUser(request, userId, [validBook], auth);

    const firstDelete = await deleteSingleBookFromUser(
      request,
      userId,
      validBook.isbn,
      token
    );
    expect(firstDelete.status()).toBe(204);

    const secondDelete = await deleteSingleBookFromUser(
      request,
      userId,
      validBook.isbn,
      token
    );
    expect(secondDelete.status()).toBe(400);
  });

  test("Delete one of two books and validate the other remains", async ({
    request,
  }) => {
    const username = uniqueUsername();
    const password = "ValidPass123!";

    const createRes = await createValidUser(request, username, password);
    const userId = (await createRes.json()).userID;
    const token = await generateToken(request, username, password);
    const auth = generateBasicAuthHeader(username, password);

    const bookOne = { isbn: "9781449331818" };
    const bookTwo = { isbn: "9781449365035" };

    await addBooksToUser(request, userId, [bookOne, bookTwo], auth);

    const deleteRes = await deleteSingleBookFromUser(
      request,
      userId,
      bookOne.isbn,
      token
    );
    expect(deleteRes.status()).toBe(204);

    const getRes = await getUserById(request, userId, token);
    expect(getRes.status()).toBe(200);

    const body = await getRes.json();
    expect(body.books.length).toBe(1);
    expect(body.books[0].isbn).toBe(bookTwo.isbn);
  });
});
