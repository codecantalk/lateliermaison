import styles from './page.module.css'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from './LogoutButton'
import { LayoutDashboard, Settings, Image as ImageIcon, Calculator } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
          <Image src="/logo.png" alt="L'Atelier Admin Logo" width={140} height={40} style={{ objectFit: 'contain' }} />
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/pricing" className={styles.navLink}>
            <Calculator size={20} />
            Pricing Engine
          </Link>
          <Link href="/admin/portfolio" className={styles.navLink}>
            <ImageIcon size={20} />
            Portfolio
          </Link>
          <Link href="/admin/settings" className={styles.navLink}>
            <Settings size={20} />
            Settings
          </Link>
        </nav>
      </aside>
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
