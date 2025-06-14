import * as React from "react"
import { NavigationMenuDemo } from "@/components/purchases/purchases-navigation"
import { PurchasesBreadcrumb } from "@/components/purchases/purchases-breadcrumb"
  
export default function PurchasingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-4">
      <NavigationMenuDemo />

      {/* Breadcrumb goes here */}
      <PurchasesBreadcrumb />

      {/* Page content */}
      {children}
    </div>
  )
}
