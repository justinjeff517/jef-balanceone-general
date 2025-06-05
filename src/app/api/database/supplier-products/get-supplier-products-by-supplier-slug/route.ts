export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supplier_slug = url.searchParams.get("supplier_slug");
  const baseUrl = process.env.DO_FUNCTION_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const resp = await fetch(`${baseUrl}/supplier-products/get-supplier-products-by-supplier-slug?supplier_slug=${encodeURIComponent(supplier_slug!)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const data = await resp.json();

  if (!resp.ok) {
    return Response.json(data, { status: resp.status });
  }

  const supplier_products = Array.isArray(data?.data?.supplier_products) ? data.data.supplier_products : [];
  return Response.json({ supplier_products });
}
