import { createClient } from '@/lib/supabase/server';
import CMSDashboardClient from './CMSDashboardClient';

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch initial leads
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch initial contacts
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (leadsError) {
    console.error("Failed to load leads:", leadsError);
  }
  
  if (contactsError) {
    console.error("Failed to load contacts:", contactsError);
  }

  return (
    <CMSDashboardClient 
      initialLeads={leads || []} 
      initialContacts={contacts || []} 
    />
  );
}
