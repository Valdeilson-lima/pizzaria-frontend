"use client";

import {
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

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 bg-app-sidebar border-r border-app-border">
      <div className="border-b border-app-border p-6">
        <h2 className="text-xl font-bold">
          Sujeito<span className="text-brand-primary">Pizzaria</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Bem-vindo, {name}!</p>
      </div>

      <nav className="flex-1 p-4 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.title}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300",
                isActive
                  ? "bg-brand-primary text-white"
                  : "hover:bg-gray-600 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" size={16} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-app-border p-4">
        <form action={logoutAction}>
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-300 cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-2" size={16} />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}
