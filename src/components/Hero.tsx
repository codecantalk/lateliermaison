'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      const tl = gsap.timeline()
      
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power3.inOut',
      })
      .from(textRef.current?.children || [], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      }, '-=1')

      // Parallax Scroll Animation
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.imageContainer}>
        <Image
          ref={imageRef}
          src="/hero-bg.jpg"
          alt="Premium Bathroom Remodeling"
          fill
          priority
          className={styles.image}
        />
        <div className={styles.imageOverlay} />
      </div>
      
      <div ref={overlayRef} className={styles.loadingOverlay} />

      <div className={`container ${styles.content}`}>
        <div ref={textRef} className={styles.textContent}>
          <h1 className={`${styles.title} font-thin`}>
            A Clean Home, <br />
            <span className={`${styles.accent} font-italic`}>Without the Stress.</span>
          </h1>
          <p className={styles.subtitle}>
            Experience top-tier housekeeping and premium remodeling services in Atlanta. Your home should reflect who you are, and we guarantee it will.
          </p>
          <div className={styles.actions}>
            <Link href="/estimate" className="btn btn-primary">
              Get Free Estimate
            </Link>
            <Link href="/services" className={`btn btn-outline ${styles.secondaryBtn}`}>
              Our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
