"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

type ItemDef = Pick<PurchaseItem, "id" | "name" | "description" | "unit_price">;

const catalog: ItemDef[] = [
  { id: "1", name: "Widget", description: "Blue widget", unit_price: 10 },
  { id: "2", name: "Gadget", description: "Red gadget", unit_price: 15 },
  { id: "3", name: "Doohickey", description: "Green doohickey", unit_price: 7.5 },
];

interface Purchase {
  receipt_number: string;
  receipt_date: string;
  supplier_tin?: string;
  items: PurchaseItem[];
}

export default function EditPurchasePage(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams() as { slug: string; receipt_number: string };
  const supplierSlug = params.slug;
  const receiptNumber = params.receipt_number;

  const [supplierTin, setSupplierTin] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [itemMap, setItemMap] = useState<Map<string, PurchaseItem>>(new Map());

  useEffect(() => {
    async function fetchPurchase() {
      try {
        const res = await fetch(`/api/purchases/${receiptNumber}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Purchase = await res.json();
        initializeForm(data);
      } catch {
        const fallback = dummyPurchases.find(p => p.receipt_number === receiptNumber);
        if (fallback) initializeForm(fallback);
      }
    }
    function initializeForm(data: Purchase) {
      setSupplierTin(data.supplier_tin ?? "");
      setReceiptDate(data.receipt_date);
      const m = new Map<string, PurchaseItem>();
      data.items.forEach(it => m.set(it.id, { ...it }));
      setItemMap(m);
    }
    fetchPurchase();
  }, [receiptNumber]);

  const addItem = useCallback((def: ItemDef) => {
    setItemMap(prev => {
      const m = new Map(prev);
      const ex = m.get(def.id);
      if (ex) {
        const qty = ex.quantity + 1;
        m.set(def.id, { ...ex, quantity: qty, total_price: +(qty * ex.unit_price).toFixed(2) });
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
    setItemMap(prev => {
      const m = new Map(prev);
      m.delete(id);
      return m;
    });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setItemMap(prev => {
      const m = new Map(prev);
      const ex = m.get(id);
      if (!ex) return m;
      const newQty = qty > 0 ? qty : 1;
      m.set(id, { ...ex, quantity: newQty, total_price: +(newQty * ex.unit_price).toFixed(2) });
      return m;
    });
  }, []);

  const items = useMemo(() => Array.from(itemMap.values()), [itemMap]);
  const total = useMemo(() => items.reduce((s, it) => s + it.total_price, 0), [items]);
  const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(receiptDate);
  const available = useMemo(() => catalog.filter(d => !itemMap.has(d.id)), [itemMap]);

  if (status === "loading") return <div>Loading...</div>;
  if (status !== "authenticated" || !session) return <div>You must be signed in.</div>;

  const userId = session.user.id;
  const now = new Date().toISOString();

  const handleSave = () => {
    if (!isDateValid || !supplierTin) return;
    const recordId = uuidv4();
    const payload = {
      data: {
        record_id: recordId,
        supplier_name: supplierSlug.replace(/-/g, " "),
        supplier_slug: supplierSlug,
        supplier_tin: supplierTin,
        receipt_date: receiptDate,
        receipt_number: receiptNumber,
        items: items.map(it => ({
          id: it.id,
          name: it.name,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price,
        })),
        total_amount: total,
        status: "draft",
        created_at: now,
        created_by: userId,
      },
      metadata: {
        mongodb: {
          collection: "purchases",
          database: "jef-balanceone-general",
        },
        created_at: now,
        created_by: userId,
        updated_at: now,
        updated_by: userId,
        change_history: [] as any[],
      },
    };
    console.log("Saving purchase payload:", JSON.stringify(payload, null, 2));
    // TODO: POST to /api/purchases
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader><CardTitle>Edit Purchase #{receiptNumber}</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Receipt Date (YYYY-MM-DD)</label>
            <Input
              type="text"
              value={receiptDate}
              onChange={e => setReceiptDate(e.target.value)}
              className="max-w-xs"
            />
            {receiptDate && !isDateValid && (
              <p className="text-red-500 text-sm mt-1">Invalid date.</p>
            )}
          </div>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add Items</h2>
            {available.length === 0 ? (
              <p>All catalog items added.</p>
            ) : (
              available.map(d => (
                <Card key={d.id} className="mb-2">
                  <CardContent className="flex items-center p-2 space-x-3">
                    <Button size="sm" onClick={() => addItem(d)}>Add</Button>
                    <div className="flex-1">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-sm text-gray-500">{d.description}</p>
                    </div>
                    <p className="text-sm font-semibold">${d.unit_price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </section>
          <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>
          {items.length === 0 ? (
            <p>No items in this purchase.</p>
          ) : (
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
                {items.map(it => (
                  <TableRow key={it.id}>
                    <TableCell>{it.name}</TableCell>
                    <TableCell>${it.unit_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={e => updateQuantity(it.id, parseInt(e.target.value, 10) || 1)}
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
          )}
          <div className="text-right font-semibold mt-4">Total: ${total.toFixed(2)}</div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={!isDateValid || !supplierTin}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const dummyPurchases: Purchase[] = [
  {
    receipt_number: "1001",
    receipt_date: "2025-05-01",
    supplier_tin: "123-456-789",
    items: [
      { id: "1", name: "Widget", description: "Blue widget", unit_price: 10, quantity: 2, total_price: 20 },
    ],
  },
  {
    receipt_number: "1002",
    receipt_date: "2025-05-02",
    supplier_tin: "987-654-321",
    items: [
      { id: "2", name: "Gadget", description: "Red gadget", unit_price: 15, quantity: 1, total_price: 15 },
    ],
  },
];
