'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import landingStyles from './LandingPage.module.css'
import FamilyBanner from './FamilyBanner'
import BottomCTA from './BottomCTA'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PaintingClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHeroHovered, setIsHeroHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    <div ref={containerRef} className={landingStyles.wrapper}>
      
      {/* 1. Fixed Parallax Hero */}
      <section className={landingStyles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={landingStyles.heroImageWrapper}>
          <img 
            src="/latelier-images/home/IMG_8185.JPG" 
            alt="Premium Painting"
            className={landingStyles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={landingStyles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={landingStyles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 8vw, 4.5rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Master</span><br/>
              Painting.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Canvas." 
          content="At Atelier Maison, we believe a fresh coat of paint is more than just color—it’s the backdrop to your life. Our expert painters bring meticulous attention to detail to every room and exterior, ensuring flawless finishes that truly revitalize your sanctuary."
        />
        <div style={{ paddingTop: '4rem' }}>

        {/* 3. Services (Alternating Layout) */}
        <section style={{ padding: '4rem 5% 8rem 5%', backgroundColor: '#fcfaf8' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* Service 1 - Text Left, Image Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
              <div className="reveal-up" style={{ paddingRight: '2rem' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>INTERIOR</span> <br/>PAINTING
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  Transform the mood and aesthetic of your living spaces. We meticulously prep every surface and use ultra-premium paints to deliver perfectly smooth, durable, and luxurious walls, trims, and ceilings.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/estimate" className="btn btn-primary" style={{ backgroundColor: '#1e3a8a', border: 'none' }}>Get an Estimate</Link>
                </div>
              </div>
              <div className="parallax-img-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
                <img 
                  src="/latelier-images/home/IMG_8191.JPG" 
                  alt="Interior Painting" 
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} 
                />
              </div>
            </div>

            {/* Service 2 - Image Left, Text Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              {/* Force image to first visually on desktop */}
              <div className="parallax-img-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', order: -1 }}>
                <img 
                  src="/hero-bg.jpg" 
                  alt="Exterior Painting" 
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} 
                />
              </div>
              <div className="reveal-up" style={{ paddingLeft: '2rem' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>EXTERIOR</span> <br/>FINISHES
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  Protect your home from the elements while boosting curb appeal. Our comprehensive exterior painting services ensure a pristine, long-lasting finish that stands the test of time.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/estimate" className="btn btn-primary" style={{ backgroundColor: '#1e3a8a', border: 'none' }}>Get an Estimate</Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        <BottomCTA 
          title="Ready for a" 
          titleHighlight="Masterpiece?" 
          text={[
            "Your home is your canvas. Let our master painters bring it to life with precision and care.",
            "Design your custom service and get an instant estimate in under 60 seconds."
          ]}
        />

        </div>
      </div>
    </div>
  )
}
