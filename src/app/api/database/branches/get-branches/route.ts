export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.DO_FUNCTION_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const resp = await fetch(`${baseUrl}/branches/get-branches`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const data = await resp.json();

  if (!resp.ok) {
    return Response.json(data, { status: resp.status });
  }

  const branches = Array.isArray(data?.data?.branches) ? data.data.branches : [];
  return Response.json({ branches });
}
