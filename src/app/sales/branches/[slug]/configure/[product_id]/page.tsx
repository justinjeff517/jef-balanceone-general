'use client'

import React, { useEffect, useState } from 'react'
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

export default function ProductPage() {
  const params = useParams<{ product_id: string }>()
  const productId = params?.product_id

  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!productId) {
      return
    }

    async function fetchProduct() {
      try {
        const res = await fetch(
          `/api/database/products/get-product-by-id?product_id=${encodeURIComponent(
            productId,
          )}`,
          { cache: 'no-store' },
        )
        if (!res.ok) {
          setNotFound(true)
          setLoading(false)
          return
        }
        const json = await res.json()
        if (!json.product?.data) {
          setNotFound(true)
        } else {
          setProduct(json.product.data)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (!productId || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-600">Product not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
        <div className="space-y-2">
          <p>
            <strong className="text-gray-600">ID:</strong> {product.id}
          </p>
          <p>
            <strong className="text-gray-600">Slug:</strong> {product.slug}
          </p>
          <p>
            <strong className="text-gray-600">Description:</strong> {product.description}
          </p>
          <p>
            <strong className="text-gray-600">Category:</strong> {product.category}
          </p>
          <p>
            <strong className="text-gray-600">Unit:</strong> {product.unit}
          </p>
          <p>
            <strong className="text-gray-600">Price:</strong> ₱{product.unit_price.toFixed(2)}
          </p>
          <p>
            <strong className="text-gray-600">Branch:</strong> {product.branch_name} ({product.branch_slug})
          </p>
          <p>
            <strong className="text-gray-600">Active:</strong> {product.active ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    </div>
  )
}
