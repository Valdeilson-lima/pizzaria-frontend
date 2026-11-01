"use client";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, LogOut } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 bg-app-background overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-125 w-125 rounded-full bg-red-500/10 blur-[120px]" />

      <Card className="w-full max-w-md bg-app-card border-app-border shadow-2xl text-white text-center relative z-10 p-6 sm:p-8">
        <CardContent className="p-0 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Acesso Negado
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              Você não possui permissões administrativas para acessar esta área
              do sistema.
            </p>
          </div>

          <p className="text-xs text-muted-foreground pt-1">
            Se acredita que isso é um engano, solicite a liberação do seu perfil
            com o gerente da pizzaria.
          </p>

          <div className="pt-2">
            <Button
              onClick={() => logoutAction()}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold h-11 cursor-pointer transition-all duration-200 shadow-md shadow-brand-primary/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair e voltar ao login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
