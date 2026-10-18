'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './customers.module.css'
import ConfirmationModal from '@/components/admin/ConfirmationModal'
import {
  Users,
  DollarSign,
  Crown,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Download,
  Calculator,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'

export default function CustomersManagerClient({
  initialCustomers = [],
  initialOrders = [],
  initialContacts = [],
  initialLeads = [],
}: {
  initialCustomers: any[]
  initialOrders: any[]
  initialContacts: any[]
  initialLeads?: any[]
}) {
  const [customers, setCustomers] = useState<any[]>(initialCustomers)
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [contacts, setContacts] = useState<any[]>(initialContacts)
  const [leads, setLeads] = useState<any[]>(initialLeads)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  
  // Modals state
  const [inspectCustomer, setInspectCustomer] = useState<any | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editCustomer, setEditCustomer] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
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

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    vipTier: 'standard',
    internalNotes: '',
  })

  const supabase = createClient()

  const triggerAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type })
    setTimeout(() => setAlertMsg(null), 5000)
  }

  // Fetch latest synchronized customers from server
  const refreshAll = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true)
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      if (data.customers) {
        setCustomers(data.customers)
        if (showToast) triggerAlert('Client directory synchronized successfully.')
      }
    } catch (err: any) {
      console.error('[Refresh Customers Error]', err)
      if (showToast) triggerAlert('Failed to synchronize directory', 'error')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Real-time synchronization for orders, contacts, leads, customers, settings
  useEffect(() => {
    const channel = supabase
      .channel('cms:customers-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        refreshAll()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders((prev) => [payload.new, ...prev.filter((o) => o.id !== payload.new.id)])
          triggerAlert(`✦ New Order Placed: $${payload.new.amount} (${payload.new.customer_name})`)
        } else if (payload.eventType === 'UPDATE') {
          setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? payload.new : o)))
        }
        refreshAll()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setContacts((prev) => [payload.new, ...prev.filter((c) => c.id !== payload.new.id)])
          triggerAlert(`✦ New Consultation Inquiry: ${payload.new.full_name}`)
        } else if (payload.eventType === 'UPDATE') {
          setContacts((prev) => prev.map((c) => (c.id === payload.new.id ? payload.new : c)))
        }
        refreshAll()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads((prev) => [payload.new, ...prev.filter((l) => l.id !== payload.new.id)])
        } else if (payload.eventType === 'UPDATE') {
          setLeads((prev) => prev.map((l) => (l.id === payload.new.id ? payload.new : l)))
        }
        refreshAll()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        refreshAll()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, refreshAll])

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      vipTier: 'standard',
      internalNotes: '',
    })
    setModalMode('create')
  }

  // Open Edit Modal
  const openEditModal = (cust: any) => {
    setEditCustomer(cust)
    setFormData({
      fullName: cust.full_name || '',
      email: cust.email || '',
      phone: cust.phone || '',
      address: cust.address || '',
      vipTier: cust.vip_tier || 'standard',
      internalNotes: cust.internal_notes || '',
    })
    setModalMode('edit')
  }

  // Save Customer
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        id: editCustomer?.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        vipTier: formData.vipTier,
        internalNotes: formData.internalNotes,
      }

      if (modalMode === 'create') {
        const res = await fetch('/api/admin/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to create customer')
        setCustomers((prev) => [data.customer, ...prev.filter((c) => c.email.toLowerCase() !== data.customer.email.toLowerCase())])
        triggerAlert('Client profile created successfully.')
      } else {
        const res = await fetch('/api/admin/customers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update customer')
        setCustomers((prev) => prev.map((c) => (c.email.toLowerCase() === data.customer.email.toLowerCase() ? data.customer : c)))
        if (inspectCustomer?.email.toLowerCase() === data.customer.email.toLowerCase()) {
          setInspectCustomer(data.customer)
        }
        triggerAlert('Client profile updated.')
      }

      setModalMode(null)
    } catch (err: any) {
      triggerAlert(err.message || 'Operation failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Request Delete Customer (opens luxury confirmation modal)
  const requestDeleteCustomer = (cust: any) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Client Profile',
      message: 'Are you sure you want to remove this client from the active directory? Associated historical orders and estimates remain intact in their respective logs.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      icon: 'delete',
      details: [
        { label: 'Client', value: cust.full_name },
        { label: 'Email', value: cust.email },
        { label: 'Tier', value: cust.vip_tier?.toUpperCase() || 'STANDARD' },
      ],
      action: async () => {
        try {
          const res = await fetch(`/api/admin/customers?id=${encodeURIComponent(cust.email || cust.id)}`, { method: 'DELETE' })
          const resData = await res.json()
          if (!res.ok) throw new Error(resData.error || 'Failed to delete client')
          setCustomers((prev) => prev.filter((c) => c.id !== cust.id && c.email.toLowerCase() !== cust.email.toLowerCase()))
          if (inspectCustomer?.id === cust.id || inspectCustomer?.email.toLowerCase() === cust.email.toLowerCase()) {
            setInspectCustomer(null)
          }
          setConfirmModal((prev) => ({ ...prev, isOpen: false }))
          triggerAlert('Client profile removed.')
        } catch (err: any) {
          triggerAlert(err.message || 'Error deleting client', 'error')
          throw err
        }
      },
    })
  }

  // Filter customers
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      (cust.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust.phone || '').includes(searchQuery) ||
      (cust.address || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTier = tierFilter === 'all' || cust.vip_tier === tierFilter

    return matchesSearch && matchesTier
  })

  // Export CSV
  const exportCustomersCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Address', 'VIP Tier', 'Total Spend', 'Orders', 'Quotes', 'Inquiries', 'Member Since']
    const rows = customers.map((c) => [
      `"${c.full_name}"`,
      c.email,
      `"${c.phone || ''}"`,
      `"${c.address || ''}"`,
      c.vip_tier || 'standard',
      (c.total_spent || 0).toFixed(2),
      c.orders_count || 0,
      c.leads_count || 0,
      c.contacts_count || 0,
      c.created_at ? new Date(c.created_at).toLocaleDateString() : '',
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `latelier_clients_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // KPIs
  const totalClients = customers.length
  const eliteCount = customers.filter((c) => c.vip_tier === 'estate_elite' || c.vip_tier === 'vip').length
  const totalLTV = customers.reduce((sum, c) => sum + (Number(c.total_spent) || 0), 0)

  // Helper to get orders, contacts & leads for a customer
  const getCustomerHistory = (email: string) => {
    const emailNorm = (email || '').toLowerCase().trim()
    const clientOrders = orders.filter((o) => (o.customer_email || o.email || '').toLowerCase().trim() === emailNorm)
    const clientContacts = contacts.filter((c) => (c.email || '').toLowerCase().trim() === emailNorm)
    const clientLeads = leads.filter((l) => (l.email || '').toLowerCase().trim() === emailNorm)
    return { clientOrders, clientContacts, clientLeads }
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
          <h1>Customer Directory</h1>
          <p>Consolidated client dossier, VIP classification, and auto-synchronized lifetime history.</p>
        </div>

        <div className={styles.actionBtns}>
          <button onClick={() => refreshAll(true)} disabled={isRefreshing} className={styles.secondaryBtn} title="Sync latest client profiles">
            <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            {isRefreshing ? 'Syncing...' : 'Sync Directory'}
          </button>
          <button onClick={exportCustomersCSV} className={styles.secondaryBtn}>
            <Download size={16} />
            Export Directory
          </button>
          <button onClick={openCreateModal} className={styles.primaryBtn}>
            <Plus size={18} />
            Add Client Profile
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Total Synchronized Clients</div>
            <div className={styles.kpiValue}>{totalClients}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(11, 19, 43, 0.08)' }}>
            <Users size={22} color="#0B132B" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>VIP & Estate Elite</div>
            <div className={styles.kpiValue} style={{ color: '#b45309' }}>{eliteCount}</div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <Crown size={22} color="#b45309" />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiLabel}>Total Client Portfolio LTV</div>
            <div className={styles.kpiValue} style={{ color: '#15803d' }}>
              ${totalLTV.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={styles.kpiIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <DollarSign size={22} color="#10b981" />
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

        <div className={styles.tierPills}>
          {['all', 'estate_elite', 'vip', 'standard'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`${styles.tierPill} ${tierFilter === tier ? styles.tierPillActive : ''}`}
            >
              {tier.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {filteredCustomers.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Users size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem' }}>No Clients Found</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Client profiles are automatically synchronized when orders, inquiries, or estimates are placed.
              </p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact Information</th>
                  <th>Service Location</th>
                  <th>VIP Tier</th>
                  <th>Lifetime Spend</th>
                  <th>Activity Summary</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => {
                  const { clientOrders, clientContacts, clientLeads } = getCustomerHistory(cust.email)
                  const displaySpent = cust.total_spent !== undefined ? cust.total_spent : clientOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)

                  return (
                    <tr key={cust.id || cust.email}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0B132B', fontSize: '1rem' }}>{cust.full_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          {clientOrders.length} order{clientOrders.length !== 1 ? 's' : ''} &bull; {clientLeads.length} quote{clientLeads.length !== 1 ? 's' : ''} &bull; {clientContacts.length} inquiry
                        </div>
                      </td>

                      <td>
                        <div>
                          <a href={`mailto:${cust.email}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                            {cust.email}
                          </a>
                        </div>
                        {cust.phone && (
                          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                            <a href={`tel:${cust.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {cust.phone}
                            </a>
                          </div>
                        )}
                      </td>

                      <td>
                        {cust.address ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#334155' }}>
                            <MapPin size={13} color="#94a3b8" />
                            <span>{cust.address}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>None specified</span>
                        )}
                      </td>

                      <td>
                        {cust.vip_tier === 'estate_elite' ? (
                          <span className={styles.badgeElite}><Crown size={11} /> Estate Elite</span>
                        ) : cust.vip_tier === 'vip' ? (
                          <span className={styles.badgeVIP}><ShieldCheck size={11} /> VIP Client</span>
                        ) : (
                          <span className={styles.badgeStandard}>Standard</span>
                        )}
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: '#b45309', fontSize: '1rem' }}>
                          ${Number(displaySpent).toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                          Last: {cust.last_active ? new Date(cust.last_active).toLocaleDateString() : 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Since: {cust.created_at ? new Date(cust.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            onClick={() => setInspectCustomer(cust)}
                            title="View Full Dossier"
                            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEditModal(cust)}
                            title="Edit Profile"
                            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => requestDeleteCustomer(cust)}
                            title="Delete Profile"
                            style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CLIENT DOSSIER DRAWER / MODAL */}
      {inspectCustomer && (() => {
        const { clientOrders, clientContacts, clientLeads } = getCustomerHistory(inspectCustomer.email)
        const totalSpent = inspectCustomer.total_spent !== undefined
          ? inspectCustomer.total_spent
          : clientOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)

        return (
          <div className={styles.overlay} onClick={() => setInspectCustomer(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
              <div className={styles.modalHeader}>
                <div>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c5a059', fontWeight: 700 }}>
                    Client Dossier
                  </span>
                  <h3>{inspectCustomer.full_name}</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <a href={`mailto:${inspectCustomer.email}`} style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      <Mail size={13} /> {inspectCustomer.email}
                    </a>
                    {inspectCustomer.phone && (
                      <a href={`tel:${inspectCustomer.phone}`} style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                        <Phone size={13} /> {inspectCustomer.phone}
                      </a>
                    )}
                    {inspectCustomer.address && (
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {inspectCustomer.address}
                      </span>
                    )}
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={() => setInspectCustomer(null)}>&times;</button>
              </div>

              <div className={styles.modalBody}>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Lifetime Spend</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b45309', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                      ${Number(totalSpent).toFixed(2)}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Completed Orders</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e40af', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                      {clientOrders.length}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>VIP Classification</div>
                    <div style={{ marginTop: '0.35rem' }}>
                      {inspectCustomer.vip_tier === 'estate_elite' ? (
                        <span className={styles.badgeElite}><Crown size={11} /> Estate Elite</span>
                      ) : inspectCustomer.vip_tier === 'vip' ? (
                        <span className={styles.badgeVIP}><ShieldCheck size={11} /> VIP Client</span>
                      ) : (
                        <span className={styles.badgeStandard}>Standard</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Internal Notes */}
                {inspectCustomer.internal_notes && (
                  <div style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b', color: '#78350f' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Concierge Profile Notes</div>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{inspectCustomer.internal_notes}</p>
                  </div>
                )}

                {/* Orders History */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0B132B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShoppingBag size={16} color="#c5a059" /> Order History ({clientOrders.length})
                  </h4>
                  {clientOrders.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>No booking orders on record.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {clientOrders.map((o) => (
                        <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{o.service_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {new Date(o.created_at).toLocaleDateString()} &bull; Ref: {o.stripe_session_id ? o.stripe_session_id.slice(-8).toUpperCase() : o.id.slice(0, 8)}
                              {o.details?.address ? ` • ${o.details.address}` : ''}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#b45309' }}>${Number(o.amount).toFixed(2)}</div>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: o.status === 'completed' ? '#15803d' : '#2563eb' }}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Estimates Quotes History */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0B132B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calculator size={16} color="#c5a059" /> Calculated Estimate Quotes ({clientLeads.length})
                  </h4>
                  {clientLeads.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>No estimate quote calculations on record.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {clientLeads.map((l) => (
                        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{l.service_type || 'Estimate Consultation'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {new Date(l.created_at).toLocaleDateString()}
                              {l.details?.squareFeet ? ` • ${l.details.squareFeet} sq ft` : ''}
                              {l.details?.bedrooms ? ` • ${l.details.bedrooms} bed` : ''}
                              {l.details?.location ? ` • ${l.details.location}` : ''}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#b45309' }}>${Number(l.total_price || 0).toFixed(2)}</div>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: l.status === 'converted' ? '#15803d' : '#64748b' }}>
                              {l.status || 'pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Consultation Requests History */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0B132B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare size={16} color="#c5a059" /> Consultations & Inquiries ({clientContacts.length})
                  </h4>
                  {clientContacts.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>No contact form inquiries on record.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {clientContacts.map((c) => (
                        <div key={c.id} style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', textTransform: 'capitalize' }}>{c.service} Consultation</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                          {c.details && <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>{c.details}</p>}
                          {c.address && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Location: {c.address}</div>}
                          {Array.isArray(c.image_urls) && c.image_urls.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                              {c.image_urls.map((url: string, idx: number) => (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#2563eb' }}>
                                  <ExternalLink size={11} /> Attachment #{idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  onClick={() => {
                    const custToEdit = inspectCustomer
                    setInspectCustomer(null)
                    openEditModal(custToEdit)
                  }}
                  className={styles.primaryBtn}
                >
                  <Edit2 size={16} />
                  Edit Client Profile
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* CREATE / EDIT CLIENT MODAL */}
      {modalMode && (
        <div className={styles.overlay} onClick={() => setModalMode(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalMode === 'create' ? 'Add Client Profile' : 'Edit Client Profile'}</h3>
              <button className={styles.closeBtn} onClick={() => setModalMode(null)}>&times;</button>
            </div>

            <form onSubmit={handleSaveCustomer}>
              <div className={styles.modalBody}>
                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Eleanor Roosevelt"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="eleanor@estate.com"
                    />
                  </div>
                </div>

                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(404) 555-0100"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>VIP Classification Tier</label>
                    <select
                      value={formData.vipTier}
                      onChange={(e) => setFormData({ ...formData, vipTier: e.target.value })}
                    >
                      <option value="standard">Standard Client</option>
                      <option value="vip">VIP Client</option>
                      <option value="estate_elite">Estate Elite (High-Value)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Primary Residence / Estate Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Buckhead, Atlanta GA"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Concierge Profile Notes (Access Instructions, Preferences, Alarm Codes)</label>
                  <textarea
                    rows={4}
                    value={formData.internalNotes}
                    onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                    placeholder="Private estate. Please announce arrival 15 mins prior. Client prefers organic scent-free products."
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setModalMode(null)} className={styles.secondaryBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className={styles.primaryBtn}>
                  {loading ? 'Saving...' : modalMode === 'create' ? 'Create Client Profile' : 'Update Profile'}
                </button>
              </div>
            </form>
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
