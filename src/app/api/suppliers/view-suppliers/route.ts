import { NextRequest, NextResponse } from 'next/server'

const DO_API_URL = process.env.DO_FUNCTION_URL!
const API_KEY     = process.env.API_KEY!

export async function GET(request: NextRequest) {
  const res = await fetch(DO_API_URL, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.error || 'Upstream error' }, { status: res.status })
  }

  const payload = await res.json()
  return NextResponse.json(payload)
}
