import RegisterForm from "@/components/forms/register-form";

export default function Register() {
  return (
    <div className="flex h-screen w-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
