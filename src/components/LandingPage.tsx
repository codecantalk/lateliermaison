'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import styles from './LandingPage.module.css'
import CleaningChecklist from './CleaningChecklist'
import Testimonials from './Testimonials'
import FAQ from './FAQ'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  { title: 'House Cleaning', desc: 'Pristine cleaning tailored for your luxury sanctuary.', img: '/latelier-images/home/IMG_8191.JPG', link: '/services/housecleaning' },
  { title: 'Remodeling', desc: 'Transforming existing spaces into your dream home.', img: '/latelier-images/home/IMG_8185.JPG', link: '/services/remodeling' },
  { title: 'Home Services', desc: 'Comprehensive property maintenance and expert care.', img: '/latelier-images/portfolio/IMG_8184.JPG', link: '/services/estate-management' }
]

const heroSlides = [
  '/latelier-images/portfolio/IMG_8191.JPG',
  '/latelier-images/portfolio/IMG_8184.JPG',
  '/latelier-images/portfolio/5A6BE788-BBDC-4362-83B1-50E26B74249D.JPG',
  '/latelier-images/portfolio/IMG_8187.JPG',
]

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHeroHovered, setIsHeroHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Revolution Slider Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000) // 6 seconds per slide
    return () => clearInterval(interval)
  }, [])

  // Scroll Detection for Hero Blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Elegant Text & Image Reveals
      gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
        gsap.from(elem, {
          y: 40,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%'
          }
        })
      })

      // Continuous SVG Drawing Animation (Smoother with pause at full shape)
      const svgTl = gsap.timeline({ repeat: -1 });
      
      // Draw in smoothly
      svgTl.fromTo('.draw-path', 
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { 
          strokeDashoffset: 0, 
          duration: 2.5, 
          ease: "power2.inOut", 
          stagger: 0.2 
        }
      )
      // Wait for a few milliseconds (1.5 seconds) while fully drawn
      .to({}, { duration: 1.5 })
      // Un-draw smoothly
      .to('.draw-path', 
        { 
          strokeDashoffset: 100, 
          duration: 2, 
          ease: "power2.inOut", 
          stagger: {
            each: 0.1,
            from: "end" // Erases from the last drawn path to the first
          }
        }
      )
      // Small pause before drawing again
      .to({}, { duration: 0.5 })

      // Slow Continuous Rotation for the SVG
      gsap.to('.intro-svg', {
        rotation: 360,
        duration: 40,
        ease: "none",
        repeat: -1
      })

      // Image Parallax for Service Cards
      gsap.utils.toArray('.service-parallax-img').forEach((img: any) => {
        gsap.to(img, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      })

      // Background Parallax for Consult Section Images
      gsap.utils.toArray('.consult-parallax-img').forEach((img: any) => {
        gsap.to(img, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* 1. Animated Slider Hero Section */}
      <section className={styles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={styles.heroImageWrapper}>
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                zIndex: currentSlide === index ? 1 : 0,
              }}
            >
              <img 
                src={slide} 
                alt={`Hero Slide ${index + 1}`}
                className={styles.objectCover}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  transform: currentSlide === index ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 8s ease-out',
                  transformOrigin: 'center center'
                }} 
              />
            </div>
          ))}
          {/* Sunny Golden Hour Overlay */}
          <div className={styles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.25) 0%, rgba(255, 229, 180, 0.08) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={styles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at bottom left, rgba(255, 220, 150, 0.2) 0%, transparent 60%)' }}></div>
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
              <h1 className="hero-anim" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, color: 'var(--color-secondary)', letterSpacing: '-0.02em', margin: 0, textShadow: '0 0 15px rgba(255,255,255,0.9)' }}>
                Luxury Home Cleaning, <br/>Remodeling & <br/><span style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>Property Services.</span>
              </h1>
            </div>

            {/* Right Column: Description & Buttons */}
            <div>
              <p className="hero-anim" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.95rem, 3vw, 1.125rem)', lineHeight: 1.7, color: 'var(--color-secondary)', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '2rem', maxWidth: '100%', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>
                Elevating the standard of living for the most discerning clientele. We provide absolute perfection across housekeeping, bespoke renovations, and meticulous estate management.
              </p>
              <div className="hero-anim" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                <Link href="/estimate?service=cleaning" className="btn btn-primary" style={{ flex: '1 1 auto', textAlign: 'center', padding: 'clamp(0.5rem, 2vw, 0.65rem) clamp(1rem, 3vw, 1.35rem)', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', whiteSpace: 'nowrap' }}>Book House Cleaning →</Link>
                <Link href="/contact" className="btn btn-secondary" style={{ flex: '1 1 auto', textAlign: 'center', padding: 'clamp(0.5rem, 2vw, 0.65rem) clamp(1rem, 3vw, 1.35rem)', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', whiteSpace: 'nowrap' }}>Request a Consultation →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>


      {/* 1.5 Introduction Statement - Compact Premium Banner */}
      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) 5%', backgroundColor: '#1e3a8a', color: '#ffffff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(1rem, 3vw, 3rem)', alignItems: 'center' }}>
            
            {/* Left: Tiny SVG & Title */}
            <div className="reveal-up" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <svg className="intro-svg" width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#d97706" strokeWidth="2" style={{ flexShrink: 0 }}>
                <rect className="draw-path" pathLength="100" x="10" y="10" width="80" height="80" />
                <path className="draw-path" pathLength="100" d="M50 10 L10 50 L50 90 L90 50 Z" />
                <path className="draw-path" pathLength="100" d="M25 50 V85 H75 V50" />
                <circle className="draw-path" pathLength="100" cx="50" cy="50" r="10" />
              </svg>
              <div>
                <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2rem', fontWeight: 400, color: '#ffffff', lineHeight: 1.1, margin: '0 0 0.25rem 0' }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>YOUR</span> Home.
                </h2>
                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>by family.</span>
              </div>
            </div>

            {/* Middle: Compact Text */}
            <div className="reveal-up">
              <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: 0, paddingRight: '1rem' }}>
                At <strong style={{ color: '#d97706' }}>Atelier Maison</strong>, we prioritize YOU. As a family-oriented company, we are dedicated to creating homes for families, built on a foundation of passion and commitment to your satisfaction. Whether you're planning a small renovation or building your dream home, we are the trusted contractors to bring your vision to life. Your home should reflect who you are, and we guarantee it will. <span style={{ fontStyle: 'italic', color: '#fff', fontWeight: 600 }}>Maison—where your vision becomes home.</span>
              </p>
            </div>

            {/* Right: Button */}
            <div className="reveal-up" style={{ textAlign: 'right' }}>
              <Link href="/estimate" className="btn btn-primary" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Start Your Project
              </Link>
            </div>

          </div>

          {/* 1.1 Trust Banner - Moved to inside Introduction Section */}
          <div style={{ position: 'relative', zIndex: 10, marginTop: '4rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '12px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                padding: '2.5rem 3rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              
              <motion.a 
                href={process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || 'https://share.google/cJk8y6TGiLCE7k5i4'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.02 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#ffffff', textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}
                title="View verified 5.0 Google Reviews (Opens in new tab)"
              >
                <div style={{ display: 'flex', gap: '4px', color: '#d97706', fontSize: '1.5rem' }}>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }}>★</motion.span>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}>★</motion.span>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}>★</motion.span>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}>★</motion.span>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.8 }}>★</motion.span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  5.0 Google Reviews ↗
                </span>
              </motion.a>

              <motion.div 
                whileHover={{ y: -5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#ffffff', textAlign: 'center', cursor: 'default' }}
              >
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </motion.div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#e5e7eb' }}>Fully Insured</span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#ffffff', textAlign: 'center', cursor: 'default' }}
              >
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </motion.div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#e5e7eb' }}>Master Artisans</span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#ffffff', textAlign: 'center', cursor: 'default' }}
              >
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 2 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </motion.div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#e5e7eb' }}>100% Satisfaction</span>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Clear Service Bifurcation Section (Distinct Cleaning vs Remodeling Paths) */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 5%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d97706', fontWeight: 700 }}>
              Tailored Residential Solutions
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#1e3a8a', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Select Your <span style={{ fontStyle: 'italic', color: '#d97706' }}>Focus</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Whether you need regular house cleaning or a full-scale architectural renovation, we provide dedicated teams specialized in each discipline.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            
            {/* PATH 1: House Cleaning */}
            <div className="reveal-up" style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#2563eb' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                  <span>🌿</span>
                  <span>Sanctuary Housekeeping</span>
                </div>
                <h3 className="font-serif" style={{ fontSize: '2.2rem', color: '#1e3a8a', marginBottom: '1rem' }}>
                  House Cleaning
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Meticulous recurring maintenance, intensive deep resets, and move-in/out cleanings. We provide trained, background-checked cleaners using premium eco-friendly supplies to keep your home spotless.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                  {['Recurring Upkeep', 'Deep Cleaning Resets', 'Move-In / Move-Out', 'Eco-Friendly Supplies'].map((pill, idx) => (
                    <span key={idx} style={{ fontSize: '0.8rem', background: '#ffffff', color: '#1e293b', padding: '6px 12px', borderRadius: '100px', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                      ✓ {pill}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href="/services/housecleaning" className="btn btn-primary" style={{ flex: '1 1 auto', textAlign: 'center' }}>
                  Explore Cleaning Services →
                </Link>
                <Link href="/estimate?service=cleaning" className="btn btn-outline" style={{ flex: '1 1 auto', textAlign: 'center' }}>
                  Get Estimated Quote
                </Link>
              </div>
            </div>

            {/* PATH 2: Architectural Remodeling */}
            <div className="reveal-up" style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#d97706' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                  <span>📐</span>
                  <span>Bespoke Construction</span>
                </div>
                <h3 className="font-serif" style={{ fontSize: '2.2rem', color: '#1e3a8a', marginBottom: '1rem' }}>
                  Home Remodeling
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Complete design-build remodeling for master bathrooms, gourmet kitchens, and luxury basement suites. Hand-selected stone, custom cabinetry, architectural lighting, and master artisans.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                  {['Master Bathrooms', 'Chef Kitchens', 'Interior Basements', 'Full Design-Build'].map((pill, idx) => (
                    <span key={idx} style={{ fontSize: '0.8rem', background: '#ffffff', color: '#1e293b', padding: '6px 12px', borderRadius: '100px', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                      ✓ {pill}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href="/services/remodeling" className="btn btn-primary" style={{ flex: '1 1 auto', textAlign: 'center', background: '#1e3a8a' }}>
                  Explore Remodeling →
                </Link>
                <Link href="/estimate?service=remodeling" className="btn btn-outline" style={{ flex: '1 1 auto', textAlign: 'center' }}>
                  Consult With Architect
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Preparation - Image Left, Text Right */}
      <section style={{ padding: 'clamp(3rem, 8vw, 8rem) 5%', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'clamp(2rem, 6vw, 6rem)', alignItems: 'center' }}>
            
            {/* Image (Left) */}
            <div className="reveal-up" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '8px' }}>
              <div className="consult-parallax-img" style={{ position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%' }}>
                <Image src="/hero-bg.jpg" alt="Preparation" fill className={styles.objectCover}  sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </div>

            {/* Text (Right) */}
            <div className="reveal-up" style={{ paddingLeft: '2rem' }}>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d97706', fontSize: '0.85rem', marginBottom: '2rem', fontWeight: 600 }}>The Process</h4>
              <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '3rem', fontWeight: 400, lineHeight: 1.2, color: '#1e3a8a', margin: 0, marginBottom: '2rem' }}>
                We leave <span style={{ fontStyle: 'italic', color: '#1e3a8a' }}>nothing</span> to chance.
              </h2>
              <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '2rem' }}>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.8, color: '#4b5563', marginBottom: '1.5rem' }}>
                  Your home should be your ultimate personal sanctuary. Whether you are scheduling routine house cleaning to keep your living environment pristine and healthy, or planning a custom bathroom or kitchen transformation, we execute with meticulous care and discipline.
                </p>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.8, color: '#4b5563' }}>
                  From upfront transparent estimates to background-checked professionals and white-glove respect for your property, our team ensures every home service is seamless, punctual, and executed to perfection.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Quality - Text Left, Image Right */}
      <section style={{ padding: 'clamp(3rem, 8vw, 8rem) 5%', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'clamp(2rem, 6vw, 6rem)', alignItems: 'center' }}>
            
            {/* Text (Left) */}
            <div className="reveal-up" style={{ paddingRight: '2rem' }}>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d97706', fontSize: '0.85rem', marginBottom: '2rem', fontWeight: 600 }}>Our Promise</h4>
              <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '3rem', fontWeight: 400, lineHeight: 1.2, color: '#1e3a8a', margin: 0, marginBottom: '2rem' }}>
                Quality. Experience. Detail.
              </h2>
              <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '2rem' }}>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.8, color: '#4b5563', marginBottom: '3rem' }}>
                  We prioritize your complete satisfaction, uncompromising attention to detail, and the lasting quality of our craftsmanship. <span style={{ fontStyle: 'italic', color: '#1e3a8a' }}>Dream with us.</span>
                </p>
                <Link href="/estimate" className="btn btn-primary" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Start Your Project
                </Link>
              </div>
            </div>

            {/* Image (Right) */}
            <div className="reveal-up" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '8px' }}>
              <div className="consult-parallax-img" style={{ position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%' }}>
                <Image src="/IMG_8191.webp" alt="Quality Experience" fill className={styles.objectCover}  sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </div>

          </div>
        </div>
      </section>

      <Testimonials />
      {/* 5. Interactive Cleaning Checklist */}
      <CleaningChecklist />

      <FAQ />

      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
