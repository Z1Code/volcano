'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const styles = {
  page: {
    maxWidth: '1200px',
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '18px',
  } as React.CSSProperties,
  statCard: {
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #1f1f25',
    background: 'linear-gradient(150deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
  } as React.CSSProperties,
  statLabel: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  } as React.CSSProperties,
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
  } as React.CSSProperties,
  hero: {
    background: 'radial-gradient(circle at 20% 20%, rgba(255, 16, 131, 0.08), transparent 30%), radial-gradient(circle at 80% 10%, rgba(155, 48, 255, 0.1), transparent 25%), linear-gradient(135deg, #101014 0%, #0a0a0d 100%)',
    border: '1px solid #18181b',
    borderRadius: '20px',
    padding: '28px 32px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
  } as React.CSSProperties,
  heroText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.75rem',
    color: '#fff',
    letterSpacing: '0.08em',
  } as React.CSSProperties,
  subtitle: {
    color: '#9ca3af',
    fontSize: '1rem',
    maxWidth: '620px',
    lineHeight: 1.5,
  } as React.CSSProperties,
  heroBadge: {
    alignSelf: 'flex-start',
    padding: '10px 14px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid #1f1f25',
    color: '#cbd5e1',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  tile: {
    position: 'relative' as const,
    padding: '18px',
    borderRadius: '16px',
    border: '1px solid #1f1f25',
    background: 'linear-gradient(150deg, rgba(255, 255, 255, 0.06), rgba(12, 12, 16, 0.85))',
    color: '#e5e7eb',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    transition: 'transform 0.12s ease, border 0.15s ease, box-shadow 0.15s ease',
    boxShadow: '0 15px 30px rgba(0,0,0,0.35)',
    fontFamily: "'SF Pro Display', 'Helvetica Neue', 'Neue Haas Grotesk', Arial, sans-serif",
  } as React.CSSProperties,
  tileAccent: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '16px',
    background: 'linear-gradient(120deg, rgba(255, 16, 131, 0.12), rgba(155, 48, 255, 0.1))',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none' as const,
  } as React.CSSProperties,
  tileHover: {
    transform: 'translateY(-2px)',
    border: '1px solid rgba(255, 16, 131, 0.3)',
    boxShadow: '0 18px 38px rgba(255,16,131,0.18)',
  } as React.CSSProperties,
  tilePressed: {
    transform: 'translateY(2px) scale(0.99)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
  } as React.CSSProperties,
  tileTitle: {
    fontWeight: 700,
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 1,
  } as React.CSSProperties,
  tileEmoji: {
    fontSize: '1.2rem',
  } as React.CSSProperties,
  tileDesc: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    lineHeight: 1.4,
    zIndex: 1,
  } as React.CSSProperties,
  sections: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  } as React.CSSProperties,
  card: {
    background: 'rgba(12, 12, 16, 0.9)',
    border: '1px solid #1f1f25',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
  } as React.CSSProperties,
  cardTitle: {
    fontSize: '1rem',
    color: '#f8fafc',
    marginBottom: '4px',
  } as React.CSSProperties,
  cardSubtitle: {
    color: '#6b7280',
    fontSize: '0.9rem',
    marginBottom: '16px',
  } as React.CSSProperties,
  togglesWrap: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '12px',
  } as React.CSSProperties,
  toggleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #1f1f25',
    background: 'rgba(255,255,255,0.02)',
  } as React.CSSProperties,
  toggleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as React.CSSProperties,
  toggleTitle: {
    color: '#e5e7eb',
    fontWeight: 600,
  } as React.CSSProperties,
  toggleDesc: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  } as React.CSSProperties,
  toggle: {
    position: 'relative' as const,
    width: '58px',
    height: '30px',
    borderRadius: '20px',
    border: '1px solid #2f2f34',
    background: '#18181b',
    cursor: 'pointer',
  } as React.CSSProperties,
  toggleActive: {
    position: 'relative' as const,
    width: '58px',
    height: '30px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 16, 131, 0.5)',
    background: 'linear-gradient(120deg, rgba(255, 16, 131, 0.25), rgba(155, 48, 255, 0.35))',
    cursor: 'pointer',
  } as React.CSSProperties,
  toggleThumb: {
    position: 'absolute' as const,
    top: '3px',
    left: '3px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    transition: 'transform 0.2s ease',
  } as React.CSSProperties,
  toggleThumbActive: {
    position: 'absolute' as const,
    top: '3px',
    left: '3px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#0b0b0d',
    transform: 'translateX(26px)',
    boxShadow: '0 10px 25px rgba(255,16,131,0.35)',
    transition: 'transform 0.2s ease',
  } as React.CSSProperties,
  messageSuccess: {
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10b981',
    marginTop: '8px',
  } as React.CSSProperties,
  messageError: {
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    marginTop: '8px',
  } as React.CSSProperties,
  formRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #2a2a30',
    background: '#0f1014',
    color: '#e5e7eb',
  } as React.CSSProperties,
  button: {
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    minWidth: '160px',
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  } as React.CSSProperties,
  loading: {
    color: '#fff',
    fontSize: '1rem',
    textAlign: 'center' as const,
    padding: '20px 0',
  } as React.CSSProperties,
}

const adminTiles = [
  { href: '/admin/events', title: 'Eventos', desc: 'Crea, publica y controla aforos', emoji: '🎟️' },
  { href: '/admin/tickets', title: 'Boletos', desc: 'Revisa ventas y controles', emoji: '📊' },
  { href: '/admin/stats', title: 'Insights', desc: 'Métricas de desempeño', emoji: '📈' },
  { href: '/admin/employees', title: 'Equipo', desc: 'Roles y accesos del staff', emoji: '🧑‍💼' },
  { href: '/employee', title: 'Scanner', desc: 'Acceso rápido a lector', emoji: '📱' },
  { href: '/admin/settings', title: 'Configuración', desc: 'Visibilidad del sitio', emoji: '⚙️' },
]

export default function AdminPage() {
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)
  const [pressedTile, setPressedTile] = useState<string | null>(null)
  const [stats, setStats] = useState({
    ticketsSold: 0,
    ticketsValidated: 0,
    activeEvents: 0,
    revenue: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const fetchStats = async () => {
    setStatsLoading(true)
    setStatsError(null)
    try {
      const supabase = createClient()

      // Fetch tickets and events directly from Supabase
      const [ticketsRes, eventsRes] = await Promise.all([
        supabase.from('tickets').select('status, price_paid'),
        supabase.from('events').select('id, is_active')
      ])

      console.log('Tickets response:', ticketsRes)
      console.log('Events response:', eventsRes)

      if (ticketsRes.error) {
        console.error('Tickets error:', ticketsRes.error.message, ticketsRes.error.code)
        throw new Error(ticketsRes.error.message)
      }
      if (eventsRes.error) {
        console.error('Events error:', eventsRes.error.message, eventsRes.error.code)
        throw new Error(eventsRes.error.message)
      }

      const tickets = (ticketsRes.data || []) as Array<{ status: string; price_paid: number | null }>
      const events = (eventsRes.data || []) as Array<{ id: string; is_active: boolean }>

      setStats({
        ticketsSold: tickets.length,
        ticketsValidated: tickets.filter(t => t.status === 'used').length,
        activeEvents: events.filter(e => e.is_active).length,
        revenue: tickets.reduce((sum, t) => sum + (t.price_paid || 0), 0),
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      console.error('Error fetching stats:', message)
      setStatsError(message)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Tickets vendidos</span>
          <span style={styles.statValue}>
            {statsLoading ? '...' : stats.ticketsSold}
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Tickets validados</span>
          <span style={styles.statValue}>
            {statsLoading ? '...' : stats.ticketsValidated}
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Eventos activos</span>
          <span style={styles.statValue}>
            {statsLoading ? '...' : stats.activeEvents}
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Ingresos totales</span>
          <span style={styles.statValue}>
            {statsLoading ? '...' : `$${stats.revenue.toFixed(2)}`}
          </span>
        </div>
      </div>
      {statsError && (
        <div style={{ color: '#f97316', marginBottom: '12px', fontSize: '0.95rem' }}>
          {statsError}
        </div>
      )}

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <span style={styles.heroBadge}>Centro de control</span>
          <h1 style={styles.title}>Panel de administración</h1>
          <p style={styles.subtitle}>
            Gestiona eventos, equipo, boletos y la visibilidad del sitio desde un hub más limpio y moderno.
          </p>
        </div>
      </section>

      <div style={styles.grid}>
        {adminTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            style={{
              ...styles.tile,
              ...(hoveredTile === tile.href ? styles.tileHover : {}),
              ...(pressedTile === tile.href ? styles.tilePressed : {}),
            }}
            onMouseEnter={() => setHoveredTile(tile.href)}
            onMouseLeave={() => setHoveredTile(null)}
            onMouseDown={() => setPressedTile(tile.href)}
            onMouseUp={() => setPressedTile(null)}
            onBlur={() => setPressedTile(null)}
          >
            <span
              style={{
                ...styles.tileAccent,
                opacity: hoveredTile === tile.href ? 1 : 0,
              }}
            />
            <div style={styles.tileTitle}>
              <span style={styles.tileEmoji}>{tile.emoji}</span>
              {tile.title}
            </div>
            <p style={styles.tileDesc}>{tile.desc}</p>
          </Link>
        ))}
      </div>

      <div style={styles.sections}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Notas rápidas</h2>
          <p style={styles.cardSubtitle}>Revisa eventos y tareas clave.</p>
          <ul style={{ color: '#9ca3af', lineHeight: 1.6, paddingLeft: '16px', margin: 0 }}>
            <li>Publica nuevos eventos y revisa su aforo en “Eventos”.</li>
            <li>Controla accesos del staff en “Equipo”.</li>
            <li>Usa “Scanner” para validar tickets en sitio.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
