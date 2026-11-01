"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Dashboard() {
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
    </div>
  );
}
