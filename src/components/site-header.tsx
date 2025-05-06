"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SiteHeader(): JSX.Element {
  // Retrieve current path from Next.js router
  const pathname = usePathname()
  
  // Split pathname into segments and filter out any empty values
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // Build breadcrumb items: always start with Home, then add the dynamic segments.
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      // Build the URL for each segment by joining previous segments
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      // Capitalize the first letter of segment name
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      return { label, href }
    }),
  ]
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                <BreadcrumbItem>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {/* Only render separator if not the last breadcrumb */}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub One
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
