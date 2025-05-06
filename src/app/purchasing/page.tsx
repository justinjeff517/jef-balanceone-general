import React from 'react';
import Link from 'next/link';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
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

// Dummy data for demonstration
const purchases: Purchase[] = [
  {
    id: '1',
    supplier_name: 'Acme Supplies',
    supplier_slug: 'acme-supplies',
    supplier_tin: '123-456-789',
    items: [
      {
        id: 'item1',
        name: 'Widget A',
        description: 'High-quality widget',
        quantity: 10,
        unit_price: 25.5,
        total_price: 255,
      },
    ],
    total_amount: 255,
    status: 'Submitted',
    created_at: '2025-05-07T02:00:00Z',
    updated_at: '2025-05-07T03:00:00Z',
    created_by: 'jdoe',
    approved_by: 'asmith',
    approval_timestamp: '2025-05-07T03:30:00Z',
    change_history: [
      {
        changed_at: '2025-05-07T02:30:00Z',
        changed_by: 'jdoe',
        changes: { field: 'status', old_value: 'draft', new_value: 'submitted' },
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="p-6">
<div className="flex items-center space-x-4 mb-4">
  <Tooltip>
    <TooltipTrigger asChild>
      <Button asChild variant="default" size="sm">
        <Link href="/purchasing/suppliers">
          <Plus className="mr-2 h-4 w-4" />
          Supplier Purchases
        </Link>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      Add Purchases from Suppliers
    </TooltipContent>
  </Tooltip>
</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.supplier_name}</TableCell>
              <TableCell>{purchase.total_amount.toFixed(2)}</TableCell>
              <TableCell>{purchase.status}</TableCell>
              <TableCell>{new Date(purchase.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Modify</DropdownMenuItem>
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
