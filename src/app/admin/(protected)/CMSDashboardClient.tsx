'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'
import { Users, Clock, ArrowUpRight, Printer, Image as ImageIcon } from 'lucide-react'

export default function CMSDashboardClient({ initialLeads, initialContacts }: { initialLeads: any[], initialContacts: any[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [contacts, setContacts] = useState(initialContacts)
  const [activeTab, setActiveTab] = useState<'leads' | 'contacts'>('contacts')
  const supabase = createClient()

  useEffect(() => {
    // Real-time subscription for leads
    const leadsChannel = supabase.channel('public:leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((current) => [payload.new, ...current])
      })
      .subscribe()

    // Real-time subscription for contacts
    const contactsChannel = supabase.channel('public:contacts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, (payload) => {
        setContacts((current) => [payload.new, ...current])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(leadsChannel)
      supabase.removeChannel(contactsChannel)
    }
  }, [supabase])

  const handleUpdateStatus = async (id: string, table: 'leads' | 'contacts', newStatus: string) => {
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id)
      
    if (error) {
      alert('Error updating status: ' + error.message)
      return
    }
    
    // Optimistically update UI
    if (table === 'contacts') {
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c))
    } else {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l))
    }
  }

  const handlePrint = (data: any, type: 'lead' | 'contact') => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Print ${type === 'contact' ? 'Contact Request' : 'Estimate Lead'}</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; color: #1e293b; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
            .label { font-weight: bold; color: #64748b; font-size: 0.875rem; text-transform: uppercase; }
            .value { font-size: 1.1rem; margin-bottom: 1rem; }
            .images { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
            .images img { max-width: 300px; max-height: 300px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <h1>L'Atelier Maison - ${type === 'contact' ? 'Contact Request' : 'Estimate Lead'}</h1>
          
          <div class="grid">
            <div>
              <div class="label">Name</div>
              <div class="value">${data.customer_name || data.full_name || 'N/A'}</div>
              
              <div class="label">Email</div>
              <div class="value">${data.email || 'N/A'}</div>
              
              <div class="label">Phone</div>
              <div class="value">${data.phone || 'N/A'}</div>
              
              ${data.address ? `<div class="label">Address</div><div class="value">${data.address}</div>` : ''}
            </div>
            
            <div>
              <div class="label">Service</div>
              <div class="value" style="text-transform: capitalize;">${data.service_type || data.service || 'N/A'}</div>
              
              <div class="label">Date Submitted</div>
              <div class="value">${new Date(data.created_at).toLocaleString()}</div>
              
              ${data.budget ? `<div class="label">Budget</div><div class="value">${data.budget}</div>` : ''}
              ${data.timeline ? `<div class="label">Timeline</div><div class="value">${data.timeline}</div>` : ''}
              ${data.total_price ? `<div class="label">Estimated Price</div><div class="value">$${data.total_price}</div>` : ''}
            </div>
          </div>
          
          <div class="label">Project Details</div>
          <div class="value" style="white-space: pre-wrap; background: #f8fafc; padding: 1rem; border-radius: 4px;">${data.details || 'No details provided.'}</div>

          ${data.image_urls && data.image_urls.length > 0 ? `
            <div class="label" style="margin-top: 2rem;">Uploaded Photos</div>
            <div class="images">
              ${data.image_urls.map((url: string) => `<img src="${url}" alt="Uploaded Photo" />`).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    
    // Wait for images to load before triggering print
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  const totalInquiries = leads.length + contacts.length
  const pendingInquiries = leads.filter((l: any) => l.status === 'pending').length + contacts.filter((c: any) => c.status === 'pending').length

  return (
    <div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Total Inquiries (All Time)</h3>
              <p className={styles.statNumber}>{totalInquiries}</p>
            </div>
            <div className={styles.statIconWrapper}>
              <Users size={24} color="#64748b" />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}>
            <ArrowUpRight size={16} />
            <span>Live Sync Active</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Pending Review</h3>
              <p className={styles.statNumber} style={{ color: 'var(--color-primary)' }}>{pendingInquiries}</p>
            </div>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(65, 105, 225, 0.1)' }}>
              <Clock size={24} color="var(--color-primary)" />
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.recentBookings}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Recent Submissions</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
            <button 
              onClick={() => setActiveTab('contacts')}
              style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: activeTab === 'contacts' ? '#ffffff' : 'transparent', boxShadow: activeTab === 'contacts' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', fontWeight: activeTab === 'contacts' ? 600 : 400, color: activeTab === 'contacts' ? '#1e293b' : '#64748b' }}
            >
              Contact Forms
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: activeTab === 'leads' ? '#ffffff' : 'transparent', boxShadow: activeTab === 'leads' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', fontWeight: activeTab === 'leads' ? 600 : 400, color: activeTab === 'leads' ? '#1e293b' : '#64748b' }}
            >
              Estimates
            </button>
          </div>
        </div>
        
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
                      <td style={{ fontWeight: 600, color: '#1e3a8a' }}>\${lead.total_price}</td>
                      <td>
                        <span className={lead.status === 'completed' ? styles.badgeSuccess : styles.badgePending}>
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
