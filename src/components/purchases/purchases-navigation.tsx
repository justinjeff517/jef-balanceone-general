"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShoppingCartIcon } from "lucide-react";

export function NavigationMenuDemo() {
  const pathname = usePathname();
  const [cartCount] = React.useState(3);

  return (
    <header className="w-full bg-white shadow">
      <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6 px-4 py-2">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center space-x-6">
            <NavigationMenuItem>
              <Link
                href="/purchases"
                className={navigationMenuTriggerStyle()}
              >
                All Purchases
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/purchases"
                className={navigationMenuTriggerStyle()}
              >
                Store
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
        <Link href="/purchases/cart" className="relative">
          <ShoppingCartIcon size={28} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
              {cartCount}
            </span>
          )}
        </Link>
              </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>


      </div>
    </header>
  );
}
