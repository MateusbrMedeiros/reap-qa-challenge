import { APIRequestContext } from "@playwright/test";

export const BASE_URL = "https://demoqa.com";

export async function getBooks(request: APIRequestContext) {
  const res = await request.get(`${BASE_URL}/BookStore/v1/Books`);
  return res;
}

export async function addBooksToUser(
  request: APIRequestContext,
  userId: string,
  collectionOfIsbns: { isbn: string }[],
  authHeader: string
) {
  const res = await request.post(`${BASE_URL}/BookStore/v1/Books`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader,
    },
    data: {
      userId,
      collectionOfIsbns,
    },
  });

  return res;
}

interface ReplaceIsbnPayload {
  userId: string;
  isbn: string;
}

export async function updateBookForUser(
  request: APIRequestContext,
  oldIsbn: string,
  payload: ReplaceIsbnPayload,
  auth: string
) {
  return await request.put(`${BASE_URL}/BookStore/v1/Books/${oldIsbn}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    data: payload,
  });
}

export async function deleteAllBooksFromUser(
  request: APIRequestContext,
  userId: string,
  token: string
) {
  const res = await request.delete(
    `https://demoqa.com/BookStore/v1/Books?UserId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res;
}

export async function deleteSingleBookFromUser(
  request: APIRequestContext,
  userId: string,
  isbn: string,
  token: string
) {
  const res = await request.delete(`${BASE_URL}/BookStore/v1/Book`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: {
      isbn,
      userId,
    },
  });

  return res;
}
