'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface SaleItem {
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

interface SaleReceipt {
  id: string;
  branch_name: string;
  branch_slug: string;
  branch_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: SaleItem[];
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by: string;
  approval_timestamp: string;
  change_history: ChangeHistory[];
}

export default function SaleReceiptPage() {
  const { receiptNumber } = useParams();
  const [sale, setSale] = useState<SaleReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dummy: SaleReceipt = {
      id: '1',
      branch_name: 'Main Branch',
      branch_slug: 'main-branch',
      branch_tin: '987-654-321',
      receipt_date: '2025-05-08',
      receipt_number: receiptNumber || '00000',
      items: [
        {
          id: 'item1',
          name: 'Product X',
          description: 'High-end product',
          quantity: 3,
          unit_price: 45.0,
          total_price: 135.0,
        },
        {
          id: 'item2',
          name: 'Product Y',
          description: 'Standard product',
          quantity: 2,
          unit_price: 30.0,
          total_price: 60.0,
        },
      ],
      total_amount: 195.0,
      status: 'submitted',
      created_at: '2025-05-07T02:00:00Z',
      updated_at: '2025-05-07T03:00:00Z',
      created_by: 'Carol',
      approved_by: 'Dave',
      approval_timestamp: '2025-05-07T03:30:00Z',
      change_history: [
        {
          changed_at: '2025-05-07T02:30:00Z',
          changed_by: 'Carol',
          changes: {
            field: 'status',
            old_value: 'draft',
            new_value: 'submitted',
          },
        },
      ],
    };

    setTimeout(() => {
      setSale(dummy);
      setLoading(false);
    }, 500);
  }, [receiptNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Sale receipt not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sale Receipt #{sale.receipt_number}</CardTitle>
            <Badge variant={sale.status === 'approved' ? 'default' : 'secondary'}>
              {sale.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Branch Information</h3>
              <p>Name: {sale.branch_name}</p>
              <p>Slug: {sale.branch_slug}</p>
              <p>TIN: {sale.branch_tin}</p>
            </div>
            <div>
              <h3 className="font-semibold">Receipt Details</h3>
              <p>Date: {new Date(sale.receipt_date).toLocaleDateString()}</p>
              <p>Created: {new Date(sale.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(sale.updated_at).toLocaleString()}</p>
              <p>Created By: {sale.created_by}</p>
              <p>Approved By: {sale.approved_by}</p>
              <p>Approval Time: {new Date(sale.approval_timestamp).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell>${item.total_price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="font-semibold">Total Amount: ${sale.total_amount.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change History</CardTitle>
        </CardHeader>
        <CardContent>
          {sale.change_history.map((change, i) => (
            <div key={i} className="mb-4">
              <p><span className="font-semibold">Changed By:</span> {change.changed_by}</p>
              <p><span className="font-semibold">Changed At:</span> {new Date(change.changed_at).toLocaleString()}</p>
              <p><span className="font-semibold">Field:</span> {change.changes.field}</p>
              <p><span className="font-semibold">Old Value:</span> {change.changes.old_value}</p>
              <p><span className="font-semibold">New Value:</span> {change.changes.new_value}</p>
              {i < sale.change_history.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
