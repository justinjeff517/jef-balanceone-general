"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface Branch {
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

const branches: Branch[] = [
  {
    id: "1e2d3c4b-5a6f-7e8d-9c0b-1a2e3f4d5c6b",
    name: "Central Branch",
    slug: "central-branch",
    tin: "987-654-321",
    address: "123 Main St, Central City",
    products: [],
    created_at: "2025-05-30T08:00:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    updated_at: "2025-05-31T09:15:00Z",
    updated_by: "22222222-2222-2222-2222-222222222222",
    change_history: [],
  },
  {
    id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
    name: "North Branch",
    slug: "north-branch",
    tin: "987-654-322",
    address: "456 North Rd, Northtown",
    products: [],
    created_at: "2025-05-30T08:30:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    updated_at: "2025-05-31T09:45:00Z",
    updated_by: "22222222-2222-2222-2222-222222222222",
    change_history: [],
  },
  {
    id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
    name: "East Branch",
    slug: "east-branch",
    tin: "987-654-323",
    address: "789 East Blvd, Eastville",
    products: [],
    created_at: "2025-05-30T09:00:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    updated_at: "2025-05-31T10:00:00Z",
    updated_by: "22222222-2222-2222-2222-222222222222",
    change_history: [],
  },
  {
    id: "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
    name: "South Branch",
    slug: "south-branch",
    tin: "987-654-324",
    address: "321 South St, Southcity",
    products: [],
    created_at: "2025-05-30T09:30:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    updated_at: "2025-05-31T10:30:00Z",
    updated_by: "22222222-2222-2222-2222-222222222222",
    change_history: [],
  },
  {
    id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    name: "West Branch",
    slug: "west-branch",
    tin: "987-654-325",
    address: "654 West Ave, Westburg",
    products: [],
    created_at: "2025-05-30T10:00:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    updated_at: "2025-05-31T11:00:00Z",
    updated_by: "22222222-2222-2222-2222-222222222222",
    change_history: [],
  },
];

export default function Page() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      branches.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4">
        <Input
          placeholder="Search branches..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Branch Grid */}
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
