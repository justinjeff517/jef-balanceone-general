"use client";
import * as React from "react";
import { SalesNavigation } from "@/components/sales/sales-navigation";
import SalesFooter from "@/components/sales/sales-footer";
import SalesBreadcrumb from "@/components/sales/sales-breadcrumb";
export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* solid, sticky navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow">
        <SalesNavigation />
      </nav>
      <div className="p-4 ml-2">
        <SalesBreadcrumb />
      </div>

      {/* page content */}
      <main className="flex-grow overflow-auto">
        {children}
      </main>

      {/* footer stays put */}
      <SalesFooter />
    </div>
  );
}
