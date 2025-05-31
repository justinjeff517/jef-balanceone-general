'use client';

import React, { useState, useMemo, FC, ChangeEvent } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface ChangeDetail {
  field: string;
  old: string;
  new: string;
}

interface HistoryEntry {
  timestamp: string;
  user_id: string;
  changes: ChangeDetail[];
}

interface Supplier {
  id: string;
  name: string;
  slug: string;
  tin: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  change_history: HistoryEntry[];
}

const sampleSuppliers: Supplier[] = [
  {
    id: 'a3f1c2d4-e5b6-7a8f-9012-3456b7890cde',
    name: 'Acme Industrial',
    slug: 'acme-industrial',
    tin: '123-456-789',
    created_at: '2025-05-01T10:00:00Z',
    created_by: '11111111-1111-1111-1111-111111111111',
    updated_at: '2025-05-10T15:30:00Z',
    updated_by: '22222222-2222-2222-2222-222222222222',
    change_history: [
      {
        timestamp: '2025-05-05T12:00:00Z',
        user_id: '33333333-3333-3333-3333-333333333333',
        changes: [
          { field: 'name', old: 'Acme Ind.', new: 'Acme Industrial' },
          { field: 'tin', old: '000-000-000', new: '123-456-789' },
        ],
      },
    ],
  },
  {
    id: 'b4e2d3c5-f6a7-8b90-1234-5678c9012def',
    name: 'Global Supplies Co.',
    slug: 'global-supplies-co',
    tin: '987-654-321',
    created_at: '2025-04-20T09:15:00Z',
    created_by: '44444444-4444-4444-4444-444444444444',
    updated_at: '2025-05-15T08:45:00Z',
    updated_by: '55555555-5555-5555-5555-555555555555',
    change_history: [],
  },
];

const Page: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fuse = useMemo(
    () =>
      new Fuse< Supplier>(sampleSuppliers, {
        keys: ['name', 'tin', 'slug'],
        threshold: 0.3,
      }),
    []
  );

  const displayedSuppliers = useMemo< Supplier[]>(
    () =>
      searchQuery
        ? fuse.search(searchQuery).map(result => result.item)
        : sampleSuppliers,
    [searchQuery, fuse]
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>


        <div className="flex items-center justify-center mb-6">

          <Input
            placeholder="Search suppliers…"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-1/2"
          />
        </div>

  

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedSuppliers.map(s => (
          <Link key={s.id} href={`/purchases/suppliers/${s.slug}`}>
            <div className="block p-4 border rounded hover:shadow">
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-sm">TIN: {s.tin}</p>
              <p className="text-xs text-gray-500">
                Created: {new Date(s.created_at).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
