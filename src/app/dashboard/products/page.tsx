import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { formatarData, formatarPreco } from "@/lib/uteis";
import { Package, Tags, UtensilsCrossed } from "lucide-react";
import ProductForm from "@/components/dashboard/product-form";
import { ProductDeleteButton } from "@/components/dashboard/product-delete-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage() {
  const token = await getToken();

  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const [productsData, categoriesData] = await Promise.all([
      apiClient<Product[]>("/products", {
        token: token!,
        cache: "no-store",
      }),
      apiClient<Category[]>("/category", {
        token: token!,
        cache: "no-store",
      }),
    ]);
    products = Array.isArray(productsData) ? productsData : [];
    categories = Array.isArray(categoriesData) ? categoriesData : [];
  } catch (error) {
    console.error("Erro ao carregar dados da página de produtos:", error);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Package className="w-7 h-7 text-brand-primary" />
            Produtos
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Administre os produtos e o cardápio da pizzaria.
          </p>
        </div>

        <ProductForm categories={categories} />
      </div>

      {/* Listagem de Produtos */}
      {products.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-app-card border-app-border transition-all duration-300 hover:shadow-xl hover:border-brand-primary/40 text-white flex flex-col overflow-hidden group py-0 gap-0"
            >
              {/* Imagem do Produto */}
              <div className="relative h-48 w-full overflow-hidden bg-black/40">
                {product.banner ? (
                  <img
                    src={product.banner}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-app-background/60 text-muted-foreground">
                    <UtensilsCrossed className="w-12 h-12 stroke-[1.5]" />
                  </div>
                )}

                {/* Tag de Categoria */}
                {product.category?.name && (
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 border border-white/10 shadow-sm">
                    <Tags className="w-3 h-3 text-brand-primary" />
                    {product.category.name}
                  </span>
                )}

                {/* Preço */}
                <span className="absolute top-3 right-3 bg-brand-primary text-white font-bold px-2.5 py-1 rounded-full text-xs shadow-md">
                  {formatarPreco(product.price)}
                </span>
              </div>

              {/* Informações */}
              <CardContent className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-base md:text-lg text-white line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2 min-h-[40px]">
                    {product.description || "Sem descrição disponível."}
                  </p>
                </div>

                <div className="border-t border-app-border/60 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Criado: {formatarData(product.createdAt)}</span>
                  <ProductDeleteButton
                    productId={product.id}
                    productName={product.name}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-app-card border-app-border text-white p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary mb-4">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-2">Nenhum produto cadastrado</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Comece criando o primeiro item do seu cardápio clicando no botão
            abaixo para adicionar pizzas, bebidas ou sobremesas.
          </p>
          <div className="flex justify-center">
            <ProductForm categories={categories} />
          </div>
        </Card>
      )}
    </div>
  );
}
