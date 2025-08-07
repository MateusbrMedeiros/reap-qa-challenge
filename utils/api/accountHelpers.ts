import { APIRequestContext } from "@playwright/test";

const BASE_URL = "https://demoqa.com";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createUserRaw(
  request: APIRequestContext,
  data: { userName?: string; password?: string },
  headers?: Record<string, string>,
  waitMs: number = 500
) {
  const payload: Record<string, any> = {};
  if (data.userName !== undefined) payload.userName = data.userName;
  if (data.password !== undefined) payload.password = data.password;

  if (waitMs > 0) await delay(waitMs);

  const res = await request.post(`${BASE_URL}/Account/v1/User`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    data: payload,
  });

  return res;
}

export async function createValidUser(
  request: APIRequestContext,
  username: string,
  password: string,
  waitMs: number = 2000
) {
  return await createUserRaw(
    request,
    { userName: username, password },
    undefined,
    waitMs
  );
}

export async function generateTokenHeader(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<Record<string, string>> {
  const res = await request.post(`${BASE_URL}/Account/v1/GenerateToken`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      userName: username,
      password,
    },
  });

  if (![200, 201].includes(res.status())) {
    throw new Error(
      `Failed to generate token. Status: ${res.status()} - ${await res.text()}`
    );
  }

  const contentType = res.headers()["content-type"] || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON response when generating token, got: ${contentType}`
    );
  }

  const body = await res.json();

  if (!body.token) {
    throw new Error(
      `Token not found in response: ${JSON.stringify(body, null, 2)}`
    );
  }

  return {
    Authorization: `Bearer ${body.token}`,
    Accept: "application/json",
  };
}

export function generateRandomUsernameWithSpecialChars(length = 12): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export function uniqueUsername(prefix = "user"): string {
  return `${prefix}_${Math.random()
    .toString(36)
    .substring(2, 10)}_${Date.now()}`;
}

export async function deleteUser(
  request: APIRequestContext,
  userId: string,
  token: string
) {
  return await request.delete(`https://demoqa.com/Account/v1/User/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}
