// app/purchases/suppliers/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "next-auth/jwt";

export const runtime = "edge";        // or 'nodejs', just ensure it's server
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  // ← pass the request in here
  const cookie = (await headers()).get("cookie") || "";
  const rawToken = await getToken({
    req:    { headers: { cookie } },
    secret: process.env.NEXTAUTH_SECRET,
    raw:    true,
  });

  if (!rawToken) {
    // kicks you to signin if there's no valid JWT cookie
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(
        "/purchases/suppliers"
      )}`
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/suppliers/view_suppliers`,
    {
      headers: { Authorization: `Bearer ${rawToken}` },
      next:    { revalidate: 0 },
    }
  );
  if (!res.ok) throw new Error("Failed to load suppliers");
  const { data: { suppliers } } = await res.json();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Suppliers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {suppliers.map((s: any) => (
          <Link key={s.id} href={`/purchases/suppliers/${s.slug}`}>
            <a className="block p-4 border rounded hover:shadow">
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-sm">TIN: {s.tin}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
