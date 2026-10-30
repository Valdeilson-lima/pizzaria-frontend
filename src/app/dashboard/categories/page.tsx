import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import { formatarData } from "@/lib/uteis";
import { Tags } from "lucide-react";

export default async function CategoriesPage() {
  const token = await getToken();
  const categories = await apiClient<Category[]>("/category", {
    token: token!,
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold"> Categorias</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Administre as categorias de produtos.
          </p>
        </div>

        <button>TESTE</button>
      </div>

      {categories.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories?.map((category) => (
            <Card
              key={category.id}
              className="bg-app-card border-app-border transition-shadow hover:shadow-lg text-white"
            >
              <CardHeader>
                <CardTitle className="gap-2 flex items-center text-base md:taxt-lg">
                  <Tags className="w-5 h-5" />
                  <span>{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 text-sm">
                  Data de criação: {formatarData(category.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <p>Nenhuma categoria cadastrada</p>
        </div>
      )}
    </div>
  );
}
