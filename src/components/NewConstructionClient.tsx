'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function NewConstructionClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Parallax
      gsap.to('.hero-parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.construction-hero',
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
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* Hero Section */}
      <section className={`construction-hero ${styles.heroSection}`} style={{ height: '100vh', overflow: 'hidden' }}>
        <div className={styles.heroImageWrapper}>
          <Image src="/luxury-hero.jpg" alt="Luxury New Construction" fill className={`hero-parallax-bg ${styles.objectCover}`} priority />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroTextContainer}>
            <h4 className="reveal-up" style={{ color: '#8A9CFF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Ground-Up Architecture</h4>
            <h1 className="reveal-up font-serif" style={{ color: '#fff', marginBottom: '1rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>New Construction</h1>
            <p className="reveal-up" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>We bring your vision to life with uncompromising quality and transparency.</p>
            <div className="reveal-up">
              <Link href="/estimate" className="btn btn-primary">Build Your Home With Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.processSection} style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="font-serif">Building Your <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Legacy.</span></h2>
            <p style={{ marginTop: 'var(--spacing-md)', fontSize: '1.125rem' }}>
              At L’ATELIER MAISON, we guide you through every step of the new construction process with a focus on quality, transparency, and collaboration. From the initial consultation to the final walk-through, we prioritize your vision and make it our reality.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <h3 className="font-serif">Planning & Design</h3>
              <p>Our process begins with understanding your needs and goals, followed by detailed architectural planning and aesthetic design.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h3 className="font-serif">Execution</h3>
              <p>Once approved, we handle all permits, coordinate with trusted subcontractors, and manage the construction process from start to finish.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              <h3 className="font-serif">Communication</h3>
              <p>We maintain open communication throughout the build, ensuring you’re informed and confident every step of the way.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h3 className="font-serif">Longevity</h3>
              <p>Our commitment to craftsmanship ensures your new home is built to last, tailored to your exact specifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h4 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Portfolio Showcase</h4>
            <h2 className="font-serif">2024 <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Projects</span></h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
            <div className="reveal-up" style={{ width: '100%', maxWidth: '400px', background: 'var(--color-bg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: '4px', textAlign: 'center' }}>
              <h3 className="font-serif" style={{ color: 'var(--color-secondary)' }}>190 Barcelona Dr</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Atlanta, GA</p>
            </div>
            <div className="reveal-up" style={{ width: '100%', maxWidth: '400px', background: 'var(--color-bg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: '4px', textAlign: 'center' }}>
              <h3 className="font-serif" style={{ color: 'var(--color-secondary)' }}>210 Barcelona Dr</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Atlanta, GA</p>
            </div>
          </div>
          <div className="reveal-up" style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <Link href="/portfolio" className="btn btn-secondary">View Full Portfolio</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.consultSection}>
        <div className={styles.parallaxBg}>
          <div className={`parallax-img ${styles.imageWrapper}`}>
            <Image src="/award-bg.jpg" alt="Immaculate Architecture" fill className={styles.objectCover} />
            <div className={styles.overlayEspressoHalf}></div>
          </div>
        </div>
        
        <div className="container">
          <div className={`reveal-up ${styles.consultCard}`}>
            <h2 className="font-serif">Ready to <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Build?</span></h2>
            <p>
              Your satisfaction is our priority, and we’re here to make your dream home a reality.
            </p>
            <Link href="/estimate" className="btn btn-secondary">Contact Us Today</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
