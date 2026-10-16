import { createClient } from '@/lib/supabase/server'
import EstimatesManagerClient from './EstimatesManagerClient'

export const revalidate = 0

export default async function AdminEstimatesPage() {
  const supabase = await createClient()

  let estimates: any[] = []
  try {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) estimates = data
  } catch (err) {
    console.warn('[Admin Estimates Page Warning]', err)
  }

  return <EstimatesManagerClient initialEstimates={estimates} />
}
