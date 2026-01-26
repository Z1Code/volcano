'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const styles: { [key: string]: CSSProperties } = {
  adminTickets: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #2a2a30',
    background: 'rgba(255,255,255,0.03)',
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginBottom: '16px',
    transition: 'all 0.2s',
  },
  adminTitle: {
    fontFamily: "var(--font-display), 'Bebas Neue', sans-serif",
    fontSize: '2rem',
    color: '#fff',
    letterSpacing: '0.1em',
  },
  filters: {
    display: 'flex',
    gap: '8px',
  },
  filterBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#888',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, rgba(255, 16, 131, 0.1) 0%, rgba(155, 48, 255, 0.1) 100%)',
    border: '1px solid #ff1083',
    borderRadius: '8px',
    color: '#ff1083',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  ticketsTable: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 2fr 1fr 1.5fr 1fr 1fr 1fr',
    gap: '16px',
    padding: '14px 20px',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    color: '#888',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 2fr 1fr 1.5fr 1fr 1fr 1fr',
    gap: '16px',
    padding: '14px 20px',
    alignItems: 'center',
    borderBottom: '1px solid #222',
    color: '#fff',
    fontSize: '0.875rem',
  },
  tableRowLast: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 2fr 1fr 1.5fr 1fr 1fr 1fr',
    gap: '16px',
    padding: '14px 20px',
    alignItems: 'center',
    borderBottom: 'none',
    color: '#fff',
    fontSize: '0.875rem',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: '#888',
  },
  type: {
    background: 'rgba(255, 16, 131, 0.1)',
    color: '#ff1083',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    width: 'fit-content',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    width: 'fit-content',
  },
  statusValid: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    width: 'fit-content',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
  },
  statusUsed: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    width: 'fit-content',
    background: 'rgba(156, 163, 175, 0.1)',
    color: '#9ca3af',
  },
  date: {
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#666',
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#888',
  },
}

interface TicketWithDetails {
  id: string
  qr_code: string
  status: string
  purchase_date: string
  validated_at: string | null
  price_paid: number
  event: { title: string }
  ticket_type: { name: string }
  profile: { full_name: string | null }
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'valid' | 'used'>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const { data } = await supabase
        .from('tickets')
        .select(`
          *,
          event:events (title),
          ticket_type:ticket_types (name),
          profile:profiles (full_name)
        `)
        .order('purchase_date', { ascending: false })

      setTickets(data || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'all') return true
    return t.status === filter
  })

  const getStatusStyle = (status: string): CSSProperties => {
    if (status === 'valid') return styles.statusValid
    if (status === 'used') return styles.statusUsed
    return styles.status
  }

  if (loading) {
    return <div style={styles.loading}>Loading tickets...</div>
  }

  return (
    <div style={styles.adminTickets}>
      <div style={styles.adminHeader}>
        <div>
          <Link href="/admin" style={styles.backLink}>← Back to Admin</Link>
          <h1 style={styles.adminTitle}>ALL TICKETS</h1>
        </div>
        <div style={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            style={filter === 'all' ? styles.filterBtnActive : styles.filterBtn}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('valid')}
            style={filter === 'valid' ? styles.filterBtnActive : styles.filterBtn}
          >
            Valid ({tickets.filter((t) => t.status === 'valid').length})
          </button>
          <button
            onClick={() => setFilter('used')}
            style={filter === 'used' ? styles.filterBtnActive : styles.filterBtn}
          >
            Used ({tickets.filter((t) => t.status === 'used').length})
          </button>
        </div>
      </div>

      <div style={styles.ticketsTable}>
        <div style={styles.tableHeader}>
          <span>Code</span>
          <span>Event</span>
          <span>Type</span>
          <span>Buyer</span>
          <span>Price</span>
          <span>Status</span>
          <span>Purchased</span>
        </div>
        {filteredTickets.map((ticket, index) => (
          <div
            key={ticket.id}
            style={index === filteredTickets.length - 1 ? styles.tableRowLast : styles.tableRow}
          >
            <span style={styles.code}>{ticket.qr_code}</span>
            <span>{ticket.event?.title || 'N/A'}</span>
            <span style={styles.type}>{ticket.ticket_type?.name || 'N/A'}</span>
            <span>{ticket.profile?.full_name || 'Unknown'}</span>
            <span>${ticket.price_paid?.toFixed(2)}</span>
            <span style={getStatusStyle(ticket.status)}>{ticket.status}</span>
            <span style={styles.date}>
              {new Date(ticket.purchase_date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div style={styles.empty}>No tickets found</div>
      )}
    </div>
  )
}
