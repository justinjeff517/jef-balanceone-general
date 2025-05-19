"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  FC,
} from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
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

type ItemDef = Pick<
  PurchaseItem,
  "id" | "name" | "description" | "unit_price"
>;

const catalog: ItemDef[] = [
  { id: "1", name: "Wireless Headphones", description: "Bluetooth over-ear", unit_price: 59.99 },
  { id: "2", name: "Smart Watch",        description: "HR monitor",       unit_price: 129.99 },
  { id: "3", name: "Portable Speaker",   description: "Waterproof, 12h battery", unit_price: 39.99 },
  { id: "4", name: "E-Reader",           description: '6" glare-free, 8GB',    unit_price: 79.99 },
  { id: "5", name: "Wireless Mouse",     description: "Ergonomic, USB-C",        unit_price: 24.99 },
];

type Supplier = {
  name: string;
  slug: string;
  tin: string;
};
const dummySuppliers: Supplier[] = [
  { name: "Alpha Supply Co.", slug: "alpha-supply", tin: "123-456-001" },
  { name: "Bravo Traders",    slug: "bravo-traders", tin: "123-456-002" },
  { name: "Charlie Imports",  slug: "charlie-imports", tin: "123-456-003" },
];

interface ChangeDetail {
  field: string;
  old: null | string | number | object | any[];
  new: null | string | number | object | any[];
}

interface ChangeHistoryEntry {
  timestamp: string;   // date-time
  user_id: string;     // uuid
  changes: ChangeDetail[];
}

const Page: FC = () => {
  const router = useRouter();
  const params = useParams() as { slug?: string | string[] };
  const { data: session } = useSession();

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

  const [itemMap, setItemMap] = useState<Map<string, PurchaseItem>>(
    () => new Map()
  );
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
  const total = useMemo<number>(
    () => items.reduce((sum, it) => sum + it.total_price, 0),
    [items]
  );
  const isFormValid =
    isDateValid &&
    isNumberValid &&
    items.length > 0 &&
    Boolean(session?.user?.id);

  const addItem = useCallback((def: ItemDef) => {
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
      m.set(id, {
        ...ex,
        quantity: newQty,
        total_price: parseFloat((newQty * ex.unit_price).toFixed(2)),
      });
      return m;
    });
  }, []);

  const available = useMemo<ItemDef[]>(
    () => catalog.filter((d) => !itemMap.has(d.id)),
    [itemMap]
  );

// … other imports ...
  const handleSubmit = useCallback<() => Promise<void>>(async () => {
    if (!isFormValid) return
    setLoading(true)

    const now = new Date().toISOString()

    // data section
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
      created_by: session!.user!.id,
    }

    // wrap only dataSection under payload.data
    const payload = {
      payload: {
        data: dataSection
      }
    }
    console.log("SESSION OBJECT:", session)


    const token = session.accessToken
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }

    console.log("=== TEST HEADERS ===")
    console.log(headers)
    console.log("=== TEST PAYLOAD ===")
    console.log(JSON.stringify(payload, null, 2))

    // TODO: actually POST payload to your API endpoint here
    // await fetch("/api/purchases", {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify(payload)
    // })

    //router.push("/purchases")
  }, [
    isFormValid,
    session,
    supplier,
    receiptDate,
    receiptNumber,
    items,
    total,
    router,
  ])


  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase for {supplier.name}</CardTitle>
          <p className="text-sm text-gray-600">TIN: {supplier.tin}</p>
        </CardHeader>
        <CardContent />
        <CardFooter>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/purchases/suppliers/${supplier.slug}/configure`)
            }
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
                  <span className="font-medium flex-shrink-0 whitespace-nowrap">
                    {d.name}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 truncate">
                      {d.description}
                    </p>
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
                        onChange={(e) =>
                          updateQuantity(it.id, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>${it.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(it.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-right font-semibold mt-4">
              Total: ${total.toFixed(2)}
            </div>
          </>
        )}
      </section>

      {/* Receipt Inputs */}
      <div className="mt-10 mb-4">
        <label className="block mb-1 font-medium">Receipt Date (YYYY-MM-DD)</label>
        <Input
          type="text"
          placeholder="2025-05-08"
          value={receiptDate}
          onChange={(e) => setReceiptDate(e.target.value)}
          className="max-w-xs"
        />
        {receiptDate && !isDateValid && (
          <p className="text-red-500 text-sm mt-1">Invalid date format or date.</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Receipt Number</label>
        <Input
          type="text"
          value={receiptNumber}
          onChange={(e) => setReceiptNumber(e.target.value)}
          className="max-w-xs"
        />
        {receiptNumber && !isNumberValid && (
          <p className="text-red-500 text-sm mt-1">Cannot be empty.</p>
        )}
      </div>

      {/* Confirm Dialog */}
      <div className="mt-6 text-right">
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading || !isFormValid}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are You Sure?</DialogTitle>
              <DialogDescription>
                {`On ${receiptDate}, Receipt No. ${receiptNumber}, you’re submitting ${items.length} item(s): ` +
                  items
                    .map((it) => `${it.name} x${it.quantity} ($${it.total_price.toFixed(2)})`)
                    .join(", ") +
                  "."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setConfirmOpen(false);
                  void handleSubmit();
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
