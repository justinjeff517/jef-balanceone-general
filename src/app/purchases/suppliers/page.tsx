import Link from "next/link";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/suppliers/view_suppliers`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      next: { revalidate: 0 },
    }
  );
  if (!res.ok) throw new Error(`Failed to load suppliers (${res.status})`);
  const {
    data: { suppliers },
  } = await res.json();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Suppliers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {suppliers.map((s: any) => (
          <Link key={s.id} href={`/purchases/suppliers/${s.slug}`}>
            <div className="block p-4 border rounded hover:shadow">
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-sm">TIN: {s.tin}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
