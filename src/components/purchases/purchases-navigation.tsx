"use client";

import React, { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface IndexPillProps {
  number: number;
}

const IndexPill: FC<IndexPillProps> = ({ number }) => (
  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
    {number}
  </span>
);

export const NavigationMenuDemo: FC = () => {
  const pathname = usePathname();
  const [cartCount] = React.useState<number>(3);

  return (
    <header className="w-full bg-white shadow">
      <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6 px-4 py-2">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center space-x-6">


            <NavigationMenuItem>
              <Link
                href="/purchases/create"
                className={`${navigationMenuTriggerStyle()} flex items-center`}
              >
                Create Purchases
                <IndexPill number={3} />
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/purchases/accounting"
                className={`${navigationMenuTriggerStyle()} flex items-center`}
              >
                Unprocessed Purchases
                <IndexPill number={3} />
              </Link>
            </NavigationMenuItem>
                <NavigationMenuItem>
              <Link
                href="/purchases/accounting"
                className={`${navigationMenuTriggerStyle()} flex items-center`}
              >
                Processed Purchases
                <IndexPill number={3} />
              </Link>
            </NavigationMenuItem>
              
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
