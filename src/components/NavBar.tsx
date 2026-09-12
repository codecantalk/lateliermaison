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
          <div className={styles.navDropdownGroup}>
            <span className={styles.navLink} style={{cursor: 'pointer'}}>Services</span>
            <div className={styles.dropdownMenu}>
              <Link href="/services/new-construction" className={styles.dropdownItem}>New Construction</Link>
              <Link href="/services/bathroom-remodeling" className={styles.dropdownItem}>Bathroom Remodeling</Link>
              <Link href="/services/estate-management" className={styles.dropdownItem}>Estate Management</Link>
              <Link href="/services/cleaning" className={styles.dropdownItem}>Housekeeping</Link>
            </div>
          </div>
          <Link href="/portfolio" className={styles.navLink}>Portfolio</Link>
          <Link href="/locations" className={styles.navLink}>Locations</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
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
        <div className={styles.mobileLinkGroup}>Services</div>
        <Link href="/services/new-construction" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>-- New Construction</Link>
        <Link href="/services/bathroom-remodeling" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>-- Bathroom Remodeling</Link>
        <Link href="/services/estate-management" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>-- Estate Management</Link>
        <Link href="/services/cleaning" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>-- Housekeeping</Link>
        <Link href="/portfolio" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
        <Link href="/locations" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Locations</Link>
        <Link href="/about" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>About</Link>
      </div>
    </nav>
    </div>
  )
}
