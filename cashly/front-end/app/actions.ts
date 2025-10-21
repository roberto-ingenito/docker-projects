"use server";

import { User } from "@/lib/types/auth";
import { cookies } from "next/headers";

const jwt_token_cookie_key = "token";
const user_cookie_key = "user";

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


export async function saveUser(user: User) {
  (await cookies()).set(user_cookie_key, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 anni
    path: "/",
  });
}

export async function deleteUser() {
  (await cookies()).delete(user_cookie_key);
}

export async function getUser(): Promise<User | undefined> {
  const value = (await cookies()).get(user_cookie_key)?.value;

  if (!value) return undefined;

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }

}
