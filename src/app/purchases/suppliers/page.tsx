'use client';

import React, { useState, useMemo, FC, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface Supplier {
  id: string;
  name: string;
  slug: string;
  tin: string;
  created_at: string;
}

const Page: FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 150);

    fetch('/api/database/suppliers/get-suppliers')
      .then((res) => res.json())
      .then((data) => {
        const list = data.suppliers.map((item: any) => item.data);
        setSuppliers(list);
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          clearInterval(interval);
        }, 200);
      })
      .catch(() => {
        setLoading(false);
        clearInterval(interval);
      });

    return () => clearInterval(interval);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse<Supplier>(suppliers, {
        keys: ['name', 'tin', 'slug'],
        threshold: 0.3,
      }),
    [suppliers]
  );

  const displayedSuppliers = useMemo<Supplier[]>(
    () =>
      searchQuery
        ? fuse.search(searchQuery).map((result) => result.item)
        : suppliers,
    [searchQuery, fuse, suppliers]
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="w-full p-4">
        <Progress value={progress} />
      </div>
    );
  }

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
        {displayedSuppliers.map((s) => (
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
