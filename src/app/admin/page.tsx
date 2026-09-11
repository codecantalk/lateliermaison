import styles from './page.module.css'

export default function AdminDashboard() {
  return (
    <div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Bookings</h3>
          <p className={styles.statNumber}>124</p>
        </div>
        <div className={styles.statCard}>
          <h3>Revenue (This Month)</h3>
          <p className={styles.statNumber}>$14,500</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Inquiries</h3>
          <p className={styles.statNumber}>8</p>
        </div>
      </div>
      
      <div className={styles.recentBookings}>
        <h3>Recent Bookings</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Deep Clean</td>
              <td>Oct 12, 2026</td>
              <td><span className={styles.badgeSuccess}>Confirmed</span></td>
              <td>$250</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Bathroom Remodel</td>
              <td>Oct 15, 2026</td>
              <td><span className={styles.badgePending}>Pending Quote</span></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
