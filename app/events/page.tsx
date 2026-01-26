'use client'

import { useEffect, useState } from 'react'
import { EventWithTicketTypes } from '@/types/database'
import EventCard from '@/components/events/EventCard'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithTicketTypes[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data?.error || 'No se pudieron cargar los eventos')
        setEvents([])
        return
      }

      if (Array.isArray(data)) {
        setEvents(data)
      } else {
        setEvents([])
        setErrorMessage('Respuesta inesperada del servidor')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setErrorMessage('Error al cargar eventos')
    } finally {
      setLoading(false)
    }
  }

  const upcomingEvents = Array.isArray(events)
    ? events.filter((e) => new Date(e.date) >= new Date())
    : []
  const pastEvents = Array.isArray(events)
    ? events.filter((e) => new Date(e.date) < new Date())
    : []

  if (loading) {
    return (
      <div className="loading-container">
        <span>Loading events...</span>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #fff;
            font-size: 1.25rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="events-page">
      <header className="events-header">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
        <h1 className="events-title">UPCOMING EVENTS</h1>
        <p className="events-subtitle">Get your tickets for the hottest nights in Utah</p>
      </header>

      {upcomingEvents.length > 0 ? (
        <section className="events-section">
          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : (
        <section className="empty-section">
          <p>{errorMessage || 'No upcoming events at the moment'}</p>
          <p className="empty-subtitle">Check back soon for new events!</p>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section className="past-events-section">
          <h2 className="section-title">Past Events</h2>
          <div className="events-grid">
            {pastEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .events-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          padding: 40px 20px;
        }
        .events-header {
          max-width: 1200px;
          margin: 0 auto 40px;
          text-align: center;
        }
        .back-link {
          display: inline-block;
          color: #888;
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #ff1083;
        }
        .events-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 3rem;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: 0.1em;
        }
        .events-subtitle {
          color: #888;
          font-size: 1.1rem;
        }
        .events-section,
        .past-events-section {
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #666;
          margin: 60px 0 24px;
          letter-spacing: 0.05em;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }
        .empty-section {
          max-width: 600px;
          margin: 60px auto;
          text-align: center;
          padding: 60px 20px;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 12px;
        }
        .empty-section p {
          color: #fff;
          font-size: 1.25rem;
          margin-bottom: 8px;
        }
        .empty-subtitle {
          color: #666 !important;
          font-size: 1rem !important;
        }
      `}</style>
    </div>
  )
}
