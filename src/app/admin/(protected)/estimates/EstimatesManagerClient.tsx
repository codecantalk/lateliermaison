'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './estimates.module.css'
import {
  Calculator,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  Trash2,
  Printer,
  Mail,
  Phone,
  DollarSign,
  Download,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react'

export default function EstimatesManagerClient({ initialEstimates = [] }: { initialEstimates: any[] }) {
  const [estimates, setEstimates] = useState<any[]>(initialEstimates)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [inspectEstimate, setInspectEstimate] = useState<any | null>(null)
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const supabase = createClient()

  // Real-time synchronization
  useEffect(() => {
    const channel = supabase
      .channel('cms:estimates-mgmt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEstimates((prev) => [payload.new, ...prev.filter((e) => e.id !== payload.new.id)])
          triggerAlert(`✦ New Estimate Generated: $${payload.new.total_price} from ${payload.new.customer_name || 'Prospect'}!`)
        } else if (payload.eventType === 'UPDATE') {
          setEstimates((prev) => prev.map((e) => (e.id === payload.new.id ? payload.new : e)))
          if (inspectEstimate?.id === payload.new.id) setInspectEstimate(payload.new)
        } else if (payload.eventType === 'DELETE') {
          setEstimates((prev) => prev.filter((e) => e.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, inspectEstimate])

  const triggerAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type })
    setTimeout(() => setAlertMsg(null), 5000)
  }

  // Update Status
  const handleStatusChange = async (estimateId: string, newStatus: string) => {
    const prevEstimates = [...estimates]
    const prevInspect = inspectEstimate ? { ...inspectEstimate } : null

    // Optimistically update UI immediately for buttery smooth feel
    setEstimates(estimates.map((e) => (e.id === estimateId ? { ...e, status: newStatus } : e)))
    if (inspectEstimate?.id === estimateId) {
      setInspectEstimate({ ...inspectEstimate, status: newStatus })
    }

    try {
      const res = await fetch('/api/admin/estimates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: estimateId, status: newStatus }),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Status update failed')
      triggerAlert(`Estimate marked as ${newStatus}`)
    } catch (err: any) {
      // Rollback on failure
      setEstimates(prevEstimates)
      if (prevInspect) setInspectEstimate(prevInspect)
      triggerAlert(err.message || 'Error updating status', 'error')
    }
  }

  // Convert Estimate into an Order
  const handleConvertToOrder = async (estimate: any) => {
    if (!confirm(`Convert this estimate ($${estimate.total_price}) into an active Booking Order?`)) return

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: estimate.customer_name || 'Client',
          customerEmail: estimate.email || '',
          customerPhone: estimate.phone || '',
          serviceName: estimate.service_type || 'Custom Service',
          amount: estimate.total_price || 0,
          status: 'confirmed',
          details: estimate.details || {},
          sendReceiptEmail: true,
        }),
      })

      if (!res.ok) throw new Error('Failed to convert estimate to order')

      // Mark estimate as converted
      await handleStatusChange(estimate.id, 'converted')
      triggerAlert('✦ Successfully converted estimate into an active Booking Order!')
    } catch (err: any) {
      triggerAlert(err.message || 'Conversion error', 'error')
    }
  }

  // Delete Estimate
  const handleDeleteEstimate = async (estimateId: string) => {
    if (!confirm('Are you sure you want to delete this estimate?')) return

    try {
      const res = await fetch(`/api/admin/estimates?id=${estimateId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setEstimates(estimates.filter((e) => e.id !== estimateId))
      if (inspectEstimate?.id === estimateId) setInspectEstimate(null)
      triggerAlert('Estimate deleted.')
    } catch (err: any) {
      triggerAlert(err.message || 'Error deleting', 'error')
    }
  }

  // Print Formal Estimate Proposal
  const handlePrintProposal = (estimate: any) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Estimate Proposal - ${estimate.customer_name} - L'Atelier Maison</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 3rem; color: #1e293b; background: #ffffff; }
            .header { border-bottom: 2px solid #0B132B; padding-bottom: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 1.6rem; font-weight: bold; letter-spacing: 0.12em; color: #0B132B; text-transform: uppercase; }
            .title { font-size: 1.75rem; color: #0B132B; margin-top: 0.75rem; font-family: Georgia, serif; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
            .label { font-weight: 700; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
            .value { font-size: 1.05rem; margin-bottom: 1rem; color: #0f172a; }
            .price-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
            .price-total { font-size: 1.8rem; color: #b45309; font-weight: bold; }
            .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; font-family: monospace; font-size: 0.9rem; line-height: 1.6; }
            .footer { margin-top: 3.5rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem; font-size: 0.85rem; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">L'Atelier Maison</div>
              <div class="title">Formal Service Estimate Proposal</div>
            </div>
            <div style="text-align: right; font-size: 0.9rem; color: #64748b;">
              <div>Date Generated: ${new Date(estimate.created_at).toLocaleDateString()}</div>
              <div>Status: ${estimate.status.toUpperCase()}</div>
            </div>
          </div>
          
          <div class="grid">
            <div>
              <div class="label">Prospective Client</div>
              <div class="value"><strong>${estimate.customer_name || 'Client'}</strong></div>
              <div class="value">${estimate.email}<br/>${estimate.phone || 'No phone provided'}</div>
            </div>
            
            <div>
              <div class="label">Discipline / Service</div>
              <div class="value" style="text-transform: capitalize; font-weight: 600;">${estimate.service_type}</div>
              
              <div class="price-box">
                <div class="label">Calculated Estimate</div>
                <div class="price-total">$${Number(estimate.total_price).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div class="label">Calculation Specifications & Parameters</div>
          <div class="details-box">${typeof estimate.details === 'object' ? JSON.stringify(estimate.details, null, 2) : (estimate.details || 'Standard parameters')}</div>

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

  // Filter estimates
  const filteredEstimates = estimates.filter((e) => {
    const matchesSearch =
      (e.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.phone || '').includes(searchQuery) ||
      (e.service_type || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Export CSV
  const exportEstimatesCSV = () => {
    const headers = ['Date', 'Client Name', 'Email', 'Phone', 'Service', 'Estimated Price', 'Status']
    const rows = estimates.map((e) => [
      new Date(e.created_at).toLocaleDateString(),
      `"${e.customer_name || ''}"`,
      e.email,
      `"${e.phone || ''}"`,
      e.service_type,
      e.total_price,
      e.status,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `latelier_estimates_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // KPIs
  const totalCount = estimates.length
  const totalPipeline = estimates.reduce((sum, e) => sum + (Number(e.total_price) || 0), 0)
  const pendingCount = estimates.filter((e) => e.status === 'pending').length

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
          <h1>Estimate Submissions</h1>
          <p>Review customer quote calculations, property parameters, and convert leads into active orders.</p>
        </div>

        <button onClick={exportEstimatesCSV} className={styles.secondaryBtn}>
          <Download size={16} />
          Export Estimates CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Total Quotes Generated</div>
            <div className={styles.kpiValue}>{totalCount}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(11, 19, 43, 0.08)' }}>
            <Calculator size={22} color="#0B132B" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Pipeline Value</div>
            <div className={styles.kpiValue} style={{ color: '#b45309' }}>${totalPipeline.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <DollarSign size={22} color="#b45309" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Awaiting Follow-up</div>
            <div className={styles.kpiValue} style={{ color: '#1e40af' }}>{pendingCount}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
            <Clock size={22} color="#2563eb" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.statusPills}>
          {['all', 'pending', 'consulted', 'converted', 'archived'].map((st) => (
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
          {filteredEstimates.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Calculator size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem' }}>No Estimates Found</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Quotes generated on the Estimate Calculator will appear here in real time.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Calculated Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEstimates.map((estimate) => (
                  <tr key={estimate.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{new Date(estimate.created_at).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(estimate.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#0B132B' }}>{estimate.customer_name || 'Anonymous Client'}</div>
                      <div>
                        <a href={`mailto:${estimate.email}`} style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.85rem' }}>
                          {estimate.email}
                        </a>
                      </div>
                      {estimate.phone && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          <a href={`tel:${estimate.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {estimate.phone}
                          </a>
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{estimate.service_type}</div>
                      {estimate.details?.houseType && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>
                          Type: {estimate.details.houseType}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#b45309', fontSize: '1.1rem' }}>
                        ${Number(estimate.total_price).toFixed(2)}
                      </div>
                    </td>

                    <td>
                      <select
                        value={estimate.status || 'pending'}
                        onChange={(e) => handleStatusChange(estimate.id, e.target.value)}
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
                        <option value="consulted">Consulted</option>
                        <option value="converted">Converted to Order</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setInspectEstimate(estimate)}
                          title="View Estimate Dossier"
                          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handlePrintProposal(estimate)}
                          title="Print Estimate Proposal"
                          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => handleConvertToOrder(estimate)}
                          title="Convert to Active Order"
                          style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#16a34a' }}
                        >
                          <ShoppingBag size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteEstimate(estimate.id)}
                          title="Delete Estimate"
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

      {/* INSPECT ESTIMATE DOSSIER MODAL */}
      {inspectEstimate && (
        <div className={styles.overlay} onClick={() => setInspectEstimate(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c5a059', fontWeight: 700 }}>
                  Estimate Dossier
                </span>
                <h3 style={{ textTransform: 'capitalize' }}>{inspectEstimate.service_type} Quote</h3>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Submitted on {new Date(inspectEstimate.created_at).toLocaleString()}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setInspectEstimate(null)}>&times;</button>
            </div>

            <div className={styles.modalBody}>
              {/* Client Info Card */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: '#0B132B' }}>{inspectEstimate.customer_name || 'Anonymous Client'}</strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      <a href={`mailto:${inspectEstimate.email}`} style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                        <Mail size={14} /> {inspectEstimate.email}
                      </a>
                    </div>
                    {inspectEstimate.phone && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <a href={`tel:${inspectEstimate.phone}`} style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                          <Phone size={14} /> {inspectEstimate.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Calculated Total</div>
                    <div style={{ color: '#b45309', fontWeight: 700, fontSize: '1.6rem', fontFamily: 'var(--font-serif)' }}>
                      ${Number(inspectEstimate.total_price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications Payload */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Calculation Parameters & Selections
                </div>
                <pre style={{ margin: 0, fontSize: '0.85rem', fontFamily: 'monospace', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {typeof inspectEstimate.details === 'object' ? JSON.stringify(inspectEstimate.details, null, 2) : (inspectEstimate.details || 'Standard calculation parameters')}
                </pre>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => handlePrintProposal(inspectEstimate)} className={styles.secondaryBtn}>
                <Printer size={16} />
                Print Proposal
              </button>
              <button
                onClick={() => {
                  setInspectEstimate(null)
                  handleConvertToOrder(inspectEstimate)
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#0B132B',
                  color: '#ffffff',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag size={16} />
                Convert to Active Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
