export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const baseUrl = process.env.DO_FUNCTION_URL;
  const apiKey = process.env.API_KEY;
  const jsonHeaders = { "Content-Type": "application/json" };

  if (!baseUrl || !apiKey) {
    return new Response(
      JSON.stringify({ error: "Server misconfiguration" }),
      { status: 500, headers: jsonHeaders }
    );
  }

  const resp = await fetch(`${baseUrl}/suppliers/get-suppliers`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const payload = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return new Response(JSON.stringify(payload), {
      status: resp.status,
      headers: jsonHeaders,
    });
  }

  const suppliers = Array.isArray(payload?.data?.suppliers)
    ? payload.data.suppliers
    : [];
  return new Response(JSON.stringify({ suppliers }), {
    status: 200,
    headers: jsonHeaders,
  });
}
