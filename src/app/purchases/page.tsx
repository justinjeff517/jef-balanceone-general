"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MoreHorizontal, Plus, Search } from "lucide-react";

interface PurchaseItem {
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
  change_history: ChangeHistoryEntry[];
}

const purchases: Purchase[] = [
  {
    id: "1",
    supplier_name: "Acme Supplies",
    supplier_slug: "acme-supplies",
    supplier_tin: "123-456-789",
    receipt_date: "2025-05-08",
    receipt_number: "5001",
    items: [
      {
        id: "item1",
        name: "Widget A",
        description: "High-quality widget",
        quantity: 10,
        unit_price: 25.5,
        total_price: 255,
      },
      {
        id: "item2",
        name: "Widget B",
        description: "Standard widget",
        quantity: 5,
        unit_price: 15.0,
        total_price: 75,
      },
    ],
    total_amount: 330,
    status: "Submitted",
    created_at: "2025-05-07T02:00:00Z",
    updated_at: "2025-05-07T03:00:00Z",
    created_by: "jdoe",
    approved_by: "asmith",
    approval_timestamp: "2025-05-07T03:30:00Z",
    change_history: [
      {
        changed_at: "2025-05-07T02:10:00Z",
        changed_by: "jdoe",
        changes: {
          field: "items",
          old_value: "1 item",
          new_value: "2 items",
        },
      },
      {
        changed_at: "2025-05-07T02:30:00Z",
        changed_by: "jdoe",
        changes: {
          field: "status",
          old_value: "Draft",
          new_value: "Submitted",
        },
      },
    ],
  },
  {
    id: "2",
    supplier_name: "Global Tools Co.",
    supplier_slug: "global-tools",
    supplier_tin: "987-654-321",
    receipt_date: "2025-05-09",
    receipt_number: "5002",
    items: [
      {
        id: "item3",
        name: "Gadget C",
        description: "Multi-purpose gadget",
        quantity: 3,
        unit_price: 100.0,
        total_price: 300,
      },
    ],
    total_amount: 300,
    status: "Approved",
    created_at: "2025-05-08T10:15:00Z",
    updated_at: "2025-05-08T12:00:00Z",
    created_by: "asmith",
    approved_by: "jdoe",
    approval_timestamp: "2025-05-08T12:30:00Z",
    change_history: [
      {
        changed_at: "2025-05-08T11:00:00Z",
        changed_by: "asmith",
        changes: {
          field: "status",
          old_value: "Submitted",
          new_value: "Approved",
        },
      },
    ],
  },
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = purchases.filter((p) =>
    p.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.receipt_number.includes(searchQuery)
  );

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              <Link href="/purchases/suppliers">New Purchase from Suppliers</Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Create a new purchase record from suppliers
          </TooltipContent>
        </Tooltip>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Search className="mr-2 h-4 w-4" />
              Search Purchases
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Search Purchases</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Supplier or Receipt #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.receipt_date}</TableCell>
                    <TableCell>{p.receipt_number}</TableCell>
                    <TableCell>{p.supplier_name}</TableCell>
                    <TableCell>{p.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/suppliers/${p.supplier_slug}`}>
                              View Supplier
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter>
              <Button onClick={() => setSearchQuery("")}>Clear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Receipt #</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.receipt_date}</TableCell>
              <TableCell>{p.receipt_number}</TableCell>
              <TableCell>{p.supplier_name}</TableCell>
              <TableCell>{p.total_amount.toFixed(2)}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>
                {new Date(p.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/suppliers/${p.supplier_slug}`}>
                        View Supplier
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
  );
}
