'use client'

import Link from 'next/link'

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #2a2a30',
    background: 'rgba(255,255,255,0.03)',
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.8rem',
    color: '#fff',
    letterSpacing: '0.05em',
    margin: 0,
  } as React.CSSProperties,
}

interface PageHeaderProps {
  title: string
  backHref?: string
  backLabel?: string
}

export default function PageHeader({
  title,
  backHref = '/admin',
  backLabel = 'Volver'
}: PageHeaderProps) {
  return (
    <div style={styles.header}>
      <Link href={backHref} style={styles.backBtn}>
        ← {backLabel}
      </Link>
      <h1 style={styles.title}>{title}</h1>
    </div>
  )
}
