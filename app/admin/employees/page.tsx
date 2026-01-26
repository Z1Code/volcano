'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/database'
import Link from 'next/link'

const styles: { [key: string]: CSSProperties } = {
  adminEmployees: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  adminHeader: {
    marginBottom: '32px',
  },
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
  },
  adminTitle: {
    fontFamily: "var(--font-display), 'Bebas Neue', sans-serif",
    fontSize: '2rem',
    color: '#fff',
    letterSpacing: '0.1em',
  },
  infoBox: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '32px',
  },
  infoBoxText: {
    color: '#60a5fa',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  employeesList: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '24px',
  },
  employeesListHeading: {
    fontSize: '1rem',
    color: '#888',
    marginBottom: '20px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  employeeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderBottom: '1px solid #222',
  },
  employeeItemLast: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderBottom: 'none',
  },
  employeeInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  employeeName: {
    color: '#fff',
    fontWeight: 500,
  },
  employeePhone: {
    color: '#666',
    fontSize: '0.875rem',
  },
  employeeActions: {},
  roleSelect: {
    padding: '8px 12px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
  },
  roleBadgeBase: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  roleBadgeAdmin: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'capitalize',
    background: 'rgba(255, 16, 131, 0.1)',
    color: '#ff1083',
  },
  roleBadgeEmployee: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'capitalize',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#888',
  },
}

const getRoleBadgeStyle = (role: string): CSSProperties => {
  if (role === 'admin') return styles.roleBadgeAdmin
  if (role === 'employee') return styles.roleBadgeEmployee
  return styles.roleBadgeBase
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [hoveredLink, setHoveredLink] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['employee', 'admin'])
        .order('created_at', { ascending: false })

      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId: string, newRole: 'customer' | 'employee' | 'admin') => {
    setUpdating(userId)
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      if (newRole === 'customer') {
        setEmployees((prev) => prev.filter((e) => e.id !== userId))
      } else {
        setEmployees((prev) =>
          prev.map((e) => (e.id === userId ? { ...e, role: newRole } : e))
        )
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Error updating role')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading employees...</div>
  }

  return (
    <div style={styles.adminEmployees}>
      <div style={styles.adminHeader}>
        <Link
          href="/admin"
          style={{
            ...styles.backLink,
            color: hoveredLink ? '#ff1083' : '#888',
          }}
          onMouseEnter={() => setHoveredLink(true)}
          onMouseLeave={() => setHoveredLink(false)}
        >
          ← Back to Admin
        </Link>
        <h1 style={styles.adminTitle}>MANAGE EMPLOYEES</h1>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoBoxText}>
          To add a new employee, have them create an account first. Then find their profile
          in the users list and change their role to Employee or Admin.
        </p>
      </div>

      <div style={styles.employeesList}>
        <h2 style={styles.employeesListHeading}>Current Staff ({employees.length})</h2>
        {employees.length === 0 ? (
          <div style={styles.empty}>No employees found</div>
        ) : (
          employees.map((employee, index) => (
            <div
              key={employee.id}
              style={index === employees.length - 1 ? styles.employeeItemLast : styles.employeeItem}
            >
              <div style={styles.employeeInfo}>
                <span style={styles.employeeName}>{employee.full_name || 'No name'}</span>
                <span style={styles.employeePhone}>{employee.phone || 'No phone'}</span>
              </div>
              <div style={styles.employeeActions}>
                <select
                  value={employee.role}
                  onChange={(e) => updateRole(employee.id, e.target.value as any)}
                  disabled={updating === employee.id}
                  style={styles.roleSelect}
                >
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <span style={getRoleBadgeStyle(employee.role)}>
                {employee.role}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
