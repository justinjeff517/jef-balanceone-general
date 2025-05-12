// app/sales/branches/[branch_slug]/[receipt_number]/modify/page.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Table, TableHeader, TableHead, TableBody,
  TableRow, TableCell
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

interface ChangeHistoryEntry {
  changed_at: string;
  changed_by: string;
  changes: { field: string; old_value: string; new_value: string }[];
}

interface SaleRecord {
  collection: "sales";
  id: string;
  branch_name: string;
  branch_slug: string;
  branch_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: SaleItem[];
  payment_method: "cash" | "cheque" | "gcash";
  change_history: ChangeHistoryEntry[];
}

const dummyData: SaleRecord = {
  collection: "sales",
  id: "11111111-1111-1111-1111-111111111111",
  branch_name: "Alpha Supply Co.",
  branch_slug: "alpha-supply",
  branch_tin: "123-456-001",
  receipt_date: "2025-05-10",
  receipt_number: "2002",
  items: [
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Wireless Headphones",
      description: "Bluetooth over-ear",
      quantity: 2,
      unit_price: 59.99,
      total_price: 119.98
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Portable Speaker",
      description: "Waterproof, 12h battery",
      quantity: 3,
      unit_price: 39.99,
      total_price: 119.97
    }
  ],
  payment_method: "gcash",
  change_history: [
    {
      changed_at: "2025-05-10T14:30:00Z",
      changed_by: "44444444-4444-4444-4444-444444444444",
      changes: [
        { field: "status", old_value: "draft", new_value: "submitted" }
      ]
    }
  ]
};

type ItemDef = Pick<SaleItem, "id" | "name" | "description" | "unit_price">;

const catalog: ItemDef[] = [
  { id: "1", name: "Wireless Headphones", description: "Bluetooth over-ear", unit_price: 59.99 },
  { id: "2", name: "Smart Watch",        description: "HR monitor",         unit_price: 129.99 },
  { id: "3", name: "Portable Speaker",   description: "Waterproof, 12h battery", unit_price: 39.99 },
  { id: "4", name: "E-Reader",           description: '6" glare-free, 8GB', unit_price: 79.99 },
  { id: "5", name: "Wireless Mouse",     description: "Ergonomic, USB-C",   unit_price: 24.99 },
];

export default function ModifySalePage(): JSX.Element {
  const router = useRouter();
  const { branch_slug, receipt_number } = useParams() as { branch_slug: string; receipt_number: string };
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  // initialize from dummy data
  const orig = dummyData;
  const [itemMap, setItemMap] = useState<Map<string, SaleItem>>(
    new Map(orig.items.map(it => [it.id, it]))
  );
  const [receiptDate, setReceiptDate] = useState(orig.receipt_date);
  const [paymentMethod, setPaymentMethod] = useState(orig.payment_method);
  const [loading, setLoading] = useState(false);

  const branch = useMemo(() => ({
    name: orig.branch_name,
    slug: orig.branch_slug,
    tin: orig.branch_tin,
  }), [orig]);

  const items = useMemo(() => Array.from(itemMap.values()), [itemMap]);
  const total = useMemo(() => items.reduce((sum, it) => sum + it.total_price, 0), [items]);
  const available = useMemo(() => catalog.filter(c => !itemMap.has(c.id)), [itemMap]);

  const addItem = useCallback((def: ItemDef) => {
    setItemMap(m => {
      const next = new Map(m);
      const ex = next.get(def.id);
      if (ex) {
        const qty = ex.quantity + 1;
        next.set(def.id, { ...ex, quantity: qty, total_price: +(qty * ex.unit_price).toFixed(2) });
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
    setItemMap(m => { const next = new Map(m); next.delete(id); return next; });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setItemMap(m => {
      const next = new Map(m);
      const ex = next.get(id);
      if (!ex) return next;
      const q = Math.max(1, isNaN(qty) ? 1 : qty);
      next.set(id, { ...ex, quantity: q, total_price: +(q * ex.unit_price).toFixed(2) });
      return next;
    });
  }, []);

    const handleSave = () => {
    setLoading(true);

    type Change = { field: string; old_value: string; new_value: string };
    const changes: Change[] = [];

    if (orig.receipt_date !== receiptDate) {
        changes.push({
        field: "receipt_date",
        old_value: orig.receipt_date,
        new_value: receiptDate,
        });
    }

    if (orig.payment_method !== paymentMethod) {
        changes.push({
        field: "payment_method",
        old_value: orig.payment_method,
        new_value: paymentMethod,
        });
    }

    // compare quantities
    orig.items.forEach(oldItem => {
        const now = itemMap.get(oldItem.id);
        if (now && now.quantity !== oldItem.quantity) {
        changes.push({
            field: `item:${oldItem.id}:quantity`,
            old_value: String(oldItem.quantity),
            new_value: String(now.quantity),
        });
        }
    });

    const newEntry: ChangeHistoryEntry = {
        changed_at: new Date().toISOString(),
        changed_by: userId,
        changes,
    };

    const updated: SaleRecord = {
        ...orig,
        receipt_date: receiptDate,
        payment_method: paymentMethod,
        items: items,
        change_history: [...orig.change_history, newEntry],
    };
    console.log("Updated payload for testing:", updated);

    setTimeout(() => {
        setLoading(false);
        router.push("/sales");
    }, 500);
    };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Edit Sale @ {branch.name}</h1>
      <p className="mb-4 text-gray-600">TIN: {branch.tin}</p>

      <section className="mb-8">
        <h2 className="font-medium mb-2">Add Items</h2>
        {available.length === 0
          ? <p>All items added.</p>
          : available.map(d => (
              <Card key={d.id}>
                <CardContent className="flex items-center p-2 space-x-3">
                  <Button size="sm" onClick={() => addItem(d)}>Add</Button>
                  <span className="font-medium">{d.name}</span>
                  <p className="text-sm text-gray-500 flex-1">{d.description}</p>
                  <span className="font-semibold">${d.unit_price.toFixed(2)}</span>
                </CardContent>
              </Card>
            ))}
      </section>

      <section className="mb-8">
        <h2 className="font-medium mb-2">Items ({items.length})</h2>
        {items.length === 0
          ? <p>No items.</p>
          : <>
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
                  {items.map(it => (
                    <TableRow key={it.id}>
                      <TableCell>{it.name}</TableCell>
                      <TableCell>${it.unit_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={e => updateQuantity(it.id, parseInt(e.target.value, 10))}
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
            </>}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1">Branch</label>
          <Input value={branch.name} disabled />
        </div>
        <div>
          <label className="block mb-1">Receipt #</label>
          <Input value={receipt_number} disabled />
        </div>
        <div>
          <label className="block mb-1">Receipt Date</label>
          <Input
            type="date"
            value={receiptDate}
            onChange={e => setReceiptDate(e.target.value)}
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value as any)}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
      </div>

      <div className="text-right">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
