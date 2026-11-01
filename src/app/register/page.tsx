import RegisterForm from "@/components/forms/register-form";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export const metadata = {
  title: "Cadastro",
  description: "Crie sua conta para acessar o sistema",
};

export default async function Register() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 bg-app-background overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-125 w-125 rounded-full bg-brand-primary/10 blur-[120px]" />
      <div className="w-full max-w-md relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
