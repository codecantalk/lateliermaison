'use client'

import { useEffect, useRef } from 'react'
import FamilyBanner from './FamilyBanner'
import BottomCTA from './BottomCTA'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import landingStyles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function NewConstructionClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for text
      gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
        gsap.from(elem, {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%'
          }
        })
      })

      // Image Parallax for Alternating Sections
      gsap.utils.toArray('.parallax-img-container').forEach((container: any) => {
        const img = container.querySelector('img')
        if (img) {
          gsap.to(img, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      
      {/* 1. Fixed Parallax Hero */}
      <section className={landingStyles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={landingStyles.heroImageWrapper}>
          <img 
            src="/latelier-images/residential/hero_new_construction.jpg" 
            alt="New Construction"
            className={landingStyles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={landingStyles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={landingStyles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>New</span><br/>
              Construction.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Vision." 
          content="At Atelier Maison, building your dream home is our greatest privilege. Our family is dedicated to constructing enduring, luxurious new builds from the ground up. With uncompromising attention to detail and a commitment to architectural excellence, we create the perfect foundation for your family's future."
        />
        <div style={{ paddingTop: '4rem' }}>

        {/* Intro text moved to BottomCTA */}

        {/* 3. Projects (Alternating Layout) */}
        <section style={{ padding: '4rem 5% 8rem 5%', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* Project 1 - Text Left, Image Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
              <div className="reveal-up" style={{ paddingRight: '2rem' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  190 BARCELONA DR, <br/><span style={{ fontStyle: 'italic', color: '#d97706' }}>ATLANTA</span>
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  A magnificent showcase of structural elegance and bespoke design. Built from the ground up to reflect the modern family's highest standards of luxury and comfort.
                </p>
              </div>
              <div className="parallax-img-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
                <img 
                  src="/latelier-images/residential/190_barcelona.jpg" 
                  alt="190 Barcelona Dr" 
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Project 2 - Image Left, Text Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div className="parallax-img-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', order: 1 }}>
                <img 
                  src="/latelier-images/residential/210_barcelona.jpg" 
                  alt="210 Barcelona Dr" 
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }}
                />
              </div>
              <div className="reveal-up" style={{ paddingLeft: '2rem', order: 2 }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  210 BARCELONA DR, <br/><span style={{ fontStyle: 'italic', color: '#d97706' }}>ATLANTA</span>
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  An architectural masterpiece perfectly blending contemporary design with timeless warmth. Every material selected and every line drawn speaks to unparalleled craftsmanship.
                </p>
              </div>
              {/* Force order on mobile via media query if needed, but flex-direction column handles it usually. Grid auto-fit will wrap in DOM order. 
                  To be safe without CSS modules, we just use DOM order and accept image top on mobile. */}
            </div>

          </div>
        </section>

        {/* 4. CTA */}
        <BottomCTA 
          title="Ready to break" 
          titleHighlight="ground?"
          text={[
            "At L’ATELIER MAISON, we guide you through every step of the new construction process with a focus on quality, transparency, and collaboration. From the initial consultation to the final walk-through, we prioritize your vision and make it our reality.",
            "Our process begins with understanding your needs and goals, followed by detailed planning and design. Once approved, we handle all permits, coordinate with trusted subcontractors, and manage the construction process from start to finish.",
            "Throughout, we maintain open communication, ensuring you’re informed and confident every step of the way. Our commitment to craftsmanship and attention to detail ensures your new home is built to last, tailored to your exact specifications. Your satisfaction is our priority, and we’re here to make your dream home a reality."
          ]}
          buttonText="Build Your Home With Us"
        />

        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
