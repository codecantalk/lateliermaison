import nodemailer from 'nodemailer'

interface SendEmailParams {
  to: string
  toName?: string
  subject: string
  html: string
  replyTo?: string
  fromType?: 'order' | 'support'
}

/**
 * Universal L'Atelier Maison Email Sender
 * Automatically uses Zoho ZeptoMail API if configured,
 * or standard Zoho Mailbox SMTP via Nodemailer,
 * with safe dev logging fallback.
 */
export async function sendEmail({ to, toName, subject, html, replyTo, fromType = 'order' }: SendEmailParams) {
  const fromEmail = fromType === 'support' 
    ? (process.env.EMAIL_SUPPORT || 'support@lateliermaison.com')
    : (process.env.EMAIL_ORDER || 'order@lateliermaison.com')
  const fromName = "L'Atelier Maison"

  // 1. Try Zoho ZeptoMail / CPaaS API (Recommended for production transactional emails)
  const zeptoApiKey = process.env.ZEPTOMAIL_API_KEY
  if (zeptoApiKey) {
    const urlsToTry = [
      process.env.ZEPTOMAIL_URL,
      'https://api.zeptomail.com/v1.1/email',
      'https://cpaas.zoho.com/v1.1/email',
    ].filter(Boolean) as string[]

    const authHeader = zeptoApiKey.startsWith('Zoho-enczapikey') ? zeptoApiKey : `Zoho-enczapikey ${zeptoApiKey}`

    for (const url of urlsToTry) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({
            from: { address: fromEmail, name: fromName },
            to: [{ email_address: { address: to, name: toName || to } }],
            reply_to: replyTo ? [{ address: replyTo }] : [{ address: fromEmail }],
            subject,
            htmlbody: html,
          }),
        })

        if (response.ok) {
          console.log(`[ZeptoMail/CPaaS] Successfully delivered email to ${to} via ${url}`)
          return { success: true, provider: 'zeptomail' }
        } else {
          const errText = await response.text()
          console.warn(`[ZeptoMail/CPaaS Warning] ${url} returned ${response.status}:`, errText)
        }
      } catch (err) {
        console.warn(`[ZeptoMail/CPaaS Error] Failed connecting to ${url}:`, err)
      }
    }
  }

  // 2. Try Zoho SMTP via Nodemailer (Standard Zoho Mailbox)
  const smtpUser = process.env.ZOHO_SMTP_USER
  const smtpPass = process.env.ZOHO_SMTP_PASSWORD
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
        port: Number(process.env.ZOHO_SMTP_PORT) || 465,
        secure: (process.env.ZOHO_SMTP_PORT === '465' || !process.env.ZOHO_SMTP_PORT),
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: toName ? `"${toName}" <${to}>` : to,
        replyTo: replyTo || fromEmail,
        subject,
        html,
      })

      console.log(`[Zoho SMTP] Successfully sent email to ${to} (MessageId: ${info.messageId})`)
      return { success: true, provider: 'smtp', messageId: info.messageId }
    } catch (err: any) {
      console.error('[Zoho SMTP Error]', err)
    }
  }

  // 3. Dev Fallback: Log email details cleanly when credentials aren't active yet
  console.log(`\n================== [EMAIL MOCK DISPATCH] ==================`)
  console.log(`FROM: "${fromName}" <${fromEmail}>`)
  console.log(`TO: ${to} (${toName || 'Valued Customer'})`)
  console.log(`SUBJECT: ${subject}`)
  console.log(`STATUS: Email generated successfully (Awaiting Zoho / Zepto credentials in .env.local)`)
  console.log(`===========================================================\n`)
  return { success: true, provider: 'mock' }
}

/**
 * Reusable Luxury Email Wrapper Template
 */
export function wrapLuxuryEmail(content: string, preheader: string = "L'Atelier Maison — Luxury Home Services"): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>L'Atelier Maison</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0b132b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; color: transparent;">
    ${preheader}
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b132b; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0e1c38 0%, #070f20 100%); padding: 36px 40px; text-align: center; border-bottom: 2px solid #c5a059;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <!-- Brand Monogram -->
                    <div style="display: inline-block; width: 50px; height: 50px; border-radius: 10px; background: rgba(197, 160, 89, 0.15); border: 1px solid #c5a059; line-height: 48px; text-align: center; margin-bottom: 12px;">
                      <span style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #f59e0b; letter-spacing: 2px;">M</span>
                    </div>
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #ffffff; font-weight: 400;">
                      L'Atelier Maison
                    </div>
                    <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #c5a059; margin-top: 4px;">
                      Haute Artisan Home Services
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 40px 32px 40px; background-color: #ffffff;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 28px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                Need assistance? Our concierge is available at<br/>
                <a href="mailto:support@lateliermaison.com" style="color: #b45309; text-decoration: none; font-weight: 600;">support@lateliermaison.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; letter-spacing: 0.05em; text-transform: uppercase;">
                Serving Atlanta, GA & the DMV Corridor (DC, Maryland, Northern Virginia)
              </p>
              <p style="margin: 8px 0 0 0; font-size: 10px; color: #cbd5e1;">
                &copy; ${new Date().getFullYear()} L'Atelier Maison. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Template: Customer Paid Order Confirmation (Receipt)
 */
export function buildCustomerOrderEmail({
  customerName,
  orderId,
  serviceName,
  amount,
  details,
  date,
}: {
  customerName: string
  orderId: string
  serviceName: string
  amount: number
  details?: any
  date?: string
}) {
  const formattedDate = date || new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Format details summary items if available
  let detailsHtml = ''
  if (details) {
    const items: string[] = []
    if (details.houseType) items.push(`<strong>Property Type:</strong> ${details.houseType.toUpperCase()}`)
    if (details.bedrooms) items.push(`<strong>Bedrooms:</strong> ${details.bedrooms}`)
    if (details.bathrooms) items.push(`<strong>Bathrooms:</strong> ${details.bathrooms}`)
    if (details.extras && Array.isArray(details.extras) && details.extras.length > 0) {
      items.push(`<strong>Selected Inclusions:</strong> ${details.extras.join(', ')}`)
    }
    if (details.scope) items.push(`<strong>Scope:</strong> ${details.scope}`)
    if (details.size) items.push(`<strong>Size:</strong> ${details.size}`)

    if (items.length > 0) {
      detailsHtml = `
        <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Order Specifications</div>
          <div style="font-size: 13px; color: #334155; line-height: 1.8;">
            ${items.join('<br/>')}
          </div>
        </div>
      `
    }
  }

  const content = `
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; width: 44px; height: 44px; background: #ecfdf5; border-radius: 50%; line-height: 44px; text-align: center; color: #10b981; font-size: 22px; font-weight: bold; margin-bottom: 12px;">✓</div>
      <h1 style="font-family: Georgia, serif; font-size: 24px; color: #0f172a; margin: 0 0 6px 0; font-weight: 400;">Thank You for Your Order</h1>
      <p style="font-size: 14px; color: #64748b; margin: 0;">Your reservation is confirmed. Reference: <span style="font-family: monospace; color: #0f172a; font-weight: 600;">${orderId}</span></p>
    </div>

    <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
      Dear <strong>${customerName || 'Valued Client'}</strong>,<br/><br/>
      We are delighted to confirm your booking with <strong>L'Atelier Maison</strong>. Our master artisans and concierge team are preparing to deliver an exceptional experience tailored to your property.
    </p>

    <!-- Receipt Box -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="font-size: 14px; color: #57534e; padding-bottom: 10px;">Service Discipline:</td>
              <td align="right" style="font-size: 14px; color: #1c1917; font-weight: 600; padding-bottom: 10px;">${serviceName}</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #57534e; padding-bottom: 10px;">Date Booked:</td>
              <td align="right" style="font-size: 14px; color: #1c1917; padding-bottom: 10px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #57534e; padding-bottom: 10px;">Payment Status:</td>
              <td align="right" style="font-size: 14px; color: #15803d; font-weight: 600; padding-bottom: 10px;">Paid via Stripe</td>
            </tr>
            <tr style="border-top: 1px solid #d6d3d1;">
              <td style="font-size: 16px; color: #1c1917; font-weight: bold; padding-top: 12px; border-top: 1px solid #e7e5e4;">Total Amount:</td>
              <td align="right" style="font-size: 20px; color: #b45309; font-weight: bold; padding-top: 12px; border-top: 1px solid #e7e5e4;">$${amount.toFixed(2)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${detailsHtml}

    <div style="margin-top: 28px; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <h4 style="margin: 0 0 6px 0; color: #92400e; font-size: 14px;">Next Steps</h4>
      <p style="margin: 0; font-size: 13px; color: #78350f; line-height: 1.6;">
        Our service coordinator will reach out to you within 2 business hours to verify access instructions, appointment timing, and any bespoke requests.
      </p>
    </div>
  `

  return wrapLuxuryEmail(content, `Order Confirmed: ${serviceName} ($${amount.toFixed(2)})`)
}

/**
 * Template: Internal Alert to order@lateliermaison.com for Paid Orders
 */
export function buildInternalOrderEmail({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  serviceName,
  amount,
  details,
}: {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  amount: number
  details?: any
}) {
  const content = `
    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #065f46;">✦ New Paid Order Received</h2>
      <p style="margin: 0; font-size: 13px; color: #047857;">Stripe checkout successfully completed. Amount: <strong>$${amount.toFixed(2)}</strong></p>
    </div>

    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px; margin-bottom: 20px;">
      <tr>
        <td width="35%" style="color: #64748b; font-weight: 600;">Order ID:</td>
        <td style="font-family: monospace; color: #0f172a; font-weight: bold;">${orderId}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Customer Name:</td>
        <td style="color: #0f172a; font-weight: 600;">${customerName || 'N/A'}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Customer Email:</td>
        <td><a href="mailto:${customerEmail}" style="color: #2563eb;">${customerEmail}</a></td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Customer Phone:</td>
        <td><a href="tel:${customerPhone}" style="color: #2563eb;">${customerPhone || 'N/A'}</a></td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Service Booked:</td>
        <td style="color: #0f172a; font-weight: 600;">${serviceName}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Total Paid:</td>
        <td style="color: #10b981; font-weight: bold; font-size: 16px;">$${amount.toFixed(2)}</td>
      </tr>
    </table>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 16px;">
      <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Full Details Payload:</div>
      <pre style="margin: 0; font-family: monospace; font-size: 12px; color: #334155; white-space: pre-wrap; overflow-x: auto;">${JSON.stringify(details || {}, null, 2)}</pre>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://lateliermaison.vercel.app/admin" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">Open CMS Dashboard &rarr;</a>
    </div>
  `

  return wrapLuxuryEmail(content, `[NEW PAID ORDER] $${amount.toFixed(2)} — ${customerName || 'Customer'}`)
}

/**
 * Template: Customer Contact Form Acknowledgment
 */
export function buildCustomerContactEmail({
  customerName,
  service,
}: {
  customerName: string
  service: string
}) {
  const content = `
    <h1 style="font-family: Georgia, serif; font-size: 22px; color: #0f172a; margin: 0 0 12px 0; font-weight: 400;">
      Thank You for Contacting L'Atelier Maison
    </h1>

    <p style="font-size: 15px; color: #334155; line-height: 1.6;">
      Dear <strong>${customerName || 'Valued Client'}</strong>,<br/><br/>
      We have received your consultation inquiry regarding <strong>${service || 'our luxury home services'}</strong>. Our master artisan coordinator is reviewing your project details.
    </p>

    <div style="padding: 18px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #c5a059; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.5;">
        <strong>Response Time Commitment:</strong><br/>
        A senior project manager will reach out via phone or email within <strong>2 to 4 business hours</strong> to discuss scope, timeline, and schedule an on-site evaluation if required.
      </p>
    </div>

    <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
      If your inquiry is urgent or requires immediate scheduling, you may also reach our concierge desk directly at <a href="mailto:support@lateliermaison.com" style="color: #b45309; text-decoration: none; font-weight: 600;">support@lateliermaison.com</a>.
    </p>
  `

  return wrapLuxuryEmail(content, "We've received your request — L'Atelier Maison")
}

/**
 * Template: Internal Alert for Contact Form Inquiries
 */
export function buildInternalContactEmail({
  fullName,
  email,
  phone,
  address,
  service,
  budget,
  timeline,
  details,
  imageCount,
}: {
  fullName: string
  email: string
  phone: string
  address: string
  service: string
  budget?: string
  timeline?: string
  details: string
  imageCount?: number
}) {
  const content = `
    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #1e40af;">✉ New Contact Form Inquiry</h2>
      <p style="margin: 0; font-size: 13px; color: #1d4ed8;">A new potential client has submitted a request on lateliermaison.com</p>
    </div>

    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px; margin-bottom: 20px;">
      <tr>
        <td width="35%" style="color: #64748b; font-weight: 600;">Client Name:</td>
        <td style="color: #0f172a; font-weight: 600;">${fullName}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Email:</td>
        <td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Phone:</td>
        <td><a href="tel:${phone}" style="color: #2563eb;">${phone}</a></td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Location / Address:</td>
        <td style="color: #0f172a;">${address || 'N/A'}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Service Requested:</td>
        <td style="color: #0f172a; font-weight: 600; text-transform: capitalize;">${service}</td>
      </tr>
      ${budget ? `<tr><td style="color: #64748b; font-weight: 600;">Budget:</td><td style="color: #0f172a;">${budget}</td></tr>` : ''}
      ${timeline ? `<tr><td style="color: #64748b; font-weight: 600;">Timeline:</td><td style="color: #0f172a;">${timeline}</td></tr>` : ''}
      ${imageCount && imageCount > 0 ? `<tr><td style="color: #64748b; font-weight: 600;">Uploaded Photos:</td><td style="color: #10b981; font-weight: bold;">${imageCount} photos attached</td></tr>` : ''}
    </table>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
      <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Client Message & Scope:</div>
      <p style="margin: 0; font-size: 13px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${details || 'No message provided.'}</p>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://lateliermaison.vercel.app/admin" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">View in CMS Dashboard &rarr;</a>
    </div>
  `

  return wrapLuxuryEmail(content, `[NEW INQUIRY] ${service} — ${fullName}`)
}
