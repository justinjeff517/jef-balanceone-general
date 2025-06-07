"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  description?: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    price: 99.99,
    imageUrl: "/images/placeholder.svg",
    description: "High-quality wireless headphones with noise cancellation."
  },
  {
    id: "2",
    name: "Smart Watch",
    slug: "smart-watch",
    price: 149.99,
    imageUrl: "/images/placeholder.svg",
    description: "Feature-packed smart watch with health tracking."
  },
  {
    id: "3",
    name: "Portable Speaker",
    slug: "portable-speaker",
    price: 59.99,
    imageUrl: "/images/placeholder.svg",
    description: "Compact portable speaker with deep bass."
  }
];

export default function ProductPage() {
  const handleAddToCart = (product: Product) => {
    // TODO: Replace with your cart integration logic
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col p-0 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={400}
              className="object-cover w-full h-auto"
            />
            <CardHeader className="p-4">
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>${product.price.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4">
              <Button onClick={() => handleAddToCart(product)} className="w-full">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
