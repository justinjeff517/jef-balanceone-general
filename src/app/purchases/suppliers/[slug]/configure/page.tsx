"use client";

import { useState, useEffect } from "react";
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
};

type SupplierData = {
  supplier_name: string;
  supplier_slug: string;
  products: Product[];
};

export default function Page(): JSX.Element {
  const { slug } = useParams() as { slug: string };
  const [supplier, setSupplier] = useState<SupplierData | null>(null);

  useEffect(() => {
    async function fetchSupplier() {
      const res = await fetch(
        `http://localhost:3000/api/database/supplier-products/get-supplier-products-by-supplier-slug?supplier_slug=${slug}`
      );
      if (!res.ok) return;
      const json = await res.json();
      const items = json.supplier_products as Array<{ data: any }>;
      if (items.length === 0) {
        setSupplier({
          supplier_name: slug,
          supplier_slug: slug,
          products: [],
        });
        return;
      }

      const first = items[0].data;
      const supplierName = first.supplier_name;
      const supplierSlug = first.supplier_slug;

      const products: Product[] = items.map((item) => {
        const d = item.data;
        return {
          id: d.id,
          name: d.name,
          slug: d.slug,
          description: d.description,
          category: d.category,
          unit: d.unit,
          unit_price: d.unit_price,
          active: d.active,
        };
      });

      setSupplier({
        supplier_name: supplierName,
        supplier_slug: supplierSlug,
        products,
      });
    }

    fetchSupplier();
  }, [slug]);

  if (!supplier) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 space-y-1">
        <p className="text-sm">
          <strong>Name:</strong> {supplier.supplier_name}
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
