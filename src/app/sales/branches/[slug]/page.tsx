"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Fuse from "fuse.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Search, MoreHorizontal, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

interface Data {
  id: string;
  branch_name: string;
  branch_slug: string;
  branch_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: Item[];
  total_amount: number;
  status: "draft" | "submitted" | "approved" | "paid" | "cancelled";
  payment_method: "cash" | "cheque" | "gcash";
  created_at: string;
  created_by: string;
}

interface Change {
  field: string;
  old: null | string | number | boolean | any[];
  new: null | string | number | boolean | any[];
}

interface ChangeHistoryEntry {
  timestamp: string;
  user_id: string;
  changes: Change[];
}

interface Metadata {
  mongodb: {
    collection: "sales";
    database: "jef-balanceone-general";
  };
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  change_history: ChangeHistoryEntry[];
}

interface SaleRecord {
  data: Data;
  metadata: Metadata;
}

const sales: SaleRecord[] = [
  {
    data: {
      id: "f1e2d3c4-5678-90ab-cdef-1234567890ab",
      branch_name: "North Branch",
      branch_slug: "north-branch",
      branch_tin: "987-654-321",
      receipt_date: "2025-05-11",
      receipt_number: "S2001",
      items: [
        {
          id: "aaaabbbb-cccc-dddd-eeee-ffff00001111",
          name: "Wireless Headphones",
          description: "Bluetooth over-ear",
          quantity: 3,
          unit: "piece",
          unit_price: 59.99,
          total_price: 179.97,
        },
      ],
      total_amount: 179.97,
      status: "submitted",
      payment_method: "gcash",
      created_at: "2025-05-11T09:00:00Z",
      created_by: "11112222-3333-4444-5555-666677778888",
    },
    metadata: {
      mongodb: {
        collection: "sales",
        database: "jef-balanceone-general",
      },
      created_at: "2025-05-11T09:00:00Z",
      created_by: "11112222-3333-4444-5555-666677778888",
      updated_at: "2025-05-11T09:15:00Z",
      updated_by: "11112222-3333-4444-5555-666677778888",
      change_history: [
        {
          timestamp: "2025-05-11T09:15:00Z",
          user_id: "11112222-3333-4444-5555-666677778888",
          changes: [
            { field: "status", old: "draft", new: "submitted" },
          ],
        },
      ],
    },
  },
  {
    data: {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      branch_name: "North Branch",
      branch_slug: "north-branch",
      branch_tin: "987-654-321",
      receipt_date: "2025-05-12",
      receipt_number: "S2002",
      items: [
        {
          id: "22223333-4444-5555-6666-777788889999",
          name: "Portable Speaker",
          description: "Waterproof, 12h battery",
          quantity: 2,
          unit: "piece",
          unit_price: 39.99,
          total_price: 79.98,
        },
      ],
      total_amount: 79.98,
      status: "draft",
      payment_method: "cash",
      created_at: "2025-05-12T10:30:00Z",
      created_by: "11112222-3333-4444-5555-666677778888",
    },
    metadata: {
      mongodb: {
        collection: "sales",
        database: "jef-balanceone-general",
      },
      created_at: "2025-05-12T10:30:00Z",
      created_by: "11112222-3333-4444-5555-666677778888",
      updated_at: "2025-05-12T10:30:00Z",
      updated_by: "11112222-3333-4444-5555-666677778888",
      change_history: [],
    },
  },
];

export default function Page() {
  const { slug } = useParams();
  const branchName = sales[0]?.data.branch_name ?? slug;
  const [search, setSearch] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse<SaleRecord>(sales, {
        keys: ["data.receipt_number","data.receipt_date", "data.branch_name"],
        threshold: 0.3,
      }),
    []
  );

  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;
    return fuse.search(search).map((result) => result.item);
  }, [search, fuse]);

  return (
    <div className="p-6">
      {/* Header Buttons */}
      <div className="flex items-center space-x-4 mb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="default" size="sm">
              <Link href={`/sales/branches/${slug}/add`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Sale
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a sale for {branchName}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="outline" size="sm">
              <Link href={`/sales/branches/${slug}/configure`}>
                Configure
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Configure for {branchName}</TooltipContent>
        </Tooltip>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Sales for {branchName}
      </h2>

      {/* Inline Search Bar (centered) */}
      <div className="flex items-center justify-center mb-6">
        <Search className="mr-2 h-5 w-5 text-gray-500" />
        <Input
          placeholder="Search by receipt # or branch name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        {search && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearch("")}
            className="ml-2"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Sales Table */}
      {filteredSales.length === 0 ? (
        <p className="text-center">No sales found for “{search}”.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Receipt #</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((s) => (
              <TableRow key={s.data.id}>
                <TableCell>{s.data.receipt_date}</TableCell>
                <TableCell>{s.data.receipt_number}</TableCell>
                <TableCell>{s.data.payment_method}</TableCell>
                <TableCell>
                  ${s.data.total_amount.toFixed(2)}
                </TableCell>
                <TableCell>{s.data.status}</TableCell>
                <TableCell>
                  {new Date(s.data.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/sales/branches/${slug}/${s.data.receipt_number}`}
                        >
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/sales/branches/${slug}/${s.data.receipt_number}/modify`}
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
      )}
    </div>
  );
}
