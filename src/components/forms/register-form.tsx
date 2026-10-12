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
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { Loader2 } from "lucide-react";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  return (
    <Card className="bg-app-card border border-app-border">
      <CardHeader>
        <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
          Sujeito<span className="text-brand-primary">Pizza</span>
        </CardTitle>
        <CardDescription className="text-white/70 text-center">
          Faça seu cadastro para usar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Digite seu nome..."
                className="bg-app-card border border-app-border text-white py-4"
                minLength={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
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
                name="password"
                type="password"
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
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Cadastrar"
              )}
            </Button>
            <p className="text-white text-center mt-3">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="text-brand-primary hover:underline font-bold"
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
