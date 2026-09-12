import styles from './page.module.css'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

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
          <Link href="/admin" className={styles.navLink}>Dashboard (Leads)</Link>
          <Link href="/admin/pricing" className={styles.navLink}>Pricing Engine</Link>
          <Link href="/admin/portfolio" className={styles.navLink}>Portfolio</Link>
          <Link href="/admin/settings" className={styles.navLink}>Settings</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <h2>Admin Portal</h2>
          <LogoutButton />
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  )
}
