'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface BottomCTAProps {
  title: string
  titleHighlight?: string
  text: string[]
  buttonText?: string
  buttonLink?: string
}

export default function BottomCTA({ 
  title, 
  titleHighlight = '', 
  text, 
  buttonText = 'Get Free Estimate', 
  buttonLink = '/estimate' 
}: BottomCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
      
      const ctx = gsap.context(() => {
        // Parallax effect for the background image
        gsap.to(imageRef.current, {
          yPercent: 30, // move the image 30% down as user scrolls
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })

        // Overlay darkening on scroll
        gsap.to('.cta-blue-overlay', {
          backgroundColor: '#0a192f',
          opacity: 0.98,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })

        // Stagger reveal for paragraphs and CTA
        gsap.from('.cta-para', {
          y: 80,
          opacity: 0,
          stagger: 0.25,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        })
      }, containerRef)
      
      return () => ctx.revert()
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      style={{ 
        padding: '10rem 5%', 
        position: 'relative', 
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      {/* Background Parallax Image */}
      <div style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', zIndex: 0 }}>
        <Image 
          ref={imageRef}
          src="/hero-bg.jpg"
          alt="CTA Background"
          fill
          style={{ objectFit: 'cover' }}
         sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      {/* Solid Blue Overlay */}
      <div 
        className="cta-blue-overlay"
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#1e3a8a', 
          opacity: 0.85, 
          zIndex: 1 
        }} 
      />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Paragraph text with reveal animation */}
        <div style={{ marginBottom: '5rem' }}>
          {text.map((paragraph, i) => (
            <p 
              key={i} 
              className="cta-para"
              style={{ 
                fontFamily: '"Plus Jakarta Sans", sans-serif', 
                fontSize: '1rem', 
                lineHeight: 1.9, 
                color: 'rgba(255,255,255,0.9)', 
                marginBottom: '2rem' 
              }}
            >
              {i === 0 && <strong style={{ color: '#d97706', fontSize: '1rem', fontWeight: 600 }}>L’ATELIER MAISON — </strong>}
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Call to action heading & button */}
        <div className="cta-para" style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#ffffff', marginBottom: '3rem' }}>
            {title} <span style={{ fontStyle: 'italic', color: '#d97706' }}>{titleHighlight}</span>
          </h2>
          <Link href={buttonLink} className="btn btn-primary" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {buttonText}
          </Link>
        </div>

      </div>
    </section>
  )
}
