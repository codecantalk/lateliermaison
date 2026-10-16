import { createClient } from '@/lib/supabase/server';
import CMSDashboardClient from './CMSDashboardClient';

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch initial orders
  let orders: any[] = [];
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!ordersError && ordersData) {
      orders = ordersData;
    }
  } catch (err) {
    console.warn("Could not query orders table (run supabase_setup.sql if not created):", err);
  }

  // Fetch initial leads
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  // Fetch initial contacts
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  if (leadsError) {
    console.error("Failed to load leads:", leadsError);
  }
  
  if (contactsError) {
    console.error("Failed to load contacts:", contactsError);
  }

  return (
    <CMSDashboardClient 
      initialOrders={orders || []}
      initialLeads={leads || []} 
      initialContacts={contacts || []} 
    />
  );
}
