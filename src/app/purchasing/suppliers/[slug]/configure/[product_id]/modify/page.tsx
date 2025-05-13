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

// Schema types
type Change = { field: string; old: string | null; new: string | null };

type ChangeHistoryEntry = {
  timestamp: string;
  user_id: string;
  changes: Change[];
};

interface Product {
  data: {
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
  metadata: {
    mongodb: {
      collection: string;
      database: string;
    };
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    change_history: ChangeHistoryEntry[];
  };
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
    data: {
      id: product_id,
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
    },
    metadata: {
      mongodb: {
        collection: "products",
        database: "jef-balanceone-general",
      },
      created_at: sampleTime,
      created_by: sampleUser,
      updated_at: sampleTime,
      updated_by: sampleUser,
      change_history: [],
    },
  });

  useEffect(() => {
    setProduct({
      data: {
        id: product_id,
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
      },
      metadata: {
        mongodb: {
          collection: "products",
          database: "jef-balanceone-general",
        },
        created_at: sampleTime,
        created_by: sampleUser,
        updated_at: sampleTime,
        updated_by: sampleUser,
        change_history: [
          {
            timestamp: sampleTime,
            user_id: sampleUser,
            changes: [{ field: "name", old: "", new: "Sample Widget" }],
          },
        ],
      },
    });
  }, [product_id, slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const change: Change = {
      field: "updated_at",
      old: product.data.updated_at,
      new: now,
    };
    const updated: Product = {
      data: {
        ...product.data,
        updated_at: now,
        updated_by: sampleUser,
      },
      metadata: {
        ...product.metadata,
        updated_at: now,
        updated_by: sampleUser,
        change_history: [
          ...product.metadata.change_history,
          { timestamp: now, user_id: sampleUser, changes: [change] },
        ],
      },
    };
    console.log("Payload:", updated);
    // TODO: send `updated` to API
    router.push(`/purchasing/suppliers/${slug}/configure/${product.data.id}`);
  };

  const handleDelete = () => {
    console.log("Deleting product:", product.data.id);
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
              value={product.data.name}
              onChange={(e) =>
                setProduct({
                  ...product,
                  data: { ...product.data, name: e.target.value },
                })
              }
            />
            <Input
              placeholder="Slug"
              value={product.data.slug}
              onChange={(e) =>
                setProduct({
                  ...product,
                  data: { ...product.data, slug: e.target.value },
                })
              }
            />
            <Input
              placeholder="Description"
              value={product.data.description}
              onChange={(e) =>
                setProduct({
                  ...product,
                  data: { ...product.data, description: e.target.value },
                })
              }
            />
            <Input
              placeholder="Category"
              value={product.data.category}
              onChange={(e) =>
                setProduct({
                  ...product,
                  data: { ...product.data, category: e.target.value },
                })
              }
            />
            <Input
              placeholder="Unit (e.g. piece, kg)"
              value={product.data.unit}
              onChange={(e) =>
                setProduct({
                  ...product,
                  data: { ...product.data, unit: e.target.value },
                })
              }
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Unit Price"
              value={product.data.unit_price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  data: {
                    ...product.data,
                    unit_price: parseFloat(e.target.value) || 0,
                  },
                })
              }
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={product.data.active}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    data: { ...product.data, active: e.target.checked },
                  })
                }
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
                  <DialogTitle>
                    Are You Sure You Want to Delete this Product?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone.
                  </DialogDescription>
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
