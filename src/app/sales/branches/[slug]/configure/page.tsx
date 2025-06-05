"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

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
    products: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/database/products/get-products-by-branch-slug?branch_slug=${encodeURIComponent(
            slug
          )}`
        );
        const json = await res.json();
        const raw = json.products || [];
        const mapped: Product[] = raw.map((item: any) => ({
          id: item.data.id,
          name: item.data.name,
          description: item.data.description,
          unit_price: item.data.unit_price,
        }));
        const branchName =
          raw.length > 0 ? raw[0].data.branch_name : slug;
        setBranch({
          branch_name: branchName,
          branch_slug: slug,
          products: mapped,
        });
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      setLoading(true);
      fetchProducts();
    }
  }, [slug]);

  const handleDelete = (id: string): void => {
    console.log("Deleting product", id);
    // call delete API or update state here
  };

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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branch.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.unit_price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{product.name}</strong>? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(product.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
