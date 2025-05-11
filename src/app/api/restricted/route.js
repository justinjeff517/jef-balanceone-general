import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(
      JSON.stringify({ error: "You must be signed in." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }
  return new Response(
    JSON.stringify({ content: "Protected content visible!" }),
    { headers: { "Content-Type": "application/json" } }
  )
}
