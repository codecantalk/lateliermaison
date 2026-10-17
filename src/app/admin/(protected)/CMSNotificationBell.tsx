'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell,
  ShoppingBag,
  MessageSquare,
  FileText,
  CheckCheck,
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { useCMSNotifications, CMSNotification } from '@/context/CMSNotificationsContext'
import styles from './CMSNotificationBell.module.css'

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 45) return 'Just now'
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    if (diffSec < 172800) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return 'Recent'
  }
}

export default function CMSNotificationBell() {
  const {
    notifications,
    unreadCount,
    countsByType,
    isLiveConnected,
    isSoundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    clearAll,
    playChimeTest,
  } = useCMSNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'orders' | 'contacts' | 'leads'>('all')
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Filtered list
  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'orders') return item.type === 'order'
    if (filter === 'contacts') return item.type === 'contact'
    if (filter === 'leads') return item.type === 'lead'
    return true
  })

  const getIcon = (type: CMSNotification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={18} />
      case 'contact':
        return <MessageSquare size={18} />
      case 'lead':
        return <FileText size={18} />
    }
  }

  const getIconClass = (type: CMSNotification['type']) => {
    switch (type) {
      case 'order':
        return `${styles.iconBadge} ${styles.iconOrder}`
      case 'contact':
        return `${styles.iconBadge} ${styles.iconContact}`
      case 'lead':
        return `${styles.iconBadge} ${styles.iconLead}`
    }
  }

  const getBadgeClass = (type: CMSNotification['type']) => {
    switch (type) {
      case 'order':
        return `${styles.typeBadge} ${styles.badgeOrder}`
      case 'contact':
        return `${styles.typeBadge} ${styles.badgeContact}`
      case 'lead':
        return `${styles.typeBadge} ${styles.badgeLead}`
    }
  }

  return (
    <div className={styles.bellWrapper} ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        className={`${styles.bellButton} ${isOpen ? styles.bellButtonActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
      >
        <Bell
          size={20}
          className={unreadCount > 0 ? styles.bellIconHasUnread : ''}
          strokeWidth={unreadCount > 0 ? 2.4 : 2}
        />

        {unreadCount > 0 && (
          <>
            <span className={styles.badgePulse} />
            <span className={styles.badge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Flyout Popover */}
      {isOpen && (
        <div className={styles.popover}>
          {/* Header */}
          <div className={styles.popoverHeader}>
            <div className={styles.headerLeft}>
              <h3 className={styles.headerTitle}>Live Notifications</h3>
              <div className={styles.liveBadge} title="Real-time WebSocket sync active">
                <span className={styles.pulseDot} />
                <span>{isLiveConnected ? 'Live' : 'Connected'}</span>
              </div>
            </div>

            <div className={styles.headerActions}>
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className={styles.headerBtn}
                title={isSoundEnabled ? 'Mute notification sound' : 'Enable notification chime'}
              >
                {isSoundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>{isSoundEnabled ? 'Chime on' : 'Muted'}</span>
              </button>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className={styles.headerBtn}
                  title="Mark all notifications as read"
                >
                  <CheckCheck size={13} />
                  <span>Read all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className={styles.tabsRow}>
            <button
              type="button"
              className={`${styles.tabBtn} ${filter === 'all' ? styles.activeTabBtn : ''}`}
              onClick={() => setFilter('all')}
            >
              All {notifications.length > 0 && `(${notifications.length})`}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${filter === 'orders' ? styles.activeTabBtn : ''}`}
              onClick={() => setFilter('orders')}
            >
              Orders {countsByType.orders > 0 && `(${countsByType.orders})`}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${filter === 'contacts' ? styles.activeTabBtn : ''}`}
              onClick={() => setFilter('contacts')}
            >
              Inquiries {countsByType.contacts > 0 && `(${countsByType.contacts})`}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${filter === 'leads' ? styles.activeTabBtn : ''}`}
              onClick={() => setFilter('leads')}
            >
              Estimates {countsByType.leads > 0 && `(${countsByType.leads})`}
            </button>
          </div>

          {/* List */}
          <div className={styles.notifList}>
            {filteredNotifications.length === 0 ? (
              <div className={styles.emptyState}>
                <CheckCircle2 size={36} color="#10b981" />
                <h4>All Caught Up</h4>
                <p>
                  No pending {filter !== 'all' ? filter : ''} notifications. New inquiries and Stripe orders will appear in real time.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className={`${styles.notifItem} ${!item.isRead ? styles.notifItemUnread : ''}`}
                  onClick={() => {
                    markAsRead(item.id)
                    setIsOpen(false)
                  }}
                >
                  {!item.isRead && <span className={styles.unreadMarker} />}

                  <div className={getIconClass(item.type)}>
                    {getIcon(item.type)}
                  </div>

                  <div className={styles.notifBody}>
                    <div className={styles.notifRowTop}>
                      <span className={styles.notifTitle}>{item.title}</span>
                      <span className={styles.notifTime}>{formatRelativeTime(item.timestamp)}</span>
                    </div>

                    <div className={styles.notifSubtitle}>{item.subtitle}</div>

                    <div className={styles.notifMeta}>
                      <span className={getBadgeClass(item.type)}>
                        {item.type === 'order' ? 'Booking Order' : item.type === 'contact' ? 'Contact Form' : 'Estimate Lead'}
                      </span>
                      {item.amount && item.amount > 0 ? (
                        <span className={styles.amountTag}>${item.amount.toFixed(2)}</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className={styles.popoverFooter}>
            <button
              type="button"
              className={styles.soundTestBtn}
              onClick={playChimeTest}
              title="Test the luxury notification sound"
            >
              <Sparkles size={12} color="#c5a059" />
              <span>Test Chime</span>
            </button>

            {notifications.length > 0 && (
              <button
                type="button"
                className={styles.soundTestBtn}
                onClick={clearAll}
                title="Clear notification list"
              >
                Clear all
              </button>
            )}

            <Link
              href="/admin/orders"
              className={styles.footerLink}
              onClick={() => setIsOpen(false)}
            >
              <span>View Orders</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
