import styles from './page.module.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>L'Atelier Admin</div>
        <nav className={styles.nav}>
          <a href="/admin" className={styles.navLink}>Dashboard</a>
          <a href="/admin/bookings" className={styles.navLink}>Bookings</a>
          <a href="/admin/customers" className={styles.navLink}>Customers</a>
          <a href="/admin/settings" className={styles.navLink}>Settings</a>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <h2>Admin Portal</h2>
          <button className="btn btn-outline">Logout</button>
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  )
}
