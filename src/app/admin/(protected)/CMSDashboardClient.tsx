'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'
import { Users, Clock, ArrowUpRight, Printer, Image as ImageIcon, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react'

export default function CMSDashboardClient({
  initialOrders = [],
  initialLeads = [],
  initialContacts = [],
}: {
  initialOrders?: any[]
  initialLeads: any[]
  initialContacts: any[]
}) {
  const [orders, setOrders] = useState(initialOrders)
  const [leads, setLeads] = useState(initialLeads)
  const [contacts, setContacts] = useState(initialContacts)
  const [activeTab, setActiveTab] = useState<'orders' | 'contacts' | 'leads'>('orders')
  const [newAlert, setNewAlert] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // 1. Real-time subscription for orders
    const ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders((current) => [payload.new, ...current])
        setNewAlert(`✦ New Paid Order: $${payload.new.amount} from ${payload.new.customer_name}`)
        setTimeout(() => setNewAlert(null), 8000)
      })
      .subscribe()

    // 2. Real-time subscription for leads
    const leadsChannel = supabase
      .channel('public:leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((current) => [payload.new, ...current])
        setNewAlert(`✦ New Estimate Lead: ${payload.new.customer_name || 'Customer'}`)
        setTimeout(() => setNewAlert(null), 8000)
      })
      .subscribe()

    // 3. Real-time subscription for contacts
    const contactsChannel = supabase
      .channel('public:contacts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, (payload) => {
        setContacts((current) => [payload.new, ...current])
        setNewAlert(`✦ New Contact Form Inquiry: ${payload.new.full_name}`)
        setTimeout(() => setNewAlert(null), 8000)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(leadsChannel)
      supabase.removeChannel(contactsChannel)
    }
  }, [supabase])

  const handleUpdateStatus = async (id: string, table: 'orders' | 'leads' | 'contacts', newStatus: string) => {
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id)
      
    if (error) {
      alert('Error updating status: ' + error.message)
      return
    }
    
    // Optimistically update UI
    if (table === 'orders') {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    } else if (table === 'contacts') {
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c))
    } else {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l))
    }
  }

  const handlePrint = (data: any, type: 'order' | 'lead' | 'contact') => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const title = type === 'order' 
      ? 'Paid Order Receipt' 
      : type === 'contact' 
      ? 'Contact Request' 
      : 'Estimate Lead'

    const html = `
      <html>
        <head>
          <title>${title} - L'Atelier Maison</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2.5rem; color: #1e293b; background: #ffffff; }
            .header { border-bottom: 2px solid #0B132B; padding-bottom: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 1.5rem; font-weight: bold; letter-spacing: 0.1em; color: #0B132B; }
            .subtitle { font-size: 0.85rem; color: #c5a059; text-transform: uppercase; letter-spacing: 0.15em; }
            .title { font-size: 1.75rem; color: #0B132B; margin-top: 0.5rem; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
            .label { font-weight: 700; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
            .value { font-size: 1.05rem; margin-bottom: 1rem; color: #0f172a; }
            .price-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
            .price-total { font-size: 1.5rem; color: #b45309; font-weight: bold; }
            .images { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
            .images img { max-width: 260px; max-height: 260px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; }
            .footer { margin-top: 3rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; font-size: 0.85rem; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">L'ATELIER MAISON</div>
              <div class="subtitle">Haute Artisan Home Services</div>
              <div class="title">${title}</div>
            </div>
            <div style="text-align: right; font-size: 0.9rem; color: #64748b;">
              <div>Date: ${new Date(data.created_at).toLocaleDateString()}</div>
              <div>Ref: ${data.stripe_session_id ? data.stripe_session_id.slice(-10).toUpperCase() : (data.id ? data.id.slice(0, 8).toUpperCase() : 'N/A')}</div>
            </div>
          </div>
          
          <div class="grid">
            <div>
              <div class="label">Customer Name</div>
              <div class="value">${data.customer_name || data.full_name || 'N/A'}</div>
              
              <div class="label">Email Address</div>
              <div class="value">${data.email || data.customer_email || 'N/A'}</div>
              
              <div class="label">Phone Number</div>
              <div class="value">${data.phone || data.customer_phone || 'N/A'}</div>
              
              ${data.address ? `<div class="label">Service Address</div><div class="value">${data.address}</div>` : ''}
            </div>
            
            <div>
              <div class="label">Discipline / Service</div>
              <div class="value" style="text-transform: capitalize; font-weight: 600;">${data.service_name || data.service_type || data.service || 'N/A'}</div>
              
              <div class="label">Current Status</div>
              <div class="value" style="text-transform: uppercase; font-weight: bold; color: ${data.status === 'paid' ? '#10b981' : '#b45309'};">${data.status}</div>

              ${data.amount || data.total_price ? `
                <div class="price-box">
                  <div class="label">Total Amount</div>
                  <div class="price-total">$${Number(data.amount || data.total_price).toFixed(2)}</div>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="label">Service Specifications & Scope</div>
          <div class="value" style="white-space: pre-wrap; background: #f8fafc; padding: 1.25rem; border-radius: 6px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 0.9rem;">${typeof data.details === 'object' ? JSON.stringify(data.details, null, 2) : (data.details || 'No additional details provided.')}</div>

          ${data.image_urls && data.image_urls.length > 0 ? `
            <div class="label" style="margin-top: 2rem;">Uploaded Client Photos</div>
            <div class="images">
              ${data.image_urls.map((url: string) => `<img src="${url}" alt="Client Photo" />`).join('')}
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
    
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  const totalRevenue = orders.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0)
  const totalInquiries = orders.length + leads.length + contacts.length
  const pendingCount = contacts.filter((c: any) => c.status === 'pending').length + leads.filter((l: any) => l.status === 'pending').length

  return (
    <div>
      {/* Real-time Notification Banner */}
      {newAlert && (
        <div style={{
          background: 'linear-gradient(135deg, #0e1c38 0%, #070f20 100%)',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #c5a059',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <strong style={{ color: '#c5a059', fontSize: '0.95rem' }}>Real-time Update:</strong>
            <span style={{ fontSize: '0.95rem' }}>{newAlert}</span>
          </div>
          <button 
            onClick={() => setNewAlert(null)}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Paid Bookings (Stripe)</h3>
              <p className={styles.statNumber} style={{ color: '#10b981' }}>{orders.length}</p>
            </div>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <CreditCard size={24} color="#10b981" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
            Total Collected: <span style={{ color: '#b45309', fontWeight: 700 }}>${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Total Inquiries</h3>
              <p className={styles.statNumber}>{totalInquiries}</p>
            </div>
            <div className={styles.statIconWrapper}>
              <Users size={24} color="#64748b" />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}>
            <ArrowUpRight size={16} />
            <span>Real-time Sync Active</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Pending Review</h3>
              <p className={styles.statNumber} style={{ color: 'var(--color-primary)' }}>{pendingCount}</p>
            </div>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(65, 105, 225, 0.1)' }}>
              <Clock size={24} color="var(--color-primary)" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            Awaiting concierge action
          </div>
        </div>
      </div>
      
      {/* Submissions Section */}
      <div className={styles.recentBookings}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>Submissions & Bookings</h3>
            <Link 
              href="/admin/orders" 
              style={{ 
                fontSize: '0.85rem', 
                color: '#2563eb', 
                textDecoration: 'none', 
                fontWeight: 600,
                background: 'rgba(37, 99, 235, 0.08)',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px'
              }}
            >
              Open Full Orders Portal &rarr;
            </Link>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'orders' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'orders' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'orders' ? 600 : 400,
                color: activeTab === 'orders' ? '#0f172a' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Paid Orders</span>
              <span style={{ fontSize: '0.75rem', background: activeTab === 'orders' ? '#10b981' : '#cbd5e1', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>
                {orders.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('contacts')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'contacts' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'contacts' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'contacts' ? 600 : 400,
                color: activeTab === 'contacts' ? '#0f172a' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Contact Forms</span>
              <span style={{ fontSize: '0.75rem', background: '#64748b', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>
                {contacts.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('leads')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'leads' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'leads' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'leads' ? 600 : 400,
                color: activeTab === 'leads' ? '#0f172a' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Estimates</span>
              <span style={{ fontSize: '0.75rem', background: '#64748b', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>
                {leads.length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Tab 1: Orders (Paid via Stripe) */}
        {activeTab === 'orders' && (
          <div style={{ overflowX: 'auto' }}>
            {orders.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <CreditCard size={36} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ margin: 0, fontWeight: 500 }}>No paid bookings recorded yet.</p>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Orders placed through Stripe checkout will appear here in real time.
                </p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Contact Info</th>
                    <th>Service Booked</th>
                    <th>Amount Paid</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id}>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>{order.customer_name || 'Valued Client'}</td>
                      <td>
                        {order.customer_email || 'N/A'}<br/>
                        <span style={{ color: '#64748b', fontSize: '0.85em' }}>{order.customer_phone || ''}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{order.service_name}</span>
                        {order.stripe_session_id && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                            Ref: {order.stripe_session_id.slice(-8).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#15803d', fontSize: '1.05rem' }}>
                          ${Number(order.amount).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className={styles.badgeSuccess} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={12} /> {order.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handlePrint(order, 'order')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', color: '#475569' }}
                            title="Print Formal Invoice Receipt"
                          >
                            <Printer size={16} />
                          </button>
                          {order.status !== 'completed' && (
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'orders', 'completed')}
                              style={{ display: 'flex', alignItems: 'center', background: '#10b981', border: 'none', padding: '0.5rem 0.85rem', borderRadius: '4px', cursor: 'pointer', color: '#ffffff', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Fulfill
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Contacts */}
        {activeTab === 'contacts' && (
          <div style={{ overflowX: 'auto' }}>
            {contacts.length === 0 ? (
              <p style={{ color: '#64748b' }}>No contact submissions found yet.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Contact Info</th>
                    <th>Service / Timeline</th>
                    <th>Images</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact: any) => (
                    <tr key={contact.id}>
                      <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 500 }}>{contact.full_name}</td>
                      <td>{contact.email}<br/><span style={{ color: '#64748b', fontSize: '0.85em' }}>{contact.phone}</span></td>
                      <td>
                        <span style={{ textTransform: 'capitalize' }}>{contact.service}</span>
                        <br/><span style={{ color: '#64748b', fontSize: '0.85em' }}>{contact.timeline}</span>
                      </td>
                      <td>
                        {contact.image_urls && contact.image_urls.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.85rem' }}>
                            <ImageIcon size={16} /> {contact.image_urls.length}
                          </div>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>None</span>
                        )}
                      </td>
                      <td>
                        <span className={contact.status === 'completed' ? styles.badgeSuccess : styles.badgePending}>
                          {contact.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handlePrint(contact, 'contact')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', color: '#475569' }}
                            title="Print / View Full Details"
                          >
                            <Printer size={16} />
                          </button>
                          {contact.status !== 'completed' && (
                            <button 
                              onClick={() => handleUpdateStatus(contact.id, 'contacts', 'completed')}
                              style={{ display: 'flex', alignItems: 'center', background: '#10b981', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', color: '#ffffff', fontSize: '0.875rem' }}
                            >
                              Mark Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Leads */}
        {activeTab === 'leads' && (
          <div style={{ overflowX: 'auto' }}>
            {leads.length === 0 ? (
              <p style={{ color: '#64748b' }}>No estimate leads found yet.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Contact Info</th>
                    <th>Service</th>
                    <th>Estimate Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: any) => (
                    <tr key={lead.id}>
                      <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 500 }}>{lead.customer_name || 'Anonymous'}</td>
                      <td>{lead.email}<br/><span style={{ color: '#64748b', fontSize: '0.85em' }}>{lead.phone}</span></td>
                      <td style={{ textTransform: 'capitalize' }}>{lead.service_type}</td>
                      <td style={{ fontWeight: 600, color: '#1e3a8a' }}>${lead.total_price}</td>
                      <td>
                        <span className={lead.status === 'completed' || lead.status === 'paid' ? styles.badgeSuccess : styles.badgePending}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handlePrint(lead, 'lead')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', color: '#475569' }}
                            title="Print / View Full Details"
                          >
                            <Printer size={16} />
                          </button>
                          {lead.status !== 'completed' && (
                            <button 
                              onClick={() => handleUpdateStatus(lead.id, 'leads', 'completed')}
                              style={{ display: 'flex', alignItems: 'center', background: '#10b981', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', color: '#ffffff', fontSize: '0.875rem' }}
                            >
                              Mark Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
