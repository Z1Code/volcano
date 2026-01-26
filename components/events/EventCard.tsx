'use client'

import { EventWithTicketTypes } from '@/types/database'
import Link from 'next/link'

interface EventCardProps {
  event: EventWithTicketTypes
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()
  const lowestPrice = Math.min(...event.ticket_types.map((t) => t.price))
  const totalAvailable = event.ticket_types.reduce(
    (sum, t) => sum + (t.quantity_available - t.quantity_sold),
    0
  )

  return (
    <div className={`event-card ${isPast ? 'past' : ''}`}>
      {event.image_url && (
        <div className="event-image">
          <img src={event.image_url} alt={event.title} />
          {isPast && <div className="past-overlay">Past Event</div>}
        </div>
      )}

      <div className="event-content">
        <div className="event-date">
          <span className="date-day">{eventDate.getDate()}</span>
          <span className="date-month">
            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
        </div>

        <div className="event-info">
          <h3 className="event-title">{event.title}</h3>
          {event.description && (
            <p className="event-description">{event.description}</p>
          )}

          <div className="event-meta">
            <span className="event-time">
              {eventDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="event-availability">
              {totalAvailable > 0 ? `${totalAvailable} tickets left` : 'Sold Out'}
            </span>
          </div>
        </div>

        <div className="event-action">
          <span className="event-price">
            From <strong>${lowestPrice.toFixed(2)}</strong>
          </span>
          {!isPast && totalAvailable > 0 && (
            <Link href={`/events/${event.id}`} className="buy-btn">
              Get Tickets
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .event-card {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .event-card:hover {
          transform: translateY(-4px);
          border-color: #444;
        }
        .event-card.past {
          opacity: 0.6;
        }
        .event-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .past-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .event-content {
          padding: 20px;
          display: flex;
          gap: 16px;
        }
        .event-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 60px;
          padding: 12px;
          background: linear-gradient(135deg, rgba(255, 16, 131, 0.1) 0%, rgba(155, 48, 255, 0.1) 100%);
          border-radius: 8px;
        }
        .date-day {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.75rem;
          color: #fff;
          line-height: 1;
        }
        .date-month {
          color: #ff1083;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        .event-info {
          flex: 1;
        }
        .event-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: 0.03em;
        }
        .event-description {
          color: #888;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .event-meta {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
        }
        .event-time {
          color: #666;
        }
        .event-availability {
          color: #10b981;
        }
        .event-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          min-width: 120px;
        }
        .event-price {
          color: #888;
          font-size: 0.875rem;
        }
        .event-price strong {
          color: #fff;
          font-size: 1.25rem;
        }
        .buy-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border-radius: 8px;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .buy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
        }
      `}</style>
    </div>
  )
}
