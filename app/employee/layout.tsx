'use client'

import { AuthProvider } from '@/components/auth/AuthProvider'
import Link from 'next/link'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="employee-layout">
        <header className="employee-header">
          <Link href="/" className="logo">
            VOLCANO
          </Link>
          <span className="badge">STAFF</span>
        </header>
        <main className="employee-main">{children}</main>

        <style jsx>{`
          .employee-layout {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          }
          .employee-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            border-bottom: 1px solid #222;
          }
          .logo {
            font-family: var(--font-display), 'Bebas Neue', sans-serif;
            font-size: 1.5rem;
            color: #fff;
            text-decoration: none;
            letter-spacing: 0.1em;
          }
          .badge {
            background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
            padding: 6px 16px;
            border-radius: 20px;
            color: #fff;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.1em;
          }
          .employee-main {
            padding: 24px;
          }
        `}</style>
      </div>
    </AuthProvider>
  )
}
