'use client';

import React, { useState, useMemo, FC, ChangeEvent } from 'react';
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

// --- Schema-aligned types ---
type PurchaseStatus = 'draft' | 'submitted' | 'approved' | 'paid' | 'cancelled';

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
  old: null | string | number | any[] | object;
  new: null | string | number | any[] | object;
}

interface ChangeHistory {
  timestamp: string;
  user_id: string;
  changes: ChangeDetail[];
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
  updated_at: string;
  updated_by: string;
  change_history: ChangeHistory[];
}

// Dummy data
const purchases: Purchase[] = [
  {
    record_id: '111e1111-a11b-11c1-d111-111111111111',
    supplier_name: 'Supplier A',
    supplier_slug: 'supplier-a',
    supplier_tin: '111-222-333',
    receipt_date: '2025-05-01',
    receipt_number: 'PUR-1001',
    items: [
      {
        id: 'aaa459ea-ee8a-3ca4-894e-db77e160355e',
        name: 'Material A',
        description: 'Raw material',
        quantity: 10,
        unit_price: 15.5,
        total_price: 155,
      },
    ],
    total_amount: 155,
    status: 'approved',
    created_at: '2025-05-01T09:00:00Z',
    created_by: 'user-uuid-1',
    updated_at: '2025-05-02T10:00:00Z',
    updated_by: 'user-uuid-2',
    change_history: [
      {
        timestamp: '2025-05-02T10:00:00Z',
        user_id: 'user-uuid-2',
        changes: [{ field: 'status', old: 'submitted', new: 'approved' }],
      },
    ],
  },
  {
    record_id: '222e2222-b22b-22c2-e222-222222222222',
    supplier_name: 'Supplier B',
    supplier_slug: 'supplier-b',
    supplier_tin: '222-333-444',
    receipt_date: '2025-05-05',
    receipt_number: 'PUR-1002',
    items: [
      {
        id: 'bbb569fa-ff8b-4da9-921c-ec88e270466f',
        name: 'Component B',
        quantity: 5,
        unit_price: 50,
        total_price: 250,
      },
    ],
    total_amount: 250,
    status: 'submitted',
    created_at: '2025-05-05T11:30:00Z',
    created_by: 'user-uuid-3',
    updated_at: '',
    updated_by: '',
    change_history: [],
  },
  {
    record_id: '333e3333-c33b-33c3-f333-333333333333',
    supplier_name: 'Supplier C',
    supplier_slug: 'supplier-c',
    supplier_tin: '333-444-555',
    receipt_date: '2025-05-10',
    receipt_number: 'PUR-1003',
    items: [
      {
        id: 'ccc670gb-gg9c-5eb0-a032-fd99f381577g',
        name: 'Service C',
        description: 'Installation service',
        quantity: 1,
        unit_price: 500,
        total_price: 500,
      },
    ],
    total_amount: 500,
    status: 'paid',
    created_at: '2025-05-10T14:45:00Z',
    created_by: 'user-uuid-4',
    updated_at: '',
    updated_by: '',
    change_history: [],
  },
];

const Page: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    []
  );

  const displayedPurchases = useMemo<Purchase[]>(
    () =>
      searchQuery
        ? fuse.search(searchQuery).map(r => r.item)
        : purchases,
    [searchQuery, fuse]
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex-grow min-w-0">
          <Input
            placeholder="Search by supplier, receipt #, status…"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full"
          />
        </div>
        <Link href="/purchases/suppliers">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase from Suppliers
          </Button>
        </Link>
      </div>

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
              <TableCell>
                {new Date(p.created_at).toLocaleString()}
              </TableCell>
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
