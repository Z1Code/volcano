'use client'

import { useState, useEffect } from 'react'
import { SectionsConfig, defaultConfig, sectionLabels } from '@/lib/sections-config'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [config, setConfig] = useState<SectionsConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/sections')
      const data = await res.json()
      setConfig(data)
    } catch (error) {
      console.error('Error fetching config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      setIsAuthenticated(true)
    }
  }

  const handleToggle = (section: keyof SectionsConfig) => {
    setConfig((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, config }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Error saving settings' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-card">
          <h1 className="admin-title">VOLCANO ADMIN</h1>
          <form onSubmit={handleLogin} className="admin-form">
            <label className="admin-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="Enter admin password"
              />
            </label>
            <button type="submit" className="admin-btn">
              Login
            </button>
          </form>
        </div>

        <style jsx>{`
          .admin-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            padding: 20px;
          }
          .admin-card {
            background: rgba(20, 20, 20, 0.95);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 40px;
            width: 100%;
            max-width: 400px;
          }
          .admin-title {
            font-family: var(--font-display), 'Bebas Neue', sans-serif;
            font-size: 2rem;
            color: #fff;
            text-align: center;
            margin-bottom: 32px;
            letter-spacing: 0.1em;
          }
          .admin-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .admin-label {
            display: flex;
            flex-direction: column;
            gap: 8px;
            color: #888;
            font-size: 0.875rem;
          }
          .admin-input {
            padding: 12px 16px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
          }
          .admin-input:focus {
            outline: none;
            border-color: #ff1083;
          }
          .admin-btn {
            padding: 14px 24px;
            background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .admin-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
          }
        `}</style>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">Loading...</div>
        <style jsx>{`
          .admin-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          }
          .admin-loading {
            color: #fff;
            font-size: 1.25rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">VOLCANO ADMIN</h1>

        <div className="admin-sections">
          <h2 className="admin-subtitle">Section Visibility</h2>

          {(Object.keys(config) as Array<keyof SectionsConfig>).map((section) => (
            <div key={section} className="admin-toggle-row">
              <div className="admin-toggle-info">
                <span className="admin-toggle-title">{sectionLabels[section].title}</span>
                <span className="admin-toggle-desc">{sectionLabels[section].description}</span>
              </div>
              <button
                onClick={() => handleToggle(section)}
                className={`admin-toggle ${config[section] ? 'active' : ''}`}
              >
                <span className="admin-toggle-slider" />
              </button>
            </div>
          ))}
        </div>

        {message && (
          <div className={`admin-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="admin-btn save">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <a href="/" className="admin-link">
          View Website
        </a>
      </div>

      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          padding: 20px;
        }
        .admin-card {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #333;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
        }
        .admin-title {
          font-family: var(--font-display), 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #fff;
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: 0.1em;
        }
        .admin-subtitle {
          font-size: 0.875rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #333;
        }
        .admin-sections {
          margin-bottom: 24px;
        }
        .admin-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid #222;
        }
        .admin-toggle-row:last-child {
          border-bottom: none;
        }
        .admin-toggle-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-toggle-title {
          color: #fff;
          font-weight: 500;
        }
        .admin-toggle-desc {
          color: #666;
          font-size: 0.875rem;
        }
        .admin-toggle {
          width: 52px;
          height: 28px;
          background: #333;
          border: none;
          border-radius: 14px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }
        .admin-toggle.active {
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
        }
        .admin-toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.3s;
        }
        .admin-toggle.active .admin-toggle-slider {
          transform: translateX(24px);
        }
        .admin-message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 0.875rem;
        }
        .admin-message.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }
        .admin-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        .admin-btn {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .admin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
        }
        .admin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .admin-link {
          display: block;
          text-align: center;
          margin-top: 20px;
          color: #888;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .admin-link:hover {
          color: #ff1083;
        }
      `}</style>
    </div>
  )
}
