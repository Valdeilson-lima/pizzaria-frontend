"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCcw } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatarPreco } from "@/lib/uteis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface OrderProps {
  token: string;
}

export default function Orders({ token }: OrderProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient<Order[]>("/orders?draft=false", {
        method: "GET",
        cache: "no-store",
        token: token,
      });
      setOrders(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      await fetchOrders();
    }
    loadOrders();
  }, [token]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Bem-vindo ao Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Aqui você pode gerenciar os seus pedidos.
          </p>
        </div>
        <Button className="bg-white text-black hover:bg-white hover:text-black cursor-pointer">
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">Carregando...</div>
      ) : orders.length === 0 ? (
        <div className="flex items-center justify-center">
          Nenhum pedido encontrado
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-app-card border-app-border text-white"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg lg:text-xl font-bold">
                    Mesa {order.table}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs select-none">
                    Em produção
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 mt-auto">
                <div className="">
                  <p className="text-sm font-medium mb-2">Itens do Pedido:</p>
                  {order.orderItems && order.orderItems.length > 0 && (
                    <ul className="space-y-1 text-sm">
                      {order.orderItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="font-medium">
                            {item.product.name}
                          </span>
                          <span className="text-white font-bold">
                            {item.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Separator className="my-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs">Total:</p>
                    <p className="text-lg lg:text-xl font-bold">
                      {formatarPreco(
                        order.orderItems?.reduce((acc, item) => {
                          return acc + item.product.price * item.amount;
                        }, 0)
                      )}
                    </p>
                  </div>

                  <Button className="bg-white text-black hover:bg-white hover:text-black cursor-pointer">
                    <Eye className="w-5 h-5" />
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
