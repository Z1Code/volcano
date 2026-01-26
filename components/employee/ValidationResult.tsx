'use client'

interface ValidationResultProps {
  result: {
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
  } | null
  onReset: () => void
}

export default function ValidationResult({ result, onReset }: ValidationResultProps) {
  if (!result) return null

  const isValid = result.valid

  return (
    <div className={`validation-result ${isValid ? 'valid' : 'invalid'}`}>
      <div className="result-icon">{isValid ? '✓' : '✗'}</div>
      <h2 className="result-title">
        {isValid ? 'TICKET VALID' : 'TICKET INVALID'}
      </h2>

      {result.error && <p className="result-error">{result.error}</p>}

      {result.ticket && (
        <div className="ticket-info">
          <div className="info-row">
            <span className="info-label">Event</span>
            <span className="info-value">{result.ticket.event}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Type</span>
            <span className="info-value">{result.ticket.type}</span>
          </div>
          {result.ticket.holder && (
            <div className="info-row">
              <span className="info-label">Holder</span>
              <span className="info-value">{result.ticket.holder}</span>
            </div>
          )}
          {result.ticket.perks && result.ticket.perks.length > 0 && (
            <div className="perks-section">
              <span className="info-label">Perks</span>
              <ul className="perks-list">
                {result.ticket.perks.map((perk, index) => (
                  <li key={index}>{perk}</li>
                ))}
              </ul>
            </div>
          )}
          {result.ticket.validated_at && (
            <div className="info-row">
              <span className="info-label">Validated At</span>
              <span className="info-value">
                {new Date(result.ticket.validated_at).toLocaleString()}
              </span>
            </div>
          )}
          {result.ticket.warning && (
            <div className="warning-banner">{result.ticket.warning}</div>
          )}
        </div>
      )}

      <button onClick={onReset} className="scan-again-btn">
        Scan Another Ticket
      </button>

      <style jsx>{`
        .validation-result {
          padding: 40px 32px;
          border-radius: 16px;
          text-align: center;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .validation-result.valid {
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid #10b981;
        }
        .validation-result.invalid {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid #ef4444;
        }
        .result-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 20px;
        }
        .valid .result-icon {
          background: #10b981;
          color: #fff;
        }
        .invalid .result-icon {
          background: #ef4444;
          color: #fff;
        }
        .result-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }
        .valid .result-title {
          color: #10b981;
        }
        .invalid .result-title {
          color: #ef4444;
        }
        .result-error {
          color: #ef4444;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }
        .ticket-info {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
          text-align: left;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          color: #888;
          font-size: 0.875rem;
        }
        .info-value {
          color: #fff;
          font-weight: 500;
        }
        .perks-section {
          padding: 12px 0;
        }
        .perks-list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .perks-list li {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .warning-banner {
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid #f59e0b;
          color: #f59e0b;
          padding: 12px;
          border-radius: 8px;
          margin-top: 16px;
          font-size: 0.875rem;
        }
        .scan-again-btn {
          margin-top: 24px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .scan-again-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
        }
      `}</style>
    </div>
  )
}
