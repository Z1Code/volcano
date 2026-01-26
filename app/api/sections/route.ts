import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import { SectionsConfig, defaultConfig } from '@/lib/sections-config'

const KV_KEY = 'volcano:sections'

// In-memory fallback for local development without KV
let memoryConfig: SectionsConfig | null = null

async function getConfig(): Promise<SectionsConfig> {
  try {
    // Try to get from Vercel KV
    const config = await kv.get<SectionsConfig>(KV_KEY)
    return config || defaultConfig
  } catch {
    // Fallback to memory storage for local dev
    return memoryConfig || defaultConfig
  }
}

async function setConfig(config: SectionsConfig): Promise<void> {
  try {
    await kv.set(KV_KEY, config)
  } catch {
    // Fallback to memory storage for local dev
    memoryConfig = config
  }
}

export async function GET() {
  const config = await getConfig()
  return NextResponse.json(config)
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'volcano2024'

  const body = await request.json()
  const { password, config } = body as { password: string; config: SectionsConfig }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await setConfig(config)

  return NextResponse.json({ success: true, config })
}
