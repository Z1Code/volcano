'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple timeout to show the success page
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="success-page">
        <div className="loading">Processing your order...</div>
        <style jsx>{`
          .success-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          }
          .loading {
            color: #fff;
            font-size: 1.25rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 className="success-title">PAYMENT SUCCESSFUL</h1>
        <p className="success-message">
          Thank you for your purchase! Your tickets have been created and are ready to use.
        </p>

        <div className="success-details">
          <p>You will receive a confirmation email shortly.</p>
          <p>Your QR codes are now available in your dashboard.</p>
        </div>

        <div className="success-actions">
          <Link href="/dashboard/tickets" className="primary-btn">
            View My Tickets
          </Link>
          <Link href="/events" className="secondary-btn">
            Browse More Events
          </Link>
        </div>
      </div>

      <style jsx>{`
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          padding: 20px;
        }
        .success-card {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 48px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: #fff;
          margin: 0 auto 24px;
        }
        .success-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #fff;
          margin-bottom: 16px;
          letter-spacing: 0.1em;
        }
        .success-message {
          color: #888;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .success-details {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid #222;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 32px;
        }
        .success-details p {
          color: #666;
          font-size: 0.875rem;
          margin: 8px 0;
        }
        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .primary-btn {
          display: block;
          padding: 16px 24px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border-radius: 8px;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
        }
        .secondary-btn {
          display: block;
          padding: 16px 24px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }
        .secondary-btn:hover {
          border-color: #444;
          color: #fff;
        }
      `}</style>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        color: '#fff',
        fontSize: '1.25rem'
      }}>
        Loading...
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
