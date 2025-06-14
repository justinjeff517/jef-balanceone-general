// app/suppliers/page.tsx

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface SupplierData {
  id: string
  name: string
  slug: string
  tin: string
}

interface SupplierResponse {
  data: SupplierData
  metadata: any
}

async function getSuppliers(): Promise<SupplierData[]> {
  const res = await fetch(
    "http://localhost:3000/api/database/suppliers/get-suppliers",
    { next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error("Failed to fetch suppliers")
  const { suppliers }: { suppliers: SupplierResponse[] } = await res.json()
  return suppliers.map((s) => s.data)
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Suppliers</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {suppliers.map((sup) => (
          <Link
            key={sup.id}
            href={`/purchases/create/${sup.slug}`}
            className="transform transition-transform hover:scale-105"
          >
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>{sup.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">TIN: {sup.tin}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
