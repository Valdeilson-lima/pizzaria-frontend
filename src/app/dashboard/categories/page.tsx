import { requireAdmin } from "@/lib/auth";

export default async function CategoriesPage() {
  await requireAdmin();
  return (
    <div>
      <h1>Categories Page</h1>
      {/* Add your categories content here */}
    </div>
  );
}
