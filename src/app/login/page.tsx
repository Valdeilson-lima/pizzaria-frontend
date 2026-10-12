import LoginForm from "@/components/forms/login-form";

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
