'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  } as React.CSSProperties,
  cardCentered: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.5rem',
    color: '#fff',
    textAlign: 'center' as const,
    marginBottom: '8px',
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  titleSmall: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center' as const,
    marginBottom: '16px',
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  subtitle: {
    color: '#888',
    textAlign: 'center' as const,
    marginBottom: '32px',
    fontSize: '0.95rem',
  } as React.CSSProperties,
  subtitleSuccess: {
    color: '#888',
    marginBottom: '24px',
    lineHeight: 1.6,
    fontSize: '0.95rem',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
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
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  } as React.CSSProperties,
  buttonLink: {
    display: 'inline-block',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 600,
    textDecoration: 'none',
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
  checkIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
  } as React.CSSProperties,
}

type RegistrationState = 'form' | 'check-email' | 'success'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [state, setState] = useState<RegistrationState>('form')
  const router = useRouter()

  // Check Supabase configuration on mount
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('Supabase config check (register):', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    })

    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      setError('Error de configuración: Supabase URL no está configurado.')
    } else if (!supabaseKey || supabaseKey.includes('your-anon-key')) {
      setError('Error de configuración: Supabase ANON_KEY no está configurado.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validations first (before setting loading)
    if (!fullName.trim()) {
      setError('Por favor ingresa tu nombre completo')
      return
    }

    if (!email.trim()) {
      setError('Por favor ingresa tu email')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()

    try {
      console.log('Attempting registration with:', email.trim())

      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || null,
          },
        },
      })

      console.log('Registration response:', { data, signUpError })

      if (signUpError) {
        console.error('Sign up error:', signUpError)
        // Translate common errors
        if (signUpError.message.includes('already registered')) {
          setError('Este email ya está registrado. Intenta iniciar sesión.')
        } else if (signUpError.message.includes('valid email')) {
          setError('Por favor ingresa un email válido')
        } else if (signUpError.message.includes('Failed to fetch')) {
          setError('Error de conexión. Verifica tu conexión a internet.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      if (data?.user) {
        console.log('User created:', data.user.id)
        // Check if email confirmation is required
        const needsEmailConfirmation = !data.user.email_confirmed_at

        // Create profile in database
        const { error: profileError } = await (supabase as any)
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            phone: phone.trim() || null,
            role: 'customer',
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't fail registration if profile creation fails
        }

        if (needsEmailConfirmation) {
          setState('check-email')
        } else {
          setState('success')
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 2000)
        }
      } else {
        setError('No se pudo crear la cuenta. Intenta de nuevo.')
        setLoading(false)
      }
    } catch (err: unknown) {
      console.error('Registration error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Ocurrió un error inesperado: ${errorMessage}`)
      setLoading(false)
    }
  }

  // Check Email Screen
  if (state === 'check-email') {
    return (
      <div style={styles.container}>
        <div style={styles.cardCentered}>
          <div style={styles.checkIcon}>📧</div>
          <h1 style={styles.titleSmall}>REVISA TU EMAIL</h1>
          <p style={styles.subtitleSuccess}>
            Enviamos un enlace de confirmación a <strong style={{ color: '#fff' }}>{email}</strong>
          </p>
          <p style={{ ...styles.subtitleSuccess, marginBottom: '32px', fontSize: '0.875rem' }}>
            Haz clic en el enlace del email para verificar tu cuenta y comenzar a usar Volcano.
          </p>
          <Link href="/login" style={styles.buttonLink}>
            Ir a Login
          </Link>
          <p style={{ ...styles.linkText, marginTop: '16px', fontSize: '0.8rem', color: '#666' }}>
            ¿No recibiste el email? Revisa tu carpeta de spam.
          </p>
        </div>
      </div>
    )
  }

  // Success Screen (auto-confirmed)
  if (state === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.cardCentered}>
          <div style={styles.checkIcon}>✓</div>
          <h1 style={styles.titleSmall}>¡CUENTA CREADA!</h1>
          <p style={styles.subtitleSuccess}>
            Tu cuenta ha sido creada exitosamente.
          </p>
          <div style={styles.success}>
            Redirigiendo al dashboard...
          </div>
        </div>
      </div>
    )
  }

  // Registration Form
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ÚNETE A VOLCANO</h1>
        <p style={styles.subtitle}>Crea tu cuenta para comenzar</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>
            Nombre Completo *
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </label>

          <label style={styles.label}>
            Email *
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
            Teléfono (opcional)
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              placeholder="+57 300 123 4567"
              autoComplete="tel"
            />
          </label>

          <label style={styles.label}>
            Contraseña *
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
            />
          </label>

          <label style={styles.label}>
            Confirmar Contraseña *
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              required
            />
          </label>

          <button
            type="submit"
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={styles.linkText}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={styles.link}>
            Iniciar sesión
          </Link>
        </p>

        <Link href="/" style={styles.backLink}>
          ← Volver al sitio
        </Link>
      </div>
    </div>
  )
}
