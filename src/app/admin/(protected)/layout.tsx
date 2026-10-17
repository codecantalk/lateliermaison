import styles from './page.module.css'
import AdminSidebar from './AdminSidebar'
import AdminTopHeader from './AdminTopHeader'
import { CMSNotificationsProvider } from '@/context/CMSNotificationsContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CMSNotificationsProvider>
      <div className={styles.adminLayout}>
        <AdminSidebar />
        <main className={styles.mainContent}>
          <AdminTopHeader />
          <div className={styles.contentArea}>
            {children}
          </div>
        </main>
      </div>
    </CMSNotificationsProvider>
  )
}

