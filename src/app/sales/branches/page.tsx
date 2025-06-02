'use client';

import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Product {
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
}

interface ChangeHistoryEntry {
  timestamp: string;
  user_id: string;
  changes: {
    field: string;
    old: unknown;
    new: unknown;
  }[];
}

interface BranchRaw {
  data: {
    id: string;
    name: string;
    slug: string;
    tin: string;
    address: string;
    products?: Product[];
    created_at: string;
    created_by: string;
    updated_at?: string;
    updated_by?: string;
    change_history?: ChangeHistoryEntry[];
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

export interface Branch {
  id: string;
  name: string;
  slug: string;
  tin: string;
  address: string;
  products: Product[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  change_history: ChangeHistoryEntry[];
}

export default function Page() {
  const router = useRouter();
  const [rawBranches, setRawBranches] = useState<BranchRaw[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/database/branches/get-branches", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setRawBranches(Array.isArray(json.branches) ? json.branches : []);
      } catch (err) {
        console.error("Error loading branches:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBranches();
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setProgressValue(prev => (prev >= 100 ? 0 : prev + 10));
    }, 200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const branches: Branch[] = useMemo(
    () =>
      rawBranches.map((b) => ({
        id: b.data.id,
        name: b.data.name,
        slug: b.data.slug,
        tin: b.data.tin,
        address: b.data.address,
        products: b.data.products || [],
        created_at: b.data.created_at,
        created_by: b.data.created_by,
        updated_at: b.data.updated_at || "",
        updated_by: b.data.updated_by || "",
        change_history: b.data.change_history || [],
      })),
    [rawBranches]
  );

  const filtered = useMemo(
    () =>
      branches.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
      ),
    [branches, query]
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <span className="mb-2">Loading branches...</span>
        <Progress value={progressValue} className="w-1/2" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <Input
          placeholder="Search branches..."
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          className="w-1/2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((branch) => (
          <Card
            key={branch.id}
            className="hover:shadow-lg transition-shadow flex flex-col"
          >
            <CardHeader>
              <CardTitle>{branch.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm mb-1">TIN: {branch.tin}</p>
              <p className="text-sm mb-2">Address: {branch.address}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={`/sales/branches/${branch.slug}`}>Select</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/sales/branches/${branch.slug}/configure`}>
                  Configure
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
