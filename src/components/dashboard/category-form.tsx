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
import { Loader2, Plus } from "lucide-react";
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
          <Button className="bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors flex items-center cursor-pointer font-bold">
            <Plus className=" h-4 w-4" />
            Nova Categoria
          </Button>
        }
      />
      <DialogContent className="bg-app-card text-white border-app-border p-6">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova categoria.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleCreateCategory}>
          <div className="">
            <Label htmlFor="name" className="text-right mb-3">
              Nome da categoria
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome da categoria"
              className="border-app-border bg-app-background text-white"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors cursor-pointer font-bold disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
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
