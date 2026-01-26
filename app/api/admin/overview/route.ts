import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { SectionsConfig, defaultConfig } from '@/lib/sections-config'

const KV_KEY = 'volcano:sections'

const hasKv =
  !!process.env.KV_REST_API_URL &&
  !!(process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN)

async function getConfig(): Promise<SectionsConfig> {
  if (!hasKv) return defaultConfig
  try {
    const config = await kv.get<SectionsConfig>(KV_KEY)
    return config || defaultConfig
  } catch {
    return defaultConfig
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'employee') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = await createServiceClient()

  const [
    { data: ticketsData, error: ticketsError },
    { data: eventsData, error: eventsError },
    { data: recentTickets, error: recentError },
    config,
  ] = await Promise.all([
    (service as any)
      .from('tickets')
      .select('status, price_paid')
      .throwOnError(),
    (service as any)
      .from('events')
      .select('id,is_active')
      .throwOnError(),
    (service as any)
      .from('tickets')
      .select(`
        id,
        price_paid,
        status,
        purchase_date,
        event:events (title),
        ticket_type:ticket_types (name),
        profile:profiles (full_name)
      `)
      .order('purchase_date', { ascending: false })
      .limit(10)
      .throwOnError(),
    getConfig(),
  ])

  if (ticketsError) {
    return NextResponse.json({ error: ticketsError.message }, { status: 500 })
  }
  if (eventsError) {
    return NextResponse.json({ error: eventsError.message }, { status: 500 })
  }
  if (recentError) {
    return NextResponse.json({ error: recentError.message }, { status: 500 })
  }

  const ticketsSold = ticketsData?.length || 0
  const ticketsValidated = ticketsData?.filter((t: any) => t.status === 'used').length || 0
  const revenue = ticketsData?.reduce((sum: number, t: any) => sum + (t.price_paid || 0), 0) || 0
  const activeEvents = eventsData?.filter((e: any) => e.is_active)?.length || 0

  return NextResponse.json({
    stats: {
      ticketsSold,
      ticketsValidated,
      activeEvents,
      revenue,
    },
    recentTickets: recentTickets || [],
    config,
  })
}
