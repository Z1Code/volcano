import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'volcano2024'

  const body = await request.json()
  const { password } = body as { password: string }

  if (password === adminPassword) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
