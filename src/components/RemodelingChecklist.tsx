'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const checklistData = [
  {
    category: 'Consultation & Vision',
    icon: '📝',
    image: '/consultation-bg.jpg',
    tasks: [
      'Initial walkthrough and space assessment',
      'Understanding your lifestyle and design goals',
      'Budget feasibility and timeline discussion',
      'Preliminary material and layout ideas',
      'Review of zoning and architectural requirements'
    ]
  },
  {
    category: 'Design & Planning',
    icon: '📐',
    image: '/luxury-bathroom.jpg',
    tasks: [
      'Detailed 3D renderings and floor plans',
      'Material selection (flooring, cabinetry, fixtures)',
      'Securing necessary permits and approvals',
      'Finalizing the construction schedule',
      'Pre-construction walkthrough with project manager'
    ]
  },
  {
    category: 'Construction Phase',
    icon: '🚧',
    image: '/award-bg.jpg',
    tasks: [
      'Demolition and structural preparations',
      'Plumbing, electrical, and HVAC updates',
      'Drywall, painting, and custom carpentry',
      'Installation of fixtures and finishes',
      'Rigorous ongoing quality control checks'
    ]
  },
  {
    category: 'Final Walkthrough',
    icon: '✨',
    image: '/hero-bg.jpg',
    tasks: [
      'Comprehensive quality assurance inspection',
      'Client walkthrough and feedback session',
      'Final touch-ups and detailing',
      'Handover of a pristine, transformed space',
      'Post-completion support and warranty'
    ]
  }
]

export default function RemodelingChecklist() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section style={{ padding: '6rem 5%', backgroundColor: '#f8fafc', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d97706', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
            L'Atelier Standard
          </h4>
          <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '3rem', fontWeight: 400, color: '#1e3a8a', margin: 0 }}>
            Comprehensive <span style={{ fontStyle: 'italic', color: '#1e3a8a' }}>Checklist</span>
          </h2>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem', color: '#4b5563', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.6 }}>
            Our meticulous approach ensures no detail is overlooked. Explore our multi-phase architectural remodeling checklist customized for your home.
          </p>
        </div>

        <div className="reveal-up" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(30, 58, 138, 0.1)', paddingBottom: '1rem', justifyContent: 'center' }}>
            {checklistData.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  background: activeTab === index ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05), transparent)' : 'transparent',
                  color: activeTab === index ? '#1e3a8a' : '#6b7280',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '50px',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === index ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderBottom: activeTab === index ? '2px solid #1e3a8a' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{item.icon}</span> {item.category}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ minHeight: '300px', padding: '2rem 1rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}
              >
                {/* Left: Image with cool effect */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ position: 'relative', width: '100%', height: '100%' }}
                  >
                    <Image
                      src={checklistData[activeTab].image}
                      alt={checklistData[activeTab].category}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                    {/* Premium Glass Overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,58,138,0.4) 0%, transparent 50%)' }}></div>
                  </motion.div>
                </div>

                {/* Right: Tasks Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                  {checklistData[activeTab].tasks.map((task, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(255,255,255,0.8)', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid rgba(255,255,255,1)', backdropFilter: 'blur(10px)' }}
                    >
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem', color: '#1e3a8a', margin: 0, lineHeight: 1.5 }}>
                        {task}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
