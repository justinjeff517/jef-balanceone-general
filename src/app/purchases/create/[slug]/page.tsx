"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { InboxIcon, CheckCircleIcon } from "lucide-react";

const samplePurchases = {
  unprocessed: [
    { id: "UP-001", item: "Chicken Feed – 50kg", date: "2025-06-10" },
    { id: "UP-002", item: "Farm Gloves – Pack of 10", date: "2025-06-12" },
  ],
  processed: [
    { id: "P-101", item: "Vaccines – 100 doses", date: "2025-06-05" },
    { id: "P-102", item: "Water Pumps – 2 units", date: "2025-06-07" },
  ],
};

export default function Page() {
  const { slug } = useParams();
  const supplierName = slug
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";

  return (
    <main className="p-8 flex flex-col items-start space-y-6">
      <h1 className="text-2xl font-bold">{supplierName}</h1>
      <Link href={`/purchases/create/${slug}`}>
        <Button>Create Purchase</Button>
      </Link>

      <Tabs defaultValue="unprocessed" className="w-full">
        <TabsList className="flex justify-center w-full space-x-6">
          <TabsTrigger value="unprocessed">
            <InboxIcon className="mr-2 h-5 w-5" />
            Unprocessed
          </TabsTrigger>
          <TabsTrigger value="processed">
            <CheckCircleIcon className="mr-2 h-5 w-5" />
            Processed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unprocessed" className="pt-4">
          <ul className="space-y-2">
            {samplePurchases.unprocessed.map((p) => (
              <li key={p.id} className="p-4 border rounded-lg">
                <div className="font-medium">{p.item}</div>
                <div className="text-sm text-gray-500">
                  {p.date} • #{p.id}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="processed" className="pt-4">
          <ul className="space-y-2">
            {samplePurchases.processed.map((p) => (
              <li key={p.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="font-medium">{p.item}</div>
                <div className="text-sm text-gray-500">
                  {p.date} • #{p.id}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </main>
  );
}
