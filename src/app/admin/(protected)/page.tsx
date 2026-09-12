import { createClient } from '@/lib/supabase/server';
import { Users, Clock, ArrowUpRight } from 'lucide-react';
import styles from './page.module.css';

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  const totalLeads = leads?.length || 0;
  const pendingLeads = leads?.filter(l => l.status === 'pending').length || 0;

  return (
    <div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Total Inquiries (All Time)</h3>
              <p className={styles.statNumber}>{totalLeads}</p>
            </div>
            <div className={styles.statIconWrapper}>
              <Users size={24} color="#64748b" />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}>
            <ArrowUpRight size={16} />
            <span>Live Sync</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Pending Review</h3>
              <p className={styles.statNumber} style={{ color: 'var(--color-primary)' }}>{pendingLeads}</p>
            </div>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(65, 105, 225, 0.1)' }}>
              <Clock size={24} color="var(--color-primary)" />
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.recentBookings}>
        <h3>Recent Leads & Estimates</h3>
        
        {error ? (
          <p>Error loading leads: {error.message}</p>
        ) : !leads || leads.length === 0 ? (
          <p>No leads found yet. When users submit estimates, they will appear here.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Service</th>
                  <th>Estimate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any) => (
                  <tr key={lead.id}>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td>{lead.customer_name || 'Anonymous'}</td>
                    <td>{lead.email}<br/>{lead.phone}</td>
                    <td style={{ textTransform: 'capitalize' }}>{lead.service_type}</td>
                    <td>${lead.total_price}</td>
                    <td>
                      <span className={lead.status === 'completed' ? styles.badgeSuccess : styles.badgePending}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
