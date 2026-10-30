import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await requireAdmin();

  return (
    <div className="">
      <h1>Bem-vindo ao Dashboard</h1>
    </div>
  );
}
