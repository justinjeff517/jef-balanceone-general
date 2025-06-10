"use client";
import * as React from "react";
import { SalesNavigation } from "@/components/sales/sales-navigation";
  
export default function PurchasingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* solid, sticky navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow">
        <SalesNavigation />
      </nav>

      {/* page content */}
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
