import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const eventId = searchParams.get('eventId')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let query = (supabase as any)
    .from('tickets')
    .select(`
      *,
      ticket_type:ticket_types (*),
      event:events (*)
    `)
    .order('purchase_date', { ascending: false })

  // Users can only see their own tickets unless they're admin/employee
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as any)?.role === 'customer') {
    query = query.eq('user_id', user.id)
  } else if (userId) {
    query = query.eq('user_id', userId)
  }

  if (eventId) {
    query = query.eq('event_id', eventId)
  }

  const { data: tickets, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(tickets)
}
