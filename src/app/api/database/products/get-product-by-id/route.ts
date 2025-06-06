export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const product_id = url.searchParams.get("product_id");
  const baseUrl = process.env.DO_FUNCTION_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (!product_id?.trim()) {
    return Response.json(
      { error: "product_id is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const resp = await fetch(
    `${baseUrl}/products/get-product-by-id?product_id=${encodeURIComponent(product_id)}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    }
  );

  const data = await resp.json();
  if (!resp.ok) {
    return Response.json(data, { status: resp.status });
  }

  const product = data?.data?.product ?? null;
  return Response.json({ product });
}
