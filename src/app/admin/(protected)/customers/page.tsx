import { createClient } from '@/lib/supabase/server'
import CustomersManagerClient from './CustomersManagerClient'
import { getUnifiedCustomers } from '@/lib/customers'

export const revalidate = 0

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  let customers: any[] = []
  let orders: any[] = []
  let contacts: any[] = []
  let leads: any[] = []

  try {
    const [unifiedCusts, { data: ordersData }, { data: contactsData }, { data: leadsData }] =
      await Promise.all([
        getUnifiedCustomers(supabase),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
      ])

    if (unifiedCusts) customers = unifiedCusts
    if (ordersData) orders = ordersData
    if (contactsData) contacts = contactsData
    if (leadsData) leads = leadsData
  } catch (err) {
    console.warn('[Admin Customers Page Warning]', err)
  }

  return (
    <CustomersManagerClient
      initialCustomers={customers}
      initialOrders={orders}
      initialContacts={contacts}
      initialLeads={leads}
    />
  )
}
