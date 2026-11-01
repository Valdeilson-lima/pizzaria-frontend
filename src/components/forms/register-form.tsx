"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/actions/auth";
import { Flame, Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Cadastro realizado com sucesso!");
      const timer = setTimeout(() => {
        router.push(state.redirect || "/login");
      }, 1000);

      return () => clearTimeout(timer);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.success, state?.error, state?.message, state?.redirect, router]);

  return (
    <Card className="bg-app-card border-app-border shadow-2xl text-white">
      <CardHeader className="space-y-3 pb-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/15 border border-brand-primary/30 text-brand-primary shadow-inner">
          <Flame className="w-8 h-8 fill-brand-primary/30" />
        </div>

        <div>
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sujeito<span className="text-brand-primary">Pizza</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">
            Crie sua conta para gerenciar pedidos e produtos
          </CardDescription>
        </div>

        {state?.message && (
          <p className="text-green-400 text-xs sm:text-sm font-medium text-center bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg">
            {state.message}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-gray-200 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-brand-primary" />
                Nome completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: Carlos Silva"
                required
                minLength={3}
                className="bg-app-background border-app-border text-white text-sm h-11 focus-visible:ring-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-gray-200 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-brand-primary" />
                E-mail profissional
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@pizzaria.com"
                required
                className="bg-app-background border-app-border text-white text-sm h-11 focus-visible:ring-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-gray-200 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-brand-primary" />
                Senha de acesso
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="bg-app-background border-app-border text-white text-sm h-11 focus-visible:ring-brand-primary"
              />
            </div>

            {state?.error && (
              <p className="text-red-400 text-xs sm:text-sm font-medium text-center bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white h-11 font-bold text-base cursor-pointer mt-2 transition-all duration-200 shadow-md shadow-brand-primary/25 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-2">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="text-brand-primary hover:underline font-semibold"
              >
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
