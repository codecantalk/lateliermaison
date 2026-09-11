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
  { q: "Do you supply all the cleaning products?", a: "Yes, we exclusively use our own curated selection of premium, eco-friendly formulations that are safe for all surfaces, children, and pets." },
  { q: "Will the same artisan clean my home every time?", a: "We make every effort to assign a dedicated lead artisan to your sanctuary to ensure consistency and absolute familiarity with your preferences." },
  { q: "What is the difference between a Standard and Deep Clean?", a: "A Standard Reset maintains the perfection of your home. A Deep Clean is a rigorous, top-to-bottom restoration that includes baseboards, interior windows, inside appliances, and deep grout scrubbing." }
]

export default function CleaningClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Parallax
      gsap.to('.hero-parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cleaning-hero',
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
      <section className={`cleaning-hero ${styles.heroSection}`} style={{ height: '100vh', overflow: 'hidden' }}>
        <div className={styles.heroImageWrapper}>
          <Image src="/award-bg.jpg" alt="Pristine Living Room" fill className={`hero-parallax-bg ${styles.objectCover}`} priority />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroTextContainer}>
            <h4 className="reveal-up" style={{ color: '#8A9CFF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Our Signature Service</h4>
            <h1 className="reveal-up font-serif" style={{ color: '#fff', marginBottom: '1rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>The L'Atelier Reset</h1>
            <p className="reveal-up" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Meticulous housekeeping for the most discerning homeowners in Atlanta.</p>
            <div className="reveal-up">
              <Link href="/estimate" className="btn btn-primary">Get Instant Quote</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.processSection} style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="font-serif">More Than Cleaning. <br/><span className="font-italic" style={{ color: 'var(--color-primary)' }}>Sanctuary Curation.</span></h2>
            <p style={{ marginTop: 'var(--spacing-md)', fontSize: '1.125rem' }}>
              We don't just clean surfaces; we restore tranquility to your home. Our rigorously vetted artisans use exclusively non-toxic, eco-friendly formulations that are safe for your family, pets, and the most delicate architectural materials.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-primary)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" style={{marginBottom: '1rem'}}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Standard Reset</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Perfect for maintaining your sanctuary. Includes thorough dusting, vacuuming, mopping, bathroom sanitation, and kitchen surface detailing.</p>
            </div>
            
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-primary)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" style={{marginBottom: '1rem'}}>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                <path d="M12 2v20"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Deep Clean</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>A rigorous, top-to-bottom restoration. Includes baseboards, deep scrubbing of grout, inside appliances, and interior window washing.</p>
            </div>
            
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-primary)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" style={{marginBottom: '1rem'}}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Move In / Move Out</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Ensure your new home is flawlessly sanitized before arrival, or leave your previous residence in immaculate condition.</p>
            </div>
            
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-primary)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" style={{marginBottom: '1rem'}}>
                <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"/>
                <line x1="3" y1="22" x2="21" y2="22"/>
              </svg>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Post-Construction</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Specialized fine-dust removal and polishing after remodeling or construction, restoring absolute purity to the air and surfaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: The Guarantee Section */}
      <section className="guarantee-section" style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)', position: 'relative', clipPath: 'inset(0)' }}>
        <div className="guarantee-parallax" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg className="bg-anim-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <defs>
              <radialGradient id="sphere-glow-cleaning" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#sphere-glow-cleaning)" />
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
            <h2 className="reveal-up font-serif" style={{ color: 'var(--color-text-inverse)', marginBottom: '1rem' }}>The 200% Guarantee</h2>
            <p className="reveal-up" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)' }}>
              We do not compromise. If you are not absolutely elated with the perfection of your home, we will return immediately to rectify it. If you are still unsatisfied, we will refund your payment entirely. Your peace of mind is absolute.
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
            <Image src="/luxury-bathroom.jpg" alt="Immaculate Bathroom" fill className={styles.objectCover} />
            <div className={styles.overlayEspressoHalf}></div>
          </div>
        </div>
        
        <div className="container">
          <div className={`reveal-up ${styles.consultCard}`}>
            <h2 className="font-serif">Ready for <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Perfection?</span></h2>
            <p>
              Use our instant online calculator to get a transparent quote and secure your booking in under 60 seconds.
            </p>
            <Link href="/estimate" className="btn btn-secondary">Calculate Estimate & Book</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
