"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductDeleteButtonProps {
  productId: string;
  productName: string;
}

export function ProductDeleteButton({
  productId,
  productName,
}: ProductDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function executeDelete(toastId?: string | number) {
    if (toastId) {
      toast.dismiss(toastId);
    }

    const loadingToastId = toast.loading(`Desativando "${productName}"...`);
    try {
      setLoading(true);
      const result = await deleteProduct(productId);
      toast.dismiss(loadingToastId);

      if (result.success) {
        toast.success(result.message || "Produto desativado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao desativar produto.");
      }
    } catch {
      toast.dismiss(loadingToastId);
      toast.error("Ocorreu um erro ao tentar desativar o produto.");
    } finally {
      setLoading(false);
    }
  }

  function handlePromptDelete() {
    toast.custom(
      (t) => (
        <div className="bg-app-card border border-app-border text-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 min-w-[320px] max-w-sm">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-full bg-red-500/10 text-red-400 shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-white">
                Desativar produto?
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Deseja realmente desativar{" "}
                <span className="font-semibold text-white">
                  &quot;{productName}&quot;
                </span>{" "}
                do cardápio?
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-app-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toast.dismiss(t)}
              className="text-xs text-gray-300 hover:text-white hover:bg-white/10 h-8 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => executeDelete(t)}
              className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 h-8 cursor-pointer"
            >
              Sim, desativar
            </Button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handlePromptDelete}
      disabled={loading}
      title="Desativar produto"
      className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 h-8 px-2 transition-colors cursor-pointer"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
