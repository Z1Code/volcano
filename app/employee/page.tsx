'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import QRScanner from '@/components/employee/QRScanner'
import ValidationResult from '@/components/employee/ValidationResult'
import Link from 'next/link'

interface ValidationResponse {
  valid: boolean
  error?: string
  ticket?: {
    id: string
    event: string
    type: string
    holder?: string
    perks?: string[]
    validated_at?: string
    status?: string
    warning?: string
  }
}

export default function EmployeePage() {
  const { profile, loading: authLoading, signOut } = useAuth()
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null)
  const [validating, setValidating] = useState(false)
  const [manualCode, setManualCode] = useState('')

  const handleScan = async (qrData: string) => {
    setValidating(true)
    try {
      const res = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData }),
      })

      const data = await res.json()
      setValidationResult(data)

      // Play sound based on result
      const audio = new Audio(data.valid ? '/sounds/success.mp3' : '/sounds/error.mp3')
      audio.play().catch(() => {})
    } catch (error) {
      setValidationResult({
        valid: false,
        error: 'Network error. Please try again.',
      })
    } finally {
      setValidating(false)
    }
  }

  const handleManualValidation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode.trim()) return

    // Create a mock QR data for manual code entry
    const qrData = JSON.stringify({
      id: '',
      code: manualCode.trim(),
      v: 1,
    })

    await handleScan(qrData)
    setManualCode('')
  }

  const resetScanner = () => {
    setValidationResult(null)
  }

  if (authLoading) {
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

  if (!profile || (profile.role !== 'employee' && profile.role !== 'admin')) {
    return (
      <div className="unauthorized">
        <h1>Access Denied</h1>
        <p>You must be a staff member to access this page.</p>
        <Link href="/login" className="login-link">
          Login as Staff
        </Link>
        <style jsx>{`
          .unauthorized {
            text-align: center;
            padding: 60px 20px;
          }
          h1 {
            font-family: var(--font-display), 'Bebas Neue', sans-serif;
            font-size: 2rem;
            color: #ef4444;
            margin-bottom: 16px;
          }
          p {
            color: #888;
            margin-bottom: 24px;
          }
          .login-link {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
            border-radius: 8px;
            color: #fff;
            text-decoration: none;
            font-weight: 500;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="employee-terminal">
      <div className="terminal-header">
        <div>
          <h1 className="terminal-title">TICKET SCANNER</h1>
          <p className="terminal-subtitle">Scan tickets to validate entry</p>
        </div>
        <div className="user-info">
          <span className="user-name">{profile.full_name}</span>
          <button onClick={signOut} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="terminal-content">
        {validationResult ? (
          <ValidationResult result={validationResult} onReset={resetScanner} />
        ) : (
          <>
            <QRScanner onScan={handleScan} />

            <div className="manual-entry">
              <p>Or enter ticket code manually:</p>
              <form onSubmit={handleManualValidation} className="manual-form">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="VLC-XXXXX-XXXX"
                  className="manual-input"
                />
                <button type="submit" className="manual-btn" disabled={validating}>
                  {validating ? 'Validating...' : 'Validate'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .employee-terminal {
          max-width: 500px;
          margin: 0 auto;
        }
        .terminal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .terminal-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #fff;
          margin-bottom: 4px;
          letter-spacing: 0.1em;
        }
        .terminal-subtitle {
          color: #888;
          font-size: 0.875rem;
        }
        .user-info {
          text-align: right;
        }
        .user-name {
          display: block;
          color: #fff;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .logout-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }
        .terminal-content {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
        }
        .manual-entry {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid #333;
          text-align: center;
        }
        .manual-entry p {
          color: #666;
          font-size: 0.875rem;
          margin-bottom: 16px;
        }
        .manual-form {
          display: flex;
          gap: 12px;
        }
        .manual-input {
          flex: 1;
          padding: 12px 16px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-family: monospace;
          font-size: 0.9rem;
          text-transform: uppercase;
        }
        .manual-input:focus {
          outline: none;
          border-color: #ff1083;
        }
        .manual-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }
        .manual-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .manual-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
