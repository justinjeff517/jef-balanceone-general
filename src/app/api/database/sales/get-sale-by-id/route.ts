export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sale_id = url.searchParams.get("sale_id");
  const baseUrl = process.env.DO_FUNCTION_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (!sale_id?.trim()) {
    return Response.json(
      { error: "sale_id is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const resp = await fetch(
    `${baseUrl}/sales/get-sale-by-id?sale_id=${encodeURIComponent(sale_id)}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    }
  );

  const data = await resp.json();
  if (!resp.ok) {
    return Response.json(data, { status: resp.status });
  }

  const sale = data?.data?.sale ?? null;
  return Response.json({ sale });
}
