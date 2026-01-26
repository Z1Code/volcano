import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      ticket_types (*)
    `)
    .eq('is_active', true)
    .order('date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const supabase = await createServiceClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { title, description, date, image_url, ticket_types } = body

  // Create event
  const { data: event, error: eventError } = await (supabase as any)
    .from('events')
    .insert({
      title,
      description,
      date,
      image_url,
      is_active: true,
    })
    .select()
    .single()

  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 500 })
  }

  // Create ticket types
  if (ticket_types && ticket_types.length > 0) {
    const ticketTypesWithEventId = ticket_types.map((tt: any) => ({
      ...tt,
      event_id: event.id,
    }))

    const { error: ticketError } = await (supabase as any)
      .from('ticket_types')
      .insert(ticketTypesWithEventId)

    if (ticketError) {
      return NextResponse.json({ error: ticketError.message }, { status: 500 })
    }
  }

  return NextResponse.json(event, { status: 201 })
}
