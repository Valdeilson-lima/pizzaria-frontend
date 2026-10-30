"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
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
    <div className="lg:hidden bg-gray-900">
      <header className="sticky-top-0 z-50 border-b border-app-border bg-app-card">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <SheetContent
              side="left"
              className="w-62 p-0 bg-app-sidebar border-app-border"
            >
              <SheetHeader className="border-b border-app-border p-6">
                <SheetTitle className="text-xl text-white font-bold">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-1 flex-col p-4 space-y-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={item.title}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300 text-white",
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

              <div className=" absolute bottom-0 w-full border-t border-app-border p-4">
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
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold">
            Sujeito<span className="text-brand-primary">Pizza</span>
          </h1>
        </div>
      </header>
    </div>
  );
}
