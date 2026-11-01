"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Plus, Tags } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createCategory } from "@/actions/category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CategoryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();

    if (!name) {
      toast.warning("O nome da categoria é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      const result = await createCategory(formData);

      if (result.success) {
        toast.success("Categoria cadastrada com sucesso!");
        form.reset();
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao criar categoria.");
      }
    } catch {
      toast.error("Ocorreu um erro ao tentar criar a categoria.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-brand-primary text-white hover:bg-brand-primary-hover transition-all duration-200 flex items-center cursor-pointer font-bold shadow-md shadow-brand-primary/20">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Categoria
          </Button>
        }
      />
      <DialogContent className="bg-app-card text-white border-app-border p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2 text-brand-primary mb-1">
            <Tags className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Cardápio
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Nova Categoria
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs sm:text-sm">
            Adicione uma nova categoria para organizar pizzas, bebidas ou
            sobremesas.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-3" onSubmit={handleCreateCategory}>
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold text-gray-200"
            >
              Nome da categoria
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Pizzas Especiais, Bebidas..."
              required
              className="border-app-border bg-app-background text-white text-sm h-10 focus-visible:ring-brand-primary"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover transition-all duration-200 cursor-pointer font-bold h-10 shadow-md shadow-brand-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando categoria...
              </>
            ) : (
              "Criar Categoria"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
