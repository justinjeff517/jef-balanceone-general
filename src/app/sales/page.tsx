import React, { useMemo } from 'react'
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

interface SaleItem {
    id: string
    name: string
    description: string
    quantity: number
    unit_price: number
    total_price: number
}

interface ChangeHistory {
    changed_at: string
    changed_by: string
    changes: {
        field: string
        old_value: string
        new_value: string
    }
}

interface Sale {
    id: string
    branch_name: string
    branch_slug: string
    branch_tin: string
    items: SaleItem[]
    total_amount: number
    status: string
    created_at: string
    updated_at: string
    created_by: string
    approved_by: string
    approval_timestamp: string
    change_history: ChangeHistory[]
}

// Dummy data
const sales: Sale[] = [
    {
        id: '1',
        branch_name: 'Central Branch',
        branch_slug: 'central-branch',
        branch_tin: '987-654-321',
        items: [
            {
                id: 'item1',
                name: 'Product X',
                description: 'Top-selling item',
                quantity: 5,
                unit_price: 40.0,
                total_price: 200,
            },
        ],
        total_amount: 200,
        status: 'Completed',
        created_at: '2025-05-07T02:00:00Z',
        updated_at: '2025-05-07T03:00:00Z',
        created_by: 'jdoe',
        approved_by: 'asmith',
        approval_timestamp: '2025-05-07T03:30:00Z',
        change_history: [
            {
                changed_at: '2025-05-07T02:30:00Z',
                changed_by: 'jdoe',
                changes: { field: 'status', old_value: 'pending', new_value: 'completed' },
            },
        ],
    },
]

type FormattedSale = Sale & { createdAtString: string }

const SaleRow = React.memo(({ sale }: { sale: FormattedSale }) => (
    <TableRow>
        <TableCell>{sale.branch_name}</TableCell>
        <TableCell>{sale.total_amount.toFixed(2)}</TableCell>
        <TableCell>{sale.status}</TableCell>
        <TableCell>{sale.createdAtString}</TableCell>
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
))

export default function Page() {
    const formattedSales = useMemo<FormattedSale[]>(
        () =>
            sales.map(s => ({
                ...s,
                createdAtString: new Date(s.created_at).toLocaleString(),
            })),
        []
    )

    return (
        <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="default" size="sm">
                            <Link href="/sales/branches">
                                <Plus className="mr-2 h-4 w-4" />
                                Branch Sales
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Sales from Branches</TooltipContent>
                </Tooltip>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Branch</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {formattedSales.map(s => (
                        <SaleRow key={s.id} sale={s} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
