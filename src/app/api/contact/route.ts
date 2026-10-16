import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, buildCustomerContactEmail, buildInternalContactEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      fullName,
      phone,
      email,
      address,
      service,
      budget,
      timeline,
      details,
      imageUrls = [],
    } = body

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    let recordId: string | null = null

    // 1. Try inserting into contacts table
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert({
        full_name: fullName,
        phone,
        email,
        address,
        service,
        budget,
        timeline,
        details,
        image_urls: imageUrls,
        status: 'pending',
      })
      .select('id')
      .maybeSingle()

    if (contactError) {
      console.warn('[Contact Route] Contacts table insert failed, falling back to leads table:', contactError.message)
      // Fallback to leads table so inquiry is never dropped
      const { data: leadData } = await supabase
        .from('leads')
        .insert({
          customer_name: fullName,
          email,
          phone,
          service_type: service || 'Contact Consultation',
          total_price: 0,
          details: { address, budget, timeline, details, imageUrls, source: 'contact_form' },
          status: 'pending',
        })
        .select('id')
        .maybeSingle()

      recordId = leadData?.id || null
    } else {
      recordId = contactData?.id || null
    }

    // 2. Dispatch Customer Confirmation Email
    if (email && email.includes('@')) {
      try {
        const customerHtml = buildCustomerContactEmail({
          customerName: fullName,
          service: service || 'our bespoke home services',
        })

        await sendEmail({
          to: email,
          toName: fullName,
          subject: "Thank You for Contacting L'Atelier Maison — We Have Received Your Request",
          html: customerHtml,
          fromType: 'order',
        })
      } catch (custErr) {
        console.error('[Contact Route] Customer email error:', custErr)
      }
    }

    // 3. Dispatch Internal Alert Email to order@lateliermaison.com
    try {
      const adminEmail = process.env.EMAIL_ORDER || 'order@lateliermaison.com'
      const internalHtml = buildInternalContactEmail({
        fullName,
        email,
        phone: phone || 'Not provided',
        address: address || 'Not provided',
        service: service || 'General Inquiry',
        budget,
        timeline,
        details: details || '',
        imageCount: imageUrls.length,
      })

      await sendEmail({
        to: adminEmail,
        toName: "L'Atelier Maison Client Desk",
        subject: `✉ [NEW INQUIRY] ${service ? service.toUpperCase() : 'CONSULTATION'} — ${fullName}`,
        html: internalHtml,
        replyTo: email,
        fromType: 'order',
      })
    } catch (adminErr) {
      console.error('[Contact Route] Admin alert email error:', adminErr)
    }

    return NextResponse.json({ success: true, id: recordId })
  } catch (err: any) {
    console.error('[Contact Route Error]', err)
    return NextResponse.json({ error: err.message || 'Submission failed.' }, { status: 500 })
  }
}
