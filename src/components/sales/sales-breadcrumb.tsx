// components/common/ThirdBreadcrumb.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function ThirdBreadcrumb() {
  const pathname = usePathname(); // e.g. "/sales/branches/west_branch/add"
  const fullSegments = pathname.split("/").filter(Boolean);
  const startIndex = 2; // drop first two segments

  const crumbs = fullSegments.slice(startIndex);
  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((seg, idx) => {
          // build href including all segments up to this crumb
          const pathUpToThis = fullSegments
            .slice(0, startIndex + idx + 1)
            .join("/");
          const href = "/" + pathUpToThis;

          const isLast = idx === crumbs.length - 1;
          // optional: prettify label, e.g. turn "west_branch" into "West Branch"
          const label = seg.replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

          return (
            <React.Fragment key={seg}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
