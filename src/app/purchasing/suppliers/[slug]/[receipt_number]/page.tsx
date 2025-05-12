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

interface ChangeEntry {
  field: string;
  old_value: string;
  new_value: string;
}

interface ChangeHistory {
  changed_at: string;
  changed_by: string;
  changes: ChangeEntry[];
}

interface ESignature {
  signed_by: string;
  signed_at: string;
  signature_reason: 'submission' | 'approval' | 'correction';
  signature_hash: string;
}

interface Receipt {
  collection: 'purchase_records';
  record_id: string;
  supplier_name: string;
  supplier_slug: string;
  supplier_tin: string;
  receipt_date: string;
  receipt_number: string;
  items: ReceiptItem[];
  total_amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'cancelled';
  created_at: string;
  created_by: string;
  change_history: ChangeHistory[];
  e_signature: ESignature;
  summary_text: string;
  items_summary: string;
  last_change_summary: string;
}

export default function ReceiptPage() {
  const { receiptNumber } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dummy: Receipt = {
      collection: 'purchase_records',
      record_id: '550e8400-e29b-41d4-a716-446655440000',
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
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      change_history: [
        {
          changed_at: '2025-05-03T15:00:00Z',
          changed_by: '550e8400-e29b-41d4-a716-446655440002',
          changes: [
            {
              field: 'status',
              old_value: 'pending',
              new_value: 'approved',
            },
          ],
        },
      ],
      e_signature: {
        signed_by: '550e8400-e29b-41d4-a716-446655440002',
        signed_at: '2025-05-03T15:00:00Z',
        signature_reason: 'approval',
        signature_hash: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
      },
      summary_text: 'Purchased 2 × Widget A and 1 × Widget B from Acme Corporation for $65.00 on 2025-05-01.',
      items_summary: '- Widget A (2) @ $25.00 → $50.00\n- Widget B (1) @ $15.00 → $15.00',
      last_change_summary: 'Status changed from pending to approved by user 550e8400-e29b-41d4-a716-446655440002 on 2025-05-03T15:00:00Z.',
    };

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
              <p>Created By: {receipt.created_by}</p>
              <p>Record ID: {receipt.record_id}</p>
              <p>Collection: {receipt.collection}</p>
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

      <Card className="mb-6">
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
              {change.changes.map((c, i) => (
                <div key={i}>
                  <p><span className="font-semibold">Field:</span> {c.field}</p>
                  <p><span className="font-semibold">Old Value:</span> {c.old_value}</p>
                  <p><span className="font-semibold">New Value:</span> {c.new_value}</p>
                </div>
              ))}
              {index < receipt.change_history.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>E-Signature & Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Signed By:</strong> {receipt.e_signature.signed_by}</p>
          <p><strong>Signed At:</strong> {new Date(receipt.e_signature.signed_at).toLocaleString()}</p>
          <p><strong>Reason:</strong> {receipt.e_signature.signature_reason}</p>
          <Separator className="my-4" />
          <p><strong>Summary:</strong> {receipt.summary_text}</p>
          <p><strong>Items Summary:</strong><br/>{receipt.items_summary}</p>
          <p><strong>Last Change Summary:</strong> {receipt.last_change_summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
