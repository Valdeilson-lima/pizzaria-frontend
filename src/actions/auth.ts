"use server";
import { apiClient } from "@/lib/api";
import { AuthResponse, RegisterResponse, User } from "@/lib/types";
import { setToken } from "@/lib/auth";

export async function registerAction(
  prevState: {
    success: boolean;
    error?: string;
    message?: string;
    redirect?: string;
  } | null,
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Preencha todos os campos" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Senha deve ter pelo menos 6 caracteres",
      };
    }

    const data = {
      name,
      email,
      password,
    };

    const response = await apiClient<RegisterResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      success: true,
      message: response.message.message,
      redirect: "/login",
    };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "Erro ao cadastrar usuário" };
  }
}

export async function loginAction(
  prevState: {
    success: boolean;
    error?: string;
    message?: string;
    redirect?: string;
  } | null,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Preencha todos os campos" };
    }

    const data = {
      email,
      password,
    };

    const response = await apiClient<AuthResponse>("/session", {
      method: "POST",
      body: JSON.stringify(data),
    });

    await setToken(response.user.token);
    return {
      success: true,
      message: response.message,
      redirect: "/dashboard",
    };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "Erro ao realizar login" };
  }
}
