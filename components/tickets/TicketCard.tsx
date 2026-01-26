'use client'

import { TicketWithDetails } from '@/types/database'
import Link from 'next/link'

interface TicketCardProps {
  ticket: TicketWithDetails
  showQR?: boolean
}

export default function TicketCard({ ticket, showQR = false }: TicketCardProps) {
  const isValid = ticket.status === 'valid'
  const eventDate = new Date(ticket.event.date)
  const isPast = eventDate < new Date()

  return (
    <div className={`ticket-card ${!isValid ? 'used' : ''} ${isPast ? 'past' : ''}`}>
      <div className="ticket-header">
        <span className={`ticket-status ${ticket.status}`}>
          {ticket.status === 'valid' && '✓ Valid'}
          {ticket.status === 'used' && '✗ Used'}
          {ticket.status === 'cancelled' && '✗ Cancelled'}
          {ticket.status === 'expired' && '✗ Expired'}
        </span>
        <span className="ticket-type">{ticket.ticket_type.name}</span>
      </div>

      <div className="ticket-body">
        <h3 className="ticket-event">{ticket.event.title}</h3>
        <div className="ticket-details">
          <div className="detail">
            <span className="detail-label">Date</span>
            <span className="detail-value">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="detail">
            <span className="detail-label">Time</span>
            <span className="detail-value">
              {eventDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="detail">
            <span className="detail-label">Price Paid</span>
            <span className="detail-value">${ticket.price_paid.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {showQR && isValid && !isPast && (
        <Link href={`/dashboard/tickets/${ticket.id}`} className="view-qr-btn">
          View QR Code
        </Link>
      )}

      {ticket.validated_at && (
        <div className="validated-info">
          Validated: {new Date(ticket.validated_at).toLocaleString()}
        </div>
      )}

      <style jsx>{`
        .ticket-card {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .ticket-card:hover {
          transform: translateY(-2px);
          border-color: #444;
        }
        .ticket-card.used,
        .ticket-card.past {
          opacity: 0.7;
        }
        .ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid #222;
        }
        .ticket-status {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .ticket-status.valid {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .ticket-status.used {
          background: rgba(156, 163, 175, 0.1);
          color: #9ca3af;
        }
        .ticket-status.cancelled,
        .ticket-status.expired {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .ticket-type {
          color: #ff1083;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .ticket-body {
          padding: 20px;
        }
        .ticket-event {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 16px;
          letter-spacing: 0.05em;
        }
        .ticket-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-label {
          color: #666;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        .detail-value {
          color: #fff;
          font-weight: 500;
        }
        .view-qr-btn {
          display: block;
          margin: 0 20px 20px;
          padding: 12px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border-radius: 8px;
          color: #fff;
          text-align: center;
          text-decoration: none;
          font-weight: 500;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .view-qr-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
        }
        .validated-info {
          padding: 12px 20px;
          background: rgba(156, 163, 175, 0.05);
          border-top: 1px solid #222;
          color: #666;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  )
}
