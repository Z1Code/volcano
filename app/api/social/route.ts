import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { SocialConfig, defaultSocialConfig } from '@/lib/sections-config'

const SETTINGS_KEY = 'social_config'

async function getConfig(): Promise<SocialConfig> {
  try {
    const supabase = await createServiceClient()
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .single()

    if (error || !data) {
      return defaultSocialConfig
    }

    return data.value as SocialConfig
  } catch {
    return defaultSocialConfig
  }
}

async function setConfig(config: SocialConfig): Promise<boolean> {
  try {
    const supabase = await createServiceClient()
    const { error } = await (supabase as any)
      .from('site_settings')
      .upsert({
        key: SETTINGS_KEY,
        value: config,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

    return !error
  } catch {
    return false
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
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Se requiere rol de admin' }, { status: 403 })
  }

  const body = await request.json()
  const { config } = body as { config: SocialConfig }

  const success = await setConfig(config)

  if (!success) {
    return NextResponse.json({ error: 'Error guardando configuración' }, { status: 500 })
  }

  return NextResponse.json({ success: true, config })
}
