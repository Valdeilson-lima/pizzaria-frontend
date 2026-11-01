"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  RefreshCcw,
  UtensilsCrossed,
  Clock,
  User,
  Search,
  Flame,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatarPreco, tempoDecorrido, formatarData } from "@/lib/uteis";
import { finishOrder, cancelOrder } from "@/actions/order";
import { OrderDetailModal } from "./order-detail-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderProps {
  token: string;
}

export default function Orders({ token }: OrderProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Usamos ref para rastrear se é a primeira carga e evitar flickering
  const isFirstLoadRef = useRef(true);

  // Busca pedidos sem disparar loop de dependências
  const fetchOrders = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) {
          setRefreshing(true);
        } else if (isFirstLoadRef.current) {
          setLoading(true);
        }

        const response = await apiClient<Order[]>("/orders?draft=false", {
          method: "GET",
          cache: "no-store",
          token: token,
        });

        // Apenas pedidos que não foram finalizados (status === false)
        const pendingOrders = (Array.isArray(response) ? response : []).filter(
          (order) => !order.status
        );

        setOrders(pendingOrders);
        isFirstLoadRef.current = false;
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        toast.error("Não foi possível atualizar a fila de pedidos.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  // Inicialização e polling automático seguro (20s)
  useEffect(() => {
    let mounted = true;

    fetchOrders(false);

    const interval = setInterval(() => {
      if (mounted) {
        fetchOrders(true);
      }
    }, 20000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchOrders]);

  // Pedido selecionado derivado de forma limpa pelo ID
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find((o) => o.id === selectedOrderId) ?? null;
  }, [orders, selectedOrderId]);

  // Ação de concluir/finalizar pedido
  const handleFinishOrder = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const tableNumber = targetOrder?.table;

    // Fecha o modal imediatamente para UX responsiva
    setSelectedOrderId(null);

    const result = await finishOrder(orderId);
    if (result.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success(
        `Mesa ${tableNumber !== undefined ? tableNumber : ""} finalizada com sucesso! Mesa liberada.`
      );
    } else {
      toast.error(result.error || "Erro ao concluir o pedido.");
      // Se falhou, recarrega a lista
      fetchOrders(true);
    }
  };

  // Ação de cancelar pedido
  const handleCancelOrder = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const tableNumber = targetOrder?.table;

    setSelectedOrderId(null);

    const result = await cancelOrder(orderId);
    if (result.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success(
        `Pedido da Mesa ${tableNumber !== undefined ? tableNumber : ""} cancelado e mesa liberada.`
      );
    } else {
      toast.error(result.error || "Erro ao cancelar pedido.");
      fetchOrders(true);
    }
  };

  // Filtro de busca por número da mesa, nome do cliente ou item
  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return orders;

    return orders.filter((order) => {
      const matchTable = String(order.table).includes(term);
      const matchName = order.name?.toLowerCase().includes(term);
      const matchItem = order.orderItems?.some((item) =>
        item.product?.name?.toLowerCase().includes(term)
      );
      return matchTable || matchName || matchItem;
    });
  }, [orders, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Fila de Produção */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-app-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-white">
              <UtensilsCrossed className="w-7 h-7 text-brand-primary" />
              Fila da Cozinha
            </h1>

            {!loading && (
              <Badge
                variant="outline"
                className="border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1.5"
              >
                <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                {orders.length}{" "}
                {orders.length === 1 ? "mesa ativa" : "mesas ativas"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Gerencie os pedidos em preparo e conclua os atendimentos em tempo
            real.
          </p>
        </div>

        {/* Barra de ações e busca */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {orders.length > 0 && (
            <div className="relative min-w-55">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar mesa ou item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 bg-app-card border-app-border text-white text-xs sm:text-sm"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders(true)}
            disabled={loading || refreshing}
            className="border-app-border bg-app-card hover:bg-white/5 text-white cursor-pointer h-9 px-3 text-xs sm:text-sm font-medium transition-all"
          >
            <RefreshCcw
              className={cn(
                "w-3.5 h-3.5 mr-1.5",
                (loading || refreshing) && "animate-spin"
              )}
            />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </div>

      {/* Estados da Interface */}
      {loading ? (
        /* Skeleton Loading State (Apenas no primeiro carregamento) */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((skeleton) => (
            <div
              key={skeleton}
              className="bg-app-card border border-app-border rounded-xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/10 rounded-lg" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-20 bg-white/10 rounded" />
                    <div className="h-3 w-14 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="h-6 w-24 bg-white/10 rounded-full" />
              </div>

              <div className="space-y-2 pt-2">
                <div className="h-3 w-28 bg-white/10 rounded" />
                <div className="h-8 bg-white/5 rounded-md" />
                <div className="h-8 bg-white/5 rounded-md" />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-app-border/40">
                <div className="h-5 w-20 bg-white/10 rounded" />
                <div className="h-9 w-24 bg-white/10 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <Card className="bg-app-card border-app-border text-white p-8 sm:p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-4 shadow-inner">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
            Nenhum pedido em produção
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
            A fila da cozinha está livre no momento. Quando o salão ou os
            garçons enviarem novos pedidos para a cozinha, eles aparecerão aqui
            instantaneamente.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => fetchOrders(true)}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold cursor-pointer transition-all duration-200"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Verificar novos pedidos
            </Button>
          </div>
        </Card>
      ) : filteredOrders.length === 0 ? (
        /* Empty Filter Search State */
        <Card className="bg-app-card border-app-border text-white p-8 text-center">
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">
            Nenhum pedido encontrado para &ldquo;{searchTerm}&rdquo;
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Tente buscar por outro número de mesa, nome do cliente ou item.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="border-app-border hover:bg-white/5 text-xs text-white cursor-pointer"
          >
            Limpar busca
          </Button>
        </Card>
      ) : (
        /* Grid de Pedidos */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => {
            const orderTotal =
              order.orderItems?.reduce((acc, item) => {
                return acc + (item.product?.price || 0) * item.amount;
              }, 0) || 0;

            const totalItemsCount =
              order.orderItems?.reduce((acc, item) => acc + item.amount, 0) ||
              0;

            return (
              <Card
                key={order.id}
                className="bg-app-card border-app-border text-white hover:border-brand-primary/40 transition-all duration-200 hover:shadow-xl flex flex-col justify-between overflow-hidden group"
              >
                <CardHeader className="p-4 sm:p-5 pb-3 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 border border-brand-primary/25 text-brand-primary font-mono font-bold text-lg">
                        #{order.table}
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">
                          Mesa {order.table}
                        </CardTitle>
                        {order.name ? (
                          <p className="text-xs text-gray-300 flex items-center gap-1 truncate max-w-37.5 sm:max-w-42.5 mt-0.5">
                            <User className="w-3 h-3 text-brand-primary shrink-0" />
                            <span className="truncate">{order.name}</span>
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Consumo no salão
                          </p>
                        )}
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 font-medium shrink-0 flex items-center gap-1.5"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Em preparo
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {tempoDecorrido(order.createdAt) ||
                        formatarData(order.createdAt)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
                  {/* Lista Resumida de Itens */}
                  <div className="rounded-lg bg-app-background/50 border border-app-border/50 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <span>Itens ({totalItemsCount})</span>
                      <span>Qtd</span>
                    </div>

                    {order.orderItems && order.orderItems.length > 0 ? (
                      <ul className="space-y-1.5">
                        {order.orderItems.slice(0, 3).map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between gap-2 text-xs sm:text-sm"
                          >
                            <span className="text-gray-200 truncate font-medium">
                              {item.product?.name}
                            </span>
                            <span className="font-mono font-bold text-brand-primary bg-brand-primary/15 px-1.5 py-0.5 rounded text-xs shrink-0">
                              {item.amount}×
                            </span>
                          </li>
                        ))}

                        {order.orderItems.length > 3 && (
                          <li className="text-[11px] text-muted-foreground font-medium pt-1 text-center border-t border-app-border/40">
                            + {order.orderItems.length - 3} outros itens no
                            pedido
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Sem itens cadastrados
                      </p>
                    )}
                  </div>

                  <Separator className="bg-app-border/60" />

                  {/* Rodapé do Card com Total e Ação */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                        Total
                      </p>
                      <p className="text-lg font-bold font-mono text-emerald-400">
                        {formatarPreco(orderTotal)}
                      </p>
                    </div>

                    <Button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold cursor-pointer transition-all duration-200 shadow-sm"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes do Pedido */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
        onFinishOrder={handleFinishOrder}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}
