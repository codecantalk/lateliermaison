import { createClient } from '@/lib/supabase/server'
import CustomersManagerClient from './CustomersManagerClient'

export const revalidate = 0

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  let customers: any[] = []
  let orders: any[] = []
  let contacts: any[] = []

  try {
    const { data: custData } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    if (custData) customers = custData

    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (ordersData) orders = ordersData

    const { data: contactsData } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    if (contactsData) contacts = contactsData
  } catch (err) {
    console.warn('[Admin Customers Page Warning]', err)
  }

  return (
    <CustomersManagerClient
      initialCustomers={customers}
      initialOrders={orders}
      initialContacts={contacts}
    />
  )
}
