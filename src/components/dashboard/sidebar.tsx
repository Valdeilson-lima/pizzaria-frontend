"use client";

import {
  Flame,
  LogOut,
  Package,
  ShoppingCart,
  Tags,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";

interface SidebarProps {
  name: string;
}

const menuItems: {
  title: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Pedidos",
    href: "/dashboard",
    icon: ShoppingCart,
  },
  {
    title: "Produtos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/dashboard/categories",
    icon: Tags,
  },
];

export default function Sidebar({ name }: SidebarProps) {
  const pathname = usePathname();
  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 bg-app-sidebar border-r border-app-border select-none">
      {/* Topo / Logo */}
      <div className="border-b border-app-border p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/15 border border-brand-primary/30 text-brand-primary">
            <Flame className="w-5 h-5 fill-brand-primary/30" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Sujeito<span className="text-brand-primary">Pizza</span>
          </h2>
        </div>

        {/* Card do Usuário */}
        <div className="mt-4 flex items-center gap-2.5 bg-app-card/60 border border-app-border/60 p-2.5 rounded-lg">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary font-bold text-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{name}</p>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1.5">
        <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2">
          Menu Principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.title}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-white" : "text-gray-400"
                )}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Rodapé / Sair */}
      <div className="border-t border-app-border p-4">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer border border-transparent hover:border-red-500/20 transition-all font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do sistema
          </Button>
        </form>
      </div>
    </aside>
  );
}
