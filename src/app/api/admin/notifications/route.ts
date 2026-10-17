import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Query recent entries in parallel
    const [ordersRes, contactsRes, leadsRes] = await Promise.all([
      supabase
        .from('orders')
        .select('id, customer_name, customer_email, service_name, amount, total_price, status, created_at')
        .order('created_at', { ascending: false })
        .limit(15),
      supabase
        .from('contacts')
        .select('id, full_name, email, phone, service, status, created_at')
        .order('created_at', { ascending: false })
        .limit(15),
      supabase
        .from('leads')
        .select('id, customer_name, email, phone, service_type, total_price, status, created_at')
        .order('created_at', { ascending: false })
        .limit(15),
    ])

    const notifications: any[] = []

    // 1. Orders
    if (ordersRes.data) {
      ordersRes.data.forEach((o: any) => {
        notifications.push({
          id: `order_${o.id}`,
          rawId: o.id,
          type: 'order',
          title: `New Order • $${(Number(o.amount || o.total_price) || 0).toFixed(2)}`,
          subtitle: `${o.customer_name || 'Client'} — ${o.service_name || 'Home Service'}`,
          amount: Number(o.amount || o.total_price) || 0,
          customerName: o.customer_name || 'Client',
          customerEmail: o.customer_email || '',
          status: o.status || 'confirmed',
          timestamp: o.created_at,
          link: '/admin/orders',
        })
      })
    }

    // 2. Contacts
    if (contactsRes.data) {
      contactsRes.data.forEach((c: any) => {
        notifications.push({
          id: `contact_${c.id}`,
          rawId: c.id,
          type: 'contact',
          title: 'Contact Form Inquiry',
          subtitle: `${c.full_name || 'Client'} — ${c.service || 'General Inquiry'}`,
          customerName: c.full_name || 'Client',
          customerEmail: c.email || '',
          status: c.status || 'pending',
          timestamp: c.created_at,
          link: '/admin/contacts',
        })
      })
    }

    // 3. Leads (Estimates)
    if (leadsRes.data) {
      leadsRes.data.forEach((l: any) => {
        notifications.push({
          id: `lead_${l.id}`,
          rawId: l.id,
          type: 'lead',
          title: `Estimate Request • $${(Number(l.total_price) || 0).toFixed(2)}`,
          subtitle: `${l.customer_name || 'Client'} — ${l.service_type || 'Custom Service'}`,
          amount: Number(l.total_price) || 0,
          customerName: l.customer_name || 'Client',
          customerEmail: l.email || '',
          status: l.status || 'pending',
          timestamp: l.created_at,
          link: '/admin/estimates',
        })
      })
    }

    // Sort descending by timestamp
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ notifications })
  } catch (err: any) {
    console.error('[Admin Notifications Error]', err)
    return NextResponse.json({ notifications: [], error: err.message }, { status: 500 })
  }
}
