import * as React from "react"
import { AppSidebar } from "@/components/purchasing/app-sidebar"
import { SiteHeader } from "@/components/purchasing/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

  
export default function PurchasingLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (

    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">
            {children}
        </div>
 
      </SidebarInset>
    </SidebarProvider>
    )


  }