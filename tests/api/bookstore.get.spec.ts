import { expect, test } from "@playwright/test";
import { getBooks } from "../../utils/api/booksHelpers";

test.describe("/BookStore/v1/Books - GET", () => {
  test("Should return list of books", async ({ request }) => {
    const res = await getBooks(request);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.books)).toBe(true);
    expect(body.books.length).toBeGreaterThan(0);
  });
});
