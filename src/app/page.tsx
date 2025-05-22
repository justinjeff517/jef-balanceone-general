"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">JEF BalanceOne</h1>
        <Button variant="outline">
          Sign Out
        </Button>
      </div>

      <p className="mb-6">Welcome back, user@example.com</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/purchases">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage purchase records</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/sales">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View sales transactions</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/suppliers">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Supplier directory</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/branches">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Branch information</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
