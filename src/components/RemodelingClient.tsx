'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const faqs = [
  { q: "How long does a bathroom remodel typically take?", a: "A cosmetic update generally takes 1-2 weeks. A partial remodel takes 2-3 weeks, and a full-gut master suite transformation usually requires 4-6 weeks of dedicated architectural work." },
  { q: "Do you handle all plumbing and permitting?", a: "Absolutely. We employ master plumbers and handle all municipal permitting and inspections required for structural or plumbing re-routes." },
  { q: "Can I remain in my home during the renovation?", a: "Yes. Our artisans operate with absolute discretion. We seal off the work environment, utilize commercial-grade air scrubbers to eliminate dust, and maintain a pristine pathway." }
]

export default function RemodelingClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Parallax
      gsap.to('.hero-parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.remodel-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Reveal Animations
      gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
        gsap.fromTo(elem, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 85%'
            }
          }
        )
      })



      // Modern SVG 3D Wireframe Sphere Animation
      gsap.to('.modern-wireframe', {
        rotation: 360,
        transformOrigin: '500px 500px',
        duration: 90,
        repeat: -1,
        ease: 'linear'
      });
      
      Array.from({ length: 18 }).forEach((_, i) => {
        gsap.fromTo(`.wire-circle-${i}`, 
          { scaleY: 0.02 },
          {
            scaleY: 1,
            transformOrigin: '500px 500px',
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.4
          }
        );
      });

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* Hero Section */}
      <section className={`remodel-hero ${styles.heroSection}`} style={{ height: '100vh', overflow: 'hidden' }}>
        <div className={styles.heroImageWrapper}>
          <Image src="/luxury-bathroom.jpg" alt="Luxury Bathroom Remodel" fill className={`hero-parallax-bg ${styles.objectCover}`} priority />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroTextContainer}>
            <h4 className="reveal-up" style={{ color: '#8A9CFF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Architectural Transformation</h4>
            <h1 className="reveal-up font-serif" style={{ color: '#fff', marginBottom: '1rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>Bathroom Remodeling</h1>
            <p className="reveal-up" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>We transform ordinary bathrooms into extraordinary spa-like sanctuaries.</p>
            <div className="reveal-up">
              <Link href="/estimate" className="btn btn-primary">Request Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.processSection} style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="font-serif">The Art of <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Transformation.</span></h2>
            <p style={{ marginTop: 'var(--spacing-md)', fontSize: '1.125rem' }}>
              Whether you desire a cosmetic refresh with modern fixtures, or a complete full-gut renovation featuring a custom walk-in shower and luxury tile work, our team of expert architects and master plumbers execute with absolute precision.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <h3 className="font-serif">Cosmetic Updates</h3>
              <p>Elevate your space without changing the footprint. We install premium vanities, modern lighting, and high-end fixtures.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h3 className="font-serif">Custom Showers & Tile</h3>
              <p>Our artisans specialize in intricate tile work, frameless glass enclosures, and massive rain-shower systems.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              <h3 className="font-serif">Expert Plumbing</h3>
              <p>Behind every beautiful bathroom is flawless plumbing infrastructure. We ensure perfect water pressure and drainage.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h3 className="font-serif">Full Gut Renovations</h3>
              <p>We handle everything from demolition to final polish, managing the entire architectural re-layout of your master suite.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: The Guarantee Section */}
      <section className="guarantee-section" style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)', position: 'relative', clipPath: 'inset(0)' }}>
        <div className="guarantee-parallax" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg className="bg-anim-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <defs>
              <radialGradient id="sphere-glow-remodeling" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#sphere-glow-remodeling)" />
            <g className="modern-wireframe" stroke="var(--color-primary)" fill="none" strokeWidth="0.5" opacity="0.1">
              {Array.from({ length: 18 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 10} 500 500)`}>
                  <circle className={`wire-circle-${i}`} cx="500" cy="500" r="350" />
                </g>
              ))}
            </g>
          </svg>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px' }}>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <h4 className="reveal-up" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Our Promise</h4>
            <h2 className="reveal-up font-serif" style={{ color: 'var(--color-text-inverse)', marginBottom: '1rem' }}>The Lifetime Warranty</h2>
            <p className="reveal-up" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)' }}>
              Unlike contractors who disappear after the check clears, we stand by our work forever. Any defect in craftsmanship is repaired instantly, without question. We build for generations, not just for today.
            </p>
          </div>
        </div>
      </section>

      {/* NEW: FAQ Section */}
      <section style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="font-serif">Frequently Asked <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Questions</span></h2>
          </div>
          
          <div className="reveal-up">
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '1rem 0', cursor: 'pointer', textAlign: 'left', color: 'var(--color-secondary)' }}
                >
                  <span className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 500 }}>{faq.q}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '1.5rem', transform: openFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }}>+</span>
                </button>
                <div style={{ maxHeight: openFaq === idx ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                  <p style={{ paddingBottom: '1.5rem', color: 'var(--color-text-muted)' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.consultSection}>
        <div className={styles.parallaxBg}>
          <div className={`parallax-img ${styles.imageWrapper}`}>
            <Image src="/luxury-hero.jpg" alt="Immaculate Architecture" fill className={styles.objectCover} />
            <div className={styles.overlayEspressoHalf}></div>
          </div>
        </div>
        
        <div className="container">
          <div className={`reveal-up ${styles.consultCard}`}>
            <h2 className="font-serif">Begin Your <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Journey</span></h2>
            <p>
              Use our interactive estimator to get a baseline price range for your remodel, and schedule a free in-home consultation with our lead architect.
            </p>
            <Link href="/estimate" className="btn btn-secondary">Get Estimate & Schedule</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
