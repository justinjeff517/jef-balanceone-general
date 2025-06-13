"use client";

import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const branches = [
  {
    data: {
      name: "South Branch",
      slug: "south_branch",
      tin: "987-654-321",
      address: "456 Rizal Avenue, Quezon City",
    },
  },
  {
    data: {
      name: "North Branch",
      slug: "north_branch",
      tin: "555-123-456",
      address: "789 Ayala Boulevard, Makati",
    },
  },
  {
    data: {
      name: "West Branch",
      slug: "west_branch",
      tin: "444-777-888",
      address: "2020 Ortigas Center, Pasig",
    },
  },
  {
    data: {
      name: "Main Branch",
      slug: "main_branch",
      tin: "123-456-789",
      address: "123 Market Street, Manila",
    },
  },
  {
    data: {
      name: "East Branch",
      slug: "east_branch",
      tin: "333-222-111",
      address: "1010 Bonifacio Drive, Taguig",
    },
  },
] as const;

function ListItem({
  title,
  tin,
  address,
  href,
}: {
  title: string;
  tin: string;
  address: string;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block p-3 rounded-md no-underline hover:bg-gray-100"
        >
          <div className="text-sm font-medium">{title}</div>
          <p className="text-xs text-gray-600">{tin}</p>
          <p className="text-xs text-gray-600 line-clamp-2">{address}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export function SalesNavigation() {
  return (
    <header className="w-full bg-white shadow">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center space-x-4">
            {/* Home as a plain link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={
                    navigationMenuTriggerStyle() +
                    " transform transition hover:scale-105"
                  }
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Branches with dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={
                  navigationMenuTriggerStyle() +
                  " transform transition hover:scale-105"
                }
              >
                Branches
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {branches.map((b) => (
                    <ListItem
                      key={b.data.slug}
                      title={b.data.name}
                      tin={b.data.tin}
                      address={b.data.address}
                      href={`/sales/branches/${b.data.slug}`}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
