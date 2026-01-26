'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import StatsCard from '@/components/dashboard/StatsCard'
import TicketCard from '@/components/tickets/TicketCard'
import { TicketWithDetails } from '@/types/database'
import Link from 'next/link'

const styles = {
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap' as const,
    gap: '20px',
  } as React.CSSProperties,
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.5rem',
    color: '#fff',
    marginBottom: '8px',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  subtitle: {
    color: '#888',
    fontSize: '1rem',
  } as React.CSSProperties,
  buyButton: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    borderRadius: '8px',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
  } as React.CSSProperties,
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  } as React.CSSProperties,
  ticketsSection: {
    marginBottom: '40px',
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '20px',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  ticketsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
  } as React.CSSProperties,
  emptyText: {
    color: '#888',
    marginBottom: '20px',
  } as React.CSSProperties,
  browseLink: {
    display: 'inline-block',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    borderRadius: '8px',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 500,
  } as React.CSSProperties,
  viewAllLink: {
    display: 'block',
    textAlign: 'center' as const,
    marginTop: '20px',
    color: '#ff1083',
    textDecoration: 'none',
    fontWeight: 500,
  } as React.CSSProperties,
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    color: '#fff',
    fontSize: '1.25rem',
  } as React.CSSProperties,
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTickets()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets')
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return <div style={styles.loading}>Cargando...</div>
  }

  const validTickets = tickets.filter((t) => t.status === 'valid')
  const usedTickets = tickets.filter((t) => t.status === 'used')
  const upcomingTickets = validTickets.filter(
    (t) => t.event && new Date(t.event.date) >= new Date()
  )

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Bienvenido, {profile?.full_name?.split(' ')[0] || 'Invitado'}
          </h1>
          <p style={styles.subtitle}>Aquí está el resumen de tus tickets</p>
        </div>
        <Link href="/events" style={styles.buyButton}>
          Comprar Tickets
        </Link>
      </header>

      <section style={styles.statsSection}>
        <StatsCard
          title="Tickets Válidos"
          value={validTickets.length}
          icon="🎫"
          subtitle="Listos para usar"
        />
        <StatsCard
          title="Tickets Usados"
          value={usedTickets.length}
          icon="✓"
          subtitle="Ya validados"
        />
        <StatsCard
          title="Próximos Eventos"
          value={upcomingTickets.length}
          icon="📅"
          subtitle="No te los pierdas"
        />
        <StatsCard
          title="Total Gastado"
          value={`$${tickets.reduce((sum, t) => sum + (t.price_paid || 0), 0).toFixed(2)}`}
          icon="💳"
          subtitle="Histórico"
        />
      </section>

      <section style={styles.ticketsSection}>
        <h2 style={styles.sectionTitle}>Tus Próximos Tickets</h2>
        {upcomingTickets.length > 0 ? (
          <div style={styles.ticketsGrid}>
            {upcomingTickets.slice(0, 3).map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} showQR />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No tienes tickets próximos</p>
            <Link href="/events" style={styles.browseLink}>
              Ver Eventos
            </Link>
          </div>
        )}
        {upcomingTickets.length > 3 && (
          <Link href="/dashboard/tickets" style={styles.viewAllLink}>
            Ver Todos los Tickets ({upcomingTickets.length})
          </Link>
        )}
      </section>
    </div>
  )
}
