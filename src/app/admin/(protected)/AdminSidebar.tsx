'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCMSNotifications } from '@/context/CMSNotificationsContext'
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  FileText,
  Users,
  Calculator,
  Image as ImageIcon,
  Settings,
} from 'lucide-react'
import styles from './page.module.css'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { countsByType } = useCMSNotifications()

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  const getBadgeCount = (href: string) => {
    if (href === '/admin/orders') return countsByType.orders
    if (href === '/admin/contacts') return countsByType.contacts
    if (href === '/admin/estimates') return countsByType.leads
    return 0
  }

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'OPERATIONS & CLIENTS',
      items: [
        { href: '/admin/orders', label: 'Orders & Bookings', icon: ShoppingBag },
        { href: '/admin/contacts', label: 'Contact Inquiries', icon: MessageSquare },
        { href: '/admin/estimates', label: 'Estimate Quotes', icon: FileText },
        { href: '/admin/customers', label: 'Customer Directory', icon: Users },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { href: '/admin/pricing', label: 'Pricing Engine', icon: Calculator },
        { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
      ],
    },
  ]

  return (
    <aside className={styles.sidebar} style={{ overflowY: 'auto', maxHeight: '100vh' }}>
      <div
        className={styles.logo}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 11,
        }}
      >
        <Image
          src="/logo.png"
          alt="L'Atelier Admin Logo"
          width={52}
          height={52}
          style={{ objectFit: 'contain', marginBottom: '0.4rem' }}
          priority
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0B132B',
          }}
        >
          L'Atelier Maison
        </span>
        <span
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#c5a059',
            fontWeight: 700,
            marginTop: '0.15rem',
          }}
        >
          Executive Portal
        </span>
      </div>

      <nav className={styles.nav} style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navSections.map((section) => (
          <div key={section.title} style={{ marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#94a3b8',
                padding: '0.5rem 0.75rem 0.35rem 0.75rem',
              }}
            >
              {section.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                const badgeCount = getBadgeCount(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.navLink}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.92rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#0B132B' : '#64748b',
                      background: active ? 'rgba(197, 160, 89, 0.12)' : 'transparent',
                      borderLeft: active ? '3px solid #c5a059' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Icon size={18} color={active ? '#c5a059' : '#64748b'} />
                      <span>{item.label}</span>
                    </div>

                    {badgeCount > 0 && (
                      <span
                        style={{
                          background: item.href === '/admin/orders' ? '#0B132B' : 'rgba(197, 160, 89, 0.2)',
                          color: item.href === '/admin/orders' ? '#c5a059' : '#0B132B',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '10px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
