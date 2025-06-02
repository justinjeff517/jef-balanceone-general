export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.DO_FUNCTION_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const resp = await fetch(`${baseUrl}/sales/get-sales`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const data = await resp.json();

  if (!resp.ok) {
    return Response.json(data, { status: resp.status });
  }

  const sales = Array.isArray(data?.data?.sales) ? data.data.sales : [];
  return Response.json({ sales });
}
