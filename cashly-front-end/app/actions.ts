"use server";

import { cookies } from "next/headers";

const jwt_token_cookie_key = "token";

export async function saveJwtToken(token: string) {
  // Salva il token in un HttpOnly cookie
  (await cookies()).set(jwt_token_cookie_key, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 1, // 1 giorni
    path: "/",
  });
}

export async function deleteJwtToken() {
  (await cookies()).delete(jwt_token_cookie_key);
}

export async function getJwtToken(): Promise<string | undefined> {
  return (await cookies()).get(jwt_token_cookie_key)?.value;
}
