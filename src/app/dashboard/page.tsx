import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-background">
      <h1 className="text-4xl font-bold text-white mb-4">
        Bem-vindo ao Dashboard
      </h1>
      <p className="text-lg text-white/70">
        Aqui você pode gerenciar suas informações e acessar recursos exclusivos.
      </p>
      <p className="text-md text-white/50">Olá, {user?.name || "usuário"}!</p>
    </div>
  );
}
