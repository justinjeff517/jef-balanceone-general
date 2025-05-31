"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

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
  { id: "2", name: "Smart Watch",        description: "HR monitor",         unit_price: 129.99 },
  { id: "3", name: "Portable Speaker",   description: "Waterproof, 12h battery", unit_price: 39.99 },
  { id: "4", name: "E-Reader",           description: '6" glare-free, 8GB',    unit_price: 79.99 },
  { id: "5", name: "Wireless Mouse",     description: "Ergonomic, USB-C",   unit_price: 24.99 },
];

type Branch = { name: string; slug: string; tin: string };
const dummyBranches: Branch[] = [
  { name: "Alpha Supply Co.", slug: "alpha-supply",    tin: "123-456-001" },
  { name: "Bravo Traders",    slug: "bravo-traders",   tin: "123-456-002" },
  { name: "Charlie Imports",  slug: "charlie-imports", tin: "123-456-003" },
];

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";
  const branch = useMemo(
    () => dummyBranches.find((b) => b.slug === slug) ?? { name: slug, slug, tin: "" },
    [slug]
  );

  // No next-auth: userId is just an empty string
  const userId = "";

  const [itemMap, setItemMap] = useState<Map<string, SaleItem>>(new Map());
  const [receiptDate, setReceiptDate] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "cheque" | "gcash">("cash");
  const [touched, setTouched] = useState({ receiptDate: false, receiptNumber: false });
  const [loading, setLoading] = useState(false);

  const isDateValid = useMemo(() => {
    if (!receiptDate) return false;
    const rx = /^\d{4}-\d{2}-\d{2}$/;
    if (!rx.test(receiptDate)) return false;
    const d = new Date(receiptDate);
    return !isNaN(d.getTime()) && d.toISOString().startsWith(receiptDate);
  }, [receiptDate]);

  const isNumberValid = useMemo(() => /^\d+$/.test(receiptNumber), [receiptNumber]);
  const items = useMemo(() => Array.from(itemMap.values()), [itemMap]);
  const total = useMemo(() => items.reduce((s, it) => s + it.total_price, 0), [items]);
  const isFormValid = isDateValid && isNumberValid && items.length > 0;

  const addItem = useCallback((def: ItemDef) => {
    setItemMap((m) => {
      const next = new Map(m);
      const ex = next.get(def.id);
      if (ex) {
        const q = ex.quantity + 1;
        next.set(def.id, { ...ex, quantity: q, total_price: +(q * ex.unit_price).toFixed(2) });
      } else {
        next.set(def.id, {
          id: def.id,
          name: def.name,
          description: def.description,
          unit_price: def.unit_price,
          quantity: 1,
          total_price: +def.unit_price.toFixed(2),
        });
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItemMap((m) => {
      const next = new Map(m);
      next.delete(id);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setItemMap((m) => {
      const next = new Map(m);
      const ex = next.get(id);
      if (!ex) return next;
      const q = Math.max(1, isNaN(qty) ? 1 : qty);
      next.set(id, { ...ex, quantity: q, total_price: +(q * ex.unit_price).toFixed(2) });
      return next;
    });
  }, []);

  const available = useMemo(() => catalog.filter((d) => !itemMap.has(d.id)), [itemMap]);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);

    // auto-generate summaries
    const summaryText = `Sale of ${items.length} item(s) totaling $${total.toFixed(
      2
    )} at ${branch.name} on ${receiptDate}.`;
    const itemsSummary = items
      .map((it) => `• ${it.name} x${it.quantity} ($${it.total_price.toFixed(2)})`)
      .join("\n");
    const lastChangeSummary = "Initial creation";

    const payload = {
      collection: "sales" as const,
      id: uuidv4(),
      branch_name: branch.name,
      branch_slug: branch.slug,
      branch_tin: branch.tin,
      receipt_date: receiptDate,
      receipt_number: receiptNumber,
      items,
      total_amount: total,
      status: "submitted" as const,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
      created_by: userId,
      change_history: [] as any[],
      e_signature: {
        signed_by: userId,
        signed_at: new Date().toISOString(),
        signature_reason: "submission" as const,
        signature_hash: "", // ← fill or compute on backend
      },
      summary_text: summaryText,
      items_summary: itemsSummary,
      last_change_summary: lastChangeSummary,
    };

    console.log("→ payload:", JSON.stringify(payload, null, 2));
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 800));
    router.push("/sales");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Sale at {branch.name}</h1>
      <p className="mb-4 text-gray-600">TIN: {branch.tin}</p>

      <section className="mb-8">
        <h2 className="font-medium mb-2">Add Items</h2>
        {available.length === 0 ? (
          <p>All items added.</p>
        ) : (
          <div className="space-y-2">
            {available.map((d) => (
              <Card key={d.id}>
                <CardContent className="flex items-center p-2 space-x-3">
                  <Button size="sm" onClick={() => addItem(d)}>
                    Add
                  </Button>
                  <span className="font-medium">{d.name}</span>
                  <p className="text-sm text-gray-500 flex-1 truncate">{d.description}</p>
                  <span className="font-semibold">${d.unit_price.toFixed(2)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-medium mb-2">Items ({items.length})</h2>
        {items.length === 0 ? (
          <p>No items.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Qty</TableHead>
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
                        onChange={(e) => updateQuantity(it.id, parseInt(e.target.value, 10))}
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
            <div className="mt-2 text-right font-semibold">Total: ${total.toFixed(2)}</div>
          </>
        )}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="receiptDate" className="block mb-1">
            Receipt Date
          </label>
          <Input
            id="receiptDate"
            placeholder="YYYY-MM-DD"
            value={receiptDate}
            onChange={(e) => setReceiptDate(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, receiptDate: true }))}
          />
          {touched.receiptDate && !isDateValid && (
            <p className="text-red-500 text-sm">Invalid date.</p>
          )}
        </div>

        <div>
          <label htmlFor="receiptNumber" className="block mb-1">
            Receipt #
          </label>
          <Input
            id="receiptNumber"
            placeholder="12345"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value.replace(/\D/g, ""))}
            onBlur={() => setTouched((t) => ({ ...t, receiptNumber: true }))}
          />
          {touched.receiptNumber && !isNumberValid && (
            <p className="text-red-500 text-sm">Must be numeric.</p>
          )}
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
      </div>

      <div className="text-right">
        <Button onClick={handleSubmit} disabled={!isFormValid || loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
