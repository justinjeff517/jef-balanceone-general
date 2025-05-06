"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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

type ItemDef = Pick<PurchaseItem, "id" | "name" | "description" | "unit_price">;
const catalog: ItemDef[] = [
  { id: "1", name: "Wireless Headphones", description: "Bluetooth over-ear", unit_price: 59.99 },
  { id: "2", name: "Smart Watch", description: "HR monitor", unit_price: 129.99 },
  { id: "3", name: "Portable Speaker", description: "Waterproof, 12h battery", unit_price: 39.99 },
  { id: "4", name: "E-Reader", description: "6\" glare-free, 8GB", unit_price: 79.99 },
  { id: "5", name: "Wireless Mouse", description: "Ergonomic, USB-C", unit_price: 24.99 },
];

type Supplier = { name: string; slug: string; tin: string; };
const dummySuppliers: Supplier[] = [
  { name: "Alpha Supply Co.", slug: "alpha-supply", tin: "123-456-001" },
  { name: "Bravo Traders", slug: "bravo-traders", tin: "123-456-002" },
  { name: "Charlie Imports", slug: "charlie-imports", tin: "123-456-003" },
];

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";
  const supplier = useMemo(
    () =>
      dummySuppliers.find((s) => s.slug === slug) || { name: slug, slug, tin: "" },
    [slug]
  );

  const [itemMap, setItemMap] = useState<Map<string, PurchaseItem>>(() => new Map());
  const [loading, setLoading] = useState(false);

  const addItem = useCallback((def: ItemDef) => {
    setItemMap((prev) => {
      const m = new Map(prev);
      const ex = m.get(def.id);
      if (ex) {
        const qty = ex.quantity + 1;
        m.set(def.id, { ...ex, quantity: qty, total_price: parseFloat((qty * def.unit_price).toFixed(2)) });
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

  const removeItem = useCallback((id: string) => {
    setItemMap((prev) => {
      const m = new Map(prev);
      m.delete(id);
      return m;
    });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setItemMap((prev) => {
      const m = new Map(prev);
      const ex = m.get(id);
      if (!ex) return m;
      const newQty = qty > 0 ? qty : 1;
      m.set(id, { ...ex, quantity: newQty, total_price: parseFloat((newQty * ex.unit_price).toFixed(2)) });
      return m;
    });
  }, []);

  const available = useMemo(() => catalog.filter((d) => !itemMap.has(d.id)), [itemMap]);
  const items = useMemo(() => Array.from(itemMap.values()), [itemMap]);
  const total = useMemo(() => items.reduce((sum, it) => sum + it.total_price, 0), [items]);

  const handleSubmit = () => {
    setLoading(true);
    const payload = {
      data: {
        supplier_slug: supplier.slug,
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price,
        })),
        total_amount: total,
      },
    };
    console.log(JSON.stringify(payload, null, 2));
    router.push("/purchasing");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Purchase for {supplier.name}</h1>
      <p className="mb-6 text-sm text-gray-600">TIN: {supplier.tin}</p>

      <section>
        <h2 className="text-xl font-semibold mb-4">Add Items</h2>
        {available.length === 0 ? (
          <p>All catalog items added.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {available.map((d) => (
              <Card key={d.id}>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-sm">{d.name}</CardTitle>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button onClick={() => addItem(d)}>Add</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>
        {items.length === 0 ? (
          <p>No items in this purchase.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>{it.name}</TableCell>
                    <TableCell>${it.unit_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={it.quantity}
                        min={1}
                        onChange={(e) => updateQuantity(it.id, parseInt(e.target.value, 10) || 1)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>${it.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(it.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-right font-semibold mt-4">Total: ${total.toFixed(2)}</div>
          </>
        )}
      </section>

      <div className="mt-6 text-right">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
