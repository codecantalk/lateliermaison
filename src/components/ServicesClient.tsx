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
    img: '/homeservices/plumbing.webp'
  },
  {
    id: 'electrical',
    title: 'Electrical',
    img: '/homeservices/electrical.webp'
  },
  {
    id: 'water-heater',
    title: 'Water Heater Installation & Repair',
    img: '/homeservices/water-heater-installation-repair.webp'
  },
  {
    id: 'painting',
    title: 'Painting',
    img: '/homeservices/painting.webp'
  },
  {
    id: 'flooring',
    title: 'Flooring Installation & Repair',
    img: '/homeservices/flooring-installation-repair.webp'
  },
  {
    id: 'home-theater',
    title: 'Home Theater Installation',
    img: '/homeservices/home-theater-installation.webp'
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
        
        {/* Ambient White Glow strictly behind the text to ensure absolute legibility of the Navy font */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 100%)', zIndex: 3 }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)', zIndex: 3 }}></div>

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
          <div className="container" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <p className="hub-title" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.8, color: '#4b5563' }}>
              Toilet not flushing? Need a TV mounted? Water heater not working? We're here for you. We provide emergency plumbing, electrical repair, tv mounting, water heater maintenance, painting, flooring installation, garage door repair, home cleaning, closet/organization assembly, lighting solutions, home theater, etc.
            </p>
          </div>

          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-xl)', paddingBottom: '8rem' }}>
            {homeServices.map((svc) => (
              <div key={svc.id} className={`service-hub-card ${styles.premiumCardWrapper}`} style={{ display: 'block', overflow: 'hidden', borderRadius: '12px' }}>
                <div className={styles.premiumCardInner} style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                  <div className="service-parallax-img" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%' }}>
                    <Image 
                      src={svc.img} 
                      alt={svc.title} 
                      fill 
                      className={styles.objectCover} 
                     sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                  <div className={styles.premiumCardOverlay} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.4) 50%, transparent 100%)', zIndex: 1 }}></div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1.5rem', textAlign: 'center', zIndex: 2 }}>
                    <h2 className="font-serif" style={{ fontSize: '1.5rem', margin: 0, lineHeight: 1.2, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{svc.title}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 1: House Keeping */}
          <div className="container service-feature-section" style={{ paddingBottom: '8rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
            <div style={{ flex: '1 1 400px', position: 'relative', height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
               <div className="service-parallax-img" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%' }}>
                  <Image src="/hero-bg.jpg" alt="House Keeping" fill className={styles.objectCover} sizes="(max-width: 768px) 100vw, 50vw" />
               </div>
            </div>
            <div className="reveal-up" style={{ flex: '1 1 400px' }}>
               <h3 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '1rem' }}>HOUSE KEEPING</h3>
               <h2 className="font-serif" style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2, color: '#1e3a8a' }}>The L'Atelier Reset.</h2>
               <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  At MAISON ATELIER, your comfort is our priority. As a family-driven company, we recognize the importance of a clean, healthy, and welcoming environment. Our housekeeping services are designed to give you peace of mind, meticulously maintaining your home so you can focus on what matters most.
               </p>
               <Link href="/services/housekeeping" className={`btn btn-outline ${styles.ctaBtn}`}>Explore Housekeeping</Link>
            </div>
          </div>

          {/* Section 2: Estate Management */}
          <div className="container service-feature-section" style={{ paddingBottom: '8rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem', flexDirection: 'row-reverse' }}>
            <div style={{ flex: '1 1 400px', position: 'relative', height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
               <div className="service-parallax-img" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%' }}>
                  <Image src="/IMG_8191.webp" alt="Estate Management" fill className={styles.objectCover} sizes="(max-width: 768px) 100vw, 50vw" />
               </div>
            </div>
            <div className="reveal-up" style={{ flex: '1 1 400px' }}>
               <h3 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '1rem' }}>ESTATE MANAGEMENT</h3>
               <h2 className="font-serif" style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2, color: '#1e3a8a' }}>Bespoke Curation.</h2>
               <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  Beyond construction, we offer comprehensive estate management. From preventative maintenance and landscaping to managing specialized contractors, we ensure your property remains pristine and operates flawlessly year-round, preserving its value and your peace of mind.
               </p>
               <Link href="/services/estate-management" className={`btn btn-outline ${styles.ctaBtn}`}>Explore Estate Management</Link>
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
