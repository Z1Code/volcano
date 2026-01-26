'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import StatsCard from '@/components/dashboard/StatsCard'

const styles: { [key: string]: CSSProperties } = {
  adminStats: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  adminHeader: {
    marginBottom: '32px',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  recentSection: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '24px',
  },
  recentSectionH2: {
    fontFamily: "var(--font-display), 'Bebas Neue', sans-serif",
    fontSize: '1.25rem',
    color: '#fff',
    marginBottom: '20px',
    letterSpacing: '0.05em',
  },
  ticketsTable: {
    overflowX: 'auto',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
    gap: '16px',
    padding: '12px 16px',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    color: '#888',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
    gap: '16px',
    padding: '12px 16px',
    alignItems: 'center',
    borderBottom: '1px solid #222',
    color: '#fff',
    fontSize: '0.875rem',
  },
  tableRowLast: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
    gap: '16px',
    padding: '12px 16px',
    alignItems: 'center',
    color: '#fff',
    fontSize: '0.875rem',
    borderBottom: 'none',
  },
  typeBadge: {
    background: 'rgba(255, 16, 131, 0.1)',
    color: '#ff1083',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
  },
  statusBase: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
  },
  statusValid: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
  },
  statusUsed: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    background: 'rgba(156, 163, 175, 0.1)',
    color: '#9ca3af',
  },
  date: {
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#888',
  },
}

interface Stats {
  totalRevenue: number
  ticketsSold: number
  ticketsValidated: number
  activeEvents: number
  recentTickets: any[]
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    ticketsSold: 0,
    ticketsValidated: 0,
    activeEvents: 0,
    recentTickets: [],
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch all tickets
      const { data: tickets } = await (supabase as any)
        .from('tickets')
        .select(`
          *,
          event:events (*),
          profile:profiles (*)
        `)
        .order('purchase_date', { ascending: false })

      // Fetch events
      const { data: events } = await (supabase as any)
        .from('events')
        .select('*')
        .eq('is_active', true)

      if (tickets) {
        const totalRevenue = tickets.reduce((sum: number, t: any) => sum + (t.price_paid || 0), 0)
        const ticketsSold = tickets.length
        const ticketsValidated = tickets.filter((t: any) => t.status === 'used').length

        setStats({
          totalRevenue,
          ticketsSold,
          ticketsValidated,
          activeEvents: events?.length || 0,
          recentTickets: tickets.slice(0, 10),
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status: string): CSSProperties => {
    switch (status) {
      case 'valid':
        return styles.statusValid
      case 'used':
        return styles.statusUsed
      default:
        return styles.statusBase
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading statistics...</div>
  }

  const validationRate = stats.ticketsSold > 0
    ? ((stats.ticketsValidated / stats.ticketsSold) * 100).toFixed(1)
    : '0'

  return (
    <div style={styles.adminStats}>
      <div style={styles.adminHeader}>
        <Link href="/admin" style={styles.backLink}>← Back to Admin</Link>
        <h1 style={styles.adminTitle}>STATISTICS</h1>
      </div>

      <div style={styles.statsGrid}>
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
          subtitle="All time"
        />
        <StatsCard
          title="Tickets Sold"
          value={stats.ticketsSold}
          icon="🎫"
          subtitle="Total tickets"
        />
        <StatsCard
          title="Tickets Validated"
          value={stats.ticketsValidated}
          icon="✓"
          subtitle={`${validationRate}% validation rate`}
        />
        <StatsCard
          title="Active Events"
          value={stats.activeEvents}
          icon="📅"
          subtitle="Currently active"
        />
      </div>

      <div style={styles.recentSection}>
        <h2 style={styles.recentSectionH2}>Recent Ticket Sales</h2>
        <div style={styles.ticketsTable}>
          <div style={styles.tableHeader}>
            <span>Event</span>
            <span>Buyer</span>
            <span>Type</span>
            <span>Price</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {stats.recentTickets.map((ticket, index) => (
            <div
              key={ticket.id}
              style={index === stats.recentTickets.length - 1 ? styles.tableRowLast : styles.tableRow}
            >
              <span>{ticket.event?.title || 'N/A'}</span>
              <span>{ticket.profile?.full_name || 'Unknown'}</span>
              <span style={styles.typeBadge}>{ticket.ticket_type?.name || 'N/A'}</span>
              <span>${ticket.price_paid?.toFixed(2) || '0.00'}</span>
              <span style={getStatusStyle(ticket.status)}>{ticket.status}</span>
              <span style={styles.date}>
                {new Date(ticket.purchase_date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
