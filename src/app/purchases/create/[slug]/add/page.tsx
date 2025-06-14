// AddPurchase.tsx

"use client";

import { useParams } from "next/navigation";
import React, { ChangeEvent, useState, useEffect } from "react";
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
  supplier_slug: string;
  name: string;
  unit: string;
  unit_price: number;
  active: boolean;
  imageUrl: string;
}

interface PurchaseItem {
  id: string;
  product_id: string;
  name: string;
  unit: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  imageUrl: string;
}

interface PurchaseForm {
  date: string;
  purchaseNumber: string;
}

export default function AddPurchase() {
  const { slug: supplierSlug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [form, setForm] = useState<PurchaseForm>({ date: "", purchaseNumber: "" });

  // Load products for supplier
  useEffect(() => {
    if (!supplierSlug) return;
    setLoading(true);
    fetch(
      `/api/database/supplier-products/get-supplier-products-by-supplier-slug?` +
        `supplier_slug=${encodeURIComponent(supplierSlug)}`,
      { cache: "no-store" }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((json: any) => {
        // Robustly extract array from response
        let docs: any[] = [];
        if (Array.isArray(json)) {
          docs = json;
        } else if (Array.isArray(json.supplier_products)) {
          docs = json.supplier_products;
        } else if (Array.isArray(json.data)) {
          docs = json.data;
        } else if (
          Array.isArray(json.supplier_products_by_supplier_slug)
        ) {
          docs = json.supplier_products_by_supplier_slug;
        }
        const list: Product[] = docs.map((p: any) => ({
          ...p.data,
          imageUrl: p.data.imageUrl || "/images/placeholder.svg",
        }));
        setProducts(list);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [supplierSlug]);

  // Rehydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("purchases");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        localStorage.removeItem("purchases");
      }
    }
  }, []);

  // Persist purchases to localStorage
  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(items));
  }, [items]);

  const available = products.filter(
    (p) => !items.some((it) => it.product_id === p.id)
  );

  const addToCart = (product: Product) => {
    setItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        product_id: product.id,
        name: product.name,
        unit: product.unit,
        unit_price: product.unit_price,
        quantity: 1,
        total_price: product.unit_price,
        imageUrl: product.imageUrl,
      },
    ]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((list) =>
      list.map((it) =>
        it.id === id
          ? {
              ...it,
              quantity: Math.max(1, it.quantity + delta),
              total_price: it.unit_price * Math.max(1, it.quantity + delta),
            }
          : it
      )
    );
  };

  const removeItem = (id: string) =>
    setItems((list) => list.filter((it) => it.id !== id));

  const handleChange = (
    field: keyof PurchaseForm,
    e: ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submitPurchase = () => {
    const errs: string[] = [];
    const dateRx = /^\d{4}-\d{2}-\d{2}$/;
    if (!form.date) errs.push("Missing Date");
    else if (!dateRx.test(form.date) || !isValid(parseISO(form.date)))
      errs.push("Invalid Date");
    if (!form.purchaseNumber) errs.push("Missing Purchase Number");
    if (errs.length) {
      alert("Fix:\n" + errs.join("\n"));
      return;
    }

    const payload = {
      supplier_slug: supplierSlug,
      purchase_date: form.date,
      purchase_number: form.purchaseNumber,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        unit: i.unit,
        unit_price: i.unit_price,
        quantity: i.quantity,
        total_price: i.total_price,
      })),
      is_submitted: false,
    };

    console.log("Posting purchase", payload);
    // TODO: call API endpoint
    setItems([]);
  };

  const humanDate =
    form.date && isValid(parseISO(form.date))
      ? format(parseISO(form.date), "PPP")
      : "";

  const total = items.reduce((sum, it) => sum + it.total_price, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Add Products */}
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
              {loading ? (
                <p className="text-center text-gray-500">Loading…</p>
              ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
              ) : available.length === 0 ? (
                <p className="text-center text-gray-500">None left.</p>
              ) : (
                available.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-600">
                        ₱{p.unit_price.toFixed(2)} / {p.unit}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => addToCart(p)}>
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

      {/* Cart */}
      {items.length === 0 ? (
        <p className="p-6 text-center text-gray-500">No items added.</p>
      ) : (
        <Card>
          <CardContent className="divide-y">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center py-4 px-6 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={it.imageUrl}
                  alt={it.name} width={80} height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1 ml-6">
                  <h3 className="text-base font-medium">{it.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ₱{it.unit_price.toFixed(2)} / {it.unit}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(it.id, -1)}
                    >
                      –
                    </Button>
                    <span className="w-6 text-center">{it.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(it.id, 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="link"
                      className="text-sm text-red-500"
                      onClick={() => removeItem(it.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="text-right ml-4 w-24">
                  <span className="text-lg font-semibold">
                    ₱{it.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Date & Receipt */}
            <div className="flex flex-wrap gap-6 pt-6 px-6">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  name="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e)}
                  placeholder="YYYY-MM-DD"
                  className="w-full"
                />
                {humanDate && (
                  <p className="mt-1 text-sm text-gray-500">{humanDate}</p>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-1">
                  Purchase Number
                </label>
                <Input
                  name="purchaseNumber"
                  value={form.purchaseNumber}
                  onChange={(e) => handleChange("purchaseNumber", e)}
                  placeholder="PUR-12345"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center px-6 py-4">
            <span className="text-lg font-medium">Total: ₱{total.toFixed(2)}</span>
          </CardFooter>
        </Card>
      )}

      {/* Submit */}
      <div className="flex justify-end mr-10">
        <Button onClick={submitPurchase} disabled={items.length === 0}>
          Submit Purchase
        </Button>
      </div>
    </div>
  );
}
