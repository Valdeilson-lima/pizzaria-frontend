"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/lib/types";
import { createProduct } from "@/actions/product";
import { formatarInputMoeda } from "@/lib/uteis";
import { Loader2, Plus, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProductFormProps {
  categories: Category[];
}

export default function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState("");
  const [priceInCents, setPriceInCents] = useState<number>(0);

  function resetForm() {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setSelectedFile(null);
    setSelectedCategory("");
    setDisplayPrice("");
    setPriceInCents(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { display, centavos } = formatarInputMoeda(e.target.value);
    setDisplayPrice(display);
    setPriceInCents(centavos);
  }

  function handleSelectFile(file: File) {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.warning(
        "Selecione um arquivo de imagem válido (JPG, PNG ou WEBP)."
      );
      return;
    }

    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_SIZE) {
      toast.warning("A imagem deve ter no máximo 4MB.");
      return;
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectFile(file);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleSelectFile(file);
    }
  }

  function handleRemoveImage() {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const categoryId =
      selectedCategory || formData.get("categoryId")?.toString().trim();

    if (!categoryId) {
      toast.warning("Selecione uma categoria para o produto.");
      return;
    }

    if (!selectedFile) {
      toast.warning("Selecione uma imagem para o produto.");
      return;
    }

    if (!name) {
      toast.warning("O nome do produto é obrigatório.");
      return;
    }

    if (!priceInCents || priceInCents <= 0) {
      toast.warning("Informe um preço válido para o produto.");
      return;
    }

    if (!description) {
      toast.warning("A descrição do produto é obrigatória.");
      return;
    }

    formData.set("categoryId", categoryId);
    formData.set("file", selectedFile);
    // Salva o preço em centavos no banco de dados (ex: R$ 45,00 vira 4500)
    formData.set("price", String(priceInCents));

    try {
      setLoading(true);
      const result = await createProduct(formData);

      if (result.success) {
        toast.success("Produto cadastrado com sucesso!");
        form.reset();
        resetForm();
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao cadastrar produto.");
      }
    } catch {
      toast.error("Ocorreu um erro ao tentar cadastrar o produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors flex items-center cursor-pointer font-bold">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        }
      />
      <DialogContent className="bg-app-card text-white border-app-border p-6 sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo item ao cardápio.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleCreateProduct}>
          {/* Categoria */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm font-medium">
              Categoria
            </Label>
            <select
              id="category"
              name="categoryId"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loading || categories.length === 0}
              className="flex h-10 w-full rounded-lg border border-app-border bg-app-background px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option
                value=""
                disabled
                className="bg-app-card text-muted-foreground"
              >
                {categories.length === 0
                  ? "Nenhuma categoria cadastrada"
                  : "Selecione uma categoria"}
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="bg-app-card text-white"
                >
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-amber-400">
                Cadastre ao menos uma categoria antes de adicionar um produto.
              </p>
            )}
          </div>

          {/* Upload de Imagem */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Foto do Produto</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="product-image"
              disabled={loading}
            />

            {previewImage ? (
              <div className="relative rounded-lg border border-app-border overflow-hidden group bg-app-background">
                <img
                  src={previewImage}
                  alt="Prévia do produto"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="bg-black/70 hover:bg-black text-white border-white/20 text-xs cursor-pointer"
                  >
                    Trocar Imagem
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="product-image"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-app-border hover:border-brand-primary/60 rounded-lg bg-app-background/50 hover:bg-app-background cursor-pointer transition-colors"
              >
                <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold text-white">
                    Clique para enviar
                  </span>{" "}
                  <span className="text-sm text-muted-foreground">
                    ou arraste a imagem
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG ou WEBP (máx. 4MB)
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* Nome do Produto */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Pizza Calabresa Especial"
              className="border-app-border bg-app-background text-white"
              disabled={loading}
            />
          </div>

          {/* Preço com máscara automática em Real e valor em centavos */}
          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-sm font-medium">
              Preço (R$)
            </Label>
            <Input
              id="price"
              name="price"
              type="text"
              inputMode="numeric"
              value={displayPrice}
              onChange={handlePriceChange}
              placeholder="R$ 0,00"
              className="border-app-border bg-app-background text-white font-medium"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Formatação automática em Real (R$). Salvo em centavos no banco de
              dados.
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva os ingredientes e detalhes do produto..."
              className="border-app-border bg-app-background text-white resize-none"
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={loading || categories.length === 0}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors cursor-pointer font-bold disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar Produto"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
