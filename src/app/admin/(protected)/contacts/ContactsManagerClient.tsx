'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './contacts.module.css'
import ConfirmationModal from '@/components/admin/ConfirmationModal'
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  Trash2,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Download,
} from 'lucide-react'

export default function ContactsManagerClient({ initialContacts = [] }: { initialContacts: any[] }) {
  const [contacts, setContacts] = useState<any[]>(initialContacts)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [inspectContact, setInspectContact] = useState<any | null>(null)
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'primary' | 'danger'
    icon?: 'convert' | 'delete'
    details?: Array<{ label: string; value: React.ReactNode }>
    action: () => Promise<void>
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: async () => {},
  })

  const supabase = createClient()

  // Real-time synchronization
  useEffect(() => {
    const channel = supabase
      .channel('cms:contacts-mgmt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setContacts((prev) => [payload.new, ...prev.filter((c) => c.id !== payload.new.id)])
          triggerAlert(`✦ New Contact Form Submission from ${payload.new.full_name}!`)
        } else if (payload.eventType === 'UPDATE') {
          setContacts((prev) => prev.map((c) => (c.id === payload.new.id ? payload.new : c)))
          if (inspectContact?.id === payload.new.id) setInspectContact(payload.new)
        } else if (payload.eventType === 'DELETE') {
          setContacts((prev) => prev.filter((c) => c.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, inspectContact])

  const triggerAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type })
    setTimeout(() => setAlertMsg(null), 5000)
  }

  // Update Status
  const handleStatusChange = async (contactId: string, newStatus: string) => {
    const prevContacts = [...contacts]
    const prevInspect = inspectContact ? { ...inspectContact } : null

    // Optimistically update UI immediately
    setContacts(contacts.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c)))
    if (inspectContact?.id === contactId) {
      setInspectContact({ ...inspectContact, status: newStatus })
    }

    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId, status: newStatus }),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Status update failed')
      triggerAlert(`Inquiry marked as ${newStatus}`)
    } catch (err: any) {
      setContacts(prevContacts)
      if (prevInspect) setInspectContact(prevInspect)
      triggerAlert(err.message || 'Error updating status', 'error')
    }
  }

  // Request Delete Contact (opens luxury confirmation modal)
  const requestDeleteContact = (contact: any) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Inquiry',
      message: 'Are you sure you want to permanently delete this client inquiry? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      icon: 'delete',
      details: [
        { label: 'Client', value: contact.full_name },
        { label: 'Service', value: contact.service || 'General Inquiry' },
        { label: 'Date', value: new Date(contact.created_at).toLocaleDateString() },
      ],
      action: async () => {
        try {
          const res = await fetch(`/api/admin/contacts?id=${contact.id}`, { method: 'DELETE' })
          const resData = await res.json()
          if (!res.ok) throw new Error(resData.error || 'Failed to delete')
          setContacts((prev) => prev.filter((c) => c.id !== contact.id))
          if (inspectContact?.id === contact.id) setInspectContact(null)
          setConfirmModal((prev) => ({ ...prev, isOpen: false }))
          triggerAlert('Inquiry deleted.')
        } catch (err: any) {
          triggerAlert(err.message || 'Error deleting', 'error')
          throw err
        }
      },
    })
  }

  // Print Consultation Brief
  const handlePrintBrief = (contact: any) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Consultation Brief - ${contact.full_name} - L'Atelier Maison</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 3rem; color: #1e293b; background: #ffffff; }
            .header { border-bottom: 2px solid #0B132B; padding-bottom: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 1.6rem; font-weight: bold; letter-spacing: 0.12em; color: #0B132B; text-transform: uppercase; }
            .subtitle { font-size: 0.85rem; color: #c5a059; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin-top: 2px; }
            .title { font-size: 1.75rem; color: #0B132B; margin-top: 0.75rem; font-family: Georgia, serif; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
            .label { font-weight: 700; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
            .value { font-size: 1.05rem; margin-bottom: 1rem; color: #0f172a; }
            .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6; }
            .images { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
            .images img { max-width: 280px; max-height: 280px; object-fit: cover; border-radius: 8px; border: 1px solid #cbd5e1; }
            .footer { margin-top: 3.5rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem; font-size: 0.85rem; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">L'Atelier Maison</div>
              <div class="subtitle">Haute Artisan Home Services</div>
              <div class="title">Consultation Request Brief</div>
            </div>
            <div style="text-align: right; font-size: 0.9rem; color: #64748b;">
              <div>Date Submitted: ${new Date(contact.created_at).toLocaleString()}</div>
              <div>Status: ${contact.status.toUpperCase()}</div>
            </div>
          </div>
          
          <div class="grid">
            <div>
              <div class="label">Prospective Client</div>
              <div class="value"><strong>${contact.full_name}</strong></div>
              <div class="value">${contact.email}<br/>${contact.phone || 'No phone provided'}</div>
              
              ${contact.address ? `<div class="label">Property Address</div><div class="value">${contact.address}</div>` : ''}
            </div>
            
            <div>
              <div class="label">Requested Service</div>
              <div class="value" style="text-transform: capitalize; font-weight: 600;">${contact.service}</div>
              
              ${contact.budget ? `<div class="label">Estimated Budget</div><div class="value">${contact.budget}</div>` : ''}
              ${contact.timeline ? `<div class="label">Desired Timeline</div><div class="value">${contact.timeline}</div>` : ''}
            </div>
          </div>
          
          <div class="label">Project Scope & Client Message</div>
          <div class="details-box">${contact.details || 'No additional details provided.'}</div>

          ${contact.image_urls && contact.image_urls.length > 0 ? `
            <div class="label" style="margin-top: 1.5rem;">Uploaded Property Photos (${contact.image_urls.length})</div>
            <div class="images">
              ${contact.image_urls.map((url: string) => `<img src="${url}" alt="Property Photo" />`).join('')}
            </div>
          ` : ''}

          <div class="footer">
            L'Atelier Maison Concierge Desk &bull; order@lateliermaison.com &bull; support@lateliermaison.com
          </div>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 500)
  }

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      (c.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').includes(searchQuery) ||
      (c.service || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.address || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Export CSV
  const exportContactsCSV = () => {
    const headers = ['Date', 'Client Name', 'Email', 'Phone', 'Address', 'Service', 'Budget', 'Timeline', 'Status']
    const rows = contacts.map((c) => [
      new Date(c.created_at).toLocaleDateString(),
      `"${c.full_name}"`,
      c.email,
      `"${c.phone || ''}"`,
      `"${c.address || ''}"`,
      c.service,
      `"${c.budget || ''}"`,
      `"${c.timeline || ''}"`,
      c.status,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `latelier_contact_inquiries_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // KPIs
  const totalInquiries = contacts.length
  const pendingCount = contacts.filter((c) => c.status === 'pending').length
  const completedCount = contacts.filter((c) => c.status === 'completed' || c.status === 'contacted').length

  return (
    <div className={styles.container}>
      {/* Alert Banner */}
      {alertMsg && (
        <div style={{
          background: alertMsg.type === 'success' ? '#0f172a' : '#7f1d1d',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: alertMsg.type === 'success' ? '1px solid #c5a059' : '1px solid #ef4444',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: alertMsg.type === 'success' ? '#10b981' : '#f87171' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>&times;</button>
        </div>
      )}

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Contact Form Inquiries</h1>
          <p>Review bespoke consultation requests, attached property photos, and lead communications.</p>
        </div>

        <button onClick={exportContactsCSV} className={styles.secondaryBtn}>
          <Download size={16} />
          Export Inquiries CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Total Submissions</div>
            <div className={styles.kpiValue}>{totalInquiries}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(11, 19, 43, 0.08)' }}>
            <MessageSquare size={22} color="#0B132B" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Pending Review</div>
            <div className={styles.kpiValue} style={{ color: '#b45309' }}>{pendingCount}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <Clock size={22} color="#b45309" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Actioned / Contacted</div>
            <div className={styles.kpiValue} style={{ color: '#15803d' }}>{completedCount}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle2 size={22} color="#10b981" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.statusPills}>
          {['all', 'pending', 'contacted', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`${styles.statusPill} ${statusFilter === st ? styles.statusPillActive : ''}`}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {filteredContacts.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <MessageSquare size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem' }}>No Inquiries Found</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Form submissions from the public Contact page will appear here in real time.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Service Requested</th>
                  <th>Location / Timeline</th>
                  <th>Photos</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{new Date(contact.created_at).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(contact.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#0B132B' }}>{contact.full_name}</div>
                      <div>
                        <a href={`mailto:${contact.email}`} style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.85rem' }}>
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          <a href={`tel:${contact.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {contact.phone}
                          </a>
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{contact.service}</div>
                      {contact.budget && <div style={{ fontSize: '0.78rem', color: '#b45309' }}>Budget: {contact.budget}</div>}
                    </td>

                    <td>
                      {contact.address && (
                        <div style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={12} color="#94a3b8" /> {contact.address}
                        </div>
                      )}
                      {contact.timeline && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          Timeline: {contact.timeline}
                        </div>
                      )}
                    </td>

                    <td>
                      {contact.image_urls && contact.image_urls.length > 0 ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                          <ImageIcon size={14} /> {contact.image_urls.length} photo{contact.image_urls.length !== 1 ? 's' : ''}
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>None</span>
                      )}
                    </td>

                    <td>
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '20px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: '#ffffff',
                          color: '#1e293b',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setInspectContact(contact)}
                          title="View Full Inquiry Dossier"
                          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handlePrintBrief(contact)}
                          title="Print Consultation Brief"
                          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => requestDeleteContact(contact)}
                          title="Delete Submission"
                          style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* INSPECT CONTACT DOSSIER MODAL */}
      {inspectContact && (
        <div className={styles.overlay} onClick={() => setInspectContact(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c5a059', fontWeight: 700 }}>
                  Consultation Request
                </span>
                <h3 style={{ textTransform: 'capitalize' }}>{inspectContact.service} Inquiry</h3>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Submitted on {new Date(inspectContact.created_at).toLocaleString()}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setInspectContact(null)}>&times;</button>
            </div>

            <div className={styles.modalBody}>
              {/* Client Info Card */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: '#0B132B' }}>{inspectContact.full_name}</strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      <a href={`mailto:${inspectContact.email}`} style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                        <Mail size={14} /> {inspectContact.email}
                      </a>
                    </div>
                    {inspectContact.phone && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <a href={`tel:${inspectContact.phone}`} style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                          <Phone size={14} /> {inspectContact.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
                    <div style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.95rem' }}>{inspectContact.address || 'Not provided'}</div>
                    {inspectContact.budget && <div style={{ color: '#b45309', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>Budget: {inspectContact.budget}</div>}
                    {inspectContact.timeline && <div style={{ color: '#64748b', fontSize: '0.82rem' }}>Timeline: {inspectContact.timeline}</div>}
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Client Message & Project Scope
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {inspectContact.details || 'No message details provided.'}
                </p>
              </div>

              {/* Photos Gallery */}
              {inspectContact.image_urls && inspectContact.image_urls.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Attached Photos ({inspectContact.image_urls.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {inspectContact.image_urls.map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <img src={url} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => handlePrintBrief(inspectContact)} className={styles.secondaryBtn}>
                <Printer size={16} />
                Print Brief
              </button>
              <a
                href={`mailto:${inspectContact.email}?subject=Consultation Follow-up: L'Atelier Maison&body=Hello ${inspectContact.full_name},`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#0B132B',
                  color: '#ffffff',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <Mail size={16} />
                Reply by Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* LUXURY CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.action}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        variant={confirmModal.variant}
        icon={confirmModal.icon}
        details={confirmModal.details}
      />
    </div>
  )
}
