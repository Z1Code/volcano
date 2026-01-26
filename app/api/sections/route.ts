import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SectionsConfig, defaultConfig } from '@/lib/sections-config'

const KV_KEY = 'volcano:sections'

// In-memory fallback for local development without KV
let memoryConfig: SectionsConfig | null = null

const hasKv =
  !!process.env.KV_REST_API_URL &&
  !!(process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN)

async function getConfig(): Promise<SectionsConfig> {
  if (!hasKv) {
    return memoryConfig || defaultConfig
  }

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
  if (!hasKv) {
    memoryConfig = config
    return
  }

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
  // Verify user is authenticated and is admin
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Se requiere rol de admin' }, { status: 403 })
  }

  const body = await request.json()
  const { config } = body as { config: SectionsConfig }

  await setConfig(config)

  return NextResponse.json({ success: true, config })
}
