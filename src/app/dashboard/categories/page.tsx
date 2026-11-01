import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import { formatarData } from "@/lib/uteis";
import { Calendar, Tags, FolderPlus } from "lucide-react";
import CategoryForm from "@/components/dashboard/category-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
  const token = await getToken();
  let categories: Category[] = [];

  try {
    const data = await apiClient<Category[]>("/category", {
      token: token!,
      cache: "no-store",
    });
    categories = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-app-border/40">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-white">
            <Tags className="w-7 h-7 text-brand-primary" />
            Categorias
          </h1>
          <p className="text-muted-foreground text-sm">
            Organize o cardápio da sua pizzaria por categorias de produtos.
          </p>
        </div>

        <CategoryForm />
      </div>

      {/* Grid de Categorias */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="bg-app-card border-app-border text-white transition-all duration-200 hover:border-brand-primary/40 hover:shadow-xl group"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary group-hover:scale-105 transition-transform">
                    <Tags className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg font-bold text-white group-hover:text-brand-primary transition-colors truncate">
                      {category.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Categoria do Cardápio
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <div className="pt-3 border-t border-app-border/50 flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Cadastrada em {formatarData(category.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Estado Vazio de Categorias */
        <Card className="bg-app-card border-app-border text-white p-8 sm:p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-4 shadow-inner">
            <FolderPlus className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
            Nenhuma categoria cadastrada
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Crie categorias para organizar seus produtos (como Pizzas
            Tradicionais, Pizzas Doces, Bebidas e Sobremesas).
          </p>
          <div className="flex justify-center">
            <CategoryForm />
          </div>
        </Card>
      )}
    </div>
  );
}
