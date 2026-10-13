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
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push(state.redirect || "/dashboard");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [state?.success, state?.redirect, router]);
  return (
    <Card className="bg-app-card border border-app-border">
      <CardHeader>
        <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
          Sujeito<span className="text-brand-primary">Pizza</span>
        </CardTitle>
        <CardDescription className="text-white/70 text-center">
          Faça seu login para usar o sistema
        </CardDescription>
        {state?.message && (
          <p className="text-green-400 text-sm font-medium text-center bg-green-500/10 border border-green-500/20 p-2 rounded">
            {state.message}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Digite seu email..."
                className="text-white bg-app-card border border-app-border py-4"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua senha..."
                className="bg-app-card border border-app-border text-white py-4"
              />
            </div>
            {state?.error && (
              <p className="text-red-400 text-sm font-medium text-center bg-red-500/10 border border-red-500/20 p-2 rounded">
                {state.error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-brand-primary text-white py-4 text-lg font-bold hover:bg-brand-primary/80 cursor-pointer mt-2 transition-all duration-300"
            >
              {isPending ? "Carregando..." : "Entrar"}
            </Button>
            <p className="text-white text-center mt-3">
              Não possui uma conta?{" "}
              <Link
                href="/register"
                className="text-brand-primary hover:underline font-bold"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
