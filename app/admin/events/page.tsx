'use client'

import { useState, useEffect, CSSProperties } from 'react'
import Link from 'next/link'
import { Event, TicketType } from '@/types/database'

interface EventWithTicketTypes extends Event {
  ticket_types: TicketType[]
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: '1200px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '22px',
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
    transition: 'all 0.2s',
  },
  titleWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontFamily: "var(--font-display), 'Bebas Neue', sans-serif",
    fontSize: '2.3rem',
    color: '#fff',
    letterSpacing: '0.08em',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.95rem',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  ghostButton: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #262630',
    background: 'rgba(255,255,255,0.02)',
    color: '#e5e7eb',
    cursor: 'pointer',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
  },
  panel: {
    borderRadius: '16px',
    border: '1px solid #1f1f25',
    background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
    padding: '18px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px',
  },
  panelTitle: {
    color: '#f8fafc',
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  panelSubtitle: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    marginBottom: '12px',
  },
  tag: {
    padding: '8px 10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #262630',
    borderRadius: '10px',
    color: '#cbd5e1',
    fontSize: '0.85rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px 14px',
    marginBottom: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#a1a1aa',
    fontSize: '0.9rem',
  },
  input: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #262630',
    background: '#0f1014',
    color: '#f4f4f5',
  },
  textarea: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #262630',
    background: '#0f1014',
    color: '#f4f4f5',
    minHeight: '96px',
  },
  imagePreviewWrap: {
    marginBottom: '12px',
  },
  imagePreview: {
    width: '100%',
    height: '160px',
    borderRadius: '12px',
    objectFit: 'cover' as const,
    border: '1px solid #262630',
  },
  imagePlaceholder: {
    width: '100%',
    height: '160px',
    borderRadius: '12px',
    border: '1px dashed #262630',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4b5563',
    fontSize: '0.9rem',
  },
  sectionDivider: {
    margin: '14px 0 10px',
    color: '#9ca3af',
    fontWeight: 600,
  },
  ticketCard: {
    border: '1px solid #262630',
    borderRadius: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    marginBottom: '8px',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
  },
  ticketRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  perksInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #262630',
    background: '#0f1014',
    color: '#f4f4f5',
    marginTop: '8px',
  },
  removeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: '1px solid #ef4444',
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '1.1rem',
  },
  addTypeBtn: {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px dashed #262630',
    background: 'transparent',
    color: '#a1a1aa',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center' as const,
    marginTop: '6px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '10px',
  },
  submitBtnDisabled: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
    color: '#fff',
    fontWeight: 700,
    opacity: 0.6,
    cursor: 'not-allowed',
    marginTop: '10px',
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },
  eventCard: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '16px',
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid #1f1f25',
    background: 'linear-gradient(120deg, rgba(255,255,255,0.025), rgba(255,255,255,0.015))',
    alignItems: 'center',
  },
  eventInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  eventTitle: {
    color: '#fff',
    fontSize: '1.05rem',
    fontWeight: 700,
  },
  eventDate: {
    color: '#9ca3af',
    fontSize: '0.92rem',
  },
  badges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  badge: {
    padding: '8px 10px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#10b981',
    fontSize: '0.85rem',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  badgeMuted: {
    padding: '8px 10px',
    borderRadius: '12px',
    background: 'rgba(148, 163, 184, 0.12)',
    color: '#cbd5e1',
    fontSize: '0.85rem',
    border: '1px solid rgba(148, 163, 184, 0.25)',
  },
  stats: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'flex-end',
  },
  statValue: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  },
  empty: {
    padding: '24px',
    textAlign: 'center',
    color: '#9ca3af',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#9ca3af',
  },
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventWithTicketTypes[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    image_url: '',
    ticketTypes: [
      { name: 'General', price: 25, description: 'General admission', perks: ['Entry access'], quantity_available: 100 },
    ],
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Edit state
  const [editingEvent, setEditingEvent] = useState<EventWithTicketTypes | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    image_url: '',
    is_active: true,
  })
  const [editUploading, setEditUploading] = useState(false)
  const [editSaving, setEditSaving] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }))
      } else {
        alert(data.error || 'Error subiendo imagen')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error subiendo imagen')
    } finally {
      setUploading(false)
    }
  }

  // Edit functions
  const startEditing = (event: EventWithTicketTypes) => {
    const eventDate = new Date(event.date)
    setEditingEvent(event)
    setEditForm({
      title: event.title,
      description: event.description || '',
      date: eventDate.toISOString().split('T')[0],
      time: eventDate.toTimeString().slice(0, 5),
      image_url: event.image_url || '',
      is_active: event.is_active,
    })
  }

  const cancelEditing = () => {
    setEditingEvent(null)
    setEditForm({
      title: '',
      description: '',
      date: '',
      time: '',
      image_url: '',
      is_active: true,
    })
  }

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setEditUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setEditForm((prev) => ({ ...prev, image_url: data.url }))
      } else {
        alert(data.error || 'Error subiendo imagen')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error subiendo imagen')
    } finally {
      setEditUploading(false)
    }
  }

  const deleteEditImage = async () => {
    if (!editForm.image_url) return

    // Only delete from Supabase if it's a Supabase URL
    if (editForm.image_url.includes('supabase')) {
      try {
        const res = await fetch(`/api/upload?url=${encodeURIComponent(editForm.image_url)}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          console.error('Error deleting image from storage')
        }
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }

    setEditForm((prev) => ({ ...prev, image_url: '' }))
  }

  const saveEdit = async () => {
    if (!editingEvent) return

    setEditSaving(true)
    try {
      const eventDate = new Date(`${editForm.date}T${editForm.time}`)

      // If image changed and old image was from Supabase, delete old image
      if (editingEvent.image_url && editingEvent.image_url !== editForm.image_url && editingEvent.image_url.includes('supabase')) {
        try {
          await fetch(`/api/upload?url=${encodeURIComponent(editingEvent.image_url)}`, {
            method: 'DELETE',
          })
        } catch (error) {
          console.error('Error deleting old image:', error)
        }
      }

      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          title: editForm.title,
          description: editForm.description,
          date: eventDate.toISOString(),
          image_url: editForm.image_url || null,
          is_active: editForm.is_active,
        }),
      })

      if (res.ok) {
        cancelEditing()
        fetchEvents()
      } else {
        const error = await res.json()
        alert(error.error || 'Error actualizando evento')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error actualizando evento')
    } finally {
      setEditSaving(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchEvents(controller.signal)
    return () => controller.abort()
  }, [])

  const fetchEvents = async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/events', { signal })
      const data = await res.json()
      if (Array.isArray(data)) {
        setEvents(data)
      } else {
        setEvents([])
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const eventDate = new Date(`${formData.date}T${formData.time}`)

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: eventDate.toISOString(),
          image_url: formData.image_url || null,
          ticket_types: formData.ticketTypes.map((tt) => ({
            name: tt.name,
            price: parseFloat(tt.price.toString()),
            description: tt.description,
            perks: tt.perks,
            quantity_available: parseInt(tt.quantity_available.toString()),
          })),
        }),
      })

      if (res.ok) {
        setShowForm(true)
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          image_url: '',
          ticketTypes: [
            { name: 'General', price: 25, description: 'General admission', perks: ['Entry access'], quantity_available: 100 },
          ],
        })
        fetchEvents()
      } else {
        const error = await res.json()
        alert(error.error || 'Error creating event')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating event')
    } finally {
      setSaving(false)
    }
  }

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        { name: '', price: 0, description: '', perks: [], quantity_available: 50 },
      ],
    }))
  }

  const updateTicketType = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((tt, i) =>
        i === index ? { ...tt, [field]: value } : tt
      ),
    }))
  }

  const removeTicketType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return <div style={styles.loading}>Cargando eventos...</div>
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div style={styles.titleWrap}>
          <Link href="/admin" style={styles.backLink}>← Regresar</Link>
          <div>
            <h1 style={styles.title}>Eventos y aforo</h1>
            <p style={styles.subtitle}>Publica, edita y monitorea todas las fechas desde un panel más claro.</p>
          </div>
        </div>
        <div style={styles.actions}>
          <button onClick={() => setShowForm((s) => !s)} style={styles.ghostButton}>
            {showForm ? 'Ocultar creación' : 'Nuevo evento'}
          </button>
        </div>
      </div>

      <div style={styles.layout}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Zona de creación</h2>
              <p style={styles.panelSubtitle}>Define detalles y tipos de boleto para publicar al instante.</p>
            </div>
            <span style={styles.tag}>{formData.ticketTypes.length} tipo(s) de boleto</span>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit}>
              {/* Image Section */}
              <div style={styles.imagePreviewWrap}>
                {/* Preview */}
                {formData.image_url ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={styles.imagePreview}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: '' }))}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="image-upload" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'block' }}>
                      <div style={styles.imagePlaceholder}>
                        {uploading ? '⏳ Subiendo...' : '📷 Haz clic para subir imagen'}
                      </div>
                    </label>
                  </>
                )}
                {/* URL Input */}
                {!formData.image_url && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ flex: 1, height: '1px', background: '#262630' }} />
                      <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>o pega una URL</span>
                      <div style={{ flex: 1, height: '1px', background: '#262630' }} />
                    </div>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Ej: Neon Nights"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fecha *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hora *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.textarea}
                  placeholder="Describe el evento..."
                  rows={3}
                />
              </div>

              <h3 style={styles.sectionDivider}>Tipos de boleto</h3>
              {formData.ticketTypes.map((tt, index) => (
                <div key={index} style={styles.ticketCard}>
                  <div style={styles.ticketHeader}>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Tipo {index + 1}</span>
                    {formData.ticketTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketType(index)}
                        style={styles.removeBtn}
                        aria-label="Eliminar tipo"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div style={styles.ticketGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Nombre</label>
                      <input
                        type="text"
                        placeholder="Ej: VIP, General"
                        value={tt.name}
                        onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                        required
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.ticketRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Precio ($)</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={tt.price}
                          onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Cantidad</label>
                        <input
                          type="number"
                          placeholder="100"
                          value={tt.quantity_available}
                          onChange={(e) => updateTicketType(index, 'quantity_available', e.target.value)}
                          min="1"
                          required
                          style={styles.input}
                        />
                      </div>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Beneficios (separados por coma)</label>
                      <input
                        type="text"
                        placeholder="Acceso VIP, Bebida gratis, Mesa reservada"
                        value={tt.perks.join(', ')}
                        onChange={(e) => updateTicketType(index, 'perks', e.target.value.split(',').map((s) => s.trim()))}
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addTicketType} style={styles.addTypeBtn}>
                + Añadir tipo
              </button>

              <button type="submit" disabled={saving} style={saving ? styles.submitBtnDisabled : styles.submitBtn}>
                {saving ? 'Creando...' : 'Crear evento'}
              </button>
            </form>
          )}
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Eventos publicados</h2>
              <p style={styles.panelSubtitle}>Aforo y estado en tiempo real.</p>
            </div>
            <span style={styles.tag}>{events.length} eventos</span>
          </div>

          <div style={styles.eventsList}>
            {events.length === 0 && (
              <div style={styles.empty}>Aún no hay eventos creados.</div>
            )}

            {events.map((event) => {
              const eventDate = new Date(event.date)
              const totalSold = event.ticket_types.reduce((sum, tt) => sum + tt.quantity_sold, 0)
              const totalAvailable = event.ticket_types.reduce((sum, tt) => sum + tt.quantity_available, 0)

              return (
                <div key={event.id} style={styles.eventCard}>
                  <div style={styles.eventInfo}>
                    <span style={styles.eventTitle}>{event.title}</span>
                    <span style={styles.eventDate}>
                      {eventDate.toLocaleDateString('es-ES', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div style={styles.badges}>
                      <span style={event.is_active ? styles.badge : styles.badgeMuted}>
                        {event.is_active ? 'Activo' : 'Pausado'}
                      </span>
                      <span style={styles.badgeMuted}>
                        {event.ticket_types.length} tipos de boleto
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={styles.stats}>
                      <div style={styles.statItem}>
                        <span style={styles.statValue}>{totalSold}</span>
                        <span style={styles.statLabel}>Vendidos</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statValue}>{totalAvailable - totalSold}</span>
                        <span style={styles.statLabel}>Disponibles</span>
                      </div>
                    </div>
                    <button
                      onClick={() => startEditing(event)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #262630',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#e5e7eb',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => e.target === e.currentTarget && cancelEditing()}
        >
          <div
            style={{
              background: '#0c0c0e',
              borderRadius: '16px',
              border: '1px solid #1f1f25',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>Editar evento</h2>
              <button
                onClick={cancelEditing}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Image Section */}
            <div style={styles.imagePreviewWrap}>
              {editForm.image_url ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={editForm.image_url}
                    alt="Preview"
                    style={styles.imagePreview}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={deleteEditImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Eliminar imagen
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    id="edit-image-upload"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="edit-image-upload" style={{ cursor: editUploading ? 'wait' : 'pointer', display: 'block' }}>
                    <div style={styles.imagePlaceholder}>
                      {editUploading ? '⏳ Subiendo...' : '📷 Haz clic para subir imagen'}
                    </div>
                  </label>
                </>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Título *</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
                style={styles.input}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '12px 0' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha *</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Hora *</label>
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descripción</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                style={styles.textarea}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
              <label style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Estado:</label>
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: editForm.is_active ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                  background: editForm.is_active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  color: editForm.is_active ? '#10b981' : '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {editForm.is_active ? 'Activo' : 'Pausado'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={cancelEditing}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #262630',
                  background: 'transparent',
                  color: '#9ca3af',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                disabled={editSaving}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff1083 0%, #9b30ff 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: editSaving ? 'not-allowed' : 'pointer',
                  opacity: editSaving ? 0.6 : 1,
                }}
              >
                {editSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
