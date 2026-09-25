'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './NavBar.module.css'

import Image from 'next/image'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Shrink the pill when scrolled
      setScrolled(currentScrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={styles.navWrapper}>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.navContainer}`}>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="L'Atelier Maison Logo" width={140} height={40} style={{ objectFit: 'contain' }} priority />
          </Link>

          {/* Desktop Links */}
          <div className={styles.desktopLinks}>
            <Link href="/" className={styles.navLink}>HOME</Link>

            <div className={styles.navDropdownGroup}>
              <span className={styles.navLink} style={{ cursor: 'pointer' }}>RESIDENTIAL</span>
              <div className={styles.dropdownMenu}>
                <Link href="/services/new-construction" className={styles.dropdownItem}>NEW CONSTRUCTION</Link>
                <Link href="/services/remodeling" className={styles.dropdownItem}>REMODELING</Link>
              </div>
            </div>

            <Link href="/services" className={styles.navLink}>HOME SERVICES</Link>

            <Link href="/portfolio" className={styles.navLink}>PORTFOLIO</Link>

            <Link href="/locations" className={styles.navLink}>CONTACT</Link>
          </div>

          {/* CTA & Mobile Toggle */}
          <div className={styles.actions}>
            <Link href="/estimate" className={`btn btn-primary ${styles.ctaBtn}`}>
              Get Estimate
            </Link>
            <button
              className={styles.hamburger}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`${styles.line} ${mobileMenuOpen ? styles.line1Open : ''}`}></div>
              <div className={`${styles.line} ${mobileMenuOpen ? styles.line2Open : ''}`}></div>
              <div className={`${styles.line} ${mobileMenuOpen ? styles.line3Open : ''}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>HOME</Link>

          <div className={styles.mobileLinkGroup}>RESIDENTIAL</div>
          <Link href="/services/new-construction" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>-- NEW CONSTRUCTION</Link>
          <Link href="/services/remodeling" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>-- REMODELING</Link>

          <Link href="/services" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>HOME SERVICES</Link>

          <Link href="/portfolio" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>PORTFOLIO</Link>

          <Link href="/locations" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)} style={{ marginTop: '1rem' }}>CONTACT</Link>
        </div>
      </nav>
    </div>
  )
}
