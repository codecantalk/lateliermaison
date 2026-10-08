'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const reviews = [
  {
    name: 'Sarah M.',
    location: 'Atlanta, GA',
    text: 'L\'Atelier Maison transformed our outdated bathroom into a master spa. Their attention to detail and professionalism were unmatched. The team was punctual and respectful of our home throughout the entire renovation process. Highly recommended!',
    rating: 5
  },
  {
    name: 'James L.',
    location: 'DMV Area',
    text: 'We hired them for a deep luxury house cleaning before hosting a major event, and I was absolutely blown away. Every corner was spotless. They truly understand what premium service means.',
    rating: 5
  },
  {
    name: 'Elena R.',
    location: 'Bethesda, MD',
    text: 'When our water heater broke down in the middle of winter, their emergency home service team was there within hours. Fast, transparent pricing, and impeccable cleanup afterwards.',
    rating: 5
  },
  {
    name: 'Michael B.',
    location: 'Alpharetta, GA',
    text: 'We use their estate management services for our properties. Knowing that everything from landscaping to HVAC maintenance is handled with one phone call gives us complete peace of mind.',
    rating: 5
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 6000) // Change slide every 6 seconds
    
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{ padding: '8rem 5%', backgroundColor: '#FDFBF7', position: 'relative', overflow: 'hidden' }}>
      
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', color: '#d97706', marginBottom: '1rem', fontSize: '1.5rem' }}>
            ★★★★★
          </div>
          <h2 className="font-serif" style={{ fontSize: '3rem', color: 'var(--color-secondary)', margin: '0 0 1rem 0' }}>Client Testimonials.</h2>
        </div>

        <div style={{ position: 'relative', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ position: 'absolute', width: '100%', padding: '0 1rem' }}
            >
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', lineHeight: 1.6, color: '#374151', fontStyle: 'italic', marginBottom: '2rem' }}>
                "{reviews[currentIndex].text}"
              </p>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 0.25rem 0', color: 'var(--color-secondary)' }}>{reviews[currentIndex].name}</h4>
                <span style={{ fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{reviews[currentIndex].location}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '3rem' }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '30px' : '10px',
                height: '10px',
                borderRadius: '10px',
                backgroundColor: i === currentIndex ? '#d97706' : '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease'
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
