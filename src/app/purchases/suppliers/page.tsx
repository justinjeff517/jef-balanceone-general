"use client"
import Link from "next/link"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const suppliers = [
  {
    data: {
      supplier_id: "1",
      name: "Alpha Supply Co.",
      slug: "alpha-supply-co",
      tin: "123-456-001",
      address: {
        street: "123 Alpha St",
        city: "Metro City",
        region: "Metro Region",
        postal_code: "1000",
        country: "Philippines"
      },
      contact: {
        email: "alpha@supplies.com",
        phone: "+63 912-345-0001"
      },
      bank_details: {
        bank_name: "Alpha Bank",
        account_name: "Alpha Supply Co.",
        account_number: "000111222333"
      },
      created_at: "2025-05-01T08:00:00Z",
      created_by: "user-uuid-1"
    },

  },
  {
    data: {
      supplier_id: "2",
      name: "Bravo Traders",
      slug: "bravo-traders",
      tin: "123-456-002",
      address: {
        street: "456 Bravo Rd",
        city: "Metro City",
        region: "Metro Region",
        postal_code: "1001",
        country: "Philippines"
      },
      contact: {
        email: "bravo@traders.com",
        phone: "+63 923-456-7890"
      },
      bank_details: {
        bank_name: "Bravo Bank",
        account_name: "Bravo Traders",
        account_number: "000444555666"
      },
      created_at: "2025-04-15T09:30:00Z",
      created_by: "user-uuid-3"
    },

  }
  // ...repeat the same structure for suppliers 3–5
]

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Suppliers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {suppliers.map((supplier) => (
          <Card
            key={supplier.data.supplier_id}
            className="hover:shadow-lg transition-shadow flex flex-col"
          >
            <CardHeader>
              <CardTitle>{supplier.data.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm mb-1">TIN: {supplier.data.tin}</p>
              <p className="text-sm mb-2">
                {supplier.data.address.city}, {supplier.data.address.country}
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={`/purchases/suppliers/${supplier.data.slug}`}>Select</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/purchases/suppliers/${supplier.data.slug}/configure`}>
                  Configure
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
