import { createClient } from '@/lib/supabase/server'
import ContactsManagerClient from './ContactsManagerClient'

export const revalidate = 0

export default async function AdminContactsPage() {
  const supabase = await createClient()

  let contacts: any[] = []
  try {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) contacts = data
  } catch (err) {
    console.warn('[Admin Contacts Page Warning]', err)
  }

  return <ContactsManagerClient initialContacts={contacts} />
}
