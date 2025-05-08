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
import { Card, CardContent } from "@/components/ui/card";

interface SaleItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

type ItemDef = Pick<SaleItem, "id" | "name" | "description" | "unit_price">;

const catalog: ItemDef[] = [
  { id: "1", name: "Wireless Headphones", description: "Bluetooth over-ear", unit_price: 59.99 },
  { id: "2", name: "Smart Watch", description: "HR monitor", unit_price: 129.99 },
  { id: "3", name: "Portable Speaker", description: "Waterproof, 12h battery", unit_price: 39.99 },
  { id: "4", name: "E-Reader", description: '6" glare-free, 8GB', unit_price: 79.99 },
  { id: "5", name: "Wireless Mouse", description: "Ergonomic, USB-C", unit_price: 24.99 },
];

type Supplier = { name: string; slug: string; tin: string };
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
    () => dummySuppliers.find((s) => s.slug === slug) || { name: slug, slug, tin: "" },
    [slug]
  );

  const [itemMap, setItemMap] = useState<Map<string, SaleItem>>(() => new Map());
  const [saleDate, setSaleDate] = useState("");
  const [saleNumber, setSaleNumber] = useState("");
  const [touched, setTouched] = useState({ saleDate: false, saleNumber: false });
  const [loading, setLoading] = useState(false);

  const isDateValid = useMemo(() => {
    if (!saleDate) return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(saleDate)) return false;
    const date = new Date(saleDate);
    return !isNaN(date.getTime()) && date.toISOString().startsWith(saleDate);
  }, [saleDate]);

  const isNumberValid = useMemo(() => /^\d+$/.test(saleNumber), [saleNumber]);
  const items = useMemo(() => Array.from(itemMap.values()), [itemMap]);
  const total = useMemo(() => items.reduce((sum, it) => sum + it.total_price, 0), [items]);
  const isFormValid = isDateValid && isNumberValid && items.length > 0 && saleNumber !== "";

  const addItem = useCallback((def: ItemDef) => {
    setItemMap((prev) => {
      const m = new Map(prev);
      const existing = m.get(def.id);
      if (existing) {
        const qty = existing.quantity + 1;
        m.set(def.id, { ...existing, quantity: qty, total_price: +(qty * def.unit_price).toFixed(2) });
      } else {
        m.set(def.id, {
          id: def.id,
          name: def.name,
          description: def.description,
          unit_price: def.unit_price,
          quantity: 1,
          total_price: +def.unit_price.toFixed(2),
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
      const existing = m.get(id);
      if (!existing) return m;
      const newQty = Math.max(1, isNaN(qty) ? 1 : qty);
      m.set(id, { ...existing, quantity: newQty, total_price: +(newQty * existing.unit_price).toFixed(2) });
      return m;
    });
  }, []);

  const available = useMemo(() => catalog.filter((d) => !itemMap.has(d.id)), [itemMap]);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      const payload = {
        data: {
          supplier_name: supplier.name,
          supplier_slug: supplier.slug,
          supplier_tin: supplier.tin,
          sale_date: saleDate,
          sale_number: saleNumber,
          items: items.map(({ id, name, description, quantity, unit_price, total_price }) => ({
            id,
            name,
            description,
            quantity,
            unit_price,
            total_price,
          })),
          total_amount: total,
        },
      };
      console.log(JSON.stringify(payload, null, 2));
      // Simulate API call (replace with actual API call if needed)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/sales");
    } catch (error) {
      console.error("Submission failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sale for {supplier.name}</h1>
      <p className="mb-6 text-sm text-gray-600">TIN: {supplier.tin}</p>

      <section>
        <h2 className="text-xl font-semibold mb-4">Add Items</h2>
        {available.length === 0 ? (
          <p>All items added.</p>
        ) : (
          <div className="space-y-2">
            {available.map((d) => (
              <Card key={d.id}>
                <CardContent className="flex items-center p-2 space-x-3 overflow-hidden">
                  <Button size="sm" onClick={() => addItem(d)} className="flex-shrink-0">
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

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Sale Items ({items.length})</h2>
        {items.length === 0 ? (
          <p>No items in this sale.</p>
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
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          updateQuantity(it.id, value);
                        }}
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

      <div className="mt-10 mb-4">
        <label htmlFor="saleDate" className="block mb-1 font-medium">
          Sale Date (YYYY-MM-DD)
        </label>
        <Input
          id="saleDate"
          type="text"
          placeholder="2025-05-08"
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, saleDate: true }))}
          className="max-w-xs"
          aria-describedby={touched.saleDate && !isDateValid ? "saleDateError" : undefined}
        />
        {touched.saleDate && !isDateValid && (
          <p id="saleDateError" className="text-red-500 text-sm mt-1">
            Invalid date or format.
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="saleNumber" className="block mb-1 font-medium">
          Sale Number
        </label>
        <Input
          id="saleNumber"
          type="text"
          inputMode="numeric"
          pattern="[0-9]+"
          placeholder="12345"
          value={saleNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setSaleNumber(value);
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, saleNumber: true }))}
          className="max-w-xs"
          aria-describedby={touched.saleNumber && !isNumberValid ? "saleNumberError" : undefined}
        />
        {touched.saleNumber && !isNumberValid && (
          <p id="saleNumberError" className="text-red-500 text-sm mt-1">
            Please enter a valid numeric value.
          </p>
        )}
      </div>

      <div className="mt-6 text-right">
        <Button onClick={handleSubmit} disabled={loading || !isFormValid}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}