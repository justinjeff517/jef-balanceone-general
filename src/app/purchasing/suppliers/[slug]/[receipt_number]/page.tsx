'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface ReceiptItem {
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

interface Receipt {
  id: string;
  supplier_name: string;
  supplier_slug: string;
  supplier_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: ReceiptItem[];
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by: string;
  approval_timestamp: string;
  change_history: ChangeHistory[];
}

export default function ReceiptPage() {
  const { receiptNumber } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace API call with dummy data
    const dummy: Receipt = {
      id: '1',
      supplier_name: 'Acme Corporation',
      supplier_slug: 'acme-corp',
      supplier_tin: '123-456-789',
      receipt_date: '2025-05-01',
      receipt_number: receiptNumber || '00000',
      items: [
        {
          id: 'item1',
          name: 'Widget A',
          description: 'High-quality widget',
          quantity: 2,
          unit_price: 25.0,
          total_price: 50.0,
        },
        {
          id: 'item2',
          name: 'Widget B',
          description: 'Standard widget',
          quantity: 1,
          unit_price: 15.0,
          total_price: 15.0,
        },
      ],
      total_amount: 65.0,
      status: 'approved',
      created_at: '2025-05-02T09:30:00Z',
      updated_at: '2025-05-03T14:45:00Z',
      created_by: 'Alice',
      approved_by: 'Bob',
      approval_timestamp: '2025-05-03T15:00:00Z',
      change_history: [
        {
          changed_at: '2025-05-03T15:00:00Z',
          changed_by: 'Bob',
          changes: {
            field: 'status',
            old_value: 'pending',
            new_value: 'approved',
          },
        },
      ],
    };

    // Simulate loading delay
    setTimeout(() => {
      setReceipt(dummy);
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

  if (error || !receipt) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Receipt not found'}</p>
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
            <CardTitle>Receipt #{receipt.receipt_number}</CardTitle>
            <Badge variant={receipt.status === 'approved' ? 'default' : 'secondary'}>
              {receipt.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Supplier Information</h3>
              <p>Name: {receipt.supplier_name}</p>
              <p>Slug: {receipt.supplier_slug}</p>
              <p>TIN: {receipt.supplier_tin}</p>
            </div>
            <div>
              <h3 className="font-semibold">Receipt Details</h3>
              <p>Date: {new Date(receipt.receipt_date).toLocaleDateString()}</p>
              <p>Created: {new Date(receipt.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(receipt.updated_at).toLocaleString()}</p>
              <p>Created By: {receipt.created_by}</p>
              <p>Approved By: {receipt.approved_by}</p>
              <p>Approval Time: {new Date(receipt.approval_timestamp).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
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
              {receipt.items.map((item) => (
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
            <p className="font-semibold">Total Amount: ${receipt.total_amount.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change History</CardTitle>
        </CardHeader>
        <CardContent>
          {receipt.change_history.map((change, index) => (
            <div key={index} className="mb-4">
              <p>
                <span className="font-semibold">Changed By:</span> {change.changed_by}
              </p>
              <p>
                <span className="font-semibold">Changed At:</span>{' '}
                {new Date(change.changed_at).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Field:</span> {change.changes.field}
              </p>
              <p>
                <span className="font-semibold">Old Value:</span> {change.changes.old_value}
              </p>
              <p>
                <span className="font-semibold">New Value:</span> {change.changes.new_value}
              </p>
              {index < receipt.change_history.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
