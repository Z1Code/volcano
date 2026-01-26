'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EventWithTicketTypes } from '@/types/database'

const styles = {
  section: {
    padding: '80px 0',
    background: 'linear-gradient(180deg, #0a0a0c 0%, #0f0f12 100%)',
  } as React.CSSProperties,
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    marginBottom: '48px',
  } as React.CSSProperties,
  tag: {
    color: '#ff1083',
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    marginBottom: '12px',
    display: 'block',
  } as React.CSSProperties,
  title: {
    fontFamily: "'Bebas Neue', var(--font-display), sans-serif",
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    color: '#fff',
    letterSpacing: '0.04em',
    margin: 0,
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  card: {
    position: 'relative' as const,
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.08)',
    height: '520px',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'transform 0.3s, border-color 0.3s',
    cursor: 'pointer',
  } as React.CSSProperties,
  cardHover: {
    transform: 'translateY(-6px)',
    borderColor: 'rgba(255,16,131,0.4)',
  } as React.CSSProperties,
  imageWrap: {
    position: 'relative' as const,
    height: '320px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1a1a20 0%, #0d0d10 100%)',
  } as React.CSSProperties,
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  } as React.CSSProperties,
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    background: 'linear-gradient(135deg, rgba(255,16,131,0.1) 0%, rgba(155,48,255,0.1) 100%)',
  } as React.CSSProperties,
  dateBadge: {
    position: 'absolute' as const,
    top: '12px',
    left: '12px',
    background: 'rgba(10,10,12,0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
  } as React.CSSProperties,
  dateDay: {
    fontFamily: "'Bebas Neue', var(--font-display), sans-serif",
    fontSize: '1.5rem',
    color: '#fff',
    lineHeight: 1,
  } as React.CSSProperties,
  dateMonth: {
    fontSize: '0.7rem',
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
  } as React.CSSProperties,
  eventTitle: {
    fontFamily: "'Bebas Neue', var(--font-display), sans-serif",
    fontSize: '1.4rem',
    color: '#fff',
    letterSpacing: '0.03em',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  eventTime: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  } as React.CSSProperties,
  eventLink: {
    marginTop: 'auto',
    color: '#ff1083',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  } as React.CSSProperties,
  placeholderCard: {
    position: 'relative' as const,
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'linear-gradient(160deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
    height: '520px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  } as React.CSSProperties,
  placeholderIcon: {
    fontSize: '3rem',
    opacity: 0.3,
  } as React.CSSProperties,
  placeholderText: {
    color: '#4b5563',
    fontSize: '0.9rem',
    fontWeight: 500,
  } as React.CSSProperties,
  cta: {
    textAlign: 'center' as const,
    marginTop: '48px',
  } as React.CSSProperties,
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    transition: 'all 0.3s',
  } as React.CSSProperties,
  loading: {
    textAlign: 'center' as const,
    padding: '60px',
    color: '#9ca3af',
  } as React.CSSProperties,
}

const defaultIcons = ['🔥', '🎧', '🌙', '✨', '🎉', '💜']

export default function Events() {
  const [events, setEvents] = useState<EventWithTicketTypes[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        if (Array.isArray(data)) {
          // Filter only active future events
          const now = new Date()
          const futureEvents = data
            .filter((e: EventWithTicketTypes) => e.is_active && new Date(e.date) >= now)
            .slice(0, 3)
          setEvents(futureEvents)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const renderEventCard = (event: EventWithTicketTypes, index: number) => {
    const eventDate = new Date(event.date)
    const isHovered = hoveredCard === event.id

    return (
      <Link
        key={event.id}
        href={`/events/${event.id}`}
        style={{
          ...styles.card,
          ...(isHovered ? styles.cardHover : {}),
          textDecoration: 'none',
        }}
        onMouseEnter={() => setHoveredCard(event.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div style={styles.imageWrap}>
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>
              {defaultIcons[index % defaultIcons.length]}
            </div>
          )}
          <div style={styles.dateBadge}>
            <span style={styles.dateDay}>{eventDate.getDate()}</span>
            <span style={styles.dateMonth}>
              {eventDate.toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </div>
        </div>
        <div style={styles.content}>
          <h3 style={styles.eventTitle}>{event.title}</h3>
          <div style={styles.eventTime}>
            <span>🕐</span>
            <span>{formatTime(eventDate)}</span>
          </div>
          <span style={styles.eventLink}>
            Get tickets <span>→</span>
          </span>
        </div>
      </Link>
    )
  }

  const renderPlaceholder = (index: number) => (
    <div key={`placeholder-${index}`} style={styles.placeholderCard}>
      <span style={styles.placeholderIcon}>🎭</span>
      <span style={styles.placeholderText}>Coming Soon</span>
    </div>
  )

  if (loading) {
    return (
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading events...</div>
        </div>
      </section>
    )
  }

  // Calculate how many placeholders we need (always show 3 cards)
  const placeholdersNeeded = Math.max(0, 3 - events.length)

  return (
    <section id="events" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.tag}>Upcoming Events</span>
          <h2 style={styles.title}>DON'T MISS OUT</h2>
        </div>

        <div style={styles.grid}>
          {events.map((event, index) => renderEventCard(event, index))}
          {Array.from({ length: placeholdersNeeded }).map((_, index) =>
            renderPlaceholder(index)
          )}
        </div>

        <div style={styles.cta}>
          <Link href="/events" style={styles.ctaButton}>
            Browse All Events
          </Link>
        </div>
      </div>
    </section>
  )
}
