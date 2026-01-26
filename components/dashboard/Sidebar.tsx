'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

const customerLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/tickets', label: 'My Tickets', icon: '🎫' },
  { href: '/events', label: 'Buy Tickets', icon: '🛒' },
]

const employeeLinks = [
  { href: '/employee', label: 'Scanner', icon: '📱' },
]

const adminLinks = [
  { href: '/admin', label: 'Admin Panel', icon: '⚙️' },
  { href: '/admin/events', label: 'Manage Events', icon: '📅' },
  { href: '/admin/tickets', label: 'All Tickets', icon: '🎟️' },
  { href: '/admin/stats', label: 'Statistics', icon: '📊' },
  { href: '/admin/employees', label: 'Employees', icon: '👥' },
]

const styles = {
  sidebar: {
    width: '260px',
    minHeight: '100vh',
    background: 'rgba(15, 15, 15, 0.98)',
    borderRight: '1px solid #222',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'fixed' as const,
    left: 0,
    top: 0,
  } as React.CSSProperties,
  header: {
    padding: '24px',
    borderBottom: '1px solid #222',
  } as React.CSSProperties,
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.75rem',
    color: '#fff',
    textDecoration: 'none',
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  nav: {
    flex: 1,
    padding: '16px 0',
    overflowY: 'auto' as const,
  } as React.CSSProperties,
  section: {
    padding: '8px 16px',
    marginBottom: '8px',
  } as React.CSSProperties,
  sectionTitle: {
    display: 'block',
    color: '#666',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '12px',
    padding: '0 8px',
  } as React.CSSProperties,
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#999',
    textDecoration: 'none',
    borderRadius: '8px',
    marginBottom: '4px',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  navLinkActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    textDecoration: 'none',
    borderRadius: '8px',
    marginBottom: '4px',
    background: 'linear-gradient(135deg, rgba(255, 16, 131, 0.2) 0%, rgba(155, 48, 255, 0.2) 100%)',
    color: '#ff1083',
  } as React.CSSProperties,
  navIcon: {
    fontSize: '1.1rem',
  } as React.CSSProperties,
  footer: {
    padding: '16px',
    borderTop: '1px solid #222',
  } as React.CSSProperties,
  userInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginBottom: '12px',
  } as React.CSSProperties,
  userName: {
    color: '#fff',
    fontWeight: 500,
  } as React.CSSProperties,
  userRole: {
    color: '#666',
    fontSize: '0.75rem',
    textTransform: 'capitalize' as const,
  } as React.CSSProperties,
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#999',
    fontSize: '0.875rem',
    cursor: 'pointer',
  } as React.CSSProperties,
}

export default function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  const isEmployee = profile?.role === 'employee' || profile?.role === 'admin'
  const isAdmin = profile?.role === 'admin'
  const isAdminView = pathname.startsWith('/admin')

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <Link href="/" style={styles.logo}>
          VOLCANO
        </Link>
      </div>

      <nav style={styles.nav}>
        {!isAdminView && (
          <div style={styles.section}>
            <span style={styles.sectionTitle}>Menu</span>
            {customerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={isActive(link.href) ? styles.navLinkActive : styles.navLink}
              >
                <span style={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {isEmployee && (
          <div style={styles.section}>
            <span style={styles.sectionTitle}>Employee</span>
            {employeeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={isActive(link.href) ? styles.navLinkActive : styles.navLink}
              >
                <span style={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {isAdmin && (
          <div style={styles.section}>
            <span style={styles.sectionTitle}>{isAdminView ? 'Admin' : 'Admin shortcuts'}</span>
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={isActive(link.href) ? styles.navLinkActive : styles.navLink}
              >
                <span style={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{profile?.full_name || 'User'}</span>
          <span style={styles.userRole}>{profile?.role || 'customer'}</span>
        </div>
        <button onClick={signOut} style={styles.logoutBtn}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
