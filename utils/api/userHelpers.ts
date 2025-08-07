import { APIRequestContext } from "@playwright/test";

const BASE_URL = "https://demoqa.com";

export async function generateToken(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<string> {
  const res = await request.post(`${BASE_URL}/Account/v1/GenerateToken`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: { userName: username, password },
  });

  if (![200, 201].includes(res.status())) {
    throw new Error(
      `Token generation failed. Status: ${res.status()} - ${await res.text()}`
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

  return body.token;
}

export async function generateTokenHeader(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<Record<string, string>> {
  const token = await generateToken(request, username, password);
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

export async function getUserById(
  request: APIRequestContext,
  userId: string,
  token: string
) {
  return await request.get(`${BASE_URL}/Account/v1/User/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}

export function generateBasicAuthHeader(
  username: string,
  password: string
): string {
  const credentials = `${username}:${password}`;
  const encoded = Buffer.from(credentials).toString("base64");
  return `Basic ${encoded}`;
}
