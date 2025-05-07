"use client"

import * as React from "react"
import {
  IconLayoutDashboard, 
  IconInnerShadowTop,
  IconBuildings,
  IconReceipt

} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: IconLayoutDashboard,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: IconReceipt,
    },
    {
      title: "Purchasing",
      url: "/purchasing",
      icon: IconReceipt,
    },
    {
      title: "Suppliers",
      url: "/purchasing/suppliers",
      icon: IconBuildings,
    },
    {
      title: "Vendors",
      url: "/purchasing/vendors",
      icon: IconBuildings,
    },
    {
      title: "Purchases",
      url: "/purchasing/purchases",
      icon: IconBuildings,
    }
  ],


 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Purchasing</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
    
      </SidebarContent>

    </Sidebar>
  )
}
