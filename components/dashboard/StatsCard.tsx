'use client'

import { CSSProperties } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

const styles: { [key: string]: CSSProperties } = {
  card: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    color: '#888',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  icon: {
    fontSize: '1.25rem',
  },
  value: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.5rem',
    color: '#fff',
    letterSpacing: '0.02em',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  trendBase: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  trendUp: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#10b981',
  },
  trendDown: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#ef4444',
  },
  trendNeutral: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#888',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.875rem',
  },
}

const getTrendStyle = (trend?: 'up' | 'down' | 'neutral'): CSSProperties => {
  switch (trend) {
    case 'up':
      return styles.trendUp
    case 'down':
      return styles.trendDown
    case 'neutral':
      return styles.trendNeutral
    default:
      return styles.trendBase
  }
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
}: StatsCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        {icon && <span style={styles.icon}>{icon}</span>}
      </div>
      <div style={styles.value}>{value}</div>
      {(subtitle || trendValue) && (
        <div style={styles.footer}>
          {trendValue && (
            <span style={getTrendStyle(trend)}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </span>
          )}
          {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
