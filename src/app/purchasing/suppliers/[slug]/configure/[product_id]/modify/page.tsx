"use client";
import { JSX } from "react";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";

type Change = { field: string; old_value: string; new_value: string };
type ChangeHistoryEntry = {
  changed_at: string;
  changed_by: string;
  changes: Change[];
};
type ESignature = {
  signed_by: string;
  signed_at: string;
  signature_reason: "creation" | "update" | "deactivation";
  signature_hash: string;
};

interface Product {
  collection: "products";
  product_id: string;
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
  change_history: ChangeHistoryEntry[];
  e_signature: ESignature;
}

export default function Page(): JSX.Element {
  const { slug, product_id } = useParams() as {
    slug: string;
    product_id: string;
  };
  const router = useRouter();

  const sampleUser = "11111111-1111-1111-1111-111111111111";
  const sampleTime = "2025-05-01T10:00:00Z";

  const [product, setProduct] = useState<Product>({
    collection: "products",
    product_id,
    name: "",
    slug,
    description: "",
    category: "",
    unit: "",
    unit_price: 0,
    active: true,
    created_at: sampleTime,
    created_by: sampleUser,
    updated_at: sampleTime,
    updated_by: sampleUser,
    change_history: [],
    e_signature: {
      signed_by: sampleUser,
      signed_at: sampleTime,
      signature_reason: "creation",
      signature_hash:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    },
  });

  useEffect(() => {
    setProduct({
      collection: "products",
      product_id,
      name: "Sample Widget",
      slug,
      description: "A sample widget for testing purposes.",
      category: "Test Items",
      unit: "piece",
      unit_price: 99.99,
      active: true,
      created_at: sampleTime,
      created_by: sampleUser,
      updated_at: sampleTime,
      updated_by: sampleUser,
      change_history: [
        {
          changed_at: sampleTime,
          changed_by: sampleUser,
          changes: [{ field: "name", old_value: "", new_value: "Sample Widget" }],
        },
      ],
      e_signature: {
        signed_by: sampleUser,
        signed_at: sampleTime,
        signature_reason: "creation",
        signature_hash:
          "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
      },
    });
  }, [product_id, slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const changes: Change[] = [{ field: "updated", old_value: "(see audit)", new_value: "(see audit)" }];
    const updated: Product = {
      ...product,
      updated_at: now,
      updated_by: sampleUser,
      change_history: [...product.change_history, { changed_at: now, changed_by: sampleUser, changes }],
      e_signature: {
        signed_by: sampleUser,
        signed_at: now,
        signature_reason: "update",
        signature_hash: uuidv4().replace(/-/g, ""),
      },
    };
    console.log("Payload:", updated);
    // TODO: send `updated` to your API
    router.push(`/purchasing/suppliers/${slug}/configure/${product_id}`);
  };

  const handleDelete = () => {
    console.log("Deleting product:", product.product_id);
    // TODO: call delete API endpoint
    router.push(`/purchasing/suppliers/${slug}/configure`);
  };

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Modify Product</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              placeholder="Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
            <Input
              placeholder="Slug"
              value={product.slug}
              onChange={(e) => setProduct({ ...product, slug: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            />
            <Input
              placeholder="Unit (e.g. piece, kg)"
              value={product.unit}
              onChange={(e) => setProduct({ ...product, unit: e.target.value })}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Unit Price"
              value={product.unit_price}
              onChange={(e) =>
                setProduct({ ...product, unit_price: parseFloat(e.target.value) || 0 })
              }
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={product.active}
                onChange={(e) => setProduct({ ...product, active: e.target.checked })}
              />
              <span>Active</span>
            </label>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are You Sure You Want to Delete this Product?</DialogTitle>
                  <DialogDescription>This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
     
                  <Button variant="destructive" onClick={handleDelete}>
                    Yes, Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
