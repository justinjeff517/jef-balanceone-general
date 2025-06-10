"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { parseISO, format, isValid } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  unit_price: number;
  imageUrl?: string;
}

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  unit: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  imageUrl?: string;
}

interface SaleForm {
  date: string;
  receiptNumber: string;
}

const initialProducts: Product[] = [
  {
    id: uuidv4(),
    name: "Coffee Mug",
    description: "Ceramic coffee mug, 12oz",
    category: "Office",
    unit: "piece",
    unit_price: 5.99,
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: uuidv4(),
    name: "A4 Notebook",
    description: "80-page spiral notebook",
    category: "Stationery",
    unit: "piece",
    unit_price: 3.49,
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: uuidv4(),
    name: "Ballpoint Pens (Pack of 10)",
    description: "Blue ink, medium point",
    category: "Stationery",
    unit: "pack",
    unit_price: 4.25,
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: uuidv4(),
    name: "USB-C Cable",
    description: "3ft USB-C to USB-A cable",
    category: "Electronics",
    unit: "piece",
    unit_price: 8.99,
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: uuidv4(),
    name: "Wireless Mouse",
    description: "2.4GHz wireless optical mouse",
    category: "Electronics",
    unit: "piece",
    unit_price: 24.99,
    imageUrl: "/images/placeholder.svg",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [saleForm, setSaleForm] = useState<SaleForm>({ date: "", receiptNumber: "" });

  const branch = {
    id: uuidv4(),
    name: "North Branch",
    slug: "north_branch",
    tin: "123-456-789",
    address: "456 Main St, Manila",
  };

  const availableProducts = initialProducts.filter(
    p => !cartItems.some(item => item.product_id === p.id)
  );

  const addToCart = (product: Product, qty = 1) => {
    const newItem: CartItem = {
      id: uuidv4(),
      product_id: product.id,
      name: product.name,
      description: product.description,
      unit: product.unit,
      unit_price: product.unit_price,
      quantity: qty,
      total_price: product.unit_price * qty,
      imageUrl: product.imageUrl,
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
              total_price: item.unit_price * Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleFormChange = (field: keyof SaleForm, e: ChangeEvent<HTMLInputElement>) => {
    setSaleForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmitSale = () => {
    const errors: string[] = [];
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!saleForm.date) errors.push("Missing Date");
    else if (!datePattern.test(saleForm.date) || !isValid(parseISO(saleForm.date)))
      errors.push("Invalid Date");
    if (!saleForm.receiptNumber) errors.push("Missing Receipt Number");

    if (errors.length) {
      alert("Please fix before submitting:\n" + errors.join("\n"));
      return;
    }

    const total = cartItems.reduce((sum, i) => sum + i.total_price, 0);
    console.log({
      branch: branch.slug,
      sale_date: saleForm.date,
      receipt_number: saleForm.receiptNumber,
      items: cartItems,
      total_amount: total,
    });
    alert("Sale submitted successfully!");
  };

  const humanizedDate =
    saleForm.date && isValid(parseISO(saleForm.date))
      ? format(parseISO(saleForm.date), "PPP")
      : "";

  const totalAmount = cartItems.reduce((sum, i) => sum + i.total_price, 0);

  return (
    <div>
      <div className="max-w-5xl mx-auto space-y-8">


        {/* Cart */}
        <div>
        {/* Add Products Modal */}
        <div className="p-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Products</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Select Products</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {availableProducts.length === 0 ? (
                  <p className="text-center text-gray-500">All products added.</p>
                ) : (
                  availableProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          ${product.unit_price.toFixed(2)} / {product.unit}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => addToCart(product, 1)}>
                        Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <DialogFooter>
                <DialogClose>Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
          {cartItems.length === 0 ? (
            <p className="p-6 text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <Card>
              <CardContent className="divide-y">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 px-6 hover:bg-gray-50 transition-colors"
                  >
                    <Image
                      src={item.imageUrl!}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 ml-6">
                      <h3 className="text-base font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ${item.unit_price.toFixed(2)} / {item.unit}
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          –
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="link"
                          className="text-sm text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-right ml-4 w-24">
                      <span className="text-lg font-semibold">
                        ${item.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Sale date & receipt */}
                <div className="flex flex-wrap gap-6 pt-6 px-6">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      name="date"
                      value={saleForm.date}
                      onChange={e => handleFormChange("date", e)}
                      placeholder="YYYY-MM-DD"
                      className="w-full"
                    />
                    {humanizedDate && (
                      <p className="mt-1 text-sm text-gray-500">{humanizedDate}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-1">
                      Receipt Number
                    </label>
                    <Input
                      name="receiptNumber"
                      value={saleForm.receiptNumber}
                      onChange={e => handleFormChange("receiptNumber", e)}
                      placeholder="ABC-12345"
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center px-6 py-4">
                <span className="text-lg font-medium">
                  Total: ${totalAmount.toFixed(2)}
                </span>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSubmitSale}>
            Submit Sale
          </Button>
        </div>
      </div>
    </div>
  );
}