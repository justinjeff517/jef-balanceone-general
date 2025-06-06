"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type Product = {
  id: string;
  name: string;
  description: string;
  unit_price: number;
};

type BranchData = {
  branch_name: string;
  branch_slug: string;
  products: Product[];
};

export default function Page(): JSX.Element {
  const { slug } = useParams() as { slug: string };

  const [branch, setBranch] = useState<BranchData>({
    branch_name: slug,
    branch_slug: slug,
    products: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/database/products/get-products-by-branch-slug?branch_slug=${encodeURIComponent(slug)}`);
        const json = await res.json();
        const raw = json.products || [];
        const mapped: Product[] = raw.map((item: any) => ({
          id: item.data.id,
          name: item.data.name,
          description: item.data.description,
          unit_price: item.data.unit_price
        }));
        const branchName = raw.length > 0 ? raw[0].data.branch_name : slug;
        setBranch({
          branch_name: branchName,
          branch_slug: slug,
          products: mapped
        });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      setLoading(true);
      fetchProducts();
    }
  }, [slug]);

  if (loading) {
    return <div>Loading products…</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branch.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.unit_price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Link href={`/sales/branches/${branch.branch_slug}/configure/${product.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {branch.products.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          No products found for “{branch.branch_name}.”
        </div>
      )}
    </div>
  );
}
