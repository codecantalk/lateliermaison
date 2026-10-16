import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, buildCustomerContactEmail, wrapLuxuryEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      customerName,
      email,
      phone,
      serviceType,
      totalPrice = 0,
      details = {},
    } = body

    if (!customerName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Insert into leads table
    const { data: leadData, error: dbError } = await supabase
      .from('leads')
      .insert({
        customer_name: customerName,
        email,
        phone,
        service_type: serviceType || 'Estimate Consultation',
        total_price: totalPrice,
        details: details,
        status: 'pending',
      })
      .select('id')
      .maybeSingle()

    if (dbError) {
      console.error('[Lead Route DB Error]', dbError)
    }

    const leadId = leadData?.id || null

    // 2. Dispatch Customer Confirmation Email
    const quoteDisplay = details?.estimatedPriceRange 
      ? details.estimatedPriceRange 
      : (Number(totalPrice) > 0 ? `$${Number(totalPrice).toFixed(2)}` : 'On-Site Diagnostic & Quote')

    // 2. Dispatch Customer Confirmation Email
    if (email && email.includes('@')) {
      try {
        const customerHtml = buildCustomerContactEmail({
          customerName,
          service: `${serviceType || 'Home Service'} Estimate (${quoteDisplay})`,
        })

        await sendEmail({
          to: email,
          toName: customerName,
          subject: `Estimate Received: ${serviceType || "L'Atelier Maison"} — Consultation Pending`,
          html: customerHtml,
          fromType: 'order',
        })
      } catch (custErr) {
        console.error('[Lead Route] Customer email error:', custErr)
      }
    }

    // 3. Dispatch Internal Alert to order@lateliermaison.com
    try {
      const adminEmail = process.env.EMAIL_ORDER || 'order@lateliermaison.com'
      const internalContent = `
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #065f46;">✦ New Estimate Quote Request</h2>
          <p style="margin: 0; font-size: 13px; color: #047857;">Customer generated a quote calculation on the estimate page.</p>
        </div>

        <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td width="35%" style="color: #64748b; font-weight: 600;">Customer Name:</td>
            <td style="color: #0f172a; font-weight: 600;">${customerName}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600;">Email:</td>
            <td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600;">Phone:</td>
            <td><a href="tel:${phone}" style="color: #2563eb;">${phone || 'Not provided'}</a></td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600;">Service Category:</td>
            <td style="color: #0f172a; font-weight: 600;">${serviceType}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600;">Estimated Quote:</td>
            <td style="color: #b45309; font-weight: bold; font-size: 16px;">${quoteDisplay}</td>
          </tr>
        </table>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Calculation Specs:</div>
          <pre style="margin: 0; font-family: monospace; font-size: 12px; color: #334155; white-space: pre-wrap; overflow-x: auto;">${JSON.stringify(details || {}, null, 2)}</pre>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://www.lateliermaison.com/admin/estimates" style="display: inline-block; background: #0B132B; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">View in CMS Estimates Portal &rarr;</a>
        </div>
      `

      // Send to order desk
      await sendEmail({
        to: adminEmail,
        toName: "L'Atelier Maison Order Desk",
        subject: `✦ [NEW ESTIMATE LEAD] ${quoteDisplay} — ${customerName} (${serviceType})`,
        html: wrapLuxuryEmail(internalContent, `New estimate lead from ${customerName}`),
        replyTo: email,
        fromType: 'order',
      })
    } catch (adminErr) {
      console.error('[Lead Route] Admin alert email error:', adminErr)
    }

    return NextResponse.json({ success: true, id: leadId })
  } catch (err: any) {
    console.error('[Lead Route Error]', err)
    return NextResponse.json({ error: err.message || 'Failed to process lead.' }, { status: 500 })
  }
}
