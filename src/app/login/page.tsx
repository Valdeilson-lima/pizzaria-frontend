import LoginForm from "@/components/forms/login-form";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login",
  description: "Faça seu login para acessar o sistema",
};

export default async function Login() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
