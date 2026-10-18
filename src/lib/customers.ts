import { SupabaseClient } from '@supabase/supabase-js'

export type VIPTier = 'estate_elite' | 'vip' | 'standard'

export interface UnifiedCustomer {
  id: string
  full_name: string
  email: string
  phone: string | null
  address: string | null
  vip_tier: VIPTier
  internal_notes: string | null
  total_spent: number
  orders_count: number
  contacts_count: number
  leads_count: number
  last_active: string
  created_at: string
  updated_at?: string
  source?: 'auto_sync' | 'manual'
}

export interface CustomerOverride {
  id?: string
  full_name?: string
  phone?: string | null
  address?: string | null
  vip_tier?: VIPTier
  internal_notes?: string | null
  is_deleted?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Generate a deterministic client ID from an email string.
 */
export function getCustomerIdForEmail(email: string): string {
  const norm = email.toLowerCase().trim()
  const hex = Buffer.from(norm).toString('hex').slice(0, 24)
  return `cust_${hex}`
}

/**
 * Fetches and unifies all client records from orders, contacts, estimate leads,
 * explicit customers table (if present), and manual overrides.
 */
export async function getUnifiedCustomers(supabase: SupabaseClient): Promise<UnifiedCustomer[]> {
  try {
    const [ordersRes, contactsRes, leadsRes, customersRes, settingsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('value').eq('key', 'customer_overrides').maybeSingle(),
    ])

    const orders = ordersRes?.data || []
    const contacts = contactsRes?.data || []
    const leads = leadsRes?.data || []
    const rawCustomers = customersRes?.data || []
    const overrides: Record<string, CustomerOverride> = settingsRes?.data?.value || {}

    const map = new Map<string, UnifiedCustomer>()

    function getOrInit(emailRaw?: string | null, fallbackName?: string | null): UnifiedCustomer | null {
      const email = (emailRaw || '').toLowerCase().trim()
      if (!email || !email.includes('@')) return null

      if (!map.has(email)) {
        const id = getCustomerIdForEmail(email)
        map.set(email, {
          id,
          full_name: fallbackName?.trim() || 'Valued Client',
          email,
          phone: null,
          address: null,
          vip_tier: 'standard',
          internal_notes: null,
          total_spent: 0,
          orders_count: 0,
          contacts_count: 0,
          leads_count: 0,
          created_at: '',
          last_active: '',
          source: 'auto_sync',
        })
      }
      return map.get(email)!
    }

    // 1. Process orders
    for (const order of orders) {
      const email = order.customer_email || order.email
      const cust = getOrInit(email, order.customer_name)
      if (!cust) continue

      if (order.customer_name && (!cust.full_name || cust.full_name === 'Valued Client')) {
        cust.full_name = order.customer_name.trim()
      }
      if (order.customer_phone && !cust.phone) {
        cust.phone = order.customer_phone.trim()
      }
      const orderAddress = order.address || order.details?.address || order.details?.serviceAddress
      if (orderAddress && !cust.address) {
        cust.address = String(orderAddress).trim()
      }

      cust.orders_count += 1
      const amt = Number(order.amount) || 0
      const isPaid = ['confirmed', 'paid', 'completed'].includes(order.status) || amt > 0
      if (isPaid) {
        cust.total_spent += amt
      }

      if (order.created_at) {
        if (!cust.created_at || new Date(order.created_at) < new Date(cust.created_at)) {
          cust.created_at = order.created_at
        }
        if (!cust.last_active || new Date(order.created_at) > new Date(cust.last_active)) {
          cust.last_active = order.created_at
        }
      }
    }

    // 2. Process contacts
    for (const contact of contacts) {
      const cust = getOrInit(contact.email, contact.full_name)
      if (!cust) continue

      if (contact.full_name && (!cust.full_name || cust.full_name === 'Valued Client')) {
        cust.full_name = contact.full_name.trim()
      }
      if (contact.phone && !cust.phone) {
        cust.phone = contact.phone.trim()
      }
      if (contact.address && !cust.address) {
        cust.address = String(contact.address).trim()
      }

      cust.contacts_count += 1

      if (contact.created_at) {
        if (!cust.created_at || new Date(contact.created_at) < new Date(cust.created_at)) {
          cust.created_at = contact.created_at
        }
        if (!cust.last_active || new Date(contact.created_at) > new Date(cust.last_active)) {
          cust.last_active = contact.created_at
        }
      }
    }

    // 3. Process leads
    for (const lead of leads) {
      const cust = getOrInit(lead.email, lead.customer_name)
      if (!cust) continue

      if (lead.customer_name && (!cust.full_name || cust.full_name === 'Valued Client')) {
        cust.full_name = lead.customer_name.trim()
      }
      if (lead.phone && !cust.phone) {
        cust.phone = lead.phone.trim()
      }
      const leadAddress = lead.details?.address || lead.details?.zip || lead.zip
      if (leadAddress && !cust.address) {
        cust.address = String(leadAddress).trim()
      }

      cust.leads_count += 1

      if (lead.created_at) {
        if (!cust.created_at || new Date(lead.created_at) < new Date(cust.created_at)) {
          cust.created_at = lead.created_at
        }
        if (!cust.last_active || new Date(lead.created_at) > new Date(cust.last_active)) {
          cust.last_active = lead.created_at
        }
      }
    }

    // 4. Process raw customers table (if database schema includes it)
    for (const raw of rawCustomers) {
      const email = (raw.email || '').toLowerCase().trim()
      if (!email) continue
      const cust = getOrInit(email, raw.full_name)
      if (!cust) continue

      if (raw.id) cust.id = raw.id
      if (raw.full_name) cust.full_name = raw.full_name.trim()
      if (raw.phone) cust.phone = raw.phone.trim()
      if (raw.address) cust.address = raw.address.trim()
      if (raw.vip_tier) cust.vip_tier = raw.vip_tier as VIPTier
      if (raw.internal_notes) cust.internal_notes = raw.internal_notes
      if (raw.created_at) {
        if (!cust.created_at || new Date(raw.created_at) < new Date(cust.created_at)) {
          cust.created_at = raw.created_at
        }
        if (!cust.last_active || new Date(raw.created_at) > new Date(cust.last_active)) {
          cust.last_active = raw.created_at
        }
      }
    }

    // 5. Merge manual overrides (or profiles created strictly through admin)
    for (const [overrideEmail, ov] of Object.entries(overrides)) {
      const email = overrideEmail.toLowerCase().trim()
      if (ov.is_deleted) {
        map.delete(email)
        continue
      }

      let cust = map.get(email)
      if (!cust) {
        cust = {
          id: ov.id || getCustomerIdForEmail(email),
          full_name: ov.full_name || 'Valued Client',
          email,
          phone: ov.phone || null,
          address: ov.address || null,
          vip_tier: ov.vip_tier || 'standard',
          internal_notes: ov.internal_notes || null,
          total_spent: 0,
          orders_count: 0,
          contacts_count: 0,
          leads_count: 0,
          created_at: ov.created_at || new Date().toISOString(),
          last_active: ov.updated_at || ov.created_at || new Date().toISOString(),
          source: 'manual',
        }
        map.set(email, cust)
      } else {
        if (ov.full_name) cust.full_name = ov.full_name.trim()
        if (ov.phone) cust.phone = ov.phone.trim()
        if (ov.address) cust.address = ov.address.trim()
        if (ov.vip_tier) cust.vip_tier = ov.vip_tier
        if (ov.internal_notes) cust.internal_notes = ov.internal_notes
      }
    }

    // 6. Dynamic VIP Tier calculation if not manually locked
    const nowIso = new Date().toISOString()
    for (const [email, cust] of map.entries()) {
      if (!cust.created_at) cust.created_at = nowIso
      if (!cust.last_active) cust.last_active = cust.created_at

      const ov = overrides[email]
      if (ov?.vip_tier) {
        cust.vip_tier = ov.vip_tier
      } else {
        // Automatic luxury VIP evaluation
        if (cust.total_spent >= 1000 || cust.orders_count >= 3) {
          cust.vip_tier = 'estate_elite'
        } else if (cust.total_spent >= 300 || cust.orders_count >= 1 || cust.leads_count >= 2) {
          cust.vip_tier = 'vip'
        } else {
          cust.vip_tier = 'standard'
        }
      }
    }

    // Sort by last active descending
    const result = Array.from(map.values()).sort(
      (a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime()
    )

    return result
  } catch (err) {
    console.error('[getUnifiedCustomers Error]', err)
    return []
  }
}

/**
 * Persists an edited or newly created client profile in overrides and customers table.
 */
export async function saveCustomerProfile(
  supabase: SupabaseClient,
  payload: {
    id?: string
    fullName: string
    email: string
    phone?: string | null
    address?: string | null
    vipTier?: VIPTier
    internalNotes?: string | null
  }
): Promise<UnifiedCustomer> {
  const normEmail = payload.email.toLowerCase().trim()
  const customerId = payload.id || getCustomerIdForEmail(normEmail)

  // 1. Fetch existing overrides
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'customer_overrides')
    .maybeSingle()

  const currentOverrides: Record<string, CustomerOverride> = settingsData?.value || {}

  const updatedOverride: CustomerOverride = {
    ...currentOverrides[normEmail],
    id: customerId,
    full_name: payload.fullName.trim(),
    phone: payload.phone?.trim() || null,
    address: payload.address?.trim() || null,
    vip_tier: payload.vipTier || 'standard',
    internal_notes: payload.internalNotes?.trim() || null,
    is_deleted: false,
    updated_at: new Date().toISOString(),
    created_at: currentOverrides[normEmail]?.created_at || new Date().toISOString(),
  }

  currentOverrides[normEmail] = updatedOverride

  // 2. Upsert into site_settings
  await supabase.from('site_settings').upsert({
    key: 'customer_overrides',
    value: currentOverrides,
    updated_at: new Date().toISOString(),
  })

  // 3. Attempt upsert into customers table if it exists
  try {
    await supabase.from('customers').upsert(
      {
        id: customerId.startsWith('cust_') ? undefined : customerId,
        full_name: payload.fullName.trim(),
        email: normEmail,
        phone: payload.phone?.trim() || null,
        address: payload.address?.trim() || null,
        vip_tier: payload.vipTier || 'standard',
        internal_notes: payload.internalNotes?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )
  } catch (custTableErr) {
    console.warn('[saveCustomerProfile] Optional customers table upsert skipped:', custTableErr)
  }

  // 4. Return unified profile
  const allCustomers = await getUnifiedCustomers(supabase)
  const saved = allCustomers.find((c) => c.email.toLowerCase() === normEmail)
  if (saved) return saved

  return {
    id: customerId,
    full_name: payload.fullName.trim(),
    email: normEmail,
    phone: payload.phone?.trim() || null,
    address: payload.address?.trim() || null,
    vip_tier: payload.vipTier || 'standard',
    internal_notes: payload.internalNotes?.trim() || null,
    total_spent: 0,
    orders_count: 0,
    contacts_count: 0,
    leads_count: 0,
    created_at: updatedOverride.created_at || new Date().toISOString(),
    last_active: updatedOverride.updated_at || new Date().toISOString(),
    source: 'manual',
  }
}

/**
 * Removes a client profile from directory (soft delete in overrides).
 */
export async function deleteCustomerProfile(
  supabase: SupabaseClient,
  idOrEmail: string
): Promise<{ success: boolean; deletedId: string }> {
  let targetEmail = idOrEmail.toLowerCase().trim()

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'customer_overrides')
    .maybeSingle()

  const currentOverrides: Record<string, CustomerOverride> = settingsData?.value || {}

  if (!targetEmail.includes('@')) {
    const foundEntry = Object.entries(currentOverrides).find(([_, ov]) => ov.id === idOrEmail)
    if (foundEntry) {
      targetEmail = foundEntry[0]
    } else {
      const unified = await getUnifiedCustomers(supabase)
      const found = unified.find((c) => c.id === idOrEmail)
      if (found) targetEmail = found.email
    }
  }

  if (targetEmail.includes('@')) {
    currentOverrides[targetEmail] = {
      ...(currentOverrides[targetEmail] || {}),
      is_deleted: true,
      updated_at: new Date().toISOString(),
    }

    await supabase.from('site_settings').upsert({
      key: 'customer_overrides',
      value: currentOverrides,
      updated_at: new Date().toISOString(),
    })
  }

  try {
    if (idOrEmail.includes('@')) {
      await supabase.from('customers').delete().eq('email', idOrEmail)
    } else {
      await supabase.from('customers').delete().eq('id', idOrEmail)
    }
  } catch (custErr) {
    console.warn('[deleteCustomerProfile] Optional customers table delete skipped:', custErr)
  }

  return { success: true, deletedId: idOrEmail }
}
