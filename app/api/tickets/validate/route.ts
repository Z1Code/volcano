import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseTicketQRData } from '@/lib/qr'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check if user is employee or admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profileRole = (profile as any)?.role
  if (profileRole !== 'employee' && profileRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { qrData } = body

  // Parse QR data
  const ticketData = parseTicketQRData(qrData)
  if (!ticketData) {
    return NextResponse.json({
      valid: false,
      error: 'Invalid QR code format',
    })
  }

  // Find ticket
  const { data: ticket, error: fetchError } = await (supabase as any)
    .from('tickets')
    .select(`
      *,
      ticket_type:ticket_types (*),
      event:events (*),
      profile:profiles (*)
    `)
    .eq('id', ticketData.id)
    .eq('qr_code', ticketData.code)
    .single()

  if (fetchError || !ticket) {
    return NextResponse.json({
      valid: false,
      error: 'Ticket not found',
    })
  }

  const t = ticket as any

  // Check if ticket is already used
  if (t.status === 'used') {
    return NextResponse.json({
      valid: false,
      error: 'Ticket already used',
      ticket: {
        id: t.id,
        event: t.event.title,
        type: t.ticket_type.name,
        validated_at: t.validated_at,
        status: t.status,
      },
    })
  }

  // Check if ticket is cancelled or expired
  if (t.status === 'cancelled' || t.status === 'expired') {
    return NextResponse.json({
      valid: false,
      error: `Ticket is ${t.status}`,
      ticket: {
        id: t.id,
        event: t.event.title,
        type: t.ticket_type.name,
        status: t.status,
      },
    })
  }

  // Check if event date matches today (optional - can be adjusted)
  const eventDate = new Date(t.event.date)
  const today = new Date()
  const sameDay =
    eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate()

  // Mark ticket as used
  const { error: updateError } = await (supabase as any)
    .from('tickets')
    .update({
      status: 'used',
      validated_at: new Date().toISOString(),
      validated_by: user.id,
    })
    .eq('id', t.id)

  if (updateError) {
    return NextResponse.json({
      valid: false,
      error: 'Error validating ticket',
    })
  }

  return NextResponse.json({
    valid: true,
    ticket: {
      id: t.id,
      event: t.event.title,
      type: t.ticket_type.name,
      holder: t.profile?.full_name || 'Unknown',
      perks: t.ticket_type.perks,
      warning: !sameDay ? 'Warning: Event date does not match today' : null,
    },
  })
}
