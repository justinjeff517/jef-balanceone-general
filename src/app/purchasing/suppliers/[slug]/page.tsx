"use client";

import React from "react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ChangeDetail {
  field: string;
  old_value: string;
  new_value: string;
}

interface ChangeHistoryEntry {
  changed_at: string;              // date-time
  changed_by: string;              // uuid
  changes: ChangeDetail[];
}

interface ESignature {
  signed_by: string;               // uuid
  signed_at: string;               // date-time
  signature_reason: "submission" | "approval" | "correction";
  signature_hash: string;          // 64-hex chars
}

interface PurchaseRecord {
  collection: "purchase_records";
  record_id: string;               // uuid
  supplier_name: string;
  supplier_slug: string;
  supplier_tin: string;
  receipt_date: string;            // date (YYYY-MM-DD)
  receipt_number: string;
  items: PurchaseItem[];
  total_amount: number;
  status: "draft" | "submitted" | "approved" | "paid" | "cancelled";
  created_at: string;              // date-time
  created_by: string;              // uuid
  change_history: ChangeHistoryEntry[];
  e_signature: ESignature;
  summary_text: string;
  items_summary: string;
  last_change_summary: string;
}

// sample data following the schema
const purchases: PurchaseRecord[] = [
  {
    collection: "purchase_records",
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
    change_history: [
      {
        changed_at: "2025-05-07T02:30:00Z",
        changed_by: "99999999-8888-7777-6666-555555555555",
        changes: [
          {
            field: "status",
            old_value: "draft",
            new_value: "submitted",
          },
        ],
      },
    ],
    e_signature: {
      signed_by: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      signed_at: "2025-05-07T02:31:00Z",
      signature_reason: "submission",
      signature_hash:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    },
    summary_text:
      "Purchase of 10 × Widget A from Alpha Supply Co. on 2025-05-08 for a total of $255.00.",
    items_summary: "- 10 × Widget A @ $25.50 each = $255.00",
    last_change_summary:
      "Status changed from draft to submitted at 2025-05-07T02:30:00Z.",
  },
  {
    collection: "purchase_records",
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
        description: "Multi-purpose gadget",
        quantity: 5,
        unit_price: 40.0,
        total_price: 200.0,
      },
    ],
    total_amount: 200.0,
    status: "draft",
    created_at: "2025-05-09T10:00:00Z",
    created_by: "99999999-8888-7777-6666-555555555555",
    change_history: [],
    e_signature: {
      signed_by: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      signed_at: "2025-05-09T10:01:00Z",
      signature_reason: "correction",
      signature_hash:
        "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    },
    summary_text:
      "Draft purchase of 5 × Gadget B from Alpha Supply Co. on 2025-05-10 for $200.00.",
    items_summary: "- 5 × Gadget B @ $40.00 each = $200.00",
    last_change_summary: "No changes yet.",
  },
];

export default function Page() {
  const { slug } = useParams();
  const supplierName = purchases[0]?.supplier_name ?? slug;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="default" size="sm">
              <Link href={`/purchasing/suppliers/${slug}/add`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Purchase
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a purchase for {supplierName}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="sm" variant="outline">
              <Link href={`/purchasing/suppliers/${slug}/configure`}>
                Configure
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Configure for {supplierName}</TooltipContent>
        </Tooltip>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Purchases for {supplierName}
      </h2>

      {purchases.length === 0 ? (
        <p>No purchases found for {supplierName}.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Receipt #</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((p) => (
              <TableRow key={p.record_id}>
                <TableCell>{p.receipt_date}</TableCell>
                <TableCell>{p.receipt_number}</TableCell>
                <TableCell>${p.total_amount.toFixed(2)}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>
                  {new Date(p.created_at).toLocaleString()}
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
                          href={`/purchasing/suppliers/${slug}/${p.receipt_number}`}
                        >
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/purchasing/suppliers/${slug}/${p.receipt_number}/modify`}
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
