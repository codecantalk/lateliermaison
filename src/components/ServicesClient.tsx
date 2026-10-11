'use client'

import { useEffect, useRef } from 'react'
import FamilyBanner from './FamilyBanner'
import BottomCTA from './BottomCTA'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './LandingPage.module.css' // Reusing premium styles

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const homeServices = [
  {
    id: 'plumbing',
    title: 'Plumbing',
    img: '/homeservices/plumbing.webp',
    trade: 'plumbing'
  },
  {
    id: 'electrical',
    title: 'Electrical',
    img: '/homeservices/electrical.webp',
    trade: 'electrical'
  },
  {
    id: 'water-heater',
    title: 'Water Heater Installation & Repair',
    img: '/homeservices/water-heater-installation-repair.webp',
    trade: 'plumbing'
  },
  {
    id: 'painting',
    title: 'Painting',
    img: '/homeservices/painting.webp',
    trade: 'painting'
  },
  {
    id: 'flooring',
    title: 'Flooring Installation & Repair',
    img: '/homeservices/flooring-installation-repair.webp',
    trade: 'flooring'
  },
  {
    id: 'home-theater',
    title: 'Home Theater Installation',
    img: '/homeservices/home-theater-installation.webp',
    trade: 'home theater'
  },
  {
    id: 'tv-mounting',
    title: 'TV Mounting & Wiring',
    img: '/homeservices/tv-mounting.webp',
    trade: 'tv mounting'
  },
  {
    id: 'lighting',
    title: 'Lighting Solutions',
    img: '/homeservices/lighting.webp',
    trade: 'lighting'
  },
  {
    id: 'handyman',
    title: 'Expert Handyman',
    img: '/homeservices/handyman.webp',
    trade: 'handyman'
  }
]

export default function ServicesClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animations
      gsap.from('.hub-title', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out' })
      
      // Floating Cards Unveil
      gsap.utils.toArray('.service-hub-card').forEach((card: any) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        )
      })

      // Smooth Image Parallax
      gsap.utils.toArray('.service-parallax-img').forEach((imgWrapper: any) => {
        gsap.to(imgWrapper, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: imgWrapper.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper} style={{ backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
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
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
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
          suffix="Peace of Mind." 
          content="When you're a homeowner, something urgent always comes up. Plumbing issues? Electrical emergency? Whatever it is, we’re here to help!"
        />
        
        <div style={{ paddingTop: '4rem' }}>
          <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="hub-title" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.8, color: '#4b5563' }}>
              We provide absolute perfection across three main pillars: Luxury House Cleaning, Bespoke Remodeling, and Meticulous Property Services. Choose your path below.
            </p>
          </div>

          {/* Core Pillars */}
          {/* 1. House Cleaning */}
          <div className="container service-feature-section" style={{ paddingBottom: '6rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
            <div style={{ flex: '1 1 400px', position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
               <div className="service-parallax-img" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%' }}>
                  <Image src="/hero-bg.jpg" alt="House Cleaning" fill className={styles.objectCover} sizes="(max-width: 768px) 100vw, 50vw" />
               </div>
            </div>
            <div className="reveal-up" style={{ flex: '1 1 400px' }}>
               <h3 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '1rem' }}>Pillar One</h3>
               <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--color-secondary)' }}>Luxury House Cleaning</h2>
               <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  Atelier Maison's signature cleaning service. We meticulously maintain your sanctuary so you can focus on what matters most. From deep resets to ongoing immaculate upkeep.
               </p>
               <Link href="/services/housecleaning" className={`btn btn-outline ${styles.ctaBtn}`}>Explore House Cleaning</Link>
            </div>
          </div>

          {/* 2. Remodeling */}
          <div className="container service-feature-section" style={{ paddingBottom: '6rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem', flexDirection: 'row-reverse' }}>
            <div style={{ flex: '1 1 400px', position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
               <div className="service-parallax-img" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%' }}>
                  <Image src="/latelier-images/home/IMG_8185.JPG" alt="Remodeling" fill className={styles.objectCover} sizes="(max-width: 768px) 100vw, 50vw" />
               </div>
            </div>
            <div className="reveal-up" style={{ flex: '1 1 400px' }}>
               <h3 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '1rem' }}>Pillar Two</h3>
               <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--color-secondary)' }}>Bespoke Remodeling</h2>
               <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  Transform your existing space into the dream home you deserve. From elegant bathroom renovations to full gut-remodels, our architectural and design experts handle every detail.
               </p>
               <Link href="/services/remodeling" className={`btn btn-outline ${styles.ctaBtn}`}>Explore Remodeling</Link>
            </div>
          </div>

          {/* 3. Home Services */}
          <div className="container service-feature-section" style={{ paddingBottom: '6rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
            <div style={{ flex: '1 1 400px', position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
               <div className="service-parallax-img" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%' }}>
                  <Image src="/IMG_8191.webp" alt="Home Services" fill className={styles.objectCover} sizes="(max-width: 768px) 100vw, 50vw" />
               </div>
            </div>
            <div className="reveal-up" style={{ flex: '1 1 400px' }}>
               <h3 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '1rem' }}>Pillar Three</h3>
               <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--color-secondary)' }}>Home & Property Services</h2>
               <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  Comprehensive property maintenance and expert trade care. Whether you need an emergency plumber, a TV mounted flawlessly, or complete estate management, we are your home's best friend.
               </p>
               <Link href="/services/estate-management" className={`btn btn-outline ${styles.ctaBtn}`}>Explore Home Services</Link>
            </div>
          </div>

          {/* Specific Trades Grid */}
          <div style={{ backgroundColor: '#FDFBF7', padding: '6rem 0' }}>
            <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--color-secondary)' }}>Specific Needs?</h2>
              <p style={{ maxWidth: '700px', margin: '1rem auto', fontSize: '1.1rem', color: '#4b5563' }}>
                We provide expert artisans for a wide variety of household tasks. Explore our most commonly requested services below.
              </p>
            </div>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)' }}>
              {homeServices.map((svc) => (
                <Link href={`/estimate?service=estate&trade=${encodeURIComponent(svc.trade)}`} key={svc.id} className={`service-hub-card ${styles.premiumCardWrapper}`} style={{ display: 'block', overflow: 'hidden', borderRadius: '12px', cursor: 'pointer', textDecoration: 'none' }}>
                  <div className={styles.premiumCardInner} style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
                    <div className="service-parallax-img" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%' }}>
                      <Image 
                        src={svc.img} 
                        alt={svc.title} 
                        fill 
                        className={styles.objectCover} 
                        sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <div className={styles.premiumCardOverlay} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.3) 60%, transparent 100%)', zIndex: 1 }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1.5rem', textAlign: 'center', zIndex: 2 }}>
                      <h2 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.2, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{svc.title}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <BottomCTA 
            title="Need a"
            titleHighlight="repair?"
            text={[
              "We are here to assist with all your home maintenance and repair needs.",
              "Whether it's a minor fix or a larger project, we are dedicated to providing skilled and professional support and would be pleased to help."
            ]}
            buttonText="Call Us Today"
            buttonLink="/estimate"
          />

        </div>
      </div> {/* END CONTENT WRAPPER */}
    </div>
  )
}
