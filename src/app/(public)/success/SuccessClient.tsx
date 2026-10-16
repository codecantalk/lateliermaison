'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Mail, ArrowRight, Phone, Clock, FileText } from 'lucide-react'

interface OrderDetails {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  serviceName: string
  amount: number
  details?: any
}

export default function SuccessClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No session reference provided.')
      setLoading(false)
      return
    }

    async function verifyPayment() {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
        const data = await res.json()

        if (!res.ok || !data.paid) {
          throw new Error(data.error || 'Payment verification could not be completed.')
        }

        setOrder(data.order)
      } catch (err: any) {
        console.error('Verification error:', err)
        setError(err.message || 'Failed to verify transaction.')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingTop: '140px', 
      paddingBottom: '100px',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="container" style={{ maxWidth: '720px', width: '100%' }}>
        {loading ? (
          <div style={{
            background: 'var(--color-surface, #ffffff)',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            border: '1px solid rgba(197, 160, 89, 0.2)'
          }}>
            <div style={{
              display: 'inline-block',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '3px solid #e2e8f0',
              borderTopColor: '#c5a059',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
              Confirming Your Reservation...
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Securing transaction with Stripe and generating your confirmation receipt.
            </p>
          </div>
        ) : error ? (
          <div style={{
            background: 'var(--color-surface, #ffffff)',
            borderRadius: '16px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            border: '1px solid #fee2e2'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Clock size={28} />
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#991b1b', marginBottom: '0.75rem' }}>
              Verification Notice
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/estimate" style={{
                background: 'var(--color-primary, #0B132B)',
                color: '#ffffff',
                padding: '0.85rem 1.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Return to Estimate
              </Link>
              <Link href="/contact" style={{
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '0.85rem 1.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Contact Support Desk
              </Link>
            </div>
          </div>
        ) : order ? (
          <div style={{
            background: 'var(--color-surface, #ffffff)',
            borderRadius: '20px',
            padding: '3rem 2.5rem',
            boxShadow: '0 25px 50px -12px rgba(11, 19, 43, 0.08), 0 0 0 1px rgba(197, 160, 89, 0.25)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Gold Accent Bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #c5a059 0%, #e6ca85 50%, #c5a059 100%)'
            }} />

            {/* Header Badge */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
                color: '#10b981',
                marginBottom: '1.25rem',
                border: '2px solid rgba(16, 185, 129, 0.3)'
              }}>
                <CheckCircle2 size={36} strokeWidth={2.2} />
              </div>

              <div style={{
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
                color: '#c5a059',
                fontWeight: 700,
                marginBottom: '0.4rem'
              }}>
                Reservation Confirmed
              </div>

              <h1 className="font-serif" style={{ fontSize: '2.4rem', color: 'var(--color-secondary, #0B132B)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                Thank You, {order.customerName.split(' ')[0] || 'Client'}
              </h1>
              
              <p style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '1rem', margin: 0 }}>
                Your payment has been authorized and your service is officially scheduled.
              </p>
            </div>

            {/* Reference Badge */}
            <div style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '10px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.9rem' }}>
                <FileText size={18} color="#c5a059" />
                <span>Reference ID:</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', fontSize: '1rem', letterSpacing: '0.05em' }}>
                {order.orderId.slice(-10).toUpperCase()}
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div style={{
              background: '#fafaf9',
              border: '1px solid #e7e5e4',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#78716c',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
                borderBottom: '1px solid #e7e5e4',
                paddingBottom: '0.5rem'
              }}>
                Receipt Breakdown
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#57534e' }}>Discipline / Service:</span>
                <span style={{ fontWeight: 600, color: '#1c1917' }}>{order.serviceName}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#57534e' }}>Customer Email:</span>
                <span style={{ color: '#1c1917' }}>{order.customerEmail}</span>
              </div>

              {order.customerPhone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <span style={{ color: '#57534e' }}>Contact Phone:</span>
                  <span style={{ color: '#1c1917' }}>{order.customerPhone}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#57534e' }}>Payment Gateway:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 600 }}>
                  <ShieldCheck size={16} /> Stripe Verified
                </span>
              </div>

              <div style={{
                borderTop: '1px solid #d6d3d1',
                paddingTop: '0.85rem',
                marginTop: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c1917' }}>Total Paid</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#b45309', fontFamily: 'var(--font-serif)' }}>
                  ${order.amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Email Dispatch Notice */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              padding: '1.25rem',
              background: '#f0fdf4',
              borderRadius: '10px',
              border: '1px solid #bbf7d0',
              marginBottom: '2rem'
            }}>
              <Mail size={22} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#166534', marginBottom: '0.2rem' }}>
                  Confirmation Dispatched to {order.customerEmail}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#15803d', lineHeight: 1.5 }}>
                  A branded itemized receipt and next steps have been sent to your inbox. If you do not see it within a few moments, please check your spam or promotions tab.
                </div>
              </div>
            </div>

            {/* Next Steps Accordion */}
            <div style={{
              borderLeft: '4px solid #c5a059',
              background: '#fffdfa',
              padding: '1.25rem 1.5rem',
              borderRadius: '0 8px 8px 0',
              marginBottom: '2.5rem'
            }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#78350f', marginBottom: '0.35rem' }}>
                Next Steps from Our Concierge Team
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', lineHeight: 1.6 }}>
                Our artisan coordinator will contact you by phone or email within <strong>2 business hours</strong> to finalize arrival window, key handover/access codes, and address any bespoke preferences for your property.
              </p>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--color-primary, #0B132B)',
                color: '#ffffff',
                padding: '0.9rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(11, 19, 43, 0.15)'
              }}>
                <span>Return to Home</span>
                <ArrowRight size={16} />
              </Link>
              <a href="mailto:support@lateliermaison.com" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '0.9rem 1.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                <Phone size={16} />
                <span>Need Support? Contact Us</span>
              </a>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  )
}
