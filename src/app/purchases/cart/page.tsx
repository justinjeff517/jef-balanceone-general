"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  supplierName: string;
  supplierAddress: string;
  imageUrl?: string;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Coffee Mug",
    unit: "pcs",
    price: 5.99,
    quantity: 2,
    supplierName: "OfficeSupplies Co.",
    supplierAddress: "789 Office Park, Makati",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "2",
    name: "A4 Notebook",
    unit: "pcs",
    price: 3.49,
    quantity: 3,
    supplierName: "OfficeSupplies Co.",
    supplierAddress: "789 Office Park, Makati",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "3",
    name: "Ballpoint Pens (Pack of 10)",
    unit: "pack",
    price: 4.25,
    quantity: 1,
    supplierName: "OfficeSupplies Co.",
    supplierAddress: "789 Office Park, Makati",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "4",
    name: "USB-C Cable",
    unit: "pcs",
    price: 8.99,
    quantity: 2,
    supplierName: "GadgetWorld Ltd.",
    supplierAddress: "123 Tech Blvd, Quezon City",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "5",
    name: "Wireless Mouse",
    unit: "pcs",
    price: 24.99,
    quantity: 1,
    supplierName: "GadgetWorld Ltd.",
    supplierAddress: "123 Tech Blvd, Quezon City",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "6",
    name: "LED Desk Lamp",
    unit: "pcs",
    price: 29.99,
    quantity: 1,
    supplierName: "GadgetWorld Ltd.",
    supplierAddress: "123 Tech Blvd, Quezon City",
    imageUrl: "/images/placeholder.svg",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(initialCartItems);
  const [selectedSuppliers, setSelectedSuppliers] = React.useState<Record<string, boolean>>(
    Object.fromEntries(
      Array.from(new Set(initialCartItems.map(i => i.supplierName))).map(name => [name, true])
    )
  );

  const updateQuantity = (id: string, delta: number) =>
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );

  const removeItem = (id: string) =>
    setCartItems(items => items.filter(i => i.id !== id));

  // group by supplier
  const bySupplier = cartItems.reduce((acc, item) => {
    if (!acc[item.supplierName]) acc[item.supplierName] = { address: item.supplierAddress, items: [] as CartItem[] };
    acc[item.supplierName].items.push(item);
    return acc;
  }, {} as Record<string, { address: string; items: CartItem[] }>);

  // compute totals only for checked suppliers
  const filteredItems = cartItems.filter(i => selectedSuppliers[i.supplierName]);
  const totalItems = filteredItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = filteredItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const toggleSupplier = (name: string) =>
    setSelectedSuppliers(sel => ({ ...sel, [name]: !sel[name] }));

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Your Shopping Cart</h1>

      {Object.entries(bySupplier).map(([supplier, { address, items }]) => (
        <Card key={supplier}>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSuppliers[supplier]}
                onChange={() => toggleSupplier(supplier)}
                className="h-4 w-4"
              />
              <CardTitle className="text-lg">{supplier}</CardTitle>
            </div>
            <span className="text-sm text-gray-500">{address}</span>
          </CardHeader>

          <CardContent className="divide-y">
            {items.map(item => (
              <div key={item.id} className="flex items-center py-4 opacity-70">
                <Image
                  src={item.imageUrl!}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="rounded object-cover"
                />

                <div className="flex-1 ml-4">
                  <h3 className="text-base font-medium hover:underline cursor-pointer">{item.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    ${item.price.toFixed(2)} / {item.unit}
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}>–</Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                    <Button variant="link" className="text-sm" onClick={() => removeItem(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="text-right ml-4 w-24">
                  <span className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-lg">
          Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""}):
          <span className="font-semibold ml-2">${totalPrice.toFixed(2)}</span>
        </div>
        <Button size="lg" disabled={totalItems === 0}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
