
'use client';

import React, { useState } from "react";
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
    receipt_date: string;        // YYYY-MM-DD
    receipt_number: string;
    items: PurchaseItem[];
    total_amount: number;
    status: "draft" | "submitted" | "approved" | "paid" | "cancelled";
    created_at: string;          // ISO date-time
    created_by: string;          // uuid
  };
  metadata: {
    mongodb: {
      collection: "purchases";
      database: string;
    };
    created_at: string;          // ISO date-time
    created_by: string;          // uuid
    updated_at: string;          // ISO date-time
    updated_by: string;          // uuid
    change_history: ChangeHistoryEntry[];
  };
}

// sample data
const purchases: PurchaseRecord[] = [
  {
    data: {
      record_id: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      supplier_name: "Alpha Supply Co.",
      supplier_slug: "alpha-supply-co",
      supplier_tin: "123-456-001",
      receipt_date: "2025-05-08",
      receipt_number: "A1001",
      items: [
        {
          id: "11111111-2222-3333-4444-555555555555",
          name: "Widget A",
          description: "High-quality widget",
          quantity: 10,
          unit_price: 25.5,
          total_price: 255.0,
        },
      ],
      total_amount: 255.0,
      status: "submitted",
      created_at: "2025-05-07T02:00:00Z",
      created_by: "99999999-8888-7777-6666-555555555555",
    },
    metadata: {
      mongodb: {
        collection: "purchases",
        database: "jef-balanceone-general",
      },
      created_at: "2025-05-07T02:00:00Z",
      created_by: "99999999-8888-7777-6666-555555555555",
      updated_at: "2025-05-07T02:30:00Z",
      updated_by: "99999999-8888-7777-6666-555555555555",
      change_history: [
        {
          timestamp: "2025-05-07T02:30:00Z",
          user_id: "99999999-8888-7777-6666-555555555555",
          changes: [
            {
              field: "status",
              old: "draft",
              new: "submitted",
            },
          ],
        },
      ],
    },
  },
  {
    data: {
      record_id: "b2c3d4e5-6789-0abc-def1-234567890abc",
      supplier_name: "Alpha Supply Co.",
      supplier_slug: "alpha-supply-co",
      supplier_tin: "123-456-001",
      receipt_date: "2025-05-10",
      receipt_number: "A1002",
      items: [
        {
          id: "66666666-7777-8888-9999-000000000000",
          name: "Gadget B",
          quantity: 5,
          unit_price: 40.0,
          total_price: 200.0,
        },
      ],
      total_amount: 200.0,
      status: "draft",
      created_at: "2025-05-09T10:00:00Z",
      created_by: "99999999-8888-7777-6666-555555555555",
    },
    metadata: {
      mongodb: {
        collection: "purchases",
        database: "jef-balanceone-general",
      },
      created_at: "2025-05-09T10:00:00Z",
      created_by: "99999999-8888-7777-6666-555555555555",
      updated_at: "2025-05-09T10:01:00Z",
      updated_by: "99999999-8888-7777-6666-555555555555",
      change_history: [],
    },
  },
];

export default function Page() {
  const { slug } = useParams();
  const [search, setSearch] = useState("");
  const filtered = purchases.filter(p =>
    p.data.supplier_slug === slug &&
    p.data.receipt_number.toLowerCase().includes(search.toLowerCase())
  );
  const supplierName = filtered[0]?.data.supplier_name ?? slug;

  return (
    <div>
      {/* Top bar: search on left, actions on right */}
    <div className="flex items-center mb-4 space-x-4">
      <Input
        placeholder="Search receipt #…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-xs"
        aria-label="Search receipt number"
      />

<Tooltip>
  <TooltipTrigger asChild>
    <Button asChild size="sm" variant="default">
      <Link
        href={`/purchases/suppliers/${slug}/add`}
        aria-label={`Add purchase for ${supplierName}`}
      >
        Add Purchase <Plus className="h-4 w-4" />
      </Link>
    </Button>
  </TooltipTrigger>
  <TooltipContent>Add purchase for {supplierName}</TooltipContent>
</Tooltip>


      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline">
            <Link href={`/purchases/suppliers/${slug}/configure`}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Configure</TooltipContent>
      </Tooltip>
    </div>

      {/* Title */}



      {/* Table */}
      {filtered.length === 0 ? (
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
              {filtered.map(p => (
                <TableRow key={p.data.record_id}>
                  <TableCell>{p.data.receipt_date}</TableCell>
                  <TableCell>{p.data.receipt_number}</TableCell>
                  <TableCell>${p.data.total_amount.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{p.data.status}</TableCell>
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
                          <Link href={`/purchases/suppliers/${slug}/${p.data.receipt_number}`}>
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/purchases/suppliers/${slug}/${p.data.receipt_number}/modify`}>
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
