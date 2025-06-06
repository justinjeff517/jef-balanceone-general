'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface SaleItem {
  id: string;
  name: string;
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
  items: SaleItem[];
  total_amount: number;
  status: string;
  payment_method: string;
}

export default function Page() {
  const { sale_id } = useParams();
  const [sale, setSale] = React.useState<SaleData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!sale_id) return;

    fetch(`/api/database/sales/get-sale-by-id?sale_id=${sale_id}`)
      .then((res) => res.json())
      .then((json) => {
        setSale(json.sale.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sale_id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!sale) {
    return <div>Sale not found.</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Receipt #{sale.receipt_number}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">Branch:</p>
              <p>{sale.branch_name} ({sale.branch_slug})</p>
            </div>
            <div>
              <p className="text-sm font-medium">TIN:</p>
              <p>{sale.branch_tin}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">Date:</p>
              <p>{sale.receipt_date}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status:</p>
              <Badge className="capitalize">{sale.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Payment:</p>
              <p className="capitalize">{sale.payment_method}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Total Amount:</p>
            <p className="text-lg font-semibold">{sale.total_amount.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.unit_price.toLocaleString()}</TableCell>
                  <TableCell>{item.total_price.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
