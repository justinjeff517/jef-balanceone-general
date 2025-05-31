"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // Added import for uuidv4

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ItemDef {
  id: string;
  name: string;
  description: string;
  unit_price: number;
}

interface Supplier {
  name: string;
  slug: string;
  tin: string;
}

const catalog: ItemDef[] = [
  { id: "1", name: "Wireless Headphones", description: "Bluetooth over-ear", unit_price: 59.99 },
  { id: "2", name: "Smart Watch", description: "HR monitor", unit_price: 129.99 },
  { id: "3", name: "Portable Speaker", description: "Waterproof, 12h battery", unit_price: 39.99 },
  { id: "4", name: "E-Reader", description: '6" glare-free, 8GB', unit_price: 79.99 },
  { id: "5", name: "Wireless Mouse", description: "Ergonomic, USB-C", unit_price: 24.99 },
];

const dummySuppliers: Supplier[] = [
  { name: "Alpha Supply Co.", slug: "alpha-supply", tin: "123-456-001" },
  { name: "Bravo Traders", slug: "bravo-traders", tin: "123-456-002" },
  { name: "Charlie Imports", slug: "charlie-imports", tin: "123-456-003" },
];

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams() as { slug?: string | string[] };

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";
  const supplier = useMemo<Supplier>(
    () =>
      dummySuppliers.find((s) => s.slug === slug) || {
        name: slug,
        slug,
        tin: "",
      },
    [slug]
  );

  const [itemMap, setItemMap] = useState<Map<string, PurchaseItem>>(new Map());
  const [receiptDate, setReceiptDate] = useState<string>("");
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const isDateValid = useMemo<boolean>(() => {
    if (!receiptDate) return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(receiptDate)) return false;
    const [year, month, day] = receiptDate.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return (
      !isNaN(d.getTime()) &&
      d.getFullYear() === year &&
      d.getMonth() === month - 1 &&
      d.getDate() === day
    );
  }, [receiptDate]);

  const isNumberValid = receiptNumber.trim() !== "";
  const items = useMemo<PurchaseItem[]>(() => Array.from(itemMap.values()), [itemMap]);
  const total = useMemo<number>(() => items.reduce((sum, it) => sum + it.total_price, 0), [items]);
  const isFormValid = isDateValid && isNumberValid && items.length > 0;

  const addItem = useCallback((def: ItemDef): void => {
    setItemMap((prev) => {
      const m = new Map(prev);
      const ex = m.get(def.id);
      if (ex) {
        const qty = ex.quantity + 1;
        m.set(def.id, {
          ...ex,
          quantity: qty,
          total_price: parseFloat((qty * def.unit_price).toFixed(2)),
        });
      } else {
        m.set(def.id, {
          id: def.id,
          name: def.name,
          description: def.description,
          unit_price: def.unit_price,
          quantity: 1,
          total_price: parseFloat(def.unit_price.toFixed(2)),
        });
      }
      return m;
    });
  }, []);

  const removeItem = useCallback((id: string): void => {
    setItemMap((prev) => {
      const m = new Map(prev);
      m.delete(id);
      return m;
    });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number): void => {
    setItemMap((prev) => {
      const m = new Map(prev);
      const ex = m.get(id);
      if (!ex) return m;
      const newQty = qty > 0 ? qty : 1;
      m.set(id, {
        ...ex,
        quantity: newQty,
        total_price: parseFloat((newQty * ex.unit_price).toFixed(2)),
      });
      return m;
    });
  }, []);

  const available = useMemo<ItemDef[]>(() => catalog.filter((d) => !itemMap.has(d.id)), [itemMap]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!isFormValid) return;
    setLoading(true);

    try {
      const now = new Date().toISOString();

      const dataSection = {
        record_id: uuidv4(),
        supplier_name: supplier.name,
        supplier_slug: supplier.slug,
        supplier_tin: supplier.tin,
        receipt_date: receiptDate,
        receipt_number: receiptNumber,
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price,
        })),
        total_amount: total,
        status: "submitted" as const,
        created_at: now,
      };

      const payload = { payload: { data: dataSection } };
      console.log("=== PAYLOAD ===", JSON.stringify(payload, null, 2));

      // Uncomment and adjust API endpoint as needed
      // await fetch("/api/purchases", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
    } catch (error) {
      console.error("Submission failed:", error);
      // Optionally show user-facing error message
    } finally {
      setLoading(false);
    }
  }, [isFormValid, supplier, receiptDate, receiptNumber, items, total]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Purchase for {supplier.name}</CardTitle>
          <p className="text-sm text-gray-600">TIN: {supplier.tin}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Receipt Date</label>
              <Input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                className={isDateValid ? "" : "border-red-500"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Receipt Number</label>
              <Input
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className={isNumberValid ? "" : "border-red-500"}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => router.push(`/purchases/suppliers/${supplier.slug}/configure`)}
          >
            Configure
          </Button>
        </CardFooter>
      </Card>

      {/* Add Items Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add Items</h2>
        {available.length === 0 ? (
          <p>All catalog items added.</p>
        ) : (
          <div className="space-y-2">
            {available.map((d) => (
              <Card key={d.id}>
                <CardContent className="flex items-center p-2 space-x-3 overflow-hidden">
                  <Button size="sm" onClick={() => addItem(d)}>
                    Add
                  </Button>
                  <span className="font-medium flex-shrink-0 whitespace-nowrap">{d.name}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 truncate">{d.description}</p>
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0 whitespace-nowrap">
                    ${d.unit_price.toFixed(2)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Items Table */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>
        {items.length === 0 ? (
          <p>No items in this purchase.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>${item.total_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

 
      {/* Receipt Inputs & Confirm Dialog */}
      <section className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger asChild>
                <Button disabled={!isFormValid || loading}>
                  {loading ? "Submitting..." : "Submit Purchase"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Purchase</DialogTitle>
                  <DialogDescription>
                    Please review the items and total before confirming your purchase for {supplier.name}.
                  </DialogDescription>
                </DialogHeader>

                {/* Verification List */}
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Items to submit:</h3>
                  <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
                    {items.map((it) => (
                      <li key={it.id} className="flex justify-between">
                        <span>
                          {it.name}, ${it.unit_price.toFixed(2)} x {it.quantity} unit = ${it.total_price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 font-semibold flex justify-between">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Page;