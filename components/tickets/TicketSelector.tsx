'use client'

import { useState } from 'react'
import { TicketType } from '@/types/database'

interface TicketSelectorProps {
  ticketTypes: TicketType[]
  onSelect: (ticketTypeId: string, quantity: number) => void
  loading?: boolean
}

export default function TicketSelector({
  ticketTypes,
  onSelect,
  loading = false,
}: TicketSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const selectedTicket = ticketTypes.find((t) => t.id === selectedType)
  const maxQuantity = selectedTicket
    ? Math.min(10, selectedTicket.quantity_available - selectedTicket.quantity_sold)
    : 0

  const handlePurchase = () => {
    if (selectedType && quantity > 0) {
      onSelect(selectedType, quantity)
    }
  }

  return (
    <div className="ticket-selector">
      <h3 className="selector-title">Select Tickets</h3>

      <div className="ticket-types">
        {ticketTypes.map((type) => {
          const available = type.quantity_available - type.quantity_sold
          const soldOut = available <= 0

          return (
            <button
              key={type.id}
              onClick={() => !soldOut && setSelectedType(type.id)}
              className={`ticket-type ${selectedType === type.id ? 'selected' : ''} ${soldOut ? 'sold-out' : ''}`}
              disabled={soldOut}
            >
              <div className="type-header">
                <span className="type-name">{type.name}</span>
                <span className="type-price">${type.price.toFixed(2)}</span>
              </div>
              {type.description && (
                <p className="type-description">{type.description}</p>
              )}
              <ul className="type-perks">
                {type.perks.map((perk, index) => (
                  <li key={index}>{perk}</li>
                ))}
              </ul>
              <div className="type-availability">
                {soldOut ? 'Sold Out' : `${available} available`}
              </div>
            </button>
          )
        })}
      </div>

      {selectedType && maxQuantity > 0 && (
        <div className="quantity-selector">
          <label className="quantity-label">Quantity:</label>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="quantity-btn"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              className="quantity-btn"
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${(selectedTicket.price * quantity).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${(selectedTicket.price * quantity).toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={!selectedType || loading || maxQuantity <= 0}
        className="purchase-btn"
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      <style jsx>{`
        .ticket-selector {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
        }
        .selector-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 20px;
          letter-spacing: 0.05em;
        }
        .ticket-types {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .ticket-type {
          text-align: left;
          padding: 20px;
          background: #1a1a1a;
          border: 2px solid #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ticket-type:hover:not(:disabled) {
          border-color: #444;
        }
        .ticket-type.selected {
          border-color: #ff1083;
          background: rgba(255, 16, 131, 0.05);
        }
        .ticket-type.sold-out {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .type-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .type-name {
          font-weight: 600;
          color: #fff;
          font-size: 1.1rem;
        }
        .type-price {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #ff1083;
        }
        .type-description {
          color: #888;
          font-size: 0.875rem;
          margin-bottom: 12px;
        }
        .type-perks {
          list-style: none;
          padding: 0;
          margin: 0 0 12px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .type-perks li {
          font-size: 0.75rem;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
        }
        .type-availability {
          font-size: 0.75rem;
          color: #666;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-top: 1px solid #333;
          margin-bottom: 16px;
        }
        .quantity-label {
          color: #888;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .quantity-btn {
          width: 36px;
          height: 36px;
          background: #333;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 1.25rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .quantity-btn:hover:not(:disabled) {
          background: #444;
        }
        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .quantity-value {
          font-size: 1.25rem;
          color: #fff;
          font-weight: 600;
          min-width: 32px;
          text-align: center;
        }
        .order-summary {
          padding: 16px 0;
          border-top: 1px solid #333;
          margin-bottom: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          color: #888;
          padding: 8px 0;
        }
        .summary-row.total {
          border-top: 1px solid #333;
          margin-top: 8px;
          padding-top: 16px;
          color: #fff;
          font-weight: 600;
          font-size: 1.1rem;
        }
        .purchase-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .purchase-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
        }
        .purchase-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
