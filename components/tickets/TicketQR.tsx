'use client'

import { useEffect, useState } from 'react'
import { generateQRCode, createTicketQRData } from '@/lib/qr'
import { TicketWithDetails } from '@/types/database'

interface TicketQRProps {
  ticket: TicketWithDetails
}

export default function TicketQR({ ticket }: TicketQRProps) {
  const [qrImage, setQrImage] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = createTicketQRData(ticket.id, ticket.qr_code)
        const qrDataUrl = await generateQRCode(qrData)
        setQrImage(qrDataUrl)
      } catch (error) {
        console.error('Error generating QR:', error)
      } finally {
        setLoading(false)
      }
    }

    generateQR()
  }, [ticket])

  const eventDate = new Date(ticket.event.date)

  return (
    <div className="qr-container">
      <div className="qr-ticket">
        <div className="qr-header">
          <h1 className="qr-event-title">{ticket.event.title}</h1>
          <span className="qr-ticket-type">{ticket.ticket_type.name}</span>
        </div>

        <div className="qr-code-wrapper">
          {loading ? (
            <div className="qr-loading">Generating QR...</div>
          ) : qrImage ? (
            <img src={qrImage} alt="Ticket QR Code" className="qr-image" />
          ) : (
            <div className="qr-error">Error generating QR</div>
          )}
        </div>

        <div className="qr-info">
          <div className="qr-info-row">
            <span className="qr-label">Date</span>
            <span className="qr-value">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="qr-info-row">
            <span className="qr-label">Time</span>
            <span className="qr-value">
              {eventDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="qr-info-row">
            <span className="qr-label">Ticket Code</span>
            <span className="qr-value code">{ticket.qr_code}</span>
          </div>
        </div>

        <div className="qr-perks">
          <span className="qr-perks-title">Includes:</span>
          <ul className="qr-perks-list">
            {ticket.ticket_type.perks.map((perk, index) => (
              <li key={index}>{perk}</li>
            ))}
          </ul>
        </div>

        <div className="qr-footer">
          <p>Show this QR code at the entrance</p>
          <span className="qr-status">Status: {ticket.status.toUpperCase()}</span>
        </div>
      </div>

      <style jsx>{`
        .qr-container {
          display: flex;
          justify-content: center;
          padding: 20px;
        }
        .qr-ticket {
          background: rgba(20, 20, 20, 0.98);
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          overflow: hidden;
        }
        .qr-header {
          padding: 24px;
          text-align: center;
          border-bottom: 1px dashed #333;
        }
        .qr-event-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.75rem;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        .qr-ticket-type {
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border-radius: 4px;
          color: #fff;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .qr-code-wrapper {
          padding: 32px;
          display: flex;
          justify-content: center;
          background: #fff;
        }
        .qr-image {
          width: 200px;
          height: 200px;
        }
        .qr-loading,
        .qr-error {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        .qr-info {
          padding: 20px 24px;
          border-bottom: 1px dashed #333;
        }
        .qr-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }
        .qr-label {
          color: #666;
          font-size: 0.875rem;
        }
        .qr-value {
          color: #fff;
          font-weight: 500;
        }
        .qr-value.code {
          font-family: monospace;
          font-size: 0.75rem;
          background: #1a1a1a;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .qr-perks {
          padding: 20px 24px;
          border-bottom: 1px dashed #333;
        }
        .qr-perks-title {
          color: #888;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 12px;
        }
        .qr-perks-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .qr-perks-list li {
          color: #fff;
          padding: 6px 0;
          padding-left: 20px;
          position: relative;
          font-size: 0.9rem;
        }
        .qr-perks-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
        }
        .qr-footer {
          padding: 20px 24px;
          text-align: center;
        }
        .qr-footer p {
          color: #888;
          font-size: 0.875rem;
          margin-bottom: 8px;
        }
        .qr-status {
          color: #10b981;
          font-weight: 600;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}
