'use client'

import { useEffect, useRef } from 'react'
import FamilyBanner from './FamilyBanner'
import BottomCTA from './BottomCTA'
import RemodelingChecklist from './RemodelingChecklist'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import landingStyles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function RemodelingClient() {
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
            src="/latelier-images/residential/hero_remodeling.jpg" 
            alt="Remodeling"
            className={landingStyles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={landingStyles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={landingStyles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 8vw, 4.5rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Home</span><br/>
              Remodeling.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Revival." 
          content="At Atelier Maison, we breathe new life into existing spaces. Our family approaches home remodeling with a deep respect for the original structure while infusing it with modern luxury and elegance. We seamlessly blend the old with the new, ensuring your home perfectly evolves with your lifestyle."
        />
        <div style={{ paddingTop: '4rem' }}>

        {/* Intro text moved to BottomCTA */}

        {/* 3. Services (Alternating Layout) */}
        <section style={{ padding: '4rem 5% 8rem 5%', backgroundColor: '#fcfaf8' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* Service 1 - Text Left, Image Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
              <div className="reveal-up" style={{ paddingRight: '2rem' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>BATHROOM</span> <br/>REMODELING
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  Elevate your daily routine with a luxurious bathroom renovation. From spa-like walk-in showers to custom vanities, we transform your bathroom into a private sanctuary of relaxation and style.
                </p>
              </div>
              <div className="parallax-img-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
                <img 
                  src="/latelier-images/residential/bathroom.jpg" 
                  alt="Bathroom Remodeling" 
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Service 2 - Image Left, Text Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
              <div className="parallax-img-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', order: 1 }}>
                <img 
                  src="/latelier-images/residential/kitchen.jpg" 
                  alt="Kitchen Remodeling" 
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }}
                />
              </div>
              <div className="reveal-up" style={{ paddingLeft: '2rem', order: 2 }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>KITCHEN</span> <br/>REMODELING
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  The heart of your home deserves to be extraordinary. We design and build kitchens that blend high-end culinary functionality with breathtaking aesthetic appeal, tailored perfectly to your lifestyle.
                </p>
              </div>
            </div>

            {/* Service 3 - Text Left, Image Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div className="reveal-up" style={{ paddingRight: '2rem' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>INTERIOR</span> <br/>BASEMENTS
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  Unlock the hidden potential of your home. Whether you envision a state-of-the-art home theater, a wine cellar, or an elegant guest suite, we transform unfinished basements into exceptional living spaces.
                </p>
              </div>
              <div className="parallax-img-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
                <img 
                  src="/latelier-images/residential/basement.jpg" 
                  alt="Interior Basements" 
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }}
                />
              </div>
            </div>

          </div>
        </section>

        <RemodelingChecklist />

        {/* 4. CTA */}
        <BottomCTA 
          title="Transform your" 
          titleHighlight="space"
          text={[
            "Transforming older rooms in your home into a beautiful and functional space requires the expertise of a trusted and skilled renovation team.",
            "Atelier Maison is your ideal partner for the project, offering a commitment to excellence in every stage—from initial consultation to final installation.",
            "We take pride in delivering results that exceed expectations, ensuring your home renovation is seamless and enjoyable. With Atelier Maison, you can look forward to a stunning, highly functional kitchen that you’ll cherish for years to come."
          ]}
          buttonText="Start Your Renovation"
        />

        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
