'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    padding: '20px',
  } as React.CSSProperties,
  card: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative' as const,
  } as React.CSSProperties,
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.5rem',
    color: '#fff',
    textAlign: 'center' as const,
    marginBottom: '8px',
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  subtitle: {
    color: '#888',
    textAlign: 'center' as const,
    marginBottom: '32px',
    fontSize: '0.95rem',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  } as React.CSSProperties,
  label: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    color: '#888',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  input: {
    padding: '14px 16px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  } as React.CSSProperties,
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  success: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10b981',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  button: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 14px 30px rgba(255,16,131,0.25)',
    transition: 'opacity 0.2s, transform 0.12s ease, box-shadow 0.12s ease',
    fontFamily: "'SF Pro Display', 'Helvetica Neue', 'Neue Haas Grotesk', Arial, sans-serif",
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  } as React.CSSProperties,
  loaderOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none' as const,
  } as React.CSSProperties,
  spinner: {
    width: '38px',
    height: '38px',
    border: '4px solid rgba(255,255,255,0.15)',
    borderTopColor: '#ff1083',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,
  linkText: {
    textAlign: 'center' as const,
    marginTop: '24px',
    color: '#888',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  link: {
    color: '#ff1083',
    textDecoration: 'none',
    fontWeight: 500,
  } as React.CSSProperties,
  backLink: {
    display: 'block',
    textAlign: 'center' as const,
    marginTop: '20px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '0.875rem',
  } as React.CSSProperties,
}

interface LoginFormProps {
  redirectTo?: string
  embedded?: boolean
}

export default function LoginForm({ redirectTo, embedded = false }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pressed, setPressed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = redirectTo || searchParams.get('redirect') || '/dashboard'
  const urlError = searchParams.get('error')
  const urlMessage = searchParams.get('message')

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      setError('Error de configuración: Supabase URL no está configurado correctamente.')
    } else if (!supabaseKey || supabaseKey.includes('your-anon-key')) {
      setError('Error de configuración: Supabase ANON_KEY no está configurado.')
    }
  }, [])

  useEffect(() => {
    if (urlError) {
      setError(decodeURIComponent(urlError))
    }
    if (urlMessage) {
      setSuccess(decodeURIComponent(urlMessage))
    }
  }, [urlError, urlMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (!email.trim()) {
      setError('Por favor ingresa tu email')
      return
    }

    if (!password) {
      setError('Por favor ingresa tu contraseña')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email o contraseña incorrectos')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.')
        } else if (signInError.message.includes('Failed to fetch')) {
          setError('Error de conexión. Verifica tu conexión a internet.')
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      if (data?.user) {
        setSuccess('¡Login exitoso! Redirigiendo...')
        setTimeout(() => {
          router.push(redirect)
          router.refresh()
        }, 500)
      } else {
        setError('No se pudo iniciar sesión. Intenta de nuevo.')
        setLoading(false)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Ocurrió un error inesperado: ${errorMessage}`)
      setLoading(false)
    }
  }

  const formContent = (
    <div style={styles.card}>
      <h1 style={styles.title}>BIENVENIDO</h1>
      <p style={styles.subtitle}>Inicia sesión en tu cuenta Volcano</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <label style={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="tu@email.com"
            autoComplete="email"
            required
          />
        </label>

        <label style={styles.label}>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
            ...(pressed ? { transform: 'translateY(2px) scale(0.99)', boxShadow: '0 8px 18px rgba(0,0,0,0.3)' } : {}),
          }}
          disabled={loading}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {loading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.spinner} />
        </div>
      )}

      <p style={styles.linkText}>
        ¿No tienes cuenta?{' '}
        <Link href="/register" style={styles.link}>
          Regístrate
        </Link>
      </p>

      <Link href="/" style={styles.backLink}>
        ← Volver al sitio
      </Link>
    </div>
  )

  // If embedded (used inside another layout), don't wrap with container
  if (embedded) {
    return formContent
  }

  return (
    <div style={styles.container}>
      {formContent}
    </div>
  )
}
