'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './NavBar.module.css'
import Image from 'next/image'

export default function NavBar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Identify pages with dark hero (like /locations map hero)
  const normalizedPath = pathname?.replace(/\/$/, '') || ''
  const isDarkHeroPage = normalizedPath === '/locations'
  const isDarkTheme = isDarkHeroPage && !scrolled

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={styles.navWrapper}>
      <nav 
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${isDarkTheme ? styles.darkTheme : ''}`}
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className={styles.navContainer}>

          {/* Header Logo - Icon Only */}
          <Link href="/" className={styles.logo} aria-label="L'Atelier Maison Home">
            <Image 
              src="/logo.png" 
              alt="L'Atelier Maison Logo" 
              width={46} 
              height={46} 
              style={{ objectFit: 'contain' }} 
              priority 
            />
          </Link>

          {/* Desktop Links */}
          <div className={styles.desktopLinks}>
            <Link href="/services/housecleaning" className={styles.navLink}>
              HOUSE CLEANING
            </Link>

            <div 
              className={styles.navDropdownGroup}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button 
                type="button"
                className={styles.navLink}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>HOME SERVICES</span>
                <span className={`${styles.dropdownCaret} ${dropdownOpen ? styles.dropdownCaretOpen : ''}`}>▾</span>
              </button>
              <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                <Link 
                  href="/services" 
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  OVERVIEW
                </Link>
                <Link 
                  href="/services/remodeling" 
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  HOME REMODELING
                </Link>
                <Link 
                  href="/services/painting" 
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  PAINTING
                </Link>
                <Link 
                  href="/services/tv-mounting" 
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  TV MOUNTING
                </Link>
              </div>
            </div>

            <Link href="/portfolio" className={styles.navLink}>
              PORTFOLIO
            </Link>
            <Link href="/locations" className={styles.navLink}>
              LOCATIONS
            </Link>
            <Link href="/contact" className={styles.navLink}>
              CONTACT
            </Link>
          </div>

          {/* CTA & Mobile Toggle */}
          <div className={styles.actions}>
            <Link href="/estimate" className={styles.ctaBtn}>
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
          <div className={styles.mobileMenuInner}>
            <Link href="/services/housecleaning" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
              House Cleaning
            </Link>
            
            <Link href="/services" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
              Home Services
            </Link>
            <div className={styles.mobileSubGroup}>
              <Link href="/services/remodeling" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>
                Home Remodeling
              </Link>
              <Link href="/services/painting" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>
                Painting
              </Link>
              <Link href="/services/tv-mounting" className={styles.mobileSubLink} onClick={() => setMobileMenuOpen(false)}>
                TV Mounting
              </Link>
            </div>

            <Link href="/portfolio" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
              Portfolio
            </Link>
            <Link href="/locations" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
              Locations
            </Link>
            <Link href="/contact" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
