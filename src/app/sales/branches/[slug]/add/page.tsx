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
  slug: string;
  name: string;
  unit: string;
  unit_price: number;
  branch_name: string;
  branch_slug: string;
  active: boolean;
  imageUrl: string;
}

interface SalesItem {
  id: string;
  product_id: string;
  name: string;
  unit: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  imageUrl: string;
}

interface SaleForm {
  date: string;
  receiptNumber: string;
}

export default function Page() {
  const { slug: branchSlug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [SalesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [saleForm, setSaleForm] = useState<SaleForm>({ date: "", receiptNumber: "" });

  // load products for branch
  useEffect(() => {
    if (!branchSlug) return;
    setLoading(true);
    fetch(
      `/api/database/products/get-products-by-branch-slug?branch_slug=${encodeURIComponent(
        branchSlug
      )}`,
      { cache: "no-store" }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const flat: Product[] = data.products.map((p: any) => ({
          ...p.data,
          imageUrl: "/images/placeholder.svg",
        }));
        setProducts(flat);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [branchSlug]);

  // on mount, rehydrate cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setSalesItems(JSON.parse(saved));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(SalesItems));
  }, [SalesItems]);

  const availableProducts = products.filter(
    (p) => !SalesItems.some((item) => item.product_id === p.id)
  );

  const addToCart = (product: Product, qty = 1) => {
    setSalesItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        product_id: product.id,
        name: product.name,
        unit: product.unit,
        unit_price: product.unit_price,
        quantity: qty,
        total_price: product.unit_price * qty,
        imageUrl: product.imageUrl,
      },
    ]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setSalesItems((items) =>
      items.map((item) =>
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

  const removeItem = (id: string) =>
    setSalesItems((items) => items.filter((item) => item.id !== id));

  const handleFormChange = (field: keyof SaleForm, e: ChangeEvent<HTMLInputElement>) =>
    setSaleForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmitSale = async () => {
    const errs: string[] = [];
    const dateRx = /^\d{4}-\d{2}-\d{2}$/;
    if (!saleForm.date) errs.push("Missing Date");
    else if (!dateRx.test(saleForm.date) || !isValid(parseISO(saleForm.date)))
      errs.push("Invalid Date");
    if (!saleForm.receiptNumber) errs.push("Missing Receipt Number");
    if (errs.length) {
      alert("Fix:\n" + errs.join("\n"));
      return;
    }

    const payload = {
      branch_name: products[0]?.branch_name || "",
      branch_slug: branchSlug,
     // branch_tin: /* yourBranchTinState */,
      receipt_date: saleForm.date,
      receipt_number: saleForm.receiptNumber,
      is_submitted: false,
      items: SalesItems.map((item) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_price: item.total_price,
      })),
    };

    try {
      //console log
      //dont submit using api yet
      console.log("Posting sale to API", payload);
      //const res = await fetch("/api/database/sales/add-sale", { method: "POST", body: JSON.stringify(payload) }); // TODO: call API endpoint to add sale
      //reset cart
      setSalesItems([]);
    }
    catch (err) {
      alert("Error adding sale: " + err);
    }
  };

  const humanizedDate =
    saleForm.date && isValid(parseISO(saleForm.date))
      ? format(parseISO(saleForm.date), "PPP")
      : "";

  const totalAmount = SalesItems.reduce((s, i) => s + i.total_price, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
              ) : availableProducts.length === 0 ? (
                <p className="text-center text-gray-500">None left.</p>
              ) : (
                availableProducts.map((p) => (
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
      {SalesItems.length === 0 ? (
        <p className="p-6 text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <Card>
          <CardContent className="divide-y">
            {SalesItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center py-4 px-6 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1 ml-6">
                  <h3 className="text-base font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ₱{item.unit_price.toFixed(2)} / {item.unit}
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
                    ₱{item.total_price.toFixed(2)}
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
                  value={saleForm.date}
                  onChange={(e) => handleFormChange("date", e)}
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
                  onChange={(e) => handleFormChange("receiptNumber", e)}
                  placeholder="ABC-12345"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center px-6 py-4">
            <span className="text-lg font-medium">
              Total: ₱{totalAmount.toFixed(2)}
            </span>
          </CardFooter>
        </Card>
      )}

      {/* Submit */}
      <div className="flex justify-end mr-10">
        <Button
     
          onClick={handleSubmitSale}
          disabled={SalesItems.length === 0}
        >
          Submit Sale
        </Button>
      </div>
    </div>
  );
}
