'use client';

import React, { FC, useState, useMemo, ChangeEvent } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { MoreHorizontal, Plus } from 'lucide-react';

// --- Types ---
type SaleStatus = 'draft' | 'submitted' | 'approved' | 'paid' | 'cancelled';
type PaymentMethod = 'cash' | 'cheque' | 'gcash';

interface SaleItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

interface Sale {
  record_id: string;
  branch_name: string;
  branch_slug: string;
  branch_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: SaleItem[];
  items_summary: string;
  total_amount: number;
  status: SaleStatus;
  payment_method: PaymentMethod;
  created_at: string;
  created_by: string;
}

// --- Dummy data ---
const sales: Sale[] = [
  {
    record_id: 'f1e2d3c4-5678-90ab-cdef-1234567890ab',
    branch_name: 'North Branch',
    branch_slug: 'north-branch',
    branch_tin: '987-654-321',
    receipt_date: '2025-05-11',
    receipt_number: 'S2001',
    items: [
      {
        id: 'aaaabbbb-cccc-dddd-eeee-ffff00001111',
        name: 'Wireless Headphones',
        description: 'Bluetooth over-ear',
        quantity: 3,
        unit: 'piece',
        unit_price: 59.99,
        total_price: 179.97,
      },
    ],
    items_summary: '3 × Wireless Headphones',
    total_amount: 179.97,
    status: 'submitted',
    payment_method: 'gcash',
    created_at: '2025-05-11T09:00:00Z',
    created_by: '11112222-3333-4444-5555-666677778888',
  },
  {
    record_id: '01234567-89ab-cdef-0123-456789abcdef',
    branch_name: 'North Branch',
    branch_slug: 'north-branch',
    branch_tin: '987-654-321',
    receipt_date: '2025-05-12',
    receipt_number: 'S2002',
    items: [
      {
        id: '22223333-4444-5555-6666-777788889999',
        name: 'Portable Speaker',
        description: 'Waterproof, 12h battery',
        quantity: 2,
        unit: 'piece',
        unit_price: 39.99,
        total_price: 79.98,
      },
    ],
    items_summary: '2 × Portable Speaker',
    total_amount: 79.98,
    status: 'draft',
    payment_method: 'cash',
    created_at: '2025-05-12T10:30:00Z',
    created_by: '11112222-3333-4444-5555-666677778888',
  },
];

const Page: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fuse = useMemo(
    () =>
      new Fuse<Sale>(sales, {
        keys: [
          'branch_name',
          'receipt_number',
          'receipt_date',
          'status',
          'payment_method',
          'items_summary',
        ],
        threshold: 0.3,
      }),
    []
  );

  const displayedSales = useMemo<Sale[]>(
    () =>
      searchQuery
        ? fuse.search(searchQuery).map(r => r.item)
        : sales,
    [searchQuery, fuse]
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex-grow min-w-0">
          <Input
            placeholder="Search by branch, receipt #, status…"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full"
          />
        </div>
        <Link href="/sales/branches">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Sale from Branches
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Receipt #</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedSales.map(sale => (
            <TableRow key={sale.record_id}>
              <TableCell>{sale.branch_name}</TableCell>
              <TableCell>{sale.receipt_date}</TableCell>
              <TableCell>{sale.receipt_number}</TableCell>
              <TableCell>{sale.total_amount.toFixed(2)}</TableCell>
              <TableCell>{sale.status}</TableCell>
              <TableCell>{sale.payment_method}</TableCell>
              <TableCell>{new Date(sale.created_at).toLocaleString()}</TableCell>
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
    </div>
  );
};

export default Page;