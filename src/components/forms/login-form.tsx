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

export default function LoginForm() {
  return (
    <Card className="bg-app-card border border-app-border">
      <CardHeader>
        <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
          Sujeito<span className="text-brand-primary">Pizza</span>
        </CardTitle>
        <CardDescription className="text-white/70 text-center">
          Faça seu login para usar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email..."
                required
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
                placeholder="Digite sua senha..."
                required
                className="bg-app-card border border-app-border text-white py-4"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-primary text-white py-4 text-lg font-bold hover:bg-brand-primary/80 cursor-pointer mt-2 transition-all duration-300"
            >
              Entrar
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
