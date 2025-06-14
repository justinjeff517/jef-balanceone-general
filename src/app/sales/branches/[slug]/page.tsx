"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Fuse from "fuse.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Plus } from "lucide-react";
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
  is_submitted: boolean;
  branch_name: string;
  branch_slug: string;
  branch_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: Item[];
  total_amount: number;
}

interface SaleRecord {
  data: Data;
}

export default function Page() {
  const { slug: rawSlug } = useParams();
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";

  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      setLoading(true);
      const res = await fetch(
        `/api/database/sales/get-sales-by-branch-slug?branch_slug=${encodeURIComponent(
          slug
        )}`
      );
      if (res.ok) {
        const { sales } = await res.json();
        setSales(sales);
      } else {
        setSales([]);
      }
      setLoading(false);
    }
    if (slug) fetchSales();
  }, [slug]);

  const fuse = useMemo(
    () =>
      new Fuse<SaleRecord>(sales, {
        keys: ["data.receipt_number", "data.receipt_date", "data.branch_name"],
        threshold: 0.3,
      }),
    [sales]
  );

  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;
    return fuse.search(search).map((r) => r.item);
  }, [search, fuse, sales]);

  const branchName = sales[0]?.data.branch_name ?? slug;

  if (loading) return <p className="text-center">Loading…</p>;

  return (
    <div>
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
              <Link href={`/sales/branches/${slug}/configure`}>Configure</Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Configure for {branchName}</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center justify-center mb-6">
        <Input
          placeholder="Search by receipt # or branch name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/3"
        />
      </div>

      {filteredSales.length === 0 ? (
        <p className="text-center">No sales found for “{search}”.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Receipt #</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>TIN</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((s) => (
              <TableRow key={s.data.id}>
                <TableCell>{s.data.receipt_date}</TableCell>
                <TableCell>{s.data.receipt_number}</TableCell>
                <TableCell>
                  {s.data.is_submitted ? "Yes" : "No"}
                </TableCell>
                <TableCell>{s.data.branch_tin}</TableCell>
                <TableCell>${s.data.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/sales/branches/${slug}/${s.data.id}`}>
                          View
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
