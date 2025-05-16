"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
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
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading…</p>;
  }

  // Not signed in: show sign in prompt
  if (!session) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>Access your account to continue.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button onClick={() => signIn()}>Sign In</Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Signed in: show dashboard
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">JEF BalanceOne</h1>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>

      <p className="mb-6">Welcome back, {session.user?.email}</p>

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
