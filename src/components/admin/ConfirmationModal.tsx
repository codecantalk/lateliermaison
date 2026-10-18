'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, ShoppingBag, CheckCircle, Loader2, X } from 'lucide-react'

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger' | 'warning' | 'success'
  icon?: 'convert' | 'delete' | 'warning' | 'check'
  details?: Array<{ label: string; value: React.ReactNode }>
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  icon,
  details,
  isLoading = false,
}: ConfirmationModalProps) {
  const [internalLoading, setInternalLoading] = useState(false)

  // Listen for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !internalLoading && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, internalLoading, isLoading, onClose])

  const handleConfirmClick = async () => {
    try {
      setInternalLoading(true)
      await onConfirm()
    } finally {
      setInternalLoading(false)
    }
  }

  // Variant themes
  const isDanger = variant === 'danger'
  const isWarning = variant === 'warning'
  const isSuccess = variant === 'success'

  const effectiveIcon = icon || (isDanger ? 'delete' : isWarning ? 'warning' : isSuccess ? 'check' : 'convert')

  const getIconElement = () => {
    switch (effectiveIcon) {
      case 'delete':
        return <Trash2 size={24} color="#dc2626" />
      case 'warning':
        return <AlertTriangle size={24} color="#d97706" />
      case 'check':
        return <CheckCircle size={24} color="#16a34a" />
      case 'convert':
      default:
        return <ShoppingBag size={24} color="#c5a059" />
    }
  }

  const getIconBg = () => {
    if (isDanger) return 'rgba(239, 68, 68, 0.1)'
    if (isWarning) return 'rgba(217, 119, 6, 0.1)'
    if (isSuccess) return 'rgba(22, 163, 74, 0.1)'
    return 'rgba(197, 160, 89, 0.15)'
  }

  const getConfirmBtnStyle = () => {
    if (isDanger) {
      return {
        background: '#dc2626',
        color: '#ffffff',
        border: '1px solid #b91c1c',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
      }
    }
    if (isWarning) {
      return {
        background: '#d97706',
        color: '#ffffff',
        border: '1px solid #b45309',
        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
      }
    }
    return {
      background: 'linear-gradient(135deg, #0B132B 0%, #1c2b54 100%)',
      color: '#ffffff',
      border: '1px solid #c5a059',
      boxShadow: '0 4px 14px rgba(11, 19, 43, 0.3)',
    }
  }

  const busy = isLoading || internalLoading

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!busy) onClose()
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(11, 19, 43, 0.65)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(11, 19, 43, 0.35)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              zIndex: 10,
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              disabled={busy}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: busy ? 'not-allowed' : 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0B132B')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={20} />
            </button>

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                {/* Icon Badge */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: getIconBg(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getIconElement()}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: '2px' }}>
                  <h3
                    id="confirmation-modal-title"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.35rem',
                      color: '#0B132B',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.25,
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.92rem',
                      color: '#64748b',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {message}
                  </p>
                </div>
              </div>

              {/* Optional Structured Details Box */}
              {details && details.length > 0 && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  {details.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span style={{ color: '#64748b', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ color: '#0B132B', fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div
              style={{
                background: '#f8fafc',
                padding: '1.25rem 2rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: busy ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!busy) e.currentTarget.style.background = '#f1f5f9'
                }}
                onMouseLeave={(e) => {
                  if (!busy) e.currentTarget.style.background = '#ffffff'
                }}
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={handleConfirmClick}
                disabled={busy}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: busy ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.2s ease, transform 0.1s ease',
                  ...getConfirmBtnStyle(),
                  opacity: busy ? 0.75 : 1,
                }}
              >
                {busy && <Loader2 size={16} className="animate-spin" />}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
