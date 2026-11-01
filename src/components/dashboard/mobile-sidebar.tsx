"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Flame,
  LogOut,
  LucideIcon,
  Menu,
  Package,
  ShoppingCart,
  Tags,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden bg-app-card border-b border-app-border sticky top-0 z-40">
      <header className="flex h-16 items-center justify-between px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                <Menu className="h-6 w-6" />
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="w-72 p-0 bg-app-sidebar border-app-border text-white flex flex-col justify-between"
          >
            <div>
              <SheetHeader className="border-b border-app-border p-5 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/15 border border-brand-primary/30 text-brand-primary">
                    <Flame className="w-4 h-4 fill-brand-primary/30" />
                  </div>
                  <SheetTitle className="text-lg text-white font-bold tracking-tight">
                    Sujeito<span className="text-brand-primary">Pizza</span>
                  </SheetTitle>
                </div>
              </SheetHeader>

              <nav className="p-4 space-y-1.5">
                <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2">
                  Menu
                </p>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={item.title}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium transition-colors duration-200",
                        isActive
                          ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-app-border p-4">
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer border border-transparent hover:border-red-500/20 font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair do sistema
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-primary/15 border border-brand-primary/30 text-brand-primary">
            <Flame className="w-4 h-4 fill-brand-primary/30" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Sujeito<span className="text-brand-primary">Pizza</span>
          </h1>
        </div>
      </header>
    </div>
  );
}
