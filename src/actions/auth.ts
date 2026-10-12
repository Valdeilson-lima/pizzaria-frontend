"use server";
import { apiClient } from "@/lib/api";

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

    await apiClient("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      success: true,
      message: "Usuário cadastrado com sucesso!",
      redirect: "/login",
    };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "Erro ao cadastrar usuário" };
  }
}
