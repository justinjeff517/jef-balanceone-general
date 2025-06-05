'use client'

import React from 'react'
import { useParams } from 'next/navigation'

interface ProductData {
  id: string
  name: string
  slug: string
  description: string
  category: string
  unit: string
  unit_price: number
  branch_name: string
  branch_slug: string
  active: boolean
}

const sampleProduct: { data: ProductData } = {
  data: {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-ef1234561003',
    name: 'Broiler Starter (10 kg)',
    slug: 'broiler_starter_10kg',
    description: 'Starter feed for broiler chickens',
    category: 'feed',
    unit: 'bag',
    unit_price: 300,
    branch_name: 'North Branch',
    branch_slug: 'north_branch',
    active: true,
  },
}

export default function ProductPage() {
  const params = useParams<{ product_slug: string }>()
  const slug = params?.product_slug

  // Loading state
  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  // Check if product exists
  if (slug !== sampleProduct.data.slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-600">Product not found.</p>
      </div>
    )
  }

  const p = sampleProduct.data

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{p.name}</h1>
        <div className="space-y-2">
          <p><strong className="text-gray-600">ID:</strong> {p.id}</p>
          <p><strong className="text-gray-600">Slug:</strong> {p.slug}</p>
          <p><strong className="text-gray-600">Description:</strong> {p.description}</p>
          <p><strong className="text-gray-600">Category:</strong> {p.category}</p>
          <p><strong className="text-gray-600">Unit:</strong> {p.unit}</p>
          <p><strong className="text-gray-600">Price:</strong> ₱{p.unit_price.toFixed(2)}</p>
          <p><strong className="text-gray-600">Branch:</strong> {p.branch_name} ({p.branch_slug})</p>
          <p><strong className="text-gray-600">Active:</strong> {p.active ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}