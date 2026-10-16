'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './orders.module.css'
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Download,
  AlertCircle,
  FileText,
} from 'lucide-react'

export default function OrdersManagerClient({ initialOrders = [] }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  
  // Modals state
  const [inspectOrder, setInspectOrder] = useState<any | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editOrder, setEditOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    serviceName: 'House Cleaning',
    amount: '',
    status: 'confirmed',
    scheduledDate: '',
    bedrooms: '3',
    bathrooms: '2.5',
    houseType: 'single-family',
    extras: [] as string[],
    internalNotes: '',
    sendReceiptEmail: true,
  })

  const supabase = createClient()

  // Real-time synchronization
  useEffect(() => {
    const channel = supabase
      .channel('cms:orders-mgmt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders((prev) => [payload.new, ...prev.filter((o) => o.id !== payload.new.id)])
          triggerAlert(`✦ New Order Received: $${payload.new.amount} from ${payload.new.customer_name}`, 'success')
        } else if (payload.eventType === 'UPDATE') {
          setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? payload.new : o)))
          if (inspectOrder?.id === payload.new.id) setInspectOrder(payload.new)
        } else if (payload.eventType === 'DELETE') {
          setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, inspectOrder])

  const triggerAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type })
    setTimeout(() => setAlertMsg(null), 5000)
  }

  // Quick Status Update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Status update failed')
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
      if (inspectOrder?.id === orderId) {
        setInspectOrder({ ...inspectOrder, status: newStatus })
      }
      triggerAlert(`Order marked as ${newStatus}`)
    } catch (err: any) {
      triggerAlert(err.message || 'Error updating status', 'error')
    }
  }

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      serviceName: 'Luxury House Cleaning',
      amount: '350',
      status: 'confirmed',
      scheduledDate: '',
      bedrooms: '3',
      bathrooms: '2.5',
      houseType: 'single-family',
      extras: ['deep-cleaning'],
      internalNotes: '',
      sendReceiptEmail: true,
    })
    setModalMode('create')
  }

  // Open Edit Modal
  const openEditModal = (order: any) => {
    setEditOrder(order)
    const details = order.details || {}
    setFormData({
      customerName: order.customer_name || '',
      customerEmail: order.customer_email || '',
      customerPhone: order.customer_phone || '',
      address: order.address || details.address || '',
      serviceName: order.service_name || 'House Cleaning',
      amount: String(order.amount || ''),
      status: order.status || 'confirmed',
      scheduledDate: order.scheduled_date ? new Date(order.scheduled_date).toISOString().slice(0, 16) : '',
      bedrooms: details.bedrooms || '3',
      bathrooms: details.bathrooms || '2',
      houseType: details.houseType || 'single-family',
      extras: Array.isArray(details.extras) ? details.extras : [],
      internalNotes: order.internal_notes || details.internalNotes || '',
      sendReceiptEmail: false,
    })
    setModalMode('edit')
  }

  // Submit Create or Edit
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        id: editOrder?.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: formData.address,
        serviceName: formData.serviceName,
        amount: Number(formData.amount) || 0,
        status: formData.status,
        scheduledDate: formData.scheduledDate || null,
        internalNotes: formData.internalNotes,
        details: {
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          houseType: formData.houseType,
          extras: formData.extras,
          address: formData.address,
        },
        sendReceiptEmail: formData.sendReceiptEmail,
      }

      if (modalMode === 'create') {
        const res = await fetch('/api/admin/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to create order')
        setOrders([data.order, ...orders])
        triggerAlert('✦ New order created & customer record synchronized!')
      } else {
        const res = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update order')
        setOrders(orders.map((o) => (o.id === data.order.id ? data.order : o)))
        if (inspectOrder?.id === data.order.id) setInspectOrder(data.order)
        triggerAlert('Order updated successfully.')
      }

      setModalMode(null)
    } catch (err: any) {
      triggerAlert(err.message || 'Operation failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to permanently delete this order?')) return

    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete order')
      setOrders(orders.filter((o) => o.id !== orderId))
      if (inspectOrder?.id === orderId) setInspectOrder(null)
      triggerAlert('Order deleted.')
    } catch (err: any) {
      triggerAlert(err.message || 'Error deleting order', 'error')
    }
  }

  // Print Luxury Invoice
  const handlePrintReceipt = (order: any) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Invoice #${order.stripe_session_id ? order.stripe_session_id.slice(-8).toUpperCase() : order.id.slice(0, 8).toUpperCase()} - L'Atelier Maison</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 3rem; color: #1e293b; background: #ffffff; }
            .header { border-bottom: 2px solid #0B132B; padding-bottom: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 1.6rem; font-weight: bold; letter-spacing: 0.12em; color: #0B132B; text-transform: uppercase; }
            .subtitle { font-size: 0.85rem; color: #c5a059; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin-top: 2px; }
            .title { font-size: 1.75rem; color: #0B132B; margin-top: 0.75rem; font-family: Georgia, serif; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
            .label { font-weight: 700; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
            .value { font-size: 1.05rem; margin-bottom: 1rem; color: #0f172a; }
            .price-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
            .price-total { font-size: 1.8rem; color: #b45309; font-weight: bold; }
            .footer { margin-top: 3.5rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem; font-size: 0.85rem; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">L'Atelier Maison</div>
              <div class="subtitle">Haute Artisan Home Services</div>
              <div class="title">Service Order & Invoice Receipt</div>
            </div>
            <div style="text-align: right; font-size: 0.9rem; color: #64748b;">
              <div>Date: ${new Date(order.created_at).toLocaleDateString()}</div>
              <div>Ref: ${order.stripe_session_id ? order.stripe_session_id.slice(-10).toUpperCase() : order.id.slice(0, 8).toUpperCase()}</div>
              <div style="margin-top: 4px; font-weight: 600; color: #10b981; text-transform: uppercase;">Status: ${order.status}</div>
            </div>
          </div>
          
          <div class="grid">
            <div>
              <div class="label">Client Information</div>
              <div class="value"><strong>${order.customer_name}</strong></div>
              <div class="value">${order.customer_email}<br/>${order.customer_phone || ''}</div>
              
              ${order.address ? `<div class="label">Service Location</div><div class="value">${order.address}</div>` : ''}
              ${order.scheduled_date ? `<div class="label">Scheduled Appointment</div><div class="value">${new Date(order.scheduled_date).toLocaleString()}</div>` : ''}
            </div>
            
            <div>
              <div class="label">Discipline / Service</div>
              <div class="value" style="font-weight: 600;">${order.service_name}</div>

              <div class="price-box">
                <div class="label">Total Amount Paid / Authorized</div>
                <div class="price-total">$${Number(order.amount).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div class="label">Order Specifications & Scope</div>
          <div class="value" style="white-space: pre-wrap; background: #f8fafc; padding: 1.25rem; border-radius: 6px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 0.9rem;">${typeof order.details === 'object' ? JSON.stringify(order.details, null, 2) : (order.details || 'Standard luxury service scope')}</div>

          ${order.internal_notes ? `
            <div class="label" style="margin-top: 1.5rem;">Concierge Instructions</div>
            <div class="value" style="background: #fffbeb; padding: 1rem; border-radius: 6px; border-left: 4px solid #f59e0b; color: #78350f;">${order.internal_notes}</div>
          ` : ''}

          <div class="footer">
            L'Atelier Maison Concierge Desk &bull; order@lateliermaison.com &bull; support@lateliermaison.com<br/>
            Serving Atlanta, GA and the DMV Corridor
          </div>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 500)
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Service', 'Amount', 'Status']
    const rows = orders.map((o) => [
      o.stripe_session_id || o.id,
      new Date(o.created_at).toLocaleDateString(),
      `"${o.customer_name}"`,
      o.customer_email,
      `"${o.customer_phone || ''}"`,
      `"${o.service_name}"`,
      o.amount,
      o.status,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `latelier_orders_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_phone || '').includes(searchQuery) ||
      (order.service_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.stripe_session_id || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesService = serviceFilter === 'all' || (order.service_name || '').toLowerCase().includes(serviceFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesService
  })

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
  const confirmedCount = orders.filter((o) => o.status === 'confirmed' || o.status === 'paid').length
  const completedCount = orders.filter((o) => o.status === 'completed').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return <span className={styles.badgeConfirmed}><CheckCircle2 size={12} /> {status}</span>
      case 'in_progress':
        return <span className={styles.badgeInProgress}><Clock size={12} /> in progress</span>
      case 'completed':
        return <span className={styles.badgeSuccess}><CheckCircle2 size={12} /> completed</span>
      case 'cancelled':
        return <span className={styles.badgeCancelled}>&times; cancelled</span>
      default:
        return <span className={styles.badgePending}><Clock size={12} /> {status || 'pending'}</span>
    }
  }

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
          <h1>Orders & Bookings</h1>
          <p>Full control over client reservations, payments, and scheduled service fulfillment.</p>
        </div>

        <div className={styles.actionBtns}>
          <button onClick={exportToCSV} className={styles.secondaryBtn}>
            <Download size={16} />
            Export CSV
          </button>
          <button onClick={openCreateModal} className={styles.primaryBtn}>
            <Plus size={18} />
            New Booking Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Total Bookings</div>
            <div className={styles.kpiValue}>{orders.length}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(11, 19, 43, 0.08)' }}>
            <ShoppingBag size={22} color="#0B132B" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Gross Volume</div>
            <div className={styles.kpiValue} style={{ color: '#b45309' }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <DollarSign size={22} color="#b45309" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Confirmed / Active</div>
            <div className={styles.kpiValue} style={{ color: '#1e40af' }}>{confirmedCount}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
            <Clock size={22} color="#2563eb" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Completed Jobs</div>
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
            placeholder="Search by client, email, phone, reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.statusPills}>
          {['all', 'confirmed', 'in_progress', 'completed', 'cancelled', 'pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`${styles.statusPill} ${statusFilter === st ? styles.statusPillActive : ''}`}
            >
              {st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {filteredOrders.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <ShoppingBag size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem' }}>No Orders Found</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Try adjusting your search filters or click "New Booking Order" to manually create one.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Service Discipline</th>
                  <th>Amount</th>
                  <th>Scheduled For</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                        {order.stripe_session_id ? order.stripe_session_id.slice(-8).toUpperCase() : order.id.slice(0, 8).toUpperCase()}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#0B132B' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{order.customer_email}</div>
                      {order.customer_phone && <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{order.customer_phone}</div>}
                    </td>

                    <td>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>{order.service_name}</div>
                      {order.address && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          <MapPin size={12} /> {order.address}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#b45309', fontSize: '1.1rem' }}>
                        ${Number(order.amount).toFixed(2)}
                      </div>
                    </td>

                    <td>
                      {order.scheduled_date ? (
                        <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>
                          {new Date(order.scheduled_date).toLocaleDateString()}
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(order.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Unscheduled</span>
                      )}
                    </td>

                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
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
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setInspectOrder(order)}
                          title="View Full Order Dossier"
                          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(order)}
                          title="Print Luxury Invoice"
                          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => openEditModal(order)}
                          title="Edit Order"
                          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Delete Order"
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

      {/* INSPECT ORDER DRAWER / MODAL */}
      {inspectOrder && (
        <div className={styles.overlay} onClick={() => setInspectOrder(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c5a059', fontWeight: 700 }}>
                  Order Dossier
                </span>
                <h3>{inspectOrder.service_name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>
                  Ref: {inspectOrder.stripe_session_id || inspectOrder.id}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setInspectOrder(null)}>&times;</button>
            </div>

            <div className={styles.modalBody}>
              {/* Client Card */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Client Profile
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.92rem' }}>
                  <div>
                    <strong style={{ color: '#0B132B' }}>{inspectOrder.customer_name}</strong>
                    <div style={{ color: '#475569', marginTop: '0.2rem' }}>{inspectOrder.customer_email}</div>
                    <div style={{ color: '#475569' }}>{inspectOrder.customer_phone || 'No phone recorded'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.82rem' }}>Location:</div>
                    <div style={{ color: '#1e293b' }}>{inspectOrder.address || 'Address on file with concierge'}</div>
                  </div>
                </div>
              </div>

              {/* Status and Financials */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: '#fafaf9', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e7e5e4' }}>
                  <div style={{ fontSize: '0.8rem', color: '#78716c', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Payment & Amount
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#b45309', fontFamily: 'var(--font-serif)' }}>
                    ${Number(inspectOrder.amount).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>
                    Status: {inspectOrder.status.toUpperCase()}
                  </div>
                </div>

                <div style={{ background: '#fafaf9', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e7e5e4' }}>
                  <div style={{ fontSize: '0.8rem', color: '#78716c', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Appointment Timing
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>
                    {inspectOrder.scheduled_date ? new Date(inspectOrder.scheduled_date).toLocaleString() : 'Pending Scheduling'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                    Booked On: {new Date(inspectOrder.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Specifications Payload */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Service Specifications
                </div>
                <pre style={{ margin: 0, fontSize: '0.85rem', fontFamily: 'monospace', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {typeof inspectOrder.details === 'object' ? JSON.stringify(inspectOrder.details, null, 2) : (inspectOrder.details || 'Standard service scope')}
                </pre>
              </div>

              {/* Concierge Notes */}
              {inspectOrder.internal_notes && (
                <div style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b', color: '#78350f' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>Internal Staff Instructions</div>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{inspectOrder.internal_notes}</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => handlePrintReceipt(inspectOrder)} className={styles.secondaryBtn}>
                <Printer size={16} />
                Print Invoice
              </button>
              <button
                onClick={() => {
                  setInspectOrder(null)
                  openEditModal(inspectOrder)
                }}
                className={styles.primaryBtn}
              >
                <Edit2 size={16} />
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ORDER MODAL */}
      {modalMode && (
        <div className={styles.overlay} onClick={() => setModalMode(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalMode === 'create' ? 'Create New Booking Order' : 'Edit Order Details'}</h3>
              <button className={styles.closeBtn} onClick={() => setModalMode(null)}>&times;</button>
            </div>

            <form onSubmit={handleSaveOrder}>
              <div className={styles.modalBody}>
                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label>Client Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Katherine Vance"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Client Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="client@luxuryestate.com"
                    />
                  </div>
                </div>

                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="(404) 555-0199"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Property Address / ZIP</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="3450 Tuxedo Rd NW, Atlanta GA"
                    />
                  </div>
                </div>

                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label>Service Discipline *</label>
                    <select
                      value={formData.serviceName}
                      onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    >
                      <option value="Luxury House Cleaning">Luxury House Cleaning</option>
                      <option value="Deep Architectural Cleaning">Deep Architectural Cleaning</option>
                      <option value="Bespoke Home Remodeling">Bespoke Home Remodeling</option>
                      <option value="High-End Interior Painting">High-End Interior Painting</option>
                      <option value="Artisan TV & Media Mounting">Artisan TV & Media Mounting</option>
                      <option value="Estate Care & Management">Estate Care & Management</option>
                      <option value="Custom Bespoke Project">Custom Bespoke Project</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Investment Amount ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="350.00"
                    />
                  </div>
                </div>

                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label>Order Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed / Paid</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Appointment Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Internal Concierge Instructions (Access Codes, Pets, Key handover)</label>
                  <textarea
                    rows={3}
                    value={formData.internalNotes}
                    onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                    placeholder="Gate code #4490. Key in lockbox under portico. Friendly golden retriever on site."
                  />
                </div>

                {modalMode === 'create' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.sendReceiptEmail}
                      onChange={(e) => setFormData({ ...formData, sendReceiptEmail: e.target.checked })}
                    />
                    <span>Dispatch luxury confirmation receipt email to client via Zoho ZeptoMail</span>
                  </label>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setModalMode(null)} className={styles.secondaryBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className={styles.primaryBtn}>
                  {loading ? 'Saving...' : modalMode === 'create' ? 'Create & Confirm Order' : 'Update Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
