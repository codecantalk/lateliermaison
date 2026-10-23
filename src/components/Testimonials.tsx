'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const reviews = [
  {
    name: 'Sarah M.',
    location: 'Buckhead, Atlanta, GA',
    text: 'L\'Atelier Maison transformed our home with their deep luxury cleaning. Their attention to detail, punctuality, and eco-friendly products are unmatched. Every corner was pristine. Highly recommended!',
    rating: 5,
    source: 'Google Review',
    date: '2 months ago'
  },
  {
    name: 'James L.',
    location: 'Georgetown, Washington DC',
    text: 'We hired them for a recurring estate cleaning service in the DMV, and I was absolutely blown away. The team is discreet, meticulous, and truly understands what luxury care means.',
    rating: 5,
    source: 'Google Review',
    date: '1 month ago'
  },
  {
    name: 'Elena R.',
    location: 'Bethesda, MD',
    text: 'Their home service team is responsive, honest, and impeccable. We had delicate marble finishes and hardwood floors that required specialized care, and they handled everything flawlessly.',
    rating: 5,
    source: 'Google Review',
    date: '3 weeks ago'
  },
  {
    name: 'Michael B.',
    location: 'Alpharetta & Vinings, GA',
    text: 'We use their estate care and cleaning services for our properties. Knowing that everything is handled with master craftsman rigor gives us complete peace of mind. Outstanding work.',
    rating: 5,
    source: 'Google Review',
    date: '4 months ago'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const googleBusinessUrl = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || 'https://www.google.com/search?q=L%27Atelier+Maison+Atlanta+reviews'

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 6000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{ padding: '7rem 5%', backgroundColor: '#FDFBF7', position: 'relative', overflow: 'hidden' }}>
      
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Clickable Google Badge Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <a
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: '#ffffff',
              padding: '0.6rem 1.4rem',
              borderRadius: '50px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              textDecoration: 'none',
              marginBottom: '1.25rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
              e.currentTarget.style.borderColor = '#d97706'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
            title="Read our 5.0 Star Reviews on Google Business Profile"
          >
            {/* Google SVG Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
              5.0 Rating on Google
            </span>
            <span style={{ color: '#d97706', fontSize: '0.9rem', letterSpacing: '1px' }}>★★★★★</span>
            <span style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 600 }}>
              (See All Reviews ↗)
            </span>
          </a>

          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-secondary)', margin: 0 }}>
            Client Testimonials.
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
            Genuine feedback from homeowners across Atlanta & the DMV Area.
          </p>
        </div>

        {/* Carousel Card */}
        <div style={{ position: 'relative', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ position: 'absolute', width: '100%', padding: '0 1rem' }}
            >
              <div style={{ display: 'inline-flex', gap: '3px', color: '#d97706', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ★★★★★
              </div>
              
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.7, color: '#334155', fontStyle: 'italic', marginBottom: '1.75rem', maxWidth: '850px', margin: '0 auto 1.75rem auto' }}>
                "{reviews[currentIndex].text}"
              </p>

              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0 0 0.25rem 0', color: 'var(--color-secondary)' }}>
                  {reviews[currentIndex].name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {reviews[currentIndex].location}
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <a 
                    href={googleBusinessUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ fontSize: '0.82rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    ✓ {reviews[currentIndex].source} ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2.5rem', marginBottom: '2.5rem' }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '28px' : '9px',
                height: '9px',
                borderRadius: '10px',
                backgroundColor: i === currentIndex ? '#d97706' : '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Call-to-action button to Google Profile */}
        <div>
          <a
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderColor: '#c5a059',
              color: '#1e3a8a',
              fontSize: '0.9rem',
              padding: '0.7rem 1.6rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <span>Read More Google Reviews</span>
            <span style={{ color: '#d97706' }}>→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
