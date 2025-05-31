'use client'
import { useState, useEffect } from 'react'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await fetch('/api/suppliers/view-suppliers')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch suppliers')
        setSuppliers(data.data.suppliers)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSuppliers()
  }, [])

  if (loading) return (
    <main>
      <h1>Loading...</h1>
    </main>
  )

  if (error) return (
    <main>
      <h1>Error: {error}</h1>
    </main>
  )

  return (
    <main>
      <h1>Suppliers</h1>
      <ul>
        {suppliers.map(s => (
          <li key={s.id}>
            {s.name} - {s.slug}
          </li>
        ))}
      </ul>
    </main>
  )
}
