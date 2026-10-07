'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'
import FamilyBanner from './FamilyBanner'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function EstateManagementClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Parallax
      gsap.to('.hero-parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.estate-hero',
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
      
      {/* 1. Fixed Parallax Hero */}
      <section className={styles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={styles.heroImageWrapper}>
          <img 
            src="/award-bg.jpg" 
            alt="Home Services"
            className={styles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={styles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={styles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 8vw, 4.5rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Home</span><br/>
              Services.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Legacy." 
          content="At Atelier Maison, we safeguard what you value most. Managing your home is an honor we take seriously. As a family-oriented firm, we provide proactive, comprehensive services to preserve the beauty, functionality, and value of your property for generations to come."
        />
        <div style={{ paddingTop: '4rem' }}>

      {/* Content Section */}
      <section className={styles.processSection} style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="font-serif">Comprehensive <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Care.</span></h2>
            <p style={{ marginTop: 'var(--spacing-md)', fontSize: '1.125rem' }}>
              From complex plumbing infrastructure to bespoke electrical enhancements and fine interior painting, our master artisans handle every detail of your estate's maintenance with absolute discretion and perfection.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <h3 className="font-serif">Plumbing</h3>
              <p>Expert installations, repairs, and infrastructure maintenance to ensure flawless water delivery and drainage.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <h3 className="font-serif">Electrical</h3>
              <p>Custom lighting design, smart-home integrations, and electrical panel upgrades for modern estates.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <h3 className="font-serif">Flooring</h3>
              <p>Installation and restoration of premium hardwood, natural stone tile, and luxury vinyl planks.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              <h3 className="font-serif">Painting</h3>
              <p>Interior and exterior fine painting using eco-friendly, ultra-premium coatings and meticulous prep work.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
              <h3 className="font-serif">Home Theater</h3>
              <p>Immersive audio-visual installations, bespoke acoustic treatments, and hidden television mounting.</p>
            </div>
            <div className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <h3 className="font-serif">Handyman Services</h3>
              <p>Rapid deployment for minor repairs, assemblies, and adjustments to keep your sanctuary functioning perfectly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.consultSection}>
        <div className={styles.parallaxBg}>
          <div className={`parallax-img ${styles.imageWrapper}`}>
            <Image src="/luxury-bathroom.jpg" alt="Estate Interior" fill className={styles.objectCover}  sizes="(max-width: 768px) 100vw, 50vw" />
            <div className={styles.overlayEspressoHalf}></div>
          </div>
        </div>
        
        <div className="container">
          <div className={`reveal-up ${styles.consultCard}`}>
            <h2 className="font-serif">Schedule <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Service</span></h2>
            <p>
              Connect with our home services team to address your property's immediate or long-term needs.
            </p>
            <Link href="/estimate" className="btn btn-secondary">Request Service Call</Link>
          </div>
        </div>
      </section>
      
        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
