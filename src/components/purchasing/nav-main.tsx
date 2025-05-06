"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: Icon
}

interface NavMainProps {
  items: NavItem[]
}

const normalize = (path: string) => path.replace(/\/$/, "")

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  const current = normalize(pathname)

  // Build a list of candidate URLs that match current path
  const matches = items
    .map((item) => {
      const url = normalize(
        item.url.startsWith("http")
          ? new URL(item.url).pathname
          : item.url
      )
      if (current === url || current.startsWith(url + "/")) return url
      return null
    })
    .filter((u): u is string => !!u)

  // Pick the longest (most specific) URL
  const activeUrl = matches.sort((a, b) => b.length - a.length)[0] || ""

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const url = normalize(
              item.url.startsWith("http")
                ? new URL(item.url).pathname
                : item.url
            )
            const isActive = url === activeUrl

            return (
              <SidebarMenuItem key={item.title + url}>
                <SidebarMenuButton asChild>
                  {isActive ? (
                    <div
                      className="flex items-center gap-2 px-2 py-1 rounded bg-neutral-500 text-white cursor-default"
                      style={{ pointerEvents: "none" }}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </div>
                  ) : (
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-100 cursor-pointer"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
