"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/lib/types";
import { formatarDataHora, formatarPreco, tempoDecorrido } from "@/lib/uteis";
import {
  CheckCircle2,
  Clock,
  User,
  UtensilsCrossed,
  Loader2,
  AlertCircle,
  Receipt,
  Trash2,
} from "lucide-react";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onFinishOrder: (orderId: string) => Promise<void>;
  onCancelOrder?: (orderId: string) => Promise<void>;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onFinishOrder,
  onCancelOrder,
}: OrderDetailModalProps) {
  const [isFinishing, setIsFinishing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cachedOrder, setCachedOrder] = useState<Order | null>(order);

  // Mantém em cache os dados do pedido durante o fade-out de fechamento
  useEffect(() => {
    if (order) {
      setCachedOrder(order);
    }
  }, [order]);

  const displayOrder = order || cachedOrder;
  if (!displayOrder) return null;

  const totalAmount =
    displayOrder.orderItems?.reduce((acc, item) => {
      return acc + (item.product?.price || 0) * item.amount;
    }, 0) || 0;

  const totalItemsCount =
    displayOrder.orderItems?.reduce((acc, item) => acc + item.amount, 0) || 0;

  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      await onFinishOrder(displayOrder.id);
      onClose();
    } finally {
      setIsFinishing(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancelOrder) return;
    try {
      setIsCanceling(true);
      await onCancelOrder(displayOrder.id);
      setConfirmCancel(false);
      onClose();
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setConfirmCancel(false);
          onClose();
        }
      }}
    >
      <DialogContent className="bg-app-card text-white border-app-border p-5 sm:p-6 sm:max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader className="space-y-3 pb-3 border-b border-app-border pr-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 border border-brand-primary/25 text-brand-primary font-mono font-bold text-lg">
                #{displayOrder.table}
              </span>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Mesa {displayOrder.table}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  Criado {formatarDataHora(displayOrder.createdAt)} (
                  {tempoDecorrido(displayOrder.createdAt)})
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 font-medium flex items-center gap-1.5 shrink-0"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Em produção
            </Badge>
          </div>

          {displayOrder.name && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 bg-app-background/80 px-3 py-2 rounded-lg border border-app-border/50">
              <User className="w-4 h-4 text-brand-primary shrink-0" />
              <span>Cliente / Referência:</span>
              <strong className="text-white font-semibold truncate">
                {displayOrder.name}
              </strong>
            </div>
          )}
        </DialogHeader>

        {/* Lista de itens */}
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <span>Itens do Pedido ({totalItemsCount})</span>
            <span>Subtotal</span>
          </div>

          {displayOrder.orderItems && displayOrder.orderItems.length > 0 ? (
            <div className="divide-y divide-app-border/50 rounded-lg border bg-app-background/50 overflow-hidden">
              {displayOrder.orderItems.map((item) => {
                const itemTotal = (item.product?.price || 0) * item.amount;
                return (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-primary text-white font-mono font-bold text-xs shadow-sm">
                        {item.amount}×
                      </span>

                      {item.product?.banner ? (
                        <img
                          src={item.product.banner}
                          alt={item.product.name}
                          className="h-10 w-10 rounded-md object-cover border border-app-border shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-app-card border border-app-border text-muted-foreground">
                          <UtensilsCrossed className="w-5 h-5 text-gray-400" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-white truncate">
                          {item.product?.name || "Produto não identificado"}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {formatarPreco(item.product?.price || 0)} cada
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono font-bold text-sm sm:text-base text-white">
                      {formatarPreco(itemTotal)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground bg-app-background/40 rounded-lg border border-app-border">
              Nenhum item adicionado a este pedido.
            </div>
          )}
        </div>

        <Separator className="bg-app-border" />

        {/* Resumo financeiro */}
        <div className="rounded-lg bg-app-background/90 p-4 border border-app-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Receipt className="w-4 h-4" /> Quantidade total de itens
            </span>
            <span className="font-mono font-bold text-white">
              {totalItemsCount}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-app-border/60">
            <span className="text-base font-bold text-white">
              Total do Pedido
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {formatarPreco(totalAmount)}
            </span>
          </div>
        </div>

        {/* Confirmação de cancelamento */}
        {confirmCancel && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Deseja realmente cancelar este pedido?</span>
            </div>
            <p className="text-xs text-gray-300">
              Essa ação cancelará o pedido, removerá os itens e liberará a Mesa{" "}
              {displayOrder.table}.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                onClick={handleCancel}
                disabled={isCanceling}
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Sim, cancelar pedido"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-app-border hover:bg-white/5 cursor-pointer text-xs text-white"
                onClick={() => setConfirmCancel(false)}
                disabled={isCanceling}
              >
                Voltar
              </Button>
            </div>
          </div>
        )}

        {/* Ações do Rodapé do Modal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div>
            {onCancelOrder && !confirmCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer text-xs"
                onClick={() => setConfirmCancel(true)}
                disabled={isFinishing || isCanceling}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Cancelar mesa
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-app-border hover:bg-white/5 cursor-pointer text-white"
              onClick={() => onClose()}
              disabled={isFinishing || isCanceling}
            >
              Fechar
            </Button>

            <Button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-all duration-200 shadow-md shadow-emerald-950/40"
              onClick={handleFinish}
              disabled={isFinishing || isCanceling}
            >
              {isFinishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Concluindo...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Concluir Pedido
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
