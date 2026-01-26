'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider'
import Sidebar from '@/components/dashboard/Sidebar'

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  } as React.CSSProperties,
  main: {
    flex: 1,
    marginLeft: '260px',
    padding: '32px',
  } as React.CSSProperties,
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: '#fff',
    fontSize: '1.25rem',
  } as React.CSSProperties,
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard')
    }
  }, [loading, user, router])

  if (loading) {
    return <div style={styles.loading}>Loading...</div>
  }

  if (!user) {
    return <div style={styles.loading}>Redirecting to login...</div>
  }

  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>{children}</main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  )
}
