"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createProduct(data: FormData) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const name = data.get("name")?.toString().trim();
    const price = data.get("price")?.toString().trim();
    const description = data.get("description")?.toString().trim();
    const categoryId = data.get("categoryId")?.toString().trim();
    const file = data.get("file") as File | null;

    if (!name) {
      throw new Error("O nome do produto é obrigatório.");
    }
    if (!price) {
      throw new Error("O preço do produto é obrigatório.");
    }

    // Valida e garante o valor em centavos como string de dígitos inteiros para o banco (/^[0-9]+$/)
    const digitsOnly = price.replace(/\D/g, "");
    const priceInCents = parseInt(digitsOnly, 10);
    if (!digitsOnly || isNaN(priceInCents) || priceInCents <= 0) {
      throw new Error("O preço do produto é obrigatório e deve ser positivo.");
    }

    if (!description) {
      throw new Error("A descrição do produto é obrigatória.");
    }
    if (!categoryId) {
      throw new Error("A categoria do produto é obrigatória.");
    }
    if (!file || !(file instanceof File) || file.size === 0) {
      throw new Error("A imagem do produto é obrigatória.");
    }

    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB conforme endpoints.md
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("A imagem deve ter no máximo 4MB.");
    }

    // Monta o FormData limpo para envio à API
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", String(priceInCents));
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("file", file);

    const response = await apiClient<Product>("/product", {
      method: "POST",
      body: formData,
      token,
    });

    revalidatePath("/dashboard/products");
    return { success: true, product: response };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao cadastrar produto.";
    console.error("Erro ao cadastrar produto:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    if (!productId) {
      throw new Error("ID do produto é obrigatório.");
    }

    const response = await apiClient<{ message: string }>(
      `/product?productId=${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        token,
      }
    );

    revalidatePath("/dashboard/products", "page");
    return {
      success: true,
      message: response?.message || "Produto desabilitado com sucesso",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao desativar produto.";
    return { success: false, error: errorMessage };
  }
}
