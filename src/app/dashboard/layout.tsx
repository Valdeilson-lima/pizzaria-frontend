import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="flex flex-col min-h-screen bg-app-background">
      <header className="bg-app-header text-white p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <main className="grow p-4">{children}</main>
    </div>
  );
}
