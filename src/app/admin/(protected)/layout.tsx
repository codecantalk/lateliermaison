import styles from './page.module.css'
import LogoutButton from './LogoutButton'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.02em' }}>Admin Portal</h2>
          <LogoutButton />
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  )
}

