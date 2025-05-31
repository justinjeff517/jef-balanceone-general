"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  unit: string;
  unit_price: number;
  active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

type SupplierData = {
  supplier_name: string;
  supplier_slug: string;
  supplier_tin: string;
  products: Product[];
};

export default function Page(): JSX.Element {
  const { slug } = useParams() as { slug: string };

  const supplier: SupplierData = {
    supplier_name: slug,
    supplier_slug: slug,
    supplier_tin: "123-456-789",
    products: [
      {
        id: "a1b2c3d4-e5f6-4a3b-8c7d-0e1f2a3b4c5d",
        name: "Product A",
        slug: "product-a",
        description: "High-quality steel plate",
        category: "Raw Materials",
        unit: "piece",
        unit_price: 100.0,
        active: true,
        created_at: "2025-05-14T01:00:00Z",
        created_by: "11111111-1111-1111-1111-111111111111",
        updated_at: "2025-05-14T02:00:00Z",
        updated_by: "22222222-2222-2222-2222-222222222222",
      },
      {
        id: "b2c3d4e5-f6a1-4b3c-9d8e-1f0a2b3c4d5e",
        name: "Product B",
        slug: "product-b",
        description: "Box of sanding disks",
        category: "Consumables",
        unit: "box",
        unit_price: 25.5,
        active: true,
        created_at: "2025-05-14T01:30:00Z",
        created_by: "33333333-3333-3333-3333-333333333333",
        updated_at: "2025-05-14T02:30:00Z",
        updated_by: "44444444-4444-4444-4444-444444444444",
      },
      {
        id: "c3d4e5f6-a1b2-4c3d-0e9f-2a1b3c4d5e6f",
        name: "Product C",
        slug: "product-c",
        description: "Liter of industrial lubricant",
        category: "Chemicals",
        unit: "liter",
        unit_price: 15.75,
        active: false,
        created_at: "2025-05-14T02:00:00Z",
        created_by: "55555555-5555-5555-5555-555555555555",
        updated_at: "2025-05-14T03:00:00Z",
        updated_by: "66666666-6666-6666-6666-666666666666",
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto">

      <div className="mb-6 space-y-1">
        <p className="text-sm">
          <strong>Name:</strong> {supplier.supplier_name}
        </p>
        <p className="text-sm">
          <strong>TIN:</strong> {supplier.supplier_tin}
        </p>
        <p className="text-sm">
          <strong>Slug:</strong> {supplier.supplier_slug}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplier.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.unit_price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/purchases/suppliers/${supplier.supplier_slug}/configure/${product.id}`}
                      >
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/purchases/suppliers/${supplier.supplier_slug}/configure/${product.id}/modify`}
                      >
                        Modify
                      </Link>
                    </DropdownMenuItem>
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

