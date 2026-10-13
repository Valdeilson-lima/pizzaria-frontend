import { cookies } from "next/headers";
import { apiClient } from "@/lib/api";
import { User } from "./types";

const COOKIE_NAME = "auth_token";

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
  });
}

export async function removeToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUser(): Promise<User | null> {
  const token = await getToken();
  if (!token) {
    return null;
  }

  try {
    const user = await apiClient<User>("/me", {
      token: token,
    });

    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}
