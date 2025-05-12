import React from 'react'
import Link from 'next/link'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

// --- Schema-aligned types ---
type SaleStatus = 'draft' | 'submitted' | 'approved' | 'paid' | 'cancelled'
type PaymentMethod = 'cash' | 'cheque' | 'gcash'

interface SaleItem {
  id: string
  name: string
  description?: string
  quantity: number
  unit_price: number
  total_price: number
}

interface ChangeEntry {
  field: string
  old_value: string
  new_value: string
}

interface ChangeHistory {
  changed_at: string
  changed_by: string
  changes: ChangeEntry[]
}

interface ESignature {
  signed_by: string
  signed_at: string
  signature_reason: 'submission' | 'approval' | 'correction'
  signature_hash: string
}

interface Sale {
  collection: 'sales'
  record_id: string
  branch_name: string
  branch_slug: string
  branch_tin: string
  receipt_date: string
  receipt_number: string
  items: SaleItem[]
  total_amount: number
  status: SaleStatus
  payment_method: PaymentMethod
  created_at: string
  created_by: string
  change_history: ChangeHistory[]
  e_signature: ESignature
  summary_text: string
  items_summary: string
  last_change_summary: string
}

export default function Page() {
  // Dummy data matching schema
  const sales: Sale[] = [
    {
      collection: 'sales',
      record_id: '550e8400-e29b-41d4-a716-446655440000',
      branch_name: 'Central Branch',
      branch_slug: 'central-branch',
      branch_tin: '987-654-321',
      receipt_date: '2025-05-07',
      receipt_number: 'RCPT-1001',
      items: [
        {
          id: '6fa459ea-ee8a-3ca4-894e-db77e160355e',
          name: 'Product X',
          description: 'Top-selling item',
          quantity: 5,
          unit_price: 40.0,
          total_price: 200,
        },
      ],
      total_amount: 200,
      status: 'approved',
      payment_method: 'cash',
      created_at: '2025-05-07T02:00:00Z',
      created_by: '123e4567-e89b-12d3-a456-426614174000',
      change_history: [
        {
          changed_at: '2025-05-07T02:30:00Z',
          changed_by: '123e4567-e89b-12d3-a456-426614174000',
          changes: [
            { field: 'status', old_value: 'submitted', new_value: 'approved' },
          ],
        },
      ],
      e_signature: {
        signed_by: '123e4567-e89b-12d3-a456-426614174000',
        signed_at: '2025-05-07T03:30:00Z',
        signature_reason: 'approval',
        signature_hash: 'a3f5c2e1d4b6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      },
      summary_text: 'Central Branch sold 5 units of Product X for $200 on 2025-05-07.',
      items_summary: '• Product X x5 = $200',
      last_change_summary: 'Status changed from submitted to approved',
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-start mb-4">
  
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild>
              <Link href="/sales/branches">
                <Plus className="mr-2 h-4 w-4" />
                New Sale from Branches
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a new sale from branches</TooltipContent>
        </Tooltip>
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

          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map(sale => (
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

                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
