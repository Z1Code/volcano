'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EventWithTicketTypes } from '@/types/database'
import TicketSelector from '@/components/tickets/TicketSelector'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<EventWithTicketTypes | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    fetchEvent()
    checkAuth()
  }, [params.id])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setCheckingAuth(false)
  }

  const fetchEvent = async () => {
    try {
      const res = await fetch('/api/events')
      const events = await res.json()
      const found = events.find((e: EventWithTicketTypes) => e.id === params.id)
      setEvent(found || null)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (ticketTypeId: string, quantity: number) => {
    // Check if user is logged in before allowing purchase
    if (!user) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(`/events/${params.id}`)
      router.push(`/login?redirect=${returnUrl}`)
      return
    }

    setPurchasing(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketTypeId, quantity }),
      })

      const data = await res.json()

      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Error creating checkout session')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error processing purchase')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <span>Loading event...</span>
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

  if (!event) {
    return (
      <div className="not-found">
        <h1>Event Not Found</h1>
        <Link href="/events">Back to Events</Link>
        <style jsx>{`
          .not-found {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #fff;
          }
          .not-found a {
            color: #ff1083;
          }
        `}</style>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()

  // Sort ticket types: Early first, General second, VIP last
  const sortedTicketTypes = [...(event.ticket_types || [])].sort((a, b) => {
    const getOrder = (name: string) => {
      const lower = name.toLowerCase()
      if (lower.includes('early')) return 0
      if (lower.includes('general')) return 1
      if (lower.includes('vip')) return 2
      return 1 // Default to middle if no match
    }
    return getOrder(a.name) - getOrder(b.name)
  })

  return (
    <div className="event-detail-page">
      <div className="event-hero">
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="hero-image" />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <Link href="/events" className="back-link">
            ← Back to Events
          </Link>
          <h1 className="event-title">{event.title}</h1>
          <div className="event-meta">
            <span className="event-date">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="event-time">
              {eventDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="event-info">
          {event.description && (
            <div className="description-section">
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </div>
          )}

          <div className="venue-section">
            <h2>Venue</h2>
            <p>Volcano Nightclub</p>
            <p className="venue-address">Salt Lake City, Utah</p>
          </div>
        </div>

        <div className="tickets-section">
          {isPast ? (
            <div className="past-event-notice">
              <h3>This event has ended</h3>
              <p>Check out our upcoming events</p>
              <Link href="/events" className="browse-btn">
                Browse Events
              </Link>
            </div>
          ) : (
            <TicketSelector
              ticketTypes={sortedTicketTypes}
              onSelect={handlePurchase}
              loading={purchasing}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .event-detail-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        }
        .event-hero {
          position: relative;
          height: 400px;
          overflow: hidden;
        }
        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 15, 15, 1) 0%, rgba(15, 15, 15, 0.5) 100%);
        }
        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .back-link {
          display: inline-block;
          color: #888;
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 20px;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #ff1083;
        }
        .event-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 3.5rem;
          color: #fff;
          margin-bottom: 16px;
          letter-spacing: 0.05em;
        }
        .event-meta {
          display: flex;
          gap: 24px;
          color: #888;
          font-size: 1.1rem;
        }
        .event-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
        }
        .event-info {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .description-section h2,
        .venue-section h2 {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .description-section p,
        .venue-section p {
          color: #888;
          line-height: 1.7;
        }
        .venue-address {
          color: #666 !important;
          font-size: 0.875rem;
        }
        .tickets-section {
          position: sticky;
          top: 32px;
          height: fit-content;
        }
        .past-event-notice {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
        }
        .past-event-notice h3 {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 8px;
        }
        .past-event-notice p {
          color: #888;
          margin-bottom: 20px;
        }
        .browse-btn {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border-radius: 8px;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
        }
        @media (max-width: 900px) {
          .event-content {
            grid-template-columns: 1fr;
          }
          .tickets-section {
            position: static;
          }
        }
      `}</style>
    </div>
  )
}
