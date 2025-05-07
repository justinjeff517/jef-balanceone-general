"use client"

import Link from "next/link"
import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const branches = [
  { id: "1", branch_name: "Central Branch", branch_slug: "central-branch", branch_tin: "987-654-321" },
  { id: "2", branch_name: "North Branch",   branch_slug: "north-branch",   branch_tin: "987-654-322" },
  { id: "3", branch_name: "East Branch",    branch_slug: "east-branch",    branch_tin: "987-654-323" },
  { id: "4", branch_name: "South Branch",   branch_slug: "south-branch",   branch_tin: "987-654-324" },
  { id: "5", branch_name: "West Branch",    branch_slug: "west-branch",    branch_tin: "987-654-325" },
]

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Branches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            className="hover:shadow-lg transition-shadow flex flex-col"
          >
            <CardHeader>
              <CardTitle>{branch.branch_name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm mb-2">TIN: {branch.branch_tin}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={`/sales/branches/${branch.branch_slug}`}>Select</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/sales/branches/${branch.branch_slug}/configure`}>Configure</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
