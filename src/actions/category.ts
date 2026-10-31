"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createCategory(data: FormData) {
  try {
    const token = await getToken();
    const name = data.get("name")?.toString();

    if (!name) {
      throw new Error("O nome da categoria é obrigatório.");
    }

    const response = await apiClient<Category>("/category", {
      method: "POST",
      body: JSON.stringify({ name }),
      token: token!,
    });

    revalidatePath("/dashboard/categories");
    return { success: true, category: response };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao criar categoria.";
    console.error("Erro ao criar categoria:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
