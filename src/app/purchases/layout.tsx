import * as React from "react"
import { NavigationMenuDemo } from "@/components/purchases/purchases-navigation"

  
export default function PurchasingLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="p-4">
        <div>
            <NavigationMenuDemo />
        </div>
            {children}
        </div>
 


    )


  }