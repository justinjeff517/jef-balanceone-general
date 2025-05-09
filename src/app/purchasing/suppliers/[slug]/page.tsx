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

interface ChangeHistory {
  changed_at: string;
  changed_by: string;
  changes: {
    field: string;
    old_value: string;
    new_value: string;
  };
}

interface Purchase {
  id: string;
  supplier_name: string;
  supplier_slug: string;
  supplier_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: PurchaseItem[];
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by: string;
  approval_timestamp: string;
  change_history: ChangeHistory[];
}

// sample purchases for the specific supplier (alpha-supply-co)
const purchases: Purchase[] = [
  {
    id: "1",
    supplier_name: "Alpha Supply Co.",
    supplier_slug: "alpha-supply-co",
    supplier_tin: "123-456-001",
    receipt_date: "2025-05-08",
    receipt_number: "A1001",
    items: [
      { id: "item1", name: "Widget A", description: "High-quality widget", quantity: 10, unit_price: 25.5, total_price: 255 },
    ],
    total_amount: 255,
    status: "Submitted",
    created_at: "2025-05-07T02:00:00Z",
    updated_at: "2025-05-07T03:00:00Z",
    created_by: "jdoe",
    approved_by: "asmith",
    approval_timestamp: "2025-05-07T03:30:00Z",
    change_history: [
      { changed_at: "2025-05-07T02:30:00Z", changed_by: "jdoe", changes: { field: "status", old_value: "draft", new_value: "submitted" } },
    ],
  },
  {
    id: "2",
    supplier_name: "Alpha Supply Co.",
    supplier_slug: "alpha-supply-co",
    supplier_tin: "123-456-001",
    receipt_date: "2025-05-10",
    receipt_number: "A1002",
    items: [
      { id: "item2", name: "Gadget B", description: "Multi-purpose gadget", quantity: 5, unit_price: 40, total_price: 200 },
    ],
    total_amount: 200,
    status: "Draft",
    created_at: "2025-05-09T10:00:00Z",
    updated_at: "2025-05-09T10:00:00Z",
    created_by: "jdoe",
    approved_by: "",
    approval_timestamp: "",
    change_history: [],
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
    <TooltipContent>
      Add a purchase for {supplierName}
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button asChild size="sm" variant={"outline"}>
        <Link href={`/purchasing/suppliers/${slug}/configure`}>
          Configure
        </Link>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      Configure for {supplierName}
    </TooltipContent>
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
              <TableRow key={p.id}>
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
                        <Link href={`/purchasing/suppliers/${slug}/${p.id}`}>View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/purchasing/suppliers/${slug}/${p.id}/modify`}>Modify</Link>
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
