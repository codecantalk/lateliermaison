'use client'

import React from 'react'
import LogoutButton from './LogoutButton'
import CMSNotificationBell from './CMSNotificationBell'
import styles from './AdminTopHeader.module.css'

export default function AdminTopHeader() {
  return (
    <header className={styles.topbar}>
      <div className={styles.titleArea}>
        <h2 className={styles.portalTitle}>Executive Management CMS</h2>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} />
          <span>Real-time Active</span>
        </div>
      </div>

      <div className={styles.actionsArea}>
        <CMSNotificationBell />
        <div className={styles.divider} />
        <LogoutButton />
      </div>
    </header>
  )
}
