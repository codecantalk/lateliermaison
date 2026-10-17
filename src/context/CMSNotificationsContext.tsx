'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface CMSNotification {
  id: string
  rawId: string
  type: 'order' | 'contact' | 'lead'
  title: string
  subtitle: string
  detail?: string
  amount?: number
  customerName: string
  customerEmail?: string
  status?: string
  timestamp: string
  isRead: boolean
  link: string
}

export interface CMSNotificationsContextType {
  notifications: CMSNotification[]
  unreadCount: number
  countsByType: {
    orders: number
    contacts: number
    leads: number
  }
  isLiveConnected: boolean
  isSoundEnabled: boolean
  toggleSound: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  playChimeTest: () => void
  refreshNotifications: () => Promise<void>
}

const CMSNotificationsContext = createContext<CMSNotificationsContextType | null>(null)

// Luxury Web Audio Synthesizer (Crystal Chime)
export function playLuxuryChime() {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const now = ctx.currentTime

    // Tone 1: E6 (1318.5 Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(1318.5, now)
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.45)

    // Tone 2: B6 (1975.5 Hz) - Fifth harmonic pleasant chime
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1975.5, now + 0.08)
    gain2.gain.setValueAtTime(0, now + 0.08)
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.65)
  } catch {
    // Autoplay restrictions gracefully handled
  }
}

export function CMSNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<CMSNotification[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [isLiveConnected, setIsLiveConnected] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  // Load sound setting and read IDs from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSound = localStorage.getItem('cms_sound_enabled')
        if (storedSound !== null) {
          setIsSoundEnabled(storedSound === 'true')
        }
        const storedRead = localStorage.getItem('cms_read_notification_ids')
        if (storedRead) {
          const parsed = JSON.parse(storedRead)
          if (Array.isArray(parsed)) {
            setReadIds(new Set(parsed))
          }
        }
      } catch {
        // storage fallback
      }
    }
  }, [])

  // Save read IDs to localStorage
  const persistReadIds = (newSet: Set<string>) => {
    setReadIds(newSet)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cms_read_notification_ids', JSON.stringify(Array.from(newSet)))
      } catch {
        // storage fallback
      }
    }
  }

  // Toggle sound
  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('cms_sound_enabled', String(next))
      }
      return next
    })
  }

  const playChimeTest = () => {
    playLuxuryChime()
  }

  // Fetch initial notifications from API
  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications')
      const data = await res.json()
      if (data.notifications) {
        setNotifications((prev) => {
          // Merge while keeping existing real-time unread state
          const map = new Map<string, CMSNotification>()
          // Preserve local notifications
          prev.forEach((n) => map.set(n.id, n))
          // Add or update from server
          data.notifications.forEach((n: any) => {
            const isRead = readIds.has(n.id)
            map.set(n.id, {
              ...n,
              isRead: map.get(n.id)?.isRead ?? isRead,
            })
          })
          const sorted = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          return sorted
        })
      }
    } catch (e) {
      console.warn('[Notifications Sync Warning]', e)
    }
  }, [readIds])

  // Initial load
  useEffect(() => {
    refreshNotifications()
    // Periodic heartbeat sync every 30s
    const interval = setInterval(refreshNotifications, 30000)
    return () => clearInterval(interval)
  }, [refreshNotifications])

  // Real-time Supabase Subscription
  useEffect(() => {
    const channel = supabase
      .channel('cms-global-realtime-notifications')
      // 1. New Orders
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const o = payload.new
        const notifId = `order_${o.id || Date.now()}`
        const newNotif: CMSNotification = {
          id: notifId,
          rawId: o.id || '',
          type: 'order',
          title: `New Order • $${(Number(o.amount || o.total_price) || 0).toFixed(2)}`,
          subtitle: `${o.customer_name || 'Client'} — ${o.service_name || 'Home Service'}`,
          amount: Number(o.amount || o.total_price) || 0,
          customerName: o.customer_name || 'Client',
          customerEmail: o.customer_email || '',
          status: o.status || 'confirmed',
          timestamp: o.created_at || new Date().toISOString(),
          isRead: false,
          link: '/admin/orders',
        }

        setNotifications((current) => [newNotif, ...current.filter((n) => n.id !== notifId)])

        if (isSoundEnabled) {
          playLuxuryChime()
        }
      })
      // 2. New Contact Form Inquiries
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, (payload) => {
        const c = payload.new
        const notifId = `contact_${c.id || Date.now()}`
        const newNotif: CMSNotification = {
          id: notifId,
          rawId: c.id || '',
          type: 'contact',
          title: 'Contact Form Inquiry',
          subtitle: `${c.full_name || 'Client'} — ${c.service || 'General Inquiry'}`,
          customerName: c.full_name || 'Client',
          customerEmail: c.email || '',
          status: c.status || 'pending',
          timestamp: c.created_at || new Date().toISOString(),
          isRead: false,
          link: '/admin/contacts',
        }

        setNotifications((current) => [newNotif, ...current.filter((n) => n.id !== notifId)])

        if (isSoundEnabled) {
          playLuxuryChime()
        }
      })
      // 3. New Estimates (Leads)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        const l = payload.new
        const notifId = `lead_${l.id || Date.now()}`
        const newNotif: CMSNotification = {
          id: notifId,
          rawId: l.id || '',
          type: 'lead',
          title: `Estimate Request • $${(Number(l.total_price) || 0).toFixed(2)}`,
          subtitle: `${l.customer_name || 'Client'} — ${l.service_type || 'Custom Service'}`,
          amount: Number(l.total_price) || 0,
          customerName: l.customer_name || 'Client',
          customerEmail: l.email || '',
          status: l.status || 'pending',
          timestamp: l.created_at || new Date().toISOString(),
          isRead: false,
          link: '/admin/estimates',
        }

        setNotifications((current) => [newNotif, ...current.filter((n) => n.id !== notifId)])

        if (isSoundEnabled) {
          playLuxuryChime()
        }
      })
      .subscribe((status) => {
        setIsLiveConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, isSoundEnabled])

  // Mark single notification as read
  const markAsRead = useCallback(
    (id: string) => {
      const updated = new Set(readIds)
      updated.add(id)
      persistReadIds(updated)
      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    },
    [readIds]
  )

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const updated = new Set(readIds)
    notifications.forEach((n) => updated.add(n.id))
    persistReadIds(updated)
    setNotifications((current) => current.map((n) => ({ ...n, isRead: true })))
  }, [notifications, readIds])

  // Clear all
  const clearAll = useCallback(() => {
    const updated = new Set(readIds)
    notifications.forEach((n) => updated.add(n.id))
    persistReadIds(updated)
    setNotifications([])
  }, [notifications, readIds])

  // Computations
  const computedNotifications = useMemo(() => {
    return notifications.map((n) => ({
      ...n,
      isRead: n.isRead || readIds.has(n.id),
    }))
  }, [notifications, readIds])

  const unreadCount = useMemo(() => {
    return computedNotifications.filter((n) => !n.isRead).length
  }, [computedNotifications])

  const countsByType = useMemo(() => {
    return {
      orders: computedNotifications.filter((n) => n.type === 'order' && !n.isRead).length,
      contacts: computedNotifications.filter((n) => n.type === 'contact' && !n.isRead).length,
      leads: computedNotifications.filter((n) => n.type === 'lead' && !n.isRead).length,
    }
  }, [computedNotifications])

  const value = {
    notifications: computedNotifications,
    unreadCount,
    countsByType,
    isLiveConnected,
    isSoundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    clearAll,
    playChimeTest,
    refreshNotifications,
  }

  return (
    <CMSNotificationsContext.Provider value={value}>
      {children}
    </CMSNotificationsContext.Provider>
  )
}

export function useCMSNotifications() {
  const context = useContext(CMSNotificationsContext)
  if (!context) {
    throw new Error('useCMSNotifications must be used within a CMSNotificationsProvider')
  }
  return context
}
