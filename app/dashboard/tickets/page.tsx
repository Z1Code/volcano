'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import TicketCard from '@/components/tickets/TicketCard'
import { TicketWithDetails } from '@/types/database'

export default function MyTicketsPage() {
  const { user, loading: authLoading } = useAuth()
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'valid' | 'used'>('all')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // If auth finished and there's no user, stop loading to show empty state
    if (!authLoading && !user) {
      setLoading(false)
      return
    }

    if (user) {
      fetchTickets()
    }
  }, [user, authLoading])

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets')
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data?.error || 'No se pudieron cargar tus tickets')
        setTickets([])
        return
      }

      if (Array.isArray(data)) {
        setTickets(data)
      } else {
        // Defensive: ensure tickets is always an array
        setTickets([])
        setErrorMessage('Respuesta inesperada del servidor')
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setErrorMessage('Error al cargar tus tickets')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="loading">
        <span>Loading...</span>
        <style jsx>{`
          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: #fff;
            font-size: 1.25rem;
          }
        `}</style>
      </div>
    )
  }

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'all') return true
    return t.status === filter
  })

  return (
    <div className="tickets-page">
      <header className="page-header">
        <h1 className="page-title">My Tickets</h1>
        <div className="filter-tabs">
          <button
            onClick={() => setFilter('all')}
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('valid')}
            className={`filter-tab ${filter === 'valid' ? 'active' : ''}`}
          >
            Valid ({tickets.filter((t) => t.status === 'valid').length})
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`filter-tab ${filter === 'used' ? 'active' : ''}`}
          >
            Used ({tickets.filter((t) => t.status === 'used').length})
          </button>
        </div>
      </header>

      {filteredTickets.length > 0 ? (
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} showQR />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{errorMessage || 'No tickets found'}</p>
        </div>
      )}

      <style jsx>{`
        .tickets-page {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .page-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #fff;
          letter-spacing: 0.05em;
        }
        .filter-tabs {
          display: flex;
          gap: 8px;
        }
        .filter-tab {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-tab:hover {
          border-color: #444;
          color: #fff;
        }
        .filter-tab.active {
          background: linear-gradient(135deg, rgba(255, 16, 131, 0.1) 0%, rgba(155, 48, 255, 0.1) 100%);
          border-color: #ff1083;
          color: #ff1083;
        }
        .tickets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 12px;
          color: #888;
        }
      `}</style>
    </div>
  )
}
