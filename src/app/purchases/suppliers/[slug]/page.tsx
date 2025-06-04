"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Settings } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface PurchaseItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ChangeDetail {
  field: string;
  old: null | string | number | object | any[];
  new: null | string | number | object | any[];
}

interface ChangeHistoryEntry {
  timestamp: string;
  user_id: string;
  changes: ChangeDetail[];
}

interface PurchaseRecord {
  data: {
    record_id: string;
    supplier_name: string;
    supplier_slug: string;
    supplier_tin: string;
    receipt_date: string;
    receipt_number: string;
    items: PurchaseItem[];
    total_amount: number;
    status: "draft" | "submitted" | "approved" | "paid" | "cancelled";
    created_at: string;
    created_by: string;
  };
  metadata: {
    mongodb: {
      collection: "purchases";
      database: string;
    };
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    change_history: ChangeHistoryEntry[];
  };
}

export default function Page() {
  const { slug } = useParams();
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/database/purchases/get-purchases-by-supplier-slug?supplier_slug=${encodeURIComponent(
            slug!
          )}`,
          { cache: "no-store" }
        );
        console.log("Fetching purchases for slug:", slug);
        console.log("Response status:", res.status);
        if (!res.ok) {
          setPurchases([]);
        } else {
          const json = await res.json();
          setPurchases(Array.isArray(json.purchases) ? json.purchases : []);
        }
      } catch {
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPurchases();
    }
  }, [slug]);

  const filtered = purchases.filter((p) =>
    p.data.receipt_number.toLowerCase().includes(search.toLowerCase())
  );
  const supplierName = filtered[0]?.data.supplier_name ?? slug;

  return (
    <div>
      <p>
        SLUG: <strong>{slug}</strong>
      </p>
      <div className="flex items-center mb-4 space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/purchases/suppliers/${slug}/add`}>
              <Button size="sm" variant="default">
                Add Purchase <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Add purchase for {supplierName}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/purchases/suppliers/${slug}/configure`}>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Configure</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center justify-center mb-6">
        <Input
          placeholder="Search receipt #…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/3"
          aria-label="Search receipt number"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <div className="overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Receipt #</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.data.record_id}>
                  <TableCell>{p.data.receipt_date}</TableCell>
                  <TableCell>{p.data.receipt_number}</TableCell>
                  <TableCell>
                    {`$${p.data.total_amount.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="capitalize">
                    {p.data.status}
                  </TableCell>
                  <TableCell>
                    {new Date(p.metadata.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(p.metadata.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/purchases/suppliers/${slug}/${p.data.receipt_number}`}
                          >
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/purchases/suppliers/${slug}/${p.data.receipt_number}/modify`}
                          >
                            Modify
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
