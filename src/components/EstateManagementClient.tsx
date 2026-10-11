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
            src="/homeservices/handyman.webp" 
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
          prefix="HOME" 
          suffix="Services." 
          content="When you're a homeowner, something urgent always comes up. Plumbing issues? Electrical emergency? Whatever it is, we’re here to help! Toilet not flushing? Need a TV mounted? Water heater not working? We're here for you."
        />
        <div style={{ paddingTop: '4rem' }}>

      {/* Content Section */}
      <section className={styles.processSection} style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="font-serif">Comprehensive <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Care.</span></h2>
            <p style={{ marginTop: 'var(--spacing-md)', fontSize: '1.125rem' }}>
              We provide emergency plumbing, electrical repair, tv mounting, water heater maintenance, painting, flooring installation, garage door repair, home cleaning, closet/organization assembly, lighting solutions, home theater, etc.
              We are here to assist with all your home maintenance and repair needs. Whether it's a minor fix or a larger project, we are dedicated to providing skilled and professional support and would be pleased to help. Call us today.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            <Link href="/estimate?service=estate&trade=plumbing" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/plumbing.webp" alt="Plumbing" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Plumbing</h3>
              <p>Expert installations, repairs, and infrastructure maintenance to ensure flawless water delivery and drainage.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=electrical" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/electrical.webp" alt="Electrical" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Electrical</h3>
              <p>Custom lighting design, smart-home integrations, and electrical panel upgrades for modern estates.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=flooring" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/flooring-installation-repair.webp" alt="Flooring Installation" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Flooring Installation & Repair</h3>
              <p>Installation and restoration of premium hardwood, natural stone tile, and luxury vinyl planks.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=painting" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/painting.webp" alt="Painting" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Painting</h3>
              <p>Interior and exterior fine painting using eco-friendly, ultra-premium coatings and meticulous prep work.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=home%20theater" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/home-theater-installation.webp" alt="Home Theater Installation" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Home Theater Installation</h3>
              <p>Immersive audio-visual installations, bespoke acoustic treatments, and hidden television mounting.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=tv%20mounting" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/tv-mounting.webp" alt="TV Mounting" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">TV Mounting</h3>
              <p>Secure, perfectly leveled TV mounting on any surface with flawless wire concealment.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=plumbing" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/water-heater-installation-repair.webp" alt="Water Heater" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Water Heater Installation & Repair</h3>
              <p>Emergency maintenance and installation of high-efficiency water heating systems.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=lighting" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/lighting.webp" alt="Lighting Solutions" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Lighting Solutions</h3>
              <p>Elegant fixture installations and mood lighting design to elevate your sanctuary.</p>
            </Link>
            <Link href="/estimate?service=estate&trade=handyman" className={`reveal-up ${styles.serviceCard}`} style={{ padding: 'var(--spacing-lg)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <img src="/homeservices/handyman.webp" alt="Handyman Services" style={{width: '64px', height: '64px', marginBottom: '1rem', objectFit: 'cover', borderRadius: '8px'}} />
              <h3 className="font-serif">Handyman Services</h3>
              <p>Rapid deployment for minor repairs, assemblies, and adjustments to keep your home functioning perfectly.</p>
            </Link>
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
            <Link href="/estimate" className="btn btn-secondary">Start Your Project Now</Link>
          </div>
        </div>
      </section>
      
        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
