'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import landingStyles from './LandingPage.module.css'

const DEFAULT_ITEMS = [
  { img: '/portfolio-images/IMG_8183.JPG', title: 'Buckhead Master Residence', location: 'Atlanta, GA' },
  { img: '/portfolio-images/IMG_8184.JPG', title: 'Georgetown Historic Rowhome', location: 'Washington, DC' },
  { img: '/portfolio-images/IMG_8185.JPG', title: 'Midtown Architectural Sanctuary', location: 'Atlanta, GA' },
  { img: '/portfolio-images/IMG_8186.JPG', title: 'Potomac Waterfront Estate', location: 'Potomac, MD' },
  { img: '/portfolio-images/IMG_8187.JPG', title: 'Bethesda Modern Villa', location: 'Bethesda, MD' },
  { img: '/portfolio-images/IMG_8188.JPG', title: 'Arlington Luxury Residence', location: 'Arlington, VA' },
  { img: '/portfolio-images/IMG_8189.JPG', title: 'McLean Designer Manor', location: 'McLean, VA' },
  { img: '/portfolio-images/IMG_8190.JPG', title: 'Sandy Springs Contemporary', location: 'Atlanta, GA' },
  { img: '/portfolio-images/IMG_8191.JPG', title: 'Vinings Executive Retreat', location: 'Vinings, GA' },
  { img: '/portfolio-images/5A6BE788-BBDC-4362-83B1-50E26B74249D.JPG', title: 'Chevy Chase Custom Transformation', location: 'Chevy Chase, MD' },
]

export default function PortfolioClient() {
  const [portfolioItems, setPortfolioItems] = useState(DEFAULT_ITEMS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHeroHovered, setIsHeroHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadPortfolio() {
      const { data } = await supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true })
      if (data && data.length > 0) {
        const mapped = data.map(item => ({
          img: item.image_url,
          title: item.title,
          location: item.category
        }))
        setPortfolioItems(mapped)
      }
    }
    loadPortfolio()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [supabase])

  // Autoplay Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % portfolioItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [portfolioItems.length])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % portfolioItems.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length)
  }

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1)
    setCurrentIndex(idx)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.05
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const activeItem = portfolioItems[currentIndex]

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      
      {/* 1. Fixed Parallax Hero Section (Matching Homepage) */}
      <section className={landingStyles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={landingStyles.heroImageWrapper}>
          <img 
            src="/portfolio-images/IMG_8184.JPG" 
            alt="The Portfolio"
            className={landingStyles.infiniteZoomImg}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={landingStyles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.25) 0%, rgba(255, 229, 180, 0.08) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={landingStyles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at bottom left, rgba(255, 220, 150, 0.2) 0%, transparent 60%)' }}></div>
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '6rem' }}>
          
          <div 
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem', 
              alignItems: 'flex-end', 
              padding: '1.5rem', 
              background: (isHeroHovered || isScrolled) ? 'rgba(255, 255, 255, 0.15)' : 'transparent', 
              backdropFilter: (isHeroHovered || isScrolled) ? 'blur(12px)' : 'none', 
              WebkitBackdropFilter: (isHeroHovered || isScrolled) ? 'blur(12px)' : 'none',
              borderRadius: '20px',
              transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
            }}>
            
            {/* Left Column: Title */}
            <div>
              <h1 className="hero-anim" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 6vw, 4.5rem)', lineHeight: 1.1, color: 'var(--color-secondary)', letterSpacing: '-0.02em', margin: 0, textShadow: '0 0 15px rgba(255,255,255,0.9)' }}>
                The <br/><span style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>Portfolio.</span>
              </h1>
            </div>

            {/* Right Column: Description */}
            <div>
              <p className="hero-anim" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.95rem, 3vw, 1.125rem)', lineHeight: 1.7, color: 'var(--color-secondary)', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '0', maxWidth: '100%', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>
                A curated collection of our finest transformations. From historic restorations to modern minimalist sanctuaries, explore the uncompromising quality of Atelier Maison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: 'var(--color-bg)' }}>

      {/* 2. Interactive Revolution Slider Section */}
      <section style={{ 
        position: 'relative', 
        width: '100%', 
        height: '80vh', 
        minHeight: '600px', 
        overflow: 'hidden',
        backgroundColor: '#f8fafc'
      }}>
        {/* --- PREMIUM AURORA MESH BACKGROUND --- */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          {/* Champagne Gold Blob */}
          <motion.div 
            animate={{ x: ['0%', '15%', '-15%', '0%'], y: ['0%', '-15%', '15%', '0%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '-10%', left: '10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 60%)', filter: 'blur(80px)' }}
          />
          {/* Navy Blue Subtle Blob */}
          <motion.div 
            animate={{ x: ['0%', '-20%', '10%', '0%'], y: ['0%', '20%', '-10%', '0%'] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(30,58,138,0.06) 0%, transparent 60%)', filter: 'blur(80px)' }}
          />
          {/* Bright White Center Highlight */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '20%', left: '20%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1 }}
          />
          {/* Premium Noise Texture */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 2 }}></div>
        </div>

        {/* Background Main Slider */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 }, scale: { duration: 0.8, ease: "easeOut" } }}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            >
              {/* Full Uncropped Foreground Image */}
              <div style={{ position: 'absolute', inset: '40px 0 140px 0' }}>
                <Image src={activeItem.img} alt={activeItem.title} fill style={{ objectFit: 'contain' }} priority quality={100} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Info Panel */}
        <div style={{ position: 'absolute', bottom: '130px', left: '5%', zIndex: 20, maxWidth: '600px' }}>
          <motion.div key={currentIndex + '-text'} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ width: '30px', height: '2px', backgroundColor: '#d97706' }}></span>
              <span style={{ 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em', 
                fontSize: '0.75rem', 
                color: '#d97706', 
                fontWeight: 700
              }}>
                {activeItem.location}
              </span>
            </div>
            <h2 className="font-serif" style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
              lineHeight: 1.1, 
              margin: 0, 
              color: '#0f172a', 
              fontWeight: 500,
              textShadow: '0 4px 20px rgba(255,255,255,0.8)'
            }}>
              {activeItem.title}
            </h2>
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={prevSlide} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s ease' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={nextSlide} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s ease' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Thumbnail Strip Gallery View */}
        <div style={{ position: 'absolute', bottom: '25px', left: 0, right: 0, zIndex: 20, padding: '0 5%', display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {portfolioItems.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => goToSlide(idx)}
              style={{ position: 'relative', width: '100px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: currentIndex === idx ? '2px solid #fbbf24' : '2px solid rgba(255,255,255,0.2)', opacity: currentIndex === idx ? 1 : 0.6, transition: 'all 0.3s ease', transform: currentIndex === idx ? 'scale(1.05)' : 'scale(1)', backgroundColor: '#111' }}
            >
              <Image src={item.img} alt={item.title} fill style={{ objectFit: 'contain' }} sizes="100px" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Process / Philosophy Section */}
      <section style={{ padding: '6rem 5%', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d97706', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 700 }}>Our Methodology</h3>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                Crafting perfection, <br/><span style={{ fontStyle: 'italic' }}>down to the stud.</span>
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, marginBottom: '2rem' }}>
                Every project begins with a deep understanding of your vision. We do not mass-produce renovations; we carefully construct environments that mirror your exact lifestyle. From the initial architectural sketches to the final meticulous polish, our master artisans handle every detail in-house.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b', fontWeight: 500 }}><span style={{ color: '#d97706' }}>✦</span> Private Client Consultations</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b', fontWeight: 500 }}><span style={{ color: '#d97706' }}>✦</span> Sourcing Rare & Premium Materials</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b', fontWeight: 500 }}><span style={{ color: '#d97706' }}>✦</span> Flawless White-Glove Execution</li>
              </ul>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <Image src="/latelier-images/portfolio/IMG_8184.JPG" alt="Construction Process" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Expertise Metrics Section */}
      <section style={{ padding: '5rem 5%', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            <div>
              <h4 className="font-serif" style={{ fontSize: '3.5rem', color: '#1e3a8a', marginBottom: '0.5rem', margin: 0 }}>10+</h4>
              <p style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 600 }}>Years Serving Customers</p>
            </div>
            <div>
              <h4 className="font-serif" style={{ fontSize: '3.5rem', color: '#1e3a8a', marginBottom: '0.5rem', margin: 0 }}>Hundreds</h4>
              <p style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 600 }}>Of Homes Served</p>
            </div>
            <div>
              <h4 className="font-serif" style={{ fontSize: '3.5rem', color: '#1e3a8a', marginBottom: '0.5rem', margin: 0 }}>100%</h4>
              <p style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 600 }}>Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section style={{ padding: '6rem 5%', backgroundColor: '#1e3a8a', textAlign: 'center' }}>
        <div className="container">
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#ffffff', marginBottom: '1.5rem' }}>
            Ready to build your <span style={{ fontStyle: 'italic', color: '#d97706' }}>sanctuary?</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Speak directly with our design architects and master artisans to begin planning your next major transformation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/estimate" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: '#1e3a8a', border: 'none' }}>
              Request Consultation
            </Link>
            <Link href="/contact" className="btn" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff' }}>
              Contact Office
            </Link>
          </div>
        </div>
      </section>

    </div>
    </div>
  )
}
