'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SectionsConfig, defaultConfig, sectionLabels } from '@/lib/sections-config'

const styles = {
  page: {
    maxWidth: '900px',
    margin: '0 auto',
  } as React.CSSProperties,
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #2a2a30',
    background: 'rgba(255,255,255,0.03)',
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginBottom: '16px',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  card: {
    background: 'radial-gradient(circle at 20% 20%, rgba(255, 16, 131, 0.04), transparent 32%), radial-gradient(circle at 80% 0%, rgba(155, 48, 255, 0.06), transparent 26%), rgba(12, 12, 16, 0.9)',
    border: '1px solid #1f1f25',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
  } as React.CSSProperties,
  title: {
    fontSize: '1.05rem',
    color: '#f3f4f6',
    marginBottom: '4px',
    letterSpacing: '0.02em',
  } as React.CSSProperties,
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.95rem',
    marginBottom: '16px',
  } as React.CSSProperties,
  toggleList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,
  toggleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '14px',
    background: '#0f0f12',
    border: '1px solid #1f1f25',
    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  } as React.CSSProperties,
  toggleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as React.CSSProperties,
  toggleTitle: {
    color: '#e5e7eb',
    fontWeight: 700,
  } as React.CSSProperties,
  toggleDesc: {
    color: '#9ca3af',
    fontSize: '0.9rem',
  } as React.CSSProperties,
  toggle: {
    position: 'relative' as const,
    width: '56px',
    height: '30px',
    borderRadius: '18px',
    background: '#18181b',
    border: '1px solid #2a2a30',
    cursor: 'pointer',
  } as React.CSSProperties,
  toggleActive: {
    position: 'relative' as const,
    width: '56px',
    height: '30px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    border: '1px solid rgba(255,16,131,0.4)',
    cursor: 'pointer',
  } as React.CSSProperties,
  thumb: {
    position: 'absolute' as const,
    top: '3px',
    left: '3px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#0b0b0d',
    boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
    transform: 'translateX(0)',
    transition: 'transform 0.2s ease',
  } as React.CSSProperties,
  thumbActive: {
    position: 'absolute' as const,
    top: '3px',
    left: '3px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 10px 24px rgba(255,16,131,0.35)',
    transform: 'translateX(26px)',
    transition: 'transform 0.2s ease',
  } as React.CSSProperties,
  button: {
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  } as React.CSSProperties,
  messageSuccess: {
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    color: '#10b981',
    marginTop: '10px',
  } as React.CSSProperties,
  messageError: {
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#ef4444',
    marginTop: '10px',
  } as React.CSSProperties,
  loading: {
    color: '#e5e7eb',
    padding: '16px 0',
  } as React.CSSProperties,
}

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SectionsConfig>(defaultConfig)
  const [configLoading, setConfigLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchConfig = async (signal?: AbortSignal) => {
    setConfigLoading(true)
    try {
      const res = await fetch('/api/sections', { signal })
      const data = await res.json()
      setConfig(data)
    } catch (error: any) {
      if (error?.name === 'AbortError') return
      setMessage({ type: 'error', text: 'No se pudo cargar la configuración' })
    } finally {
      setConfigLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchConfig(controller.signal)
    return () => controller.abort()
  }, [])

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
        body: JSON.stringify({ config }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Configuración guardada' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Error guardando' })
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return
      setMessage({ type: 'error', text: 'Error de red, intenta de nuevo' })
    } finally {
      setSaving(false)
    }
  }

  const configKeys = Object.keys(config) as Array<keyof SectionsConfig>

  return (
    <div style={styles.page}>
      <Link href="/admin" style={styles.backLink}>← Volver al panel</Link>
      <div style={styles.card}>
        <h2 style={styles.title}>Configuración del sitio</h2>
        <p style={styles.subtitle}>Controla qué secciones son visibles en la web pública.</p>

        {configLoading ? (
          <div style={styles.loading}>Cargando configuración...</div>
        ) : (
          <>
            <div style={styles.toggleList}>
              {configKeys.map((section) => (
                <div key={section} style={styles.toggleRow}>
                  <div style={styles.toggleInfo}>
                    <span style={styles.toggleTitle}>{sectionLabels[section].title}</span>
                    <span style={styles.toggleDesc}>{sectionLabels[section].description}</span>
                  </div>
                  <button
                    onClick={() => handleToggle(section)}
                    style={config[section] ? styles.toggleActive : styles.toggle}
                    aria-pressed={config[section]}
                  >
                    <span style={config[section] ? styles.thumbActive : styles.thumb} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ ...styles.button, ...(saving ? styles.buttonDisabled : {}) }}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            {message && (
              <div style={message.type === 'success' ? styles.messageSuccess : styles.messageError}>
                {message.text}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
