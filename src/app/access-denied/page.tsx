"use client";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-background">
      <h1 className="mb-4 text-4xl font-bold text-white">Acesso negado</h1>
      <p className="text-lg text-white/70">
        Você não tem permissão para acessar esta página.
      </p>
      <p className="text-md text-white/50">
        Entre em contato com o administrador do sistema se acredita que isso é
        um erro.
      </p>
      <Button
        onClick={() => logoutAction()}
        className="mt-4 cursor-pointer bg-red-600 py-5 font-bold text-white transition duration-300 ease-in-out hover:bg-red-700"
      >
        Voltar para a tela de login
      </Button>
    </div>
  );
}
