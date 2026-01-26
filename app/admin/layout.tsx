'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import LoginForm from '@/components/auth/LoginForm'

const styles = {
  layout: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    paddingBottom: '32px',
  } as React.CSSProperties,
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    padding: '20px',
  } as React.CSSProperties,
  topbar: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
    background: 'rgba(10, 10, 12, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #1f1f25',
  } as React.CSSProperties,
  topbarInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: '0.08em',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.4rem',
    whiteSpace: 'nowrap' as const,
    transition: 'opacity 0.2s',
  } as React.CSSProperties,
  spacer: {
    flex: 1,
  } as React.CSSProperties,
  logoutBtn: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,112,215,0.4)',
    background: 'linear-gradient(120deg, rgba(255,112,215,0.14), rgba(155,48,255,0.12))',
    color: '#fff',
    cursor: 'pointer',
    marginLeft: 'auto',
  } as React.CSSProperties,
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px 24px',
  } as React.CSSProperties,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Check session once
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    }).catch(() => {})

    // Listen for login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  // No user = show login
  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <Suspense fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
          <LoginForm redirectTo="/admin" embedded />
        </Suspense>
      </div>
    )
  }

  // User exists = show admin (server validates permissions on API calls)
  return (
    <div style={styles.layout}>
      <div style={styles.topbar}>
        <div style={styles.topbarInner}>
          <Link href="/admin" style={styles.brand}>
            VOLCANO ADMIN
          </Link>
          <div style={styles.spacer} />
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar Sesión
          </button>
        </div>
      </div>
      <main style={styles.main}>{children}</main>
    </div>
  )
}
