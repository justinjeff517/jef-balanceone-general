'use client';

import React, { FC, useState, useEffect, useMemo, ChangeEvent } from 'react';
import Fuse from 'fuse.js';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

interface SaleData {
  id: string;
  branch_name: string;
  branch_slug: string;
  branch_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: Item[];
  total_amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'cancelled';
  payment_method: 'cash' | 'cheque' | 'gcash';
}

interface Metadata {
  mongodb: {
    collection: string;
    database: string;
  };
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  change_history: unknown[];
}

interface SaleEntry {
  data: SaleData;
  metadata: Metadata;
}

const Page: FC = () => {
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch('/api/database/sales/get-sales');
        const json = await res.json();
        const fetched: SaleEntry[] = json.sales ?? [];
        setSales(fetched);
      } catch (err) {
        console.error('Failed to fetch sales:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSales();
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setProgressValue(prev => (prev >= 100 ? 0 : prev + 10));
    }, 200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const fuse = useMemo(
    () =>
      new Fuse<SaleEntry>(sales, {
        keys: ['data.branch_name', 'data.receipt_number', 'data.status'],
        threshold: 0.3,
      }),
    [sales]
  );

  const displayedSales = useMemo(
    () =>
      searchQuery
        ? fuse.search(searchQuery).map(r => r.item)
        : sales,
    [searchQuery, fuse, sales]
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <span className="mb-2">Loading sales...</span>
        <Progress value={progressValue} className="w-1/2" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
<div className="mb-4">
  {/* Button at top-left */}
  <div>
    <Link href="/sales/branches">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        New Sale from Branches
      </Button>
    </Link>
  </div>

  {/* Search input centered below */}
  <div className="flex justify-center mt-4">
    <Input
      placeholder="Search by branch, receipt #, status…"
      value={searchQuery}
      onChange={onSearchChange}
      className="w-full md:w-1/2"
    />
  </div>
</div>


      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Receipt #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedSales.map(({ data }) => (
            <TableRow key={data.id}>
              <TableCell>{data.branch_name}</TableCell>
              <TableCell>{data.receipt_number}</TableCell>
              <TableCell>{data.receipt_date}</TableCell>
              <TableCell>₱{data.total_amount.toFixed(2)}</TableCell>
              <TableCell>{data.status}</TableCell>
              <TableCell>{data.payment_method}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
