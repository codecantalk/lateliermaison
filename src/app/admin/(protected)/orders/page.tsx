import { createClient } from '@/lib/supabase/server'
import OrdersManagerClient from './OrdersManagerClient'

export const revalidate = 0

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  let orders: any[] = []
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      orders = data
    }
  } catch (err) {
    console.warn('Orders query warning:', err)
  }

  return <OrdersManagerClient initialOrders={orders} />
}
