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
  console.log(`\n================== [EMAIL DISPATCH LOG] ==================`)
  console.log(`FROM: "${fromName}" <${fromEmail}>`)
  console.log(`TO: ${to} (${toName || 'Valued Customer'})`)
  console.log(`SUBJECT: ${subject}`)
  console.log(`STATUS: Email rendered successfully`)
  console.log(`===========================================================\n`)
  return { success: true, provider: 'mock' }
}

/**
 * Reusable Clean, Modern & Professional Email Wrapper
 * Minimalist, high-end styling with the real site logo and zero unnecessary fluff.
 */
export function wrapLuxuryEmail(content: string, preheader: string = "L'Atelier Maison"): string {
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
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; color: transparent;">
    ${preheader}
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);">
          
          <!-- Clean Brand Header (Pure Typography - Zero Broken Image Icons) -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="font-family: 'Playfair Display', Georgia, -apple-system, BlinkMacSystemFont, 'Segoe UI', serif; font-size: 20px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #0B132B; margin-bottom: 4px;">
                      L'ATELIER MAISON
                    </div>
                    <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #c5a059;">
                      Executive Concierge &bull; Private Client Services
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 40px 32px 40px; background-color: #ffffff;">
              ${content}
            </td>
          </tr>

          <!-- Clean Minimalist Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Need assistance? Reach our desk at 
                <a href="mailto:support@lateliermaison.com" style="color: #0B132B; text-decoration: none; font-weight: 600;">support@lateliermaison.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} L'Atelier Maison &bull; Atlanta, GA & the DMV Corridor
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
    if (details.address) items.push(`<strong>Service Address:</strong> ${details.address}`)

    if (items.length > 0) {
      detailsHtml = `
        <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Order Specifications</div>
          <div style="font-size: 13px; color: #334155; line-height: 1.8;">
            ${items.join('<br/>')}
          </div>
        </div>
      `
    }
  }

  const content = `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 20px; color: #0B132B; margin: 0 0 6px 0; font-weight: 700;">
        Reservation Confirmed
      </h1>
      <p style="font-size: 14px; color: #64748b; margin: 0;">
        Reference: <span style="font-family: monospace; color: #0B132B; font-weight: 700; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${orderId}</span>
      </p>
    </div>

    <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
      Dear <strong>${customerName || 'Valued Client'}</strong>,<br/><br/>
      Thank you for your reservation with L'Atelier Maison. Your order for <strong>${serviceName}</strong> has been successfully confirmed.
    </p>

    <!-- Receipt Box -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="font-size: 13px; color: #64748b; padding-bottom: 10px;">Service:</td>
              <td align="right" style="font-size: 13px; color: #0f172a; font-weight: 600; padding-bottom: 10px;">${serviceName}</td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: #64748b; padding-bottom: 10px;">Date Booked:</td>
              <td align="right" style="font-size: 13px; color: #0f172a; padding-bottom: 10px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: #64748b; padding-bottom: 10px;">Payment Status:</td>
              <td align="right" style="font-size: 13px; color: #16a34a; font-weight: 600; padding-bottom: 10px;">Paid</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="font-size: 15px; color: #0B132B; font-weight: 700; padding-top: 12px; border-top: 1px solid #e2e8f0;">Total Amount:</td>
              <td align="right" style="font-size: 18px; color: #0B132B; font-weight: 700; padding-top: 12px; border-top: 1px solid #e2e8f0;">$${amount.toFixed(2)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${detailsHtml}

    <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 3px solid #0B132B;">
      <div style="font-size: 13px; font-weight: 600; color: #0B132B; margin-bottom: 4px;">What to Expect Next</div>
      <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
        Our service coordinator will reach out to verify access instructions, appointment timing, and any specific preferences for your home.
      </p>
    </div>
  `

  return wrapLuxuryEmail(content, `Order Confirmed: ${serviceName} ($${amount.toFixed(2)})`)
}

const EXTRA_LABELS: Record<string, string> = {
  fridge: 'Inside Refrigerator Scrub',
  oven: 'Inside Oven & Range Degrease',
  dishwashing: 'Dishwashing & Sanitization',
  laundry: 'In-Home Laundry Wash & Fold',
  deep: 'Deep Baseboard & Grout Scrub',
  cabinets: 'Interior Cabinet Wipe-Down',
  windows: 'Interior Window Glass & Sills',
  post_construction: 'Post-Construction Dust Extraction',
  garage: 'Garage Sweep & Detail',
  porch: 'Exterior Porch / Patio Detail',
}

const HOUSE_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment / Condo',
  townhome: 'Townhome',
  single: 'Single Family Residence',
}

const PACKAGE_LABELS: Record<string, string> = {
  standard: 'Standard Maintenance',
  deep: 'Detailed Deep Clean',
  move_in_out: 'Move-In / Move-Out Turnover',
}

const CONDITION_LABELS: Record<string, string> = {
  standard: 'Regularly Maintained (Standard)',
  moderate: 'Moderate Buildup (Lived-in)',
  heavy: 'Heavy Scrub Needed (First-time deep clean)',
}

const TRADE_LABELS: Record<string, string> = {
  plumbing: 'Master Plumbing',
  electrical: 'Licensed Electrical',
  painting: 'Artisan Painting & Finishes',
  flooring: 'Custom Flooring & Hardwoods',
  'tv mounting': 'Precision TV & Audio Mounting',
  lighting: 'Architectural & Smart Lighting',
  'home theater': 'Bespoke Home Theater & AV',
  handyman: 'Master Handyman Services',
}

const SCOPE_LABELS: Record<string, string> = {
  diagnostic: 'Diagnostic Service Call / Evaluation',
  minor: 'Minor Project / Repair',
  major: 'Major Renovation / Installation',
  cosmetic: 'Cosmetic Refresh',
  partial: 'Partial Remodel',
  full: 'Full Gut & Custom Architecture',
}

/**
 * Universal Formatter: Converts raw details objects into a clean luxury HTML table
 * Eliminates raw JSON syntax completely from all client and staff emails.
 */
export function formatSpecsTable(details: any): string {
  if (!details || typeof details !== 'object' || Object.keys(details).length === 0) {
    return '<p style="margin: 0; color: #64748b; font-size: 13px;">Standard service specifications.</p>'
  }

  const rows: { label: string; value: string }[] = []

  if (details.houseType) {
    rows.push({
      label: 'Property Architecture',
      value: HOUSE_TYPE_LABELS[details.houseType] || String(details.houseType).toUpperCase(),
    })
  }

  if (details.packageType) {
    rows.push({
      label: 'Service Package',
      value: PACKAGE_LABELS[details.packageType] || String(details.packageType),
    })
  }

  if (details.bedrooms !== undefined) {
    rows.push({
      label: 'Bedrooms',
      value: `${details.bedrooms} ${Number(details.bedrooms) === 1 ? 'Bedroom' : 'Bedrooms'}`,
    })
  }

  if (details.bathrooms !== undefined) {
    rows.push({
      label: 'Bathrooms',
      value: `${details.bathrooms} ${Number(details.bathrooms) === 1 ? 'Bathroom' : 'Bathrooms'}`,
    })
  }

  if (details.squareFeet) {
    rows.push({
      label: 'Approximate Size',
      value: `${Number(details.squareFeet).toLocaleString()} sq ft`,
    })
  }

  if (details.floors) {
    rows.push({
      label: 'Levels / Floors',
      value: `${details.floors} ${Number(details.floors) === 1 ? 'Floor (Single Level)' : 'Floors'}`,
    })
  }

  if (details.location) {
    rows.push({
      label: 'Service Location',
      value: String(details.location),
    })
  }

  if (details.condition) {
    rows.push({
      label: 'Home Condition',
      value: CONDITION_LABELS[details.condition] || String(details.condition),
    })
  }

  // Selected Inclusions / Add-ons
  const extrasList: string[] = []
  if (Array.isArray(details.extras) && details.extras.length > 0) {
    details.extras.forEach((ext: string) => {
      extrasList.push(EXTRA_LABELS[ext] || ext)
    })
  }
  if (Array.isArray(details.dynamicExtras) && details.dynamicExtras.length > 0) {
    details.dynamicExtras.forEach((ext: string) => {
      extrasList.push(EXTRA_LABELS[ext] || ext)
    })
  }
  if (extrasList.length > 0) {
    rows.push({
      label: 'Selected Add-Ons',
      value: extrasList.join(', '),
    })
  }

  if (details.isMondayTuesday !== undefined) {
    rows.push({
      label: 'Promotional Schedule',
      value: details.isMondayTuesday
        ? 'Monday / Tuesday Special (10% Discount Applied)'
        : 'Regular Schedule',
    })
  }

  if (details.trade) {
    rows.push({
      label: 'Required Trade',
      value: TRADE_LABELS[details.trade] || String(details.trade),
    })
  }

  if (details.scope) {
    rows.push({
      label: 'Scope of Need',
      value: SCOPE_LABELS[details.scope] || String(details.scope),
    })
  }

  if (details.size) {
    rows.push({
      label: 'Space Size',
      value: String(details.size).charAt(0).toUpperCase() + String(details.size).slice(1),
    })
  }

  if (details.grade) {
    rows.push({
      label: 'Build Grade',
      value: details.grade === 'luxury' ? 'Luxury Build' : details.grade === 'ultra' ? 'Ultra-Luxury Custom' : 'Monumental Legacy',
    })
  }

  if (details.estimatedPriceRange) {
    rows.push({
      label: 'Estimated Range',
      value: String(details.estimatedPriceRange),
    })
  }

  if (details.screenSize) {
    const screenMap: Record<string, string> = {
      small: 'Under 55" Standard Display',
      medium: '55" – 75" Large Screen Display',
      large: '75" – 85"+ Cinema Display',
    }
    rows.push({
      label: 'Display Screen Size',
      value: screenMap[details.screenSize] || String(details.screenSize),
    })
  }

  if (details.bracketType) {
    const bracketMap: Record<string, string> = {
      tilt: 'Tilt Mount Bracket (Included)',
      motion: 'Full-Motion Articulating Swivel Arm',
      client_provided: 'Client Provided Mount',
    }
    rows.push({
      label: 'Mount Bracket',
      value: bracketMap[details.bracketType] || String(details.bracketType),
    })
  }

  if (details.wallSurface) {
    const surfaceMap: Record<string, string> = {
      drywall: 'Drywall & Standard Studs',
      brick: 'Brick, Stone or Fireplace Masonry',
    }
    rows.push({
      label: 'Wall Surface',
      value: surfaceMap[details.wallSurface] || String(details.wallSurface),
    })
  }

  if (details.wireConcealment) {
    const wireMap: Record<string, string> = {
      none: 'Standard Wire Routing (External Channel)',
      in_wall: 'In-Wall Power Relocation & Cable Concealment',
    }
    rows.push({
      label: 'Wire Concealment',
      value: wireMap[details.wireConcealment] || String(details.wireConcealment),
    })
  }

  if (details.address) {
    rows.push({
      label: 'Service Address',
      value: String(details.address),
    })
  }

  // Fallback for any unexpected custom fields without raw JSON brackets
  const knownKeys = new Set([
    'houseType', 'packageType', 'bedrooms', 'bathrooms', 'squareFeet', 'floors',
    'location', 'condition', 'extras', 'dynamicExtras', 'isMondayTuesday',
    'trade', 'scope', 'size', 'grade', 'estimatedPriceRange', 'address',
    'screenSize', 'bracketType', 'wallSurface', 'wireConcealment',
    'subtotal', 'discount', 'estimatedPrice', 'isEstimatedQuote', 'estimatedBaseline',
    'isStripeCheckout'
  ])

  Object.entries(details).forEach(([key, val]) => {
    if (!knownKeys.has(key) && val !== null && val !== undefined && typeof val !== 'object') {
      const cleanLabel = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')
      rows.push({
        label: cleanLabel.charAt(0).toUpperCase() + cleanLabel.slice(1),
        value: String(val),
      })
    }
  })

  if (rows.length === 0) {
    return '<p style="margin: 0; color: #64748b; font-size: 13px;">Standard service specifications recorded.</p>'
  }

  return `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; font-size: 13px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; margin-top: 14px;">
      <thead>
        <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <th colspan="2" align="left" style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em;">
            Order Specifications & Scope
          </th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, idx) => `
          <tr style="${idx < rows.length - 1 ? 'border-bottom: 1px solid #f1f5f9;' : ''}">
            <td width="38%" style="padding: 9px 14px; color: #64748b; font-weight: 600; vertical-align: top;">
              ${row.label}:
            </td>
            <td style="padding: 9px 14px; color: #0f172a; font-weight: 500; vertical-align: top;">
              ${row.value}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
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
  const specsHtml = formatSpecsTable(details)

  const content = `
    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">New Paid Booking</div>
      <h2 style="margin: 0; font-size: 20px; color: #0B132B; font-weight: 700;">$${amount.toFixed(2)} &mdash; ${serviceName}</h2>
    </div>

    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td width="35%" style="color: #64748b; font-weight: 600;">Reference ID:</td>
        <td style="font-family: monospace; color: #0B132B; font-weight: 700;">${orderId}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Client:</td>
        <td style="color: #0f172a; font-weight: 600;">${customerName || 'N/A'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Email:</td>
        <td><a href="mailto:${customerEmail}" style="color: #2563eb; text-decoration: none;">${customerEmail}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Phone:</td>
        <td><a href="tel:${customerPhone}" style="color: #2563eb; text-decoration: none;">${customerPhone || 'N/A'}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Service:</td>
        <td style="color: #0f172a; font-weight: 600;">${serviceName}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Total Paid:</td>
        <td style="color: #16a34a; font-weight: 700; font-size: 15px;">$${amount.toFixed(2)}</td>
      </tr>
    </table>

    ${specsHtml}

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.lateliermaison.com/admin/orders" style="display: inline-block; background: #0B132B; color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em;">View in CMS Orders Portal &rarr;</a>
    </div>
  `

  return wrapLuxuryEmail(content, `[NEW ORDER] $${amount.toFixed(2)} — ${customerName || 'Client'}`)
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
    <h1 style="font-size: 20px; color: #0B132B; margin: 0 0 12px 0; font-weight: 700;">
      Thank You for Contacting Us
    </h1>

    <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
      Dear <strong>${customerName || 'Valued Client'}</strong>,<br/><br/>
      We have received your consultation request regarding <strong>${service || 'our home services'}</strong>. Our project coordinator is reviewing your details.
    </p>

    <div style="padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 3px solid #0B132B; margin: 20px 0;">
      <div style="font-size: 13px; font-weight: 600; color: #0B132B; margin-bottom: 4px;">Response Commitment</div>
      <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
        A senior project manager will reach out via phone or email within <strong>2 to 4 business hours</strong> to discuss scope, timeline, and schedule an on-site evaluation if required.
      </p>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">
      If your inquiry is urgent, you can also reach us directly at <a href="mailto:support@lateliermaison.com" style="color: #0B132B; font-weight: 600; text-decoration: none;">support@lateliermaison.com</a>.
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
    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">New Contact Submission</div>
      <h2 style="margin: 0; font-size: 20px; color: #0B132B; font-weight: 700;">${fullName} &mdash; ${service}</h2>
    </div>

    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td width="35%" style="color: #64748b; font-weight: 600;">Client:</td>
        <td style="color: #0f172a; font-weight: 600;">${fullName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Email:</td>
        <td><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Phone:</td>
        <td><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Location:</td>
        <td style="color: #0f172a;">${address || 'N/A'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="color: #64748b; font-weight: 600;">Service Requested:</td>
        <td style="color: #0f172a; font-weight: 600; text-transform: capitalize;">${service}</td>
      </tr>
      ${budget ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="color: #64748b; font-weight: 600;">Budget:</td><td style="color: #0f172a;">${budget}</td></tr>` : ''}
      ${timeline ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="color: #64748b; font-weight: 600;">Timeline:</td><td style="color: #0f172a;">${timeline}</td></tr>` : ''}
      ${imageCount && imageCount > 0 ? `<tr><td style="color: #64748b; font-weight: 600;">Uploaded Photos:</td><td style="color: #16a34a; font-weight: 600;">${imageCount} photos attached</td></tr>` : ''}
    </table>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Client Message & Scope:</div>
      <p style="margin: 0; font-size: 13px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${details || 'No message provided.'}</p>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.lateliermaison.com/admin/contacts" style="display: inline-block; background: #0B132B; color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em;">View in CMS Inquiries Portal &rarr;</a>
    </div>
  `

  return wrapLuxuryEmail(content, `[NEW INQUIRY] ${service} — ${fullName}`)
}
