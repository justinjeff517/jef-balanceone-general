'use client';

import React, { useState, useEffect, useMemo, FC, ChangeEvent } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus } from 'lucide-react';

type PurchaseStatus = 'draft' | 'submitted' | 'approved' | 'paid' | 'cancelled';

interface PurchaseItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Purchase {
  record_id: string;
  supplier_name: string;
  supplier_slug: string;
  supplier_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: PurchaseItem[];
  total_amount: number;
  status: PurchaseStatus;
  created_at: string;
  created_by: string;
}

const Page: FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/database/purchases/get-purchases')
      .then(res => res.json())
      .then((resp: { purchases: Array<{ data: any; metadata: any }> }) => {
        const mapped: Purchase[] = resp.purchases.map(({ data, metadata }) => ({
          record_id: data.record_id,
          supplier_name: data.supplier_name,
          supplier_slug: data.supplier_slug,
          supplier_tin: data.supplier_tin,
          receipt_date: data.receipt_date,
          receipt_number: data.receipt_number,
          items: data.items,
          total_amount: data.total_amount,
          status: data.status,
          created_at: metadata.created_at,
          created_by: metadata.created_by,
        }));
        setPurchases(mapped);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching purchases:', err);
        setPurchases([]);
        setIsLoading(false);
      });
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse<Purchase>(purchases, {
        keys: [
          'supplier_name',
          'receipt_number',
          'receipt_date',
          'status',
          'supplier_tin',
        ],
        threshold: 0.3,
      }),
    [purchases]
  );

  const displayedPurchases = useMemo<Purchase[]>(
    () =>
      searchQuery
        ? fuse.search(searchQuery).map(r => r.item)
        : purchases,
    [searchQuery, fuse, purchases]
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="min-w-0 md:w-2/3">
          <Input
            placeholder="Search by supplier, receipt #, status…"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <Link href="/purchases/suppliers" className="w-full md:w-1/3">
          <Button className="w-full" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Progress className="w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Receipt #</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPurchases.map(p => (
              <TableRow key={p.record_id}>
                <TableCell>{p.supplier_name}</TableCell>
                <TableCell>{p.receipt_date}</TableCell>
                <TableCell>{p.receipt_number}</TableCell>
                <TableCell>{p.total_amount.toFixed(2)}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
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
};

export default Page;
