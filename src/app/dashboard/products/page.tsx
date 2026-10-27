import { requireAdmin } from "@/lib/auth";

export default async function ProductsPage() {
  await requireAdmin();
  return (
    <div>
      <h1>Products Page</h1>
      {/* Add your products content here */}
    </div>
  );
}
