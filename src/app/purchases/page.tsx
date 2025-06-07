"use client";

import React from "react";
import Image from "next/image";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  description?: string;
  supplierName: string;
}

const products: Product[] = [
  {
    id: "22222222-3333-4444-5555-666666666661",
    name: "Broiler Starter",
    slug: "broiler_starter",
    price: 48.75,
    imageUrl: "/images/placeholder.svg",
    description: "Starter feed for broiler chicks",
    supplierName: "Manila Feed Supplies",
  },
  {
    id: "33333333-4444-5555-6666-777777777772",
    name: "Layer Grower Feed",
    slug: "layer_grower_feed",
    price: 52.0,
    imageUrl: "/images/placeholder.svg",
    description: "Nutrient-rich feed for layer chicks",
    supplierName: "Manila Feed Supplies",
  },
  {
    id: "44444444-5555-6666-7777-888888888883",
    name: "Chicken Coop Heater",
    slug: "chicken_coop_heater",
    price: 1250.0,
    imageUrl: "/images/placeholder.svg",
    description: "Electric heater for brooder",
    supplierName: "Mindanao Agro Parts",
  },
  {
    id: "55555555-6666-7777-8888-999999999994",
    name: "Automatic Feeder",
    slug: "automatic_feeder",
    price: 750.0,
    imageUrl: "/images/placeholder.svg",
    description: "Programmable chicken feeder with sensor",
    supplierName: "Iloilo Industrial Supply",
  },
  {
    id: "66666666-7777-8888-9999-aaaaaaaaaa15",
    name: "Water Drinker",
    slug: "water_drinker",
    price: 320.0,
    imageUrl: "/images/placeholder.svg",
    description: "Stainless steel poultry waterer",
    supplierName: "Cebu Agro Traders",
  },
  {
    id: "77777777-8888-9999-aaaaaaaaaa26",
    name: "Broiler Finisher Feed",
    slug: "broiler_finisher_feed",
    price: 55.5,
    imageUrl: "/images/placeholder.svg",
    description: "High-protein feed for finishing broilers",
    supplierName: "Manila Feed Supplies",
  },
  {
    id: "88888888-9999-aaaaaaaaaa37",
    name: "Egg Collection Tray",
    slug: "egg_collection_tray",
    price: 150.0,
    imageUrl: "/images/placeholder.svg",
    description: "Stackable egg collection tray",
    supplierName: "Laguna Agro Supplies",
  },
  {
    id: "99999999-aaaaaaaaaa48",
    name: "Clean Bedding Straw",
    slug: "clean_bedding_straw",
    price: 300.0,
    imageUrl: "/images/placeholder.svg",
    description: "Fresh straw bedding for poultry coop",
    supplierName: "Iloilo Industrial Supply",
  },
];

export default function ProductPage() {
  const [query, setQuery] = React.useState("");
  const fuse = React.useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "description", "supplierName"],
        threshold: 0.3,
      }),
    []
  );

  const filtered = query
    ? fuse.search(query).map((res) => res.item)
    : products;

  const handleAddToCart = (product: Product) => {
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Our Products</h1>

      <div className="flex justify-center mb-6">
        <Input
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="w-full aspect-[3/2] relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price.toFixed(2)}</CardDescription>
                <p className="text-sm text-gray-500">{product.supplierName}</p>
              </CardHeader>
              <CardFooter className="p-4">
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}