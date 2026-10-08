'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const faqs = [
  {
    category: 'House Cleaning',
    q: 'Do I need to provide cleaning supplies or equipment?',
    a: 'No. Our professional cleaners bring all the necessary premium, eco-friendly supplies and high-grade equipment required to make your home spotless.'
  },
  {
    category: 'House Cleaning',
    q: 'What is included in a deep clean vs. a standard clean?',
    a: 'A standard clean covers all general upkeep (dusting, mopping, bathrooms, kitchens). A deep clean is more intensive, getting into baseboards, interior windows, inside appliances, and hard-to-reach areas.'
  },
  {
    category: 'Remodeling',
    q: 'How long does a typical bathroom remodel take?',
    a: 'Depending on the scope, a standard cosmetic remodel takes 2-3 weeks, while a full gut-remodel (moving plumbing, custom tile) typically takes 4-6 weeks from demolition to final polish.'
  },
  {
    category: 'Remodeling',
    q: 'Do you handle the design and material sourcing?',
    a: 'Yes! L\'Atelier Maison offers a full design-build experience. We handle architectural layout, material sourcing, permitting, and final execution.'
  },
  {
    category: 'Home Services',
    q: 'Are your tradesmen licensed and insured?',
    a: 'Absolutely. Every artisan, plumber, electrician, and handyman dispatched by L\'Atelier Maison is fully licensed, bonded, and insured for your peace of mind.'
  },
  {
    category: 'Home Services',
    q: 'Do you offer emergency repair services?',
    a: 'Yes, our estate management division handles emergency plumbing and electrical repairs. Contact us directly for immediate dispatch.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} style={{ padding: '6rem 5%', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="font-serif" style={{ fontSize: '3rem', color: 'var(--color-secondary)', margin: '0 0 1rem 0' }}>Common Questions.</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#4b5563' }}>
            Everything you need to know about our luxury services.
          </p>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" style={{ borderBottom: '1px solid #eaeaea', padding: '1.5rem 0' }}>
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', padding: 0 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{faq.category}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-secondary)' }}>{faq.q}</span>
                </div>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', transition: 'transform 0.3s', transform: openIndex === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              
              <div style={{ 
                height: openIndex === i ? 'auto' : 0, 
                overflow: 'hidden', 
                opacity: openIndex === i ? 1 : 0,
                transition: 'all 0.4s ease'
              }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', lineHeight: 1.7, color: '#4b5563', margin: '1rem 0 0 0', paddingRight: '2rem' }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
