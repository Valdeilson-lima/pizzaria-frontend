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
    <div className="flex h-screen w-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
