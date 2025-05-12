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

interface SaleItem {
  id: string;               // uuid
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
  changed_at: string;       // date-time
  changed_by: string;       // uuid
  changes: ChangeDetail[];
}

interface ESignature {
  signed_by: string;        // uuid
  signed_at: string;        // date-time
  signature_reason: "submission" | "approval" | "correction";
  signature_hash: string;   // 64-hex chars
}

interface SaleRecord {
  collection: "sales";
  record_id: string;        // uuid
  branch_name: string;
  branch_slug: string;
  branch_tin: string;
  receipt_date: string;     // YYYY-MM-DD
  receipt_number: string;
  items: SaleItem[];
  total_amount: number;
  status: "draft" | "submitted" | "approved" | "paid" | "cancelled";
  created_at: string;       // date-time
  created_by: string;       // uuid
  change_history: ChangeHistoryEntry[];
  e_signature: ESignature;
  summary_text: string;
  items_summary: string;
  last_change_summary: string;
}

// sample sales for "north-branch"
const sales: SaleRecord[] = [
  {
    collection: "sales",
    record_id: "f1e2d3c4-5678-90ab-cdef-1234567890ab",
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
        unit_price: 59.99,
        total_price: 179.97,
      },
    ],
    total_amount: 179.97,
    status: "submitted",
    created_at: "2025-05-11T09:00:00Z",
    created_by: "11112222-3333-4444-5555-666677778888",
    change_history: [
      {
        changed_at: "2025-05-11T09:15:00Z",
        changed_by: "11112222-3333-4444-5555-666677778888",
        changes: [
          { field: "status", old_value: "draft", new_value: "submitted" },
        ],
      },
    ],
    e_signature: {
      signed_by: "99990000-aaaa-bbbb-cccc-ddddeeeeffff",
      signed_at: "2025-05-11T09:16:00Z",
      signature_reason: "submission",
      signature_hash:
        "abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    },
    summary_text:
      "North Branch sold 3 Wireless Headphones on 2025-05-11 for a total of $179.97.",
    items_summary: "- 3 × Wireless Headphones @ $59.99 each = $179.97",
    last_change_summary:
      "Status changed from draft to submitted at 2025-05-11T09:15:00Z.",
  },
  {
    collection: "sales",
    record_id: "01234567-89ab-cdef-0123-456789abcdef",
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
        unit_price: 39.99,
        total_price: 79.98,
      },
    ],
    total_amount: 79.98,
    status: "draft",
    created_at: "2025-05-12T10:30:00Z",
    created_by: "11112222-3333-4444-5555-666677778888",
    change_history: [],
    e_signature: {
      signed_by: "99990000-aaaa-bbbb-cccc-ddddeeeeffff",
      signed_at: "2025-05-12T10:31:00Z",
      signature_reason: "correction",
      signature_hash:
        "fedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafe",
    },
    summary_text:
      "Draft sale of 2 Portable Speakers on 2025-05-12 totaling $79.98.",
    items_summary: "- 2 × Portable Speaker @ $39.99 each = $79.98",
    last_change_summary: "No changes yet.",
  },
];

export default function Page() {
  const { slug } = useParams();
  const branchName = sales[0]?.branch_name ?? slug;

  return (
    <div className="p-6">
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
            <Button asChild size="sm" variant="outline">
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

      {sales.length === 0 ? (
        <p>No sales found for {branchName}.</p>
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
            {sales.map((s) => (
              <TableRow key={s.record_id}>
                <TableCell>{s.receipt_date}</TableCell>
                <TableCell>{s.receipt_number}</TableCell>
                <TableCell>${s.total_amount.toFixed(2)}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell>
                  {new Date(s.created_at).toLocaleString()}
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
                          href={`/sales/branches/${slug}/${s.receipt_number}`}
                        >
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/sales/branches/${slug}/${s.receipt_number}/modify`}
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
