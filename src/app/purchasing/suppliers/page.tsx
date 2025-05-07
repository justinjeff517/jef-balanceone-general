"use client"
import Link from "next/link"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const suppliers = [
  { id: "1", name: "Alpha Supply Co.", slug: "alpha-supply-co", tin: "123-456-001" },
  { id: "2", name: "Bravo Traders", slug: "bravo-traders", tin: "123-456-002" },
  { id: "3", name: "Charlie Imports", slug: "charlie-imports", tin: "123-456-003" },
  { id: "4", name: "Delta Distributors", slug: "delta-distributors", tin: "123-456-004" },
  { id: "5", name: "Echo Enterprises", slug: "echo-enterprises", tin: "123-456-005" },
]

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Suppliers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {suppliers.map((supplier) => (
          <Card
            key={supplier.id}
            className="hover:shadow-lg transition-shadow flex flex-col"
          >
            <CardHeader>
              <CardTitle>{supplier.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm mb-2">TIN: {supplier.tin}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={`/purchasing/suppliers/${supplier.slug}`}>Select</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/purchasing/suppliers/${supplier.slug}/configure`}>Configure</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
