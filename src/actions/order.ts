"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Order } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function finishOrder(orderId: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    if (!orderId) {
      throw new Error("ID do pedido é obrigatório.");
    }

    const response = await apiClient<Order>("/order/finish", {
      method: "PUT",
      body: JSON.stringify({ order_id: orderId }),
      token,
    });

    revalidatePath("/dashboard");
    return { success: true, order: response };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao finalizar pedido.";
    console.error("Erro ao finalizar pedido:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    if (!orderId) {
      throw new Error("ID do pedido é obrigatório.");
    }

    const response = await apiClient<{ message: string }>(
      `/order?order_id=${encodeURIComponent(orderId)}`,
      {
        method: "DELETE",
        token,
      }
    );

    revalidatePath("/dashboard");
    return {
      success: true,
      message: response?.message || "Pedido cancelado com sucesso.",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao cancelar pedido.";
    console.error("Erro ao cancelar pedido:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
