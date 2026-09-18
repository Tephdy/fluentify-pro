'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'

// ============================================
// ICON COMPONENT
// ============================================
interface IconProps {
  name: string
  className?: string
  glow?: boolean
}

function Icon({ name, className = "w-5 h-5", glow = false }: IconProps) {
  const glowClass = glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''

  switch (name) {
    case 'shield':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'users':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    case 'user-check':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 11l2 2 4-4" />
        </svg>
      )
    case 'activity':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    case 'cpu':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
        </svg>
      )
    case 'log-out':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    case 'search':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
      )
    case 'download':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    case 'refresh':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    case 'bell':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    case 'crown':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 5-7 5 7 4-4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      )
    case 'grid':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'clock':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
      )
    case 'mail':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
        </svg>
      )
    case 'home':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      )
    case 'trash':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    case 'edit':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    case 'check':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'book':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'plus':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )
    case 'arrow-left':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      )
    case 'trending':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    case 'trending-down':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    case 'trophy':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v2a6 6 0 01-6 6H9a6 6 0 01-6-6V5a2 2 0 012-2zm0 10v2a5 5 0 005 5h4a5 5 0 005-5v-2m-9 9v3m-3 0h6" />
        </svg>
      )
    case 'info':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4m0-7h.01" />
        </svg>
      )
    case 'alert-circle':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
      )
    case 'x':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    case 'message-square':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        </svg>
      )
    case 'medal':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="15" r="6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l-3-6M15 9l3-6M9 9h6" />
        </svg>
      )
    case 'award':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="8" r="6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    case 'hash':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
        </svg>
      )
    case 'headphones':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
        </svg>
      )
    case 'pencil':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    case 'mic':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    case 'keyboard':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />
        </svg>
      )
    case 'pie-chart':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    case 'bar-chart':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'zap':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'layers':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    case 'graduation-cap':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 10L12 5 2 10l10 5 10-5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )
    case 'menu':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )
    case 'database':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    case 'star':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l2.63 5.33 5.88.85-4.25 4.14 1 5.85L12 16.9l-5.26 2.77 1-5.85L3.5 9.68l5.87-.85L12 3.5z" />
        </svg>
      )
    case 'key':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="8" cy="15" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.85 12.15L19 4m-3 0l3 3m-5 2l3 3" />
        </svg>
      )
    case 'lock':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      )
    case 'eye':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'eye-off':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l22 22" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    default:
      return null
  }
}

// ============================================
// ANIMATED COUNTER
// ============================================
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setDisplayValue(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <>{displayValue}</>
}

// ============================================
// RANK BADGE COMPONENT
// ============================================
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="relative w-10 h-10 shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/50 border-2 border-amber-300/60">
          <Icon name="crown" className="w-5 h-5 text-white" glow />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-300 border-2 border-[#151520] flex items-center justify-center">
          <span className="text-[8px] font-black text-amber-900">1</span>
        </div>
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="relative w-10 h-10 shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-lg shadow-slate-400/40 border-2 border-slate-200/60">
          <Icon name="medal" className="w-5 h-5 text-white" glow />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-[#151520] flex items-center justify-center">
          <span className="text-[8px] font-black text-slate-800">2</span>
        </div>
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="relative w-10 h-10 shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center shadow-lg shadow-amber-800/40 border-2 border-amber-600/50">
          <Icon name="medal" className="w-5 h-5 text-white" glow />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 border-2 border-[#151520] flex items-center justify-center">
          <span className="text-[8px] font-black text-amber-100">3</span>
        </div>
      </div>
    )
  }
  return (
    <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center">
      <span className="text-xs font-black text-slate-400">#{rank}</span>
    </div>
  )
}

// ============================================
// MODULE COLOR HELPER
// ============================================
const MODULE_META: Record<string, { 
  gradient: string; 
  textColor: string; 
  bgColor: string; 
  borderColor: string; 
  icon: string;
  label: string;
}> = {
  listening: {
    gradient: 'from-rose-500 to-pink-500',
    textColor: 'text-rose-300',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-500/30',
    icon: 'headphones',
    label: 'Listening',
  },
  reading: {
    gradient: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-300',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500/30',
    icon: 'book',
    label: 'Reading',
  },
  writing: {
    gradient: 'from-violet-500 to-purple-500',
    textColor: 'text-violet-300',
    bgColor: 'bg-violet-500',
    borderColor: 'border-violet-500/30',
    icon: 'pencil',
    label: 'Writing',
  },
  speaking: {
    gradient: 'from-emerald-500 to-teal-500',
    textColor: 'text-emerald-300',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    icon: 'mic',
    label: 'Speaking',
  },
  typing: {
    gradient: 'from-sky-500 to-blue-500',
    textColor: 'text-sky-300',
    bgColor: 'bg-sky-500',
    borderColor: 'border-sky-500/30',
    icon: 'keyboard',
    label: 'Typing',
  },
}

function getModuleMeta(moduleName: string) {
  return MODULE_META[moduleName?.toLowerCase()] ?? {
    gradient: 'from-slate-500 to-slate-600',
    textColor: 'text-slate-300',
    bgColor: 'bg-slate-500',
    borderColor: 'border-slate-500/30',
    icon: 'grid',
    label: moduleName || 'Unknown',
  }
}

// ============================================
// LEVEL COLOR HELPER
// ============================================
type TutorialLevel = 'beginner' | 'intermediate' | 'upper_intermediate' | 'advanced'

const LEVEL_META: Record<TutorialLevel, {
  gradient: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  label: string;
  emoji: string;
}> = {
  beginner: {
    gradient: 'from-emerald-500 to-teal-500',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500',
    label: 'Beginner',
    emoji: '🌱',
  },
  intermediate: {
    gradient: 'from-sky-500 to-blue-500',
    textColor: 'text-sky-300',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500',
    label: 'Intermediate',
    emoji: '🚀',
  },
  upper_intermediate: {
    gradient: 'from-violet-500 to-purple-500',
    textColor: 'text-violet-300',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500',
    label: 'Upper Intermediate',
    emoji: '⭐',
  },
  advanced: {
    gradient: 'from-rose-500 to-pink-500',
    textColor: 'text-rose-300',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500',
    label: 'Advanced',
    emoji: '🔥',
  },
}

function getLevelMeta(level: string): typeof LEVEL_META[TutorialLevel] {
  return LEVEL_META[level as TutorialLevel] ?? LEVEL_META.beginner
}

// ============================================
// TAB TYPE
// ============================================
type AdminTab = 'overview' | 'users' | 'questions' | 'tutorials' | 'topics' | 'bpo' | 'suggestions' | 'rankings' | 'statistics'

// ============================================
// BPO SUB-SECTIONS MAP
// ============================================
type BPOSection =
  | 'bpo_industry_overview'
  | 'bpo_historical_timeline'
  | 'bpo_companies'
  | 'bpo_job_roles'
  | 'bpo_application_steps'
  | 'bpo_required_documents'
  | 'bpo_success_tips'

const BPO_SECTIONS: Array<{
  key: BPOSection
  label: string
  description: string
  icon: string
  gradient: string
  singular: boolean
  orderField?: string
  orderDirection?: 'asc' | 'desc'
}> = [
  {
    key: 'bpo_industry_overview',
    label: 'Industry Overview',
    description: 'Main introductory content, key statistics, and "Why Philippines" points',
    icon: 'info',
    gradient: 'from-violet-500 to-purple-500',
    singular: true,
  },
  {
    key: 'bpo_historical_timeline',
    label: 'Historical Timeline',
    description: 'Eras and milestones of the Philippine BPO industry',
    icon: 'clock',
    gradient: 'from-amber-500 to-orange-500',
    singular: false,
    orderField: 'display_order',
    orderDirection: 'asc',
  },
  {
    key: 'bpo_companies',
    label: 'BPO Companies',
    description: 'Major employers with histories, services, and application notes',
    icon: 'book',
    gradient: 'from-cyan-500 to-blue-500',
    singular: false,
    orderField: 'display_order',
    orderDirection: 'asc',
  },
  {
    key: 'bpo_job_roles',
    label: 'Job Roles',
    description: 'Career paths, requirements, and salary ranges',
    icon: 'layers',
    gradient: 'from-emerald-500 to-teal-500',
    singular: false,
    orderField: 'display_order',
    orderDirection: 'asc',
  },
  {
    key: 'bpo_application_steps',
    label: 'Application Steps',
    description: 'Step-by-step guide for applying to BPO jobs',
    icon: 'hash',
    gradient: 'from-fuchsia-500 to-pink-500',
    singular: false,
    orderField: 'step_number',
    orderDirection: 'asc',
  },
  {
    key: 'bpo_required_documents',
    label: 'Required Documents',
    description: 'Checklist of documents needed for BPO applications',
    icon: 'shield',
    gradient: 'from-rose-500 to-red-500',
    singular: false,
    orderField: 'display_order',
    orderDirection: 'asc',
  },
  {
    key: 'bpo_success_tips',
    label: 'Success Tips',
    description: 'Categorized tips for before, during, and after applying',
    icon: 'star',
    gradient: 'from-yellow-500 to-amber-500',
    singular: false,
    orderField: 'display_order',
    orderDirection: 'asc',
  },
]

// ============================================
// FIELD DEFINITIONS PER BPO TABLE
// ============================================
type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'array' | 'json' | 'select'

interface FieldDef {
  key: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
  helpText?: string
  rows?: number
}

const BPO_FIELD_DEFS: Record<BPOSection, FieldDef[]> = {
  bpo_industry_overview: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'introduction', label: 'Introduction', type: 'textarea', required: true, rows: 10, placeholder: 'Multi-line introduction with bullet points...' },
    { key: 'key_statistics', label: 'Key Statistics (JSON)', type: 'json', placeholder: '{"totalRevenue": "$38 Billion", "directEmployment": "2M+ Filipinos"}', helpText: 'Valid JSON object with string or array values' },
    { key: 'why_philippines', label: 'Why Philippines (JSON Array)', type: 'json', placeholder: '[{"advantage": "English Proficiency", "description": "..."}]', helpText: 'Array of objects with advantage + description' },
  ],
  bpo_historical_timeline: [
    { key: 'period', label: 'Period', type: 'text', required: true, placeholder: 'e.g., 2000-2005' },
    { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g., Rapid Expansion' },
    { key: 'description', label: 'Description', type: 'textarea', required: true, rows: 5 },
    { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
  ],
  bpo_companies: [
    { key: 'slug', label: 'Slug (unique)', type: 'text', required: true, placeholder: 'e.g., accenture' },
    { key: 'name', label: 'Company Name', type: 'text', required: true },
    { key: 'founded', label: 'Founded', type: 'text', placeholder: 'e.g., 1989 (Global: 1955)' },
    { key: 'headquarters', label: 'Headquarters', type: 'text' },
    { key: 'philippines_presence', label: 'Philippines Presence', type: 'textarea', rows: 2 },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'history', label: 'History', type: 'textarea', rows: 6 },
    { key: 'services', label: 'Services (array)', type: 'array', helpText: 'One service per line' },
    { key: 'website', label: 'Website URL', type: 'text', placeholder: 'https://...' },
    { key: 'application_notes', label: 'Application Notes', type: 'textarea', rows: 3 },
    { key: 'logo_url', label: 'Logo URL', type: 'text', placeholder: 'https://...' },
    { key: 'is_active', label: 'Active (visible to users)', type: 'boolean' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ],
  bpo_job_roles: [
    { key: 'title', label: 'Role Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'requirements', label: 'Requirements (array)', type: 'array', helpText: 'One requirement per line' },
    { key: 'salary_range', label: 'Salary Range', type: 'text', placeholder: '₱15,000 - ₱30,000 monthly' },
    { key: 'skills', label: 'Key Skills (array)', type: 'array', helpText: 'One skill per line' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'is_active', label: 'Active', type: 'boolean' },
  ],
  bpo_application_steps: [
    { key: 'step_number', label: 'Step Number', type: 'number', required: true },
    { key: 'title', label: 'Step Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
    { key: 'tips', label: 'Tips (array)', type: 'array', helpText: 'One tip per line' },
  ],
  bpo_required_documents: [
    { key: 'name', label: 'Document Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'is_required', label: 'Required?', type: 'boolean' },
    { key: 'notes', label: 'Notes', type: 'textarea', rows: 2 },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ],
  bpo_success_tips: [
    { key: 'category', label: 'Category', type: 'select', required: true, options: ['beforeApplying', 'duringInterview', 'onTheJob', 'healthAndWellness'] },
    { key: 'tip', label: 'Tip', type: 'textarea', required: true, rows: 3 },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ],
}

// ============================================
// LEARNING TOPICS: Types & Field Definitions
// ============================================
interface LearningTopic {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string;
  gradient: string;
  level: 'beginner' | 'intermediate' | 'upper_intermediate' | 'advanced';
  estimated_minutes: number;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

interface LearningTopicSection {
  id: string;
  topic_id: string;
  section_type: 'lesson' | 'example' | 'template' | 'tip' | 'checklist' | 'script' | 'comparison';
  title: string;
  content: string;
  examples: any[];
  key_points: string[];
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

const TOPIC_FIELD_DEFS: FieldDef[] = [
  { key: 'slug', label: 'Slug (unique URL-friendly ID)', type: 'text', required: true, placeholder: 'e.g., customer-interaction-service', helpText: 'Lowercase, hyphens only. Used as unique identifier.' },
  { key: 'title', label: 'Topic Title', type: 'text', required: true, placeholder: 'e.g., Customer Interaction & Service Delivery' },
  { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Short one-line description' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Full description shown on topic card...' },
  { key: 'icon', label: 'Icon Name', type: 'select', options: ['book', 'headphones', 'keyboard', 'graduation-cap', 'mic', 'pencil', 'activity', 'users', 'chart', 'award', 'trophy', 'info', 'message-square', 'shield', 'sparkles', 'file-text', 'layers', 'zap'] },
  { key: 'gradient', label: 'Gradient Classes', type: 'select', options: [
    'from-rose-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-indigo-500 to-violet-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
    'from-sky-500 to-blue-500',
    'from-yellow-500 to-amber-500',
    'from-slate-500 to-slate-600',
  ]},
  { key: 'level', label: 'Difficulty Level', type: 'select', required: true, options: ['beginner', 'intermediate', 'upper_intermediate', 'advanced'] },
  { key: 'estimated_minutes', label: 'Estimated Minutes', type: 'number', placeholder: '15' },
  { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
  { key: 'is_active', label: 'Active (visible to users)', type: 'boolean' },
];

const TOPIC_SECTION_FIELD_DEFS: FieldDef[] = [
  { key: 'section_type', label: 'Section Type', type: 'select', required: true, options: ['lesson', 'example', 'template', 'tip', 'checklist', 'script', 'comparison'] },
  { key: 'title', label: 'Section Title', type: 'text', required: true, placeholder: 'e.g., Understanding Customer Interaction Channels' },
  { key: 'content', label: 'Content (main text)', type: 'textarea', required: true, rows: 5, placeholder: 'The main lesson/description text...' },
  { key: 'examples', label: 'Examples (JSON array)', type: 'json', helpText: 'Array of objects. Shape varies by section type.', placeholder: '[{"key": "value"}]' },
  { key: 'key_points', label: 'Key Takeaways (array)', type: 'array', helpText: 'One key point per line' },
  { key: 'display_order', label: 'Display Order', type: 'number', placeholder: '1' },
];

// ============================================
// BPO EDITOR COMPONENT
// ============================================
function BPOEditorView({ Icon }: { Icon: any }) {
  const [activeSection, setActiveSection] = useState<BPOSection>('bpo_industry_overview')
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingRecord, setEditingRecord] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const currentSection = BPO_SECTIONS.find(s => s.key === activeSection)!
  const fieldDefs = BPO_FIELD_DEFS[activeSection]

  const loadRecords = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      let query = supabase.from(activeSection).select('*')

      if (currentSection.orderField) {
        query = query.order(currentSection.orderField, {
          ascending: currentSection.orderDirection !== 'desc',
        })
      } else if (!currentSection.singular) {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setRecords(data || [])
    } catch (err: any) {
      console.error(`Error loading ${activeSection}:`, err.message)
      setErrorMsg(err.message || 'Failed to load records')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
    setEditingRecord(null)
    setIsCreating(false)
    setSearchQuery('')
  }, [activeSection])

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records
    const q = searchQuery.toLowerCase()
    return records.filter((rec) =>
      Object.values(rec).some((val) => {
        if (val === null || val === undefined) return false
        if (typeof val === 'string') return val.toLowerCase().includes(q)
        if (typeof val === 'number') return String(val).includes(q)
        if (Array.isArray(val)) return val.join(' ').toLowerCase().includes(q)
        return false
      })
    )
  }, [records, searchQuery])

  const openCreate = () => {
    const initial: any = {}
    fieldDefs.forEach((f) => {
      if (f.type === 'boolean') initial[f.key] = f.key === 'is_required' ? true : f.key === 'is_active' ? true : false
      else if (f.type === 'number') initial[f.key] = 0
      else if (f.type === 'array') initial[f.key] = []
      else if (f.type === 'json') initial[f.key] = f.key === 'why_philippines' ? [] : {}
      else if (f.type === 'select') initial[f.key] = f.options?.[0] || ''
      else initial[f.key] = ''
    })
    setEditingRecord(initial)
    setIsCreating(true)
  }

  const openEdit = (rec: any) => {
    setEditingRecord({ ...rec })
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setEditingRecord(null)
    setIsCreating(false)
    setErrorMsg('')
  }

  const handleSave = async () => {
    if (!editingRecord) return
    setSaving(true)
    setErrorMsg('')

    try {
      const { id, created_at, updated_at, ...payload } = editingRecord

      for (const f of fieldDefs) {
        if (f.required && !payload[f.key] && payload[f.key] !== 0) {
          throw new Error(`Field "${f.label}" is required.`)
        }
      }

      if (isCreating) {
        const { error } = await supabase.from(activeSection).insert([payload])
        if (error) throw error
      } else {
        const { error } = await supabase.from(activeSection).update(payload).eq('id', id)
        if (error) throw error
      }

      await loadRecords()
      cancelEdit()
    } catch (err: any) {
      console.error('Save error:', err.message)
      setErrorMsg(err.message || 'Failed to save record')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return

    try {
      const { error } = await supabase.from(activeSection).delete().eq('id', id)
      if (error) throw error
      await loadRecords()
    } catch (err: any) {
      console.error('Delete error:', err.message)
      alert('Delete failed: ' + err.message)
    }
  }

  const setFieldValue = (key: string, value: any) => {
    setEditingRecord((prev: any) => ({ ...prev, [key]: value }))
  }

  const getRecordLabel = (rec: any): string => {
    if (!rec) return 'Record'
    return (
      rec.title ||
      rec.name ||
      rec.period ||
      rec.tip?.substring(0, 60) ||
      rec.step_number?.toString() ||
      rec.slug ||
      rec.id?.substring(0, 8) ||
      'Record'
    )
  }

  const renderField = (f: FieldDef) => {
    const value = editingRecord?.[f.key]

    const baseInput =
      'w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-violet-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400 transition-colors'

    switch (f.type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => setFieldValue(f.key, e.target.value)}
            placeholder={f.placeholder}
            rows={f.rows || 4}
            className={`${baseInput} leading-relaxed font-mono text-[13px]`}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value ?? 0}
            onChange={(e) => setFieldValue(f.key, Number(e.target.value))}
            placeholder={f.placeholder}
            className={baseInput}
          />
        )

      case 'boolean':
        return (
          <button
            type="button"
            onClick={() => setFieldValue(f.key, !value)}
            className={`relative inline-flex items-center gap-3 px-4 py-3 rounded-xl border transition-all w-full ${
              value
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <span className={`relative w-10 h-6 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : ''}`} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        )

      case 'array':
        return (
          <textarea
            value={Array.isArray(value) ? value.join('\n') : ''}
            onChange={(e) =>
              setFieldValue(f.key, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
            }
            placeholder={f.placeholder || 'One item per line'}
            rows={5}
            className={`${baseInput} leading-relaxed font-mono text-[13px]`}
          />
        )

      case 'json':
        return (
          <textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''}
            onChange={(e) => {
              try {
                setFieldValue(f.key, JSON.parse(e.target.value))
              } catch {
                setFieldValue(f.key, e.target.value)
              }
            }}
            placeholder={f.placeholder}
            rows={6}
            className={`${baseInput} leading-relaxed font-mono text-[13px]`}
          />
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => setFieldValue(f.key, e.target.value)}
            className={`${baseInput} cursor-pointer`}
          >
            {f.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => setFieldValue(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={baseInput}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-[#151520]/80 to-blue-500/5 backdrop-blur-xl p-5 sm:p-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
              <Icon name="database" className="w-3 h-3" glow />
              BPO Industry Content
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              BPO <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">Knowledge Base</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manage the BPO Industry Guide shown in the user learning module. Edit companies, timeline, application steps, documents, and tips.
            </p>
          </div>

          <button
            onClick={loadRecords}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 font-bold text-xs transition-all shrink-0 disabled:opacity-50"
          >
            <Icon name="refresh" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Sub-section tabs */}
      <div className="flex flex-wrap gap-2">
        {BPO_SECTIONS.map((section) => {
          const isActive = activeSection === section.key
          return (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? `bg-gradient-to-r ${section.gradient} text-white border-transparent shadow-lg`
                  : 'bg-slate-900/50 text-slate-400 border-violet-500/20 hover:text-white hover:border-violet-400/40'
              }`}
            >
              <Icon name={section.icon} className="w-3.5 h-3.5" />
              <span>{section.label}</span>
            </button>
          )
        })}
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 flex items-start gap-3">
        <Icon name="info" className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" glow />
        <div className="space-y-1">
          <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">{currentSection.label}</p>
          <p className="text-[12px] text-slate-400 leading-relaxed">{currentSection.description}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between gap-3">
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* EDITING / CREATING VIEW */}
      {editingRecord && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#151520]/90 backdrop-blur-xl p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isCreating ? 'from-emerald-500 to-teal-500' : 'from-blue-500 to-cyan-500'} flex items-center justify-center shadow-lg`}>
                <Icon name={isCreating ? 'plus' : 'edit'} className="w-5 h-5 text-white" glow />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  {isCreating ? 'Create' : 'Edit'} Mode
                </p>
                <h3 className="text-lg font-black">{currentSection.label}</h3>
              </div>
            </div>
            <button
              onClick={cancelEdit}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              aria-label="Close editor"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {fieldDefs.map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  {f.label}
                  {f.required && <span className="text-rose-400">*</span>}
                </label>
                {renderField(f)}
                {f.helpText && (
                  <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                    <Icon name="info" className="w-3 h-3" />
                    {f.helpText}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-emerald-500/20">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icon name="check" className="w-4 h-4" />
                  <span>{isCreating ? 'Create Record' : 'Save Changes'}</span>
                </>
              )}
            </button>
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 disabled:opacity-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {!editingRecord && (
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
          <div className="p-5 border-b border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black tracking-tight">{currentSection.label}</h3>
              <p className="text-xs text-slate-400">
                {filteredRecords.length} record{filteredRecords.length === 1 ? '' : 's'}
                {searchQuery && ` (filtered from ${records.length})`}
              </p>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative flex-1 sm:w-64">
                <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search records..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400"
                />
              </div>
              <button
                onClick={openCreate}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-violet-500/30 hover:shadow-xl transition-all shrink-0"
              >
                <Icon name="plus" className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading records...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Icon name="database" className="w-7 h-7 text-violet-400" glow />
                </div>
                <p className="text-slate-300 font-bold">
                  {records.length === 0 ? 'No records yet' : 'No matches found'}
                </p>
                <p className="text-xs text-slate-500 max-w-sm">
                  {records.length === 0
                    ? `Click "Add New" to create the first record for ${currentSection.label}.`
                    : 'Try adjusting your search query.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-violet-500/10 max-h-[600px] overflow-y-auto">
              {filteredRecords.map((rec, idx) => {
                const label = getRecordLabel(rec)
                return (
                  <div
                    key={rec.id || idx}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-violet-500/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${currentSection.gradient} flex items-center justify-center text-white font-black text-sm`}>
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{label}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {rec.id}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {typeof rec.is_active === 'boolean' && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              rec.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                            }`}>
                              {rec.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                          {typeof rec.is_required === 'boolean' && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              rec.is_required ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-500/15 text-slate-400'
                            }`}>
                              {rec.is_required ? 'Required' : 'Optional'}
                            </span>
                          )}
                          {rec.category && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-500/15 text-violet-300">
                              {rec.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        onClick={() => openEdit(rec)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold transition-all"
                      >
                        <Icon name="edit" className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id, label)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
                      >
                        <Icon name="trash" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// LEARNING TOPICS EDITOR (Admin CRUD)
// ============================================
function TopicEditorView({ Icon }: { Icon: any }) {
  const [view, setView] = useState<'topics' | 'sections'>('topics');
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [sections, setSections] = useState<LearningTopicSection[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Topic editing
  const [editingTopic, setEditingTopic] = useState<any | null>(null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // Section editing
  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);

  const loadTopics = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('learning_topics')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTopics((data as LearningTopic[]) || []);
    } catch (err: any) {
      console.error('Error loading topics:', err.message);
      setErrorMsg(err.message || 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async (topicId: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('learning_topic_sections')
        .select('*')
        .eq('topic_id', topicId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections((data as LearningTopicSection[]) || []);
    } catch (err: any) {
      console.error('Error loading sections:', err.message);
      setErrorMsg(err.message || 'Failed to load sections');
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }, [topics, searchQuery]);

  const openCreateTopic = () => {
    setEditingTopic({
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      icon: 'book',
      gradient: 'from-indigo-500 to-violet-500',
      level: 'beginner',
      estimated_minutes: 15,
      is_active: true,
      display_order: topics.length + 1,
    });
    setIsCreatingTopic(true);
  };

  const openEditTopic = (topic: LearningTopic) => {
    setEditingTopic({ ...topic });
    setIsCreatingTopic(false);
  };

  const cancelTopicEdit = () => {
    setEditingTopic(null);
    setIsCreatingTopic(false);
    setErrorMsg('');
  };

  const handleSaveTopic = async () => {
    if (!editingTopic) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const { id, created_at, updated_at, ...payload } = editingTopic;

      if (!payload.slug?.trim()) throw new Error('Slug is required.');
      if (!payload.title?.trim()) throw new Error('Title is required.');
      if (!/^[a-z0-9-]+$/.test(payload.slug)) {
        throw new Error('Slug must be lowercase letters, numbers, and hyphens only.');
      }

      if (isCreatingTopic) {
        const { error } = await supabase.from('learning_topics').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('learning_topics').update(payload).eq('id', id);
        if (error) throw error;
      }

      await loadTopics();
      cancelTopicEdit();
    } catch (err: any) {
      console.error('Save error:', err.message);
      setErrorMsg(err.message || 'Failed to save topic');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = async (topic: LearningTopic) => {
    if (!confirm(`Delete "${topic.title}"? All its sections will also be deleted. This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('learning_topics').delete().eq('id', topic.id);
      if (error) throw error;
      await loadTopics();
    } catch (err: any) {
      console.error('Delete error:', err.message);
      alert('Delete failed: ' + err.message);
    }
  };

  const handleManageSections = (topic: LearningTopic) => {
    setSelectedTopic(topic);
    setView('sections');
    loadSections(topic.id);
  };

  const handleBackToTopics = () => {
    setView('topics');
    setSelectedTopic(null);
    setSections([]);
    setEditingSection(null);
  };

  const openCreateSection = () => {
    setEditingSection({
      topic_id: selectedTopic?.id,
      section_type: 'lesson',
      title: '',
      content: '',
      examples: [],
      key_points: [],
      display_order: sections.length + 1,
    });
    setIsCreatingSection(true);
  };

  const openEditSection = (section: LearningTopicSection) => {
    setEditingSection({ ...section });
    setIsCreatingSection(false);
  };

  const cancelSectionEdit = () => {
    setEditingSection(null);
    setIsCreatingSection(false);
    setErrorMsg('');
  };

  const handleSaveSection = async () => {
    if (!editingSection || !selectedTopic) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const { id, created_at, updated_at, ...payload } = editingSection;

      if (!payload.title?.trim()) throw new Error('Section title is required.');
      if (!payload.content?.trim()) throw new Error('Section content is required.');

      if (isCreatingSection) {
        const { error } = await supabase.from('learning_topic_sections').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('learning_topic_sections').update(payload).eq('id', id);
        if (error) throw error;
      }

      await loadSections(selectedTopic.id);
      cancelSectionEdit();
    } catch (err: any) {
      console.error('Save error:', err.message);
      setErrorMsg(err.message || 'Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (section: LearningTopicSection) => {
    if (!confirm(`Delete section "${section.title}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('learning_topic_sections').delete().eq('id', section.id);
      if (error) throw error;
      if (selectedTopic) await loadSections(selectedTopic.id);
    } catch (err: any) {
      console.error('Delete error:', err.message);
      alert('Delete failed: ' + err.message);
    }
  };

  const setTopicField = (key: string, value: any) => {
    setEditingTopic((prev: any) => ({ ...prev, [key]: value }));
  };

  const setSectionField = (key: string, value: any) => {
    setEditingSection((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderField = (
    f: FieldDef,
    value: any,
    onChange: (key: string, value: any) => void
  ) => {
    const baseInput =
      'w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-violet-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400 transition-colors';

    switch (f.type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            rows={f.rows || 4}
            className={`${baseInput} leading-relaxed`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(f.key, Number(e.target.value))}
            placeholder={f.placeholder}
            className={baseInput}
          />
        );

      case 'boolean':
        return (
          <button
            type="button"
            onClick={() => onChange(f.key, !value)}
            className={`relative inline-flex items-center gap-3 px-4 py-3 rounded-xl border transition-all w-full ${
              value
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <span className={`relative w-10 h-6 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : ''}`} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        );

      case 'array':
        return (
          <textarea
            value={Array.isArray(value) ? value.join('\n') : ''}
            onChange={(e) =>
              onChange(f.key, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
            }
            placeholder={f.placeholder || 'One item per line'}
            rows={5}
            className={`${baseInput} leading-relaxed font-mono text-[13px]`}
          />
        );

      case 'json':
        return (
          <textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''}
            onChange={(e) => {
              try {
                onChange(f.key, JSON.parse(e.target.value));
              } catch {
                onChange(f.key, e.target.value);
              }
            }}
            placeholder={f.placeholder}
            rows={8}
            className={`${baseInput} leading-relaxed font-mono text-[13px]`}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
            className={`${baseInput} cursor-pointer`}
          >
            {f.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={baseInput}
          />
        );
    }
  };

  // ============================================
  // TOPICS LIST VIEW
  // ============================================
  if (view === 'topics') {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-[#151520]/80 to-teal-500/5 backdrop-blur-xl p-5 sm:p-8">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                <Icon name="graduation-cap" className="w-3 h-3" glow />
                Career Topics Content
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Learning <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Topics</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Manage dynamic career-readiness topics shown in the user Learning module. Each topic contains organized sections (lessons, scripts, templates, checklists).
              </p>
            </div>

            <button
              onClick={loadTopics}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900/70 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 font-bold text-xs transition-all shrink-0 disabled:opacity-50"
            >
              <Icon name="refresh" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between gap-3">
            <span className="flex-1">{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline shrink-0">
              Dismiss
            </button>
          </div>
        )}

        {editingTopic ? (
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#151520]/90 backdrop-blur-xl p-5 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isCreatingTopic ? 'from-emerald-500 to-teal-500' : 'from-blue-500 to-cyan-500'} flex items-center justify-center shadow-lg`}>
                  <Icon name={isCreatingTopic ? 'plus' : 'edit'} className="w-5 h-5 text-white" glow />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    {isCreatingTopic ? 'Create' : 'Edit'} Topic
                  </p>
                  <h3 className="text-lg font-black">{editingTopic.title || 'Untitled Topic'}</h3>
                </div>
              </div>
              <button
                onClick={cancelTopicEdit}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {TOPIC_FIELD_DEFS.map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    {f.label}
                    {f.required && <span className="text-rose-400">*</span>}
                  </label>
                  {renderField(f, editingTopic[f.key], setTopicField)}
                  {f.helpText && (
                    <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                      <Icon name="info" className="w-3 h-3" />
                      {f.helpText}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 rounded-2xl border border-emerald-500/20 bg-slate-900/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">
                Live Preview
              </p>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${editingTopic.gradient} flex items-center justify-center text-white shadow-lg`}>
                  <Icon name={editingTopic.icon} className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{editingTopic.title || 'Topic Title'}</p>
                  {editingTopic.subtitle && (
                    <p className="text-xs text-emerald-400 mt-0.5">{editingTopic.subtitle}</p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    {editingTopic.level} · {editingTopic.estimated_minutes} min
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-emerald-500/20">
              <button
                onClick={handleSaveTopic}
                disabled={saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon name="check" className="w-4 h-4" />
                    <span>{isCreatingTopic ? 'Create Topic' : 'Save Changes'}</span>
                  </>
                )}
              </button>
              <button
                onClick={cancelTopicEdit}
                disabled={saving}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
            <div className="p-5 border-b border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black tracking-tight">All Topics</h3>
                <p className="text-xs text-slate-400">
                  {filteredTopics.length} topic{filteredTopics.length === 1 ? '' : 's'}
                  {searchQuery && ` (filtered from ${topics.length})`}
                </p>
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="relative flex-1 sm:w-64">
                  <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
                <button
                  onClick={openCreateTopic}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all shrink-0"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  <span>New Topic</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm">Loading topics...</div>
            ) : filteredTopics.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Icon name="graduation-cap" className="w-7 h-7 text-emerald-400" glow />
                  </div>
                  <p className="text-slate-300 font-bold">
                    {topics.length === 0 ? 'No topics yet' : 'No matches found'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    {topics.length === 0
                      ? 'Click "New Topic" to create your first learning topic.'
                      : 'Try adjusting your search query.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-violet-500/10 max-h-[600px] overflow-y-auto">
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-violet-500/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center text-white shadow-lg`}>
                        <Icon name={topic.icon} className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-white truncate">{topic.title}</p>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            topic.is_active
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-slate-500/15 text-slate-400'
                          }`}>
                            {topic.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            topic.level === 'beginner' ? 'bg-emerald-500/15 text-emerald-400' :
                            topic.level === 'intermediate' ? 'bg-sky-500/15 text-sky-400' :
                            topic.level === 'upper_intermediate' ? 'bg-violet-500/15 text-violet-400' :
                            'bg-rose-500/15 text-rose-400'
                          }`}>
                            {topic.level}
                          </span>
                        </div>
                        {topic.subtitle && (
                          <p className="text-xs text-emerald-400 mt-0.5 truncate">{topic.subtitle}</p>
                        )}
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {topic.slug} · {topic.estimated_minutes} min · Order #{topic.display_order}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        onClick={() => handleManageSections(topic)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
                      >
                        <Icon name="layers" className="w-3.5 h-3.5" />
                        <span>Sections</span>
                      </button>
                      <button
                        onClick={() => openEditTopic(topic)}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold transition-all"
                      >
                        <Icon name="edit" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
                      >
                        <Icon name="trash" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // SECTIONS VIEW
  // ============================================
  return (
    <div className="space-y-6">
      <button
        onClick={handleBackToTopics}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-slate-300 hover:text-white hover:border-violet-400/40 font-bold text-xs transition-all"
      >
        <Icon name="arrow-left" className="w-4 h-4" />
        <span>Back to All Topics</span>
      </button>

      {selectedTopic && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 sm:p-6">
          <div className={`absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br ${selectedTopic.gradient} opacity-10 rounded-full blur-3xl`} />
          <div className="relative flex items-start gap-4">
            <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${selectedTopic.gradient} flex items-center justify-center text-white shadow-lg`}>
              <Icon name={selectedTopic.icon} className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Managing Sections
              </p>
              <h2 className="text-2xl font-black tracking-tight mt-1">{selectedTopic.title}</h2>
              {selectedTopic.subtitle && (
                <p className="text-sm text-emerald-400 mt-1">{selectedTopic.subtitle}</p>
              )}
              <p className="text-[11px] text-slate-500 font-mono mt-2">
                {sections.length} section{sections.length === 1 ? '' : 's'} · {selectedTopic.level} · {selectedTopic.estimated_minutes} min
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between gap-3">
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {editingSection ? (
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#151520]/90 backdrop-blur-xl p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isCreatingSection ? 'from-cyan-500 to-blue-500' : 'from-emerald-500 to-teal-500'} flex items-center justify-center shadow-lg`}>
                <Icon name={isCreatingSection ? 'plus' : 'edit'} className="w-5 h-5 text-white" glow />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  {isCreatingSection ? 'Create' : 'Edit'} Section
                </p>
                <h3 className="text-lg font-black">{editingSection.title || 'Untitled Section'}</h3>
              </div>
            </div>
            <button
              onClick={cancelSectionEdit}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {TOPIC_SECTION_FIELD_DEFS.map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  {f.label}
                  {f.required && <span className="text-rose-400">*</span>}
                </label>
                {renderField(f, editingSection[f.key], setSectionField)}
                {f.helpText && (
                  <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                    <Icon name="info" className="w-3 h-3" />
                    {f.helpText}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-cyan-500/20">
            <button
              onClick={handleSaveSection}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icon name="check" className="w-4 h-4" />
                  <span>{isCreatingSection ? 'Create Section' : 'Save Changes'}</span>
                </>
              )}
            </button>
            <button
              onClick={cancelSectionEdit}
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
          <div className="p-5 border-b border-violet-500/20 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-base font-black tracking-tight">Sections</h3>
              <p className="text-xs text-slate-400">
                {sections.length} section{sections.length === 1 ? '' : 's'} in this topic
              </p>
            </div>
            <button
              onClick={openCreateSection}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>New Section</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading sections...</div>
          ) : sections.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Icon name="layers" className="w-7 h-7 text-cyan-400" glow />
                </div>
                <p className="text-slate-300 font-bold">No sections yet</p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click "New Section" to add the first section to this topic.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-violet-500/10 max-h-[600px] overflow-y-auto">
              {sections.map((section, idx) => {
                const sectionMeta: Record<string, { label: string; color: string }> = {
                  lesson: { label: 'Lesson', color: 'text-indigo-400 bg-indigo-500/15' },
                  example: { label: 'Example', color: 'text-cyan-400 bg-cyan-500/15' },
                  template: { label: 'Template', color: 'text-violet-400 bg-violet-500/15' },
                  tip: { label: 'Tips', color: 'text-amber-400 bg-amber-500/15' },
                  checklist: { label: 'Checklist', color: 'text-emerald-400 bg-emerald-500/15' },
                  script: { label: 'Scripts', color: 'text-rose-400 bg-rose-500/15' },
                  comparison: { label: 'Comparison', color: 'text-fuchsia-400 bg-fuchsia-500/15' },
                };
                const meta = sectionMeta[section.section_type] || sectionMeta.lesson;

                return (
                  <div
                    key={section.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-violet-500/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-xs font-black text-slate-400">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Order #{section.display_order}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white truncate mt-1">{section.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {section.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        onClick={() => openEditSection(section)}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold transition-all"
                      >
                        <Icon name="edit" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
                      >
                        <Icon name="trash" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// ADMIN SUGGESTION POOL EDITOR
// ============================================
interface AdminSuggestion {
  id: string;
  title: string;
  description: string | null;
  category: 'feature' | 'bug' | 'improvement' | 'content' | 'ui_ux' | 'performance' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  tags: string[];
  upvotes: number;
  created_by?: string | null;
  created_by_name?: string | null;
  is_pinned: boolean;
  created_at?: string;
  updated_at?: string;
}

const SUGGESTION_CATEGORIES = [
  { key: 'feature', label: 'Feature', emoji: '✨', color: 'text-violet-400 bg-violet-500/15 border-violet-500/30' },
  { key: 'bug', label: 'Bug', emoji: '🐛', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
  { key: 'improvement', label: 'Improvement', emoji: '⚡', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { key: 'content', label: 'Content', emoji: '📚', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
  { key: 'ui_ux', label: 'UI/UX', emoji: '🎨', color: 'text-fuchsia-400 bg-fuchsia-500/15 border-fuchsia-500/30' },
  { key: 'performance', label: 'Performance', emoji: '🚀', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  { key: 'other', label: 'Other', emoji: '💡', color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' },
] as const;

const SUGGESTION_PRIORITIES = [
  { key: 'low', label: 'Low', color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' },
  { key: 'medium', label: 'Medium', color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' },
  { key: 'high', label: 'High', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { key: 'critical', label: 'Critical', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
] as const;

const SUGGESTION_STATUSES = [
  { key: 'pending', label: 'Pending', color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' },
  { key: 'planned', label: 'Planned', color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' },
  { key: 'in_progress', label: 'In Progress', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { key: 'completed', label: 'Completed', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  { key: 'rejected', label: 'Rejected', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
] as const;

function SuggestionPoolView({
  Icon,
  adminEmail,
  userId,
}: {
  Icon: any;
  adminEmail: string;
  userId: string | null;
}) {
  const [suggestions, setSuggestions] = useState<AdminSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminSuggestion['status']>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AdminSuggestion['category']>('all');
  const [editing, setEditing] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // ============================================
  // LOAD SUGGESTIONS
  // ============================================
  const loadSuggestions = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('admin_suggestions')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions((data as AdminSuggestion[]) || []);
    } catch (err: any) {
      console.error('Error loading suggestions:', err.message);
      setErrorMsg(err.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  // ============================================
  // FILTER
  // ============================================
  const filtered = useMemo(() => {
    return suggestions.filter((s) => {
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [suggestions, statusFilter, categoryFilter, searchQuery]);

  // ============================================
  // STATS
  // ============================================
  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {
      pending: 0,
      planned: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0,
    };
    const byCategory: Record<string, number> = {};
    suggestions.forEach((s) => {
      byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      byCategory[s.category] = (byCategory[s.category] || 0) + 1;
    });
    return {
      total: suggestions.length,
      byStatus,
      byCategory,
      topVoted: [...suggestions].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5),
    };
  }, [suggestions]);

  // ============================================
  // OPEN CREATE
  // ============================================
  const openCreate = () => {
    setEditing({
      title: '',
      description: '',
      category: 'feature',
      priority: 'medium',
      status: 'pending',
      tags: [],
      upvotes: 0,
      is_pinned: false,
      created_by: userId,
      created_by_name: adminEmail || 'Admin',
    });
    setIsCreating(true);
  };

  const openEdit = (s: AdminSuggestion) => {
    setEditing({ ...s });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsCreating(false);
    setErrorMsg('');
  };

  // ============================================
  // SAVE
  // ============================================
  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const { id, created_at, updated_at, ...payload } = editing;

      if (!payload.title?.trim()) throw new Error('Title is required.');

      if (isCreating) {
        const { error } = await supabase.from('admin_suggestions').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('admin_suggestions').update(payload).eq('id', id);
        if (error) throw error;
      }

      await loadSuggestions();
      cancelEdit();
    } catch (err: any) {
      console.error('Save error:', err.message);
      setErrorMsg(err.message || 'Failed to save suggestion');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE
  // ============================================
  const handleDelete = async (s: AdminSuggestion) => {
    if (!confirm(`Delete suggestion "${s.title}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('admin_suggestions').delete().eq('id', s.id);
      if (error) throw error;
      await loadSuggestions();
    } catch (err: any) {
      console.error('Delete error:', err.message);
      alert('Delete failed: ' + err.message);
    }
  };

  // ============================================
  // UPVOTE
  // ============================================
  const handleUpvote = async (s: AdminSuggestion) => {
    try {
      const { error } = await supabase
        .from('admin_suggestions')
        .update({ upvotes: (s.upvotes || 0) + 1 })
        .eq('id', s.id);
      if (error) throw error;
      setSuggestions((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, upvotes: (item.upvotes || 0) + 1 } : item))
      );
    } catch (err: any) {
      console.error('Upvote error:', err.message);
    }
  };

  // ============================================
  // QUICK STATUS CHANGE
  // ============================================
  const quickStatusChange = async (s: AdminSuggestion, newStatus: AdminSuggestion['status']) => {
    try {
      const { error } = await supabase
        .from('admin_suggestions')
        .update({ status: newStatus })
        .eq('id', s.id);
      if (error) throw error;
      setSuggestions((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, status: newStatus } : item))
      );
    } catch (err: any) {
      console.error('Status update error:', err.message);
      alert('Failed to update status: ' + err.message);
    }
  };

  // ============================================
  // TOGGLE PIN
  // ============================================
  const togglePin = async (s: AdminSuggestion) => {
    try {
      const { error } = await supabase
        .from('admin_suggestions')
        .update({ is_pinned: !s.is_pinned })
        .eq('id', s.id);
      if (error) throw error;
      await loadSuggestions();
    } catch (err: any) {
      console.error('Pin toggle error:', err.message);
    }
  };

  // ============================================
  // FIELD SETTER
  // ============================================
  const setField = (key: string, value: any) => {
    setEditing((prev: any) => ({ ...prev, [key]: value }));
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[#151520]/80 to-orange-500/5 backdrop-blur-xl p-5 sm:p-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest text-amber-300">
              <Icon name="sparkles" className="w-3 h-3" glow />
              Internal Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Suggestion <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">Pool</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Capture your ideas for the next system update. Vote on proposals, track implementation status, and keep the roadmap visible.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={loadSuggestions}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900/70 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 font-bold text-xs transition-all disabled:opacity-50"
            >
              <Icon name="refresh" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Syncing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>New Suggestion</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between gap-3">
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-slate-500/15' },
          { label: 'Pending', value: stats.byStatus.pending, color: 'text-slate-300', bg: 'bg-slate-500/15' },
          { label: 'Planned', value: stats.byStatus.planned, color: 'text-sky-300', bg: 'bg-sky-500/15' },
          { label: 'In Progress', value: stats.byStatus.in_progress, color: 'text-amber-300', bg: 'bg-amber-500/15' },
          { label: 'Completed', value: stats.byStatus.completed, color: 'text-emerald-300', bg: 'bg-emerald-500/15' },
          { label: 'Rejected', value: stats.byStatus.rejected, color: 'text-rose-300', bg: 'bg-rose-500/15' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border border-violet-500/20 ${stat.bg} p-4`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Editor */}
      {editing ? (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#151520]/90 backdrop-blur-xl p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isCreating ? 'from-amber-500 to-orange-500' : 'from-blue-500 to-cyan-500'} flex items-center justify-center shadow-lg`}>
                <Icon name={isCreating ? 'plus' : 'edit'} className="w-5 h-5 text-white" glow />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  {isCreating ? 'Create' : 'Edit'} Suggestion
                </p>
                <h3 className="text-lg font-black">{editing.title || 'Untitled Suggestion'}</h3>
              </div>
            </div>
            <button
              onClick={cancelEdit}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={editing.title || ''}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="e.g., Add dark/light theme toggle in user dashboard"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-amber-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Description
              </label>
              <textarea
                value={editing.description || ''}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Describe the idea, why it matters, and any relevant details..."
                rows={5}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-amber-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            {/* Category + Priority + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                <select
                  value={editing.category || 'feature'}
                  onChange={(e) => setField('category', e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-amber-500/20 text-white text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {SUGGESTION_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Priority</label>
                <select
                  value={editing.priority || 'medium'}
                  onChange={(e) => setField('priority', e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-amber-500/20 text-white text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {SUGGESTION_PRIORITIES.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</label>
                <select
                  value={editing.status || 'pending'}
                  onChange={(e) => setField('status', e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-amber-500/20 text-white text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {SUGGESTION_STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Tags <span className="text-slate-500 normal-case">(one per line)</span>
              </label>
              <textarea
                value={Array.isArray(editing.tags) ? editing.tags.join('\n') : ''}
                onChange={(e) =>
                  setField('tags', e.target.value.split('\n').map((t) => t.trim()).filter(Boolean))
                }
                placeholder="e.g., ui&#10;theme&#10;accessibility"
                rows={3}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-amber-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 font-mono text-[13px]"
              />
            </div>

            {/* Pin toggle + Upvotes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Pin to top</label>
                <button
                  type="button"
                  onClick={() => setField('is_pinned', !editing.is_pinned)}
                  className={`relative inline-flex items-center gap-3 px-4 py-3 rounded-xl border transition-all w-full ${
                    editing.is_pinned
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className={`relative w-10 h-6 rounded-full transition-colors ${editing.is_pinned ? 'bg-amber-500' : 'bg-slate-700'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${editing.is_pinned ? 'translate-x-4' : ''}`} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {editing.is_pinned ? 'Pinned' : 'Not pinned'}
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Upvotes</label>
                <input
                  type="number"
                  value={editing.upvotes ?? 0}
                  onChange={(e) => setField('upvotes', Number(e.target.value))}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-amber-500/20 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-amber-500/20">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/30 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icon name="check" className="w-4 h-4" />
                  <span>{isCreating ? 'Submit Suggestion' : 'Save Changes'}</span>
                </>
              )}
            </button>
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="rounded-2xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search suggestions by title, description, or tags..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white text-sm focus:outline-none focus:border-violet-400 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {SUGGESTION_STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white text-sm focus:outline-none focus:border-violet-400 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {SUGGESTION_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              {filtered.length} of {suggestions.length} suggestion{suggestions.length === 1 ? '' : 's'} shown
            </p>
          </div>

          {/* List */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm rounded-2xl border border-violet-500/20 bg-[#151520]/70">
              Loading suggestions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-violet-500/20 bg-[#151520]/70">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Icon name="sparkles" className="w-8 h-8 text-amber-400" glow />
                </div>
                <p className="text-slate-300 font-bold">
                  {suggestions.length === 0 ? 'No suggestions yet' : 'No matches found'}
                </p>
                <p className="text-xs text-slate-500 max-w-sm">
                  {suggestions.length === 0
                    ? 'Click "New Suggestion" to submit your first idea for the next system update.'
                    : 'Try adjusting your filters or search query.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((s) => {
                const catMeta = SUGGESTION_CATEGORIES.find((c) => c.key === s.category) || SUGGESTION_CATEGORIES[6];
                const prioMeta = SUGGESTION_PRIORITIES.find((p) => p.key === s.priority) || SUGGESTION_PRIORITIES[1];
                const statusMeta = SUGGESTION_STATUSES.find((st) => st.key === s.status) || SUGGESTION_STATUSES[0];

                return (
                  <div
                    key={s.id}
                    className={`relative overflow-hidden rounded-2xl border bg-[#151520]/70 backdrop-blur-xl p-5 transition-colors hover:bg-violet-500/[0.03] ${
                      s.is_pinned ? 'border-amber-500/40' : 'border-violet-500/20'
                    }`}
                  >
                    {s.is_pinned && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Vote column */}
                      <div className="flex sm:flex-col items-center gap-2 sm:w-16 shrink-0">
                        <button
                          onClick={() => handleUpvote(s)}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900/70 border border-violet-500/20 hover:border-amber-500/40 hover:bg-amber-500/10 flex flex-col items-center justify-center transition-all group"
                          title="Upvote"
                        >
                          <Icon name="chevron-down" className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 rotate-180 transition-colors" />
                          <span className="text-sm font-black text-white group-hover:text-amber-400">{s.upvotes || 0}</span>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start gap-2 flex-wrap">
                          {s.is_pinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              📌 Pinned
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${catMeta.color}`}>
                            {catMeta.emoji} {catMeta.label}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${prioMeta.color}`}>
                            {prioMeta.label}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white leading-snug">{s.title}</h3>

                        {s.description && (
                          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                            {s.description}
                          </p>
                        )}

                        {s.tags && s.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {s.tags.map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800/80 text-slate-400 border border-slate-700/60">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-violet-500/10">
                          {/* Status quick-select */}
                          <select
                            value={s.status}
                            onChange={(e) => quickStatusChange(s, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusMeta.color} cursor-pointer focus:outline-none`}
                          >
                            {SUGGESTION_STATUSES.map((st) => (
                              <option key={st.key} value={st.key}>{st.label}</option>
                            ))}
                          </select>

                          {s.created_by_name && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              by {s.created_by_name}
                            </span>
                          )}

                          {s.created_at && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              · {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}

                          <div className="ml-auto flex items-center gap-2">
                            <button
                              onClick={() => togglePin(s)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                s.is_pinned
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-amber-400'
                              }`}
                              title={s.is_pinned ? 'Unpin' : 'Pin to top'}
                            >
                              📌
                            </button>
                            <button
                              onClick={() => openEdit(s)}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold transition-all flex items-center gap-1"
                            >
                              <Icon name="edit" className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(s)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] font-bold transition-all"
                            >
                              <Icon name="trash" className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// MAIN ADMIN DASHBOARD
// ============================================
export default function AdminDashboardPage() {
  const [adminEmail, setAdminEmail] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [allScores, setAllScores] = useState<any[]>([])
  const [tutorials, setTutorials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Users Filter & Edit States
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  // User Profile View State
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<{
    user: any | null
    scores: any[]
    certificates: any[]
    tickets: any[]
    lessonProgress: any[]
    completedLessonIds: string[]
  }>({ user: null, scores: [], certificates: [], tickets: [], lessonProgress: [], completedLessonIds: [] })
  const [profileLoading, setProfileLoading] = useState(false)

  // Rankings Filter State
  const [rankingModuleFilter, setRankingModuleFilter] = useState<'overall' | 'listening' | 'reading' | 'writing' | 'speaking' | 'typing'>('overall')
  const [rankingSearch, setRankingSearch] = useState('')

  // Questions Filter & CRUD Form States
  const [questionSearch, setQuestionSearch] = useState('')
  const [questionModuleFilter, setQuestionModuleFilter] = useState<'all' | 'reading' | 'listening'>('all')
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState<string | number | null>(null)
  
  // Question Form Fields
  const [qModuleId, setQModuleId] = useState<'reading' | 'listening'>('reading')
  const [qTestTitle, setQTestTitle] = useState('')
  const [qPassage, setQPassage] = useState('')
  const [qAudioScript, setQAudioScript] = useState('')
  const [qQuestionText, setQQuestionText] = useState('')
  const [qOptionsStr, setQOptionsStr] = useState('')
  const [qCorrectAnswer, setQCorrectAnswer] = useState('')

  // TUTORIAL / LESSON STATES
  const [tutorialSearch, setTutorialSearch] = useState('')
  const [tutorialLevelFilter, setTutorialLevelFilter] = useState<'all' | TutorialLevel>('all')
  const [showTutorialModal, setShowTutorialModal] = useState(false)
  const [editingTutorialId, setEditingTutorialId] = useState<string | null>(null)
  const [tTitle, setTTitle] = useState('')
  const [tLevel, setTLevel] = useState<TutorialLevel>('beginner')
  const [tOrderIndex, setTOrderIndex] = useState(1)
  const [tContent, setTContent] = useState('')
  const [expandedTutorialId, setExpandedTutorialId] = useState<string | null>(null)

  // BPO COUNTS STATE
  const [bpoCounts, setBpoCounts] = useState<Record<BPOSection, number>>({
    bpo_industry_overview: 0,
    bpo_historical_timeline: 0,
    bpo_companies: 0,
    bpo_job_roles: 0,
    bpo_application_steps: 0,
    bpo_required_documents: 0,
    bpo_success_tips: 0,
  })
  
  // TOPIC COUNTS STATE
  const [topicCounts, setTopicCounts] = useState({
    topics: 0,
    sections: 0,
  })

  // SUGGESTION COUNT STATE
  const [suggestionCount, setSuggestionCount] = useState(0)

  const router = useRouter()

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Close mobile sidebar when tab changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [activeTab])

  // ============================================
  // LOAD ADMIN DATA
  // ============================================
  const loadAdminData = async () => {
    try {
      setErrorMsg('')
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setAdminEmail(user.email)

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError
      if (usersData) setUsers(usersData)

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: false })

      if (questionsError) throw questionsError
      if (questionsData) setQuestions(questionsData)

      const { data: scoresData, error: scoresError } = await supabase
        .from('module_scores')
        .select('*')
        .order('created_at', { ascending: false })

      if (scoresError) throw scoresError
      if (scoresData) setAllScores(scoresData)

      const { data: tutorialsData, error: tutorialsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true })

      if (tutorialsError) throw tutorialsError
      if (tutorialsData) setTutorials(tutorialsData)

      const bpoTableNames: BPOSection[] = [
        'bpo_industry_overview',
        'bpo_historical_timeline',
        'bpo_companies',
        'bpo_job_roles',
        'bpo_application_steps',
        'bpo_required_documents',
        'bpo_success_tips',
      ]

      const [topicsCountRes, sectionsCountRes] = await Promise.all([
        supabase.from('learning_topics').select('*', { count: 'exact', head: true }),
        supabase.from('learning_topic_sections').select('*', { count: 'exact', head: true }),
      ])

      const { count: suggestionCountRes } = await supabase
        .from('admin_suggestions')
        .select('*', { count: 'exact', head: true })

      setSuggestionCount(suggestionCountRes ?? 0)

      setTopicCounts({
        topics: topicsCountRes.count ?? 0,
        sections: sectionsCountRes.count ?? 0,
      })

      const countResults = await Promise.all(
        bpoTableNames.map((t) =>
          supabase.from(t).select('*', { count: 'exact', head: true })
        )
      )

      const counts: Record<string, number> = {}
      bpoTableNames.forEach((name, i) => {
        counts[name] = countResults[i].count ?? 0
      })
      setBpoCounts(counts as Record<BPOSection, number>)
    } catch (err: any) {
      console.error('Error loading admin dashboard data:', err)
      setErrorMsg('Failed to fetch data: ' + (err.message || 'Unknown error (Check RLS Policies or Table Name)'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAdminData()
  }

  // ============================================
  // OPEN USER PROFILE
  // ============================================
  const openUserProfile = async (user: any) => {
    setViewingUserId(user.id)
    setProfileLoading(true)
    setProfileData({
      user,
      scores: [],
      certificates: [],
      tickets: [],
      lessonProgress: [],
      completedLessonIds: [],
    })

    try {
      const [scoresRes, certsRes, ticketsRes, lessonProgressRes] = await Promise.all([
        supabase
          .from('module_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false }),
      ])

      const lessonProgress = lessonProgressRes.data || []

      setProfileData({
        user,
        scores: scoresRes.data || [],
        certificates: certsRes.data || [],
        tickets: ticketsRes.data || [],
        lessonProgress,
        completedLessonIds: lessonProgress.map((row: any) => row.lesson_id),
      })
    } catch (err: any) {
      console.error('Error loading user profile:', err)
      setErrorMsg('Failed to load profile details: ' + err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const closeUserProfile = () => {
    setViewingUserId(null)
    setProfileData({
      user: null,
      scores: [],
      certificates: [],
      tickets: [],
      lessonProgress: [],
      completedLessonIds: [],
    })
  }

  // ============================================
  // USERS CRUD HANDLERS
  // ============================================
  const handleToggleAdmin = async (userId: string, currentStatus: boolean, userEmail: string) => {
    if (userEmail === adminEmail && currentStatus) {
      alert("Safety Lock: You cannot remove your own administrator privileges while logged in.")
      return
    }

    try {
      setErrorMsg('')
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      await loadAdminData()
      
      if (viewingUserId === userId) {
        const updatedUser = { ...profileData.user, is_admin: !currentStatus }
        setProfileData(prev => ({ ...prev, user: updatedUser }))
      }
    } catch (err: any) {
      console.error('Error updating admin status:', err)
      alert('Failed to update privilege: ' + err.message)
    }
  }

  const handleSaveName = async (userId: string) => {
    try {
      setErrorMsg('')
      const { error } = await supabase
        .from('users')
        .update({ name: editName })
        .eq('id', userId)

      if (error) throw error
      setEditingUserId(null)
      await loadAdminData()
      
      if (viewingUserId === userId) {
        setProfileData(prev => ({ ...prev, user: { ...prev.user, name: editName } }))
      }
    } catch (err: any) {
      console.error('Error updating name:', err)
      alert('Failed to update name: ' + err.message)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userEmail === adminEmail) {
      alert("Safety Lock: You cannot delete your own active admin account.")
      return
    }

    if (!confirm(`Are you sure you want to permanently delete account: ${userEmail}?`)) return

    try {
      setErrorMsg('')
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      closeUserProfile()
      await loadAdminData()
    } catch (err: any) {
      console.error('Error deleting user:', err)
      alert('Deletion failed: ' + err.message)
    }
  }

  // ============================================
  // PASSWORD UPDATE HANDLER
  // ============================================
  const handleUpdatePassword = async (userId: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(newPassword, salt)

      const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('id', userId)

      if (error) throw error

      return { success: true, message: 'Password updated successfully.' }
    } catch (err: any) {
      console.error('Error updating password:', err)
      return { success: false, message: err.message || 'Failed to update password.' }
    }
  }

  // ============================================
  // QUESTIONS CRUD HANDLERS
  // ============================================
  const openCreateQuestionModal = () => {
    setEditingQuestionId(null)
    setQModuleId('reading')
    setQTestTitle('')
    setQPassage('')
    setQAudioScript('')
    setQQuestionText('')
    setQOptionsStr('')
    setQCorrectAnswer('')
    setShowQuestionModal(true)
  }

  const openEditQuestionModal = (q: any) => {
    setEditingQuestionId(q.id)
    setQModuleId(q.module_id || 'reading')
    setQTestTitle(q.test_title || '')
    setQPassage(q.passage || '')
    setQAudioScript(q.audio_script || '')
    setQQuestionText(q.question_text || '')
    setQOptionsStr(Array.isArray(q.options) ? q.options.join(', ') : '')
    setQCorrectAnswer(q.correct_answer || '')
    setShowQuestionModal(true)
  }

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    const optionsArray = qOptionsStr.split(',').map((o) => o.trim()).filter(Boolean)

    const payload = {
      module_id: qModuleId,
      test_title: qTestTitle.trim(),
      passage: qModuleId === 'reading' ? qPassage.trim() : null,
      audio_script: qModuleId === 'listening' ? qAudioScript.trim() : null,
      question_text: qQuestionText.trim(),
      options: optionsArray,
      correct_answer: qCorrectAnswer.trim(),
    }

    try {
      setErrorMsg('')
      if (editingQuestionId !== null) {
        const { error } = await supabase
          .from('questions')
          .update(payload)
          .eq('id', editingQuestionId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('questions')
          .insert([payload])
        if (error) throw error
      }

      setShowQuestionModal(false)
      await loadAdminData()
    } catch (err: any) {
      console.error('Error saving question:', err)
      alert('Failed to save question: ' + (err.message || 'Unknown error'))
    }
  }

  const handleDeleteQuestion = async (questionId: string | number) => {
    if (!confirm('Are you sure you want to permanently delete this question?')) return

    try {
      setErrorMsg('')
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId)

      if (error) throw error
      await loadAdminData()
    } catch (err: any) {
      console.error('Error deleting question:', err)
      alert('Failed to delete question: ' + err.message)
    }
  }

  // ============================================
  // TUTORIALS / LESSONS CRUD HANDLERS
  // ============================================
  const openCreateTutorialModal = () => {
    setEditingTutorialId(null)
    setTTitle('')
    setTLevel('beginner')
    setTOrderIndex(tutorials.length + 1)
    setTContent('')
    setShowTutorialModal(true)
  }

  const openEditTutorialModal = (t: any) => {
    setEditingTutorialId(t.id)
    setTTitle(t.title || '')
    setTLevel((t.level as TutorialLevel) || 'beginner')
    setTOrderIndex(t.order_index || 1)
    setTContent(t.content || '')
    setShowTutorialModal(true)
  }

  const handleSaveTutorial = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title: tTitle.trim(),
      level: tLevel,
      order_index: Number(tOrderIndex),
      content: tContent.trim(),
    }

    try {
      setErrorMsg('')
      if (editingTutorialId !== null) {
        const { error } = await supabase
          .from('lessons')
          .update(payload)
          .eq('id', editingTutorialId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([payload])
        if (error) throw error
      }

      setShowTutorialModal(false)
      await loadAdminData()
    } catch (err: any) {
      console.error('Error saving tutorial:', err)
      alert('Failed to save tutorial: ' + (err.message || 'Unknown error'))
    }
  }

  const handleDeleteTutorial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson? This cannot be undone.')) return
    try {
      setErrorMsg('')
      const { error } = await supabase.from('lessons').delete().eq('id', id)
      if (error) throw error
      await loadAdminData()
    } catch (err: any) {
      console.error('Error deleting tutorial:', err)
      alert('Failed to delete lesson: ' + err.message)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setTimeout(async () => {
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    }, 600)
  }

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole =
        filterRole === 'all' ||
        (filterRole === 'admin' && u.is_admin === true) ||
        (filterRole === 'user' && u.is_admin !== true)

      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, filterRole])

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        questionSearch.trim() === '' ||
        q.question_text?.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.test_title?.toLowerCase().includes(questionSearch.toLowerCase())

      const matchesModule =
        questionModuleFilter === 'all' || q.module_id === questionModuleFilter

      return matchesSearch && matchesModule
    })
  }, [questions, questionSearch, questionModuleFilter])

  // Filtered tutorials
  const filteredTutorials = useMemo(() => {
    return tutorials.filter((t) => {
      const matchesSearch =
        tutorialSearch.trim() === '' ||
        t.title?.toLowerCase().includes(tutorialSearch.toLowerCase()) ||
        t.content?.toLowerCase().includes(tutorialSearch.toLowerCase())

      const matchesLevel =
        tutorialLevelFilter === 'all' || t.level === tutorialLevelFilter

      return matchesSearch && matchesLevel
    })
  }, [tutorials, tutorialSearch, tutorialLevelFilter])

  // Tutorial stats
  const tutorialStats = useMemo(() => {
    const total = tutorials.length
    const byLevel: Record<string, number> = {
      beginner: 0,
      intermediate: 0,
      upper_intermediate: 0,
      advanced: 0,
    }
    tutorials.forEach(t => {
      const lvl = (t.level || 'beginner') as TutorialLevel
      if (byLevel[lvl] !== undefined) byLevel[lvl]++
    })
    return { total, byLevel }
  }, [tutorials])

  const stats = useMemo(() => {
    const totalUsers = users.length
    const admins = users.filter((u) => u.is_admin).length
    const regularUsers = totalUsers - admins
    const totalQuestions = questions.length
    const readingQuestions = questions.filter(q => q.module_id === 'reading').length
    const listeningQuestions = questions.filter(q => q.module_id === 'listening').length
    
    return { totalUsers, admins, regularUsers, totalQuestions, readingQuestions, listeningQuestions }
  }, [users, questions])

  // ============================================
  // RANKINGS COMPUTATION
  // ============================================
  const rankings = useMemo(() => {
  const userScoreMap = new Map<string, {
    userId: string
    userName: string
    userEmail: string
    isAdmin: boolean
    scoresByModule: Record<string, number[]>
    wpmByModule: Record<string, number[]>
    accuracyByModule: Record<string, number[]>
    totalScore: number
    totalAttempts: number
  }>()

  allScores.forEach((s) => {
    const uid = s.user_id
    if (!uid) return
    if (!userScoreMap.has(uid)) {
      const u = users.find(x => x.id === uid)
      userScoreMap.set(uid, {
        userId: uid,
        userName: u?.name || 'Unknown User',
        userEmail: u?.email || 'N/A',
        isAdmin: u?.is_admin || false,
        scoresByModule: {},
        wpmByModule: {},
        accuracyByModule: {},
        totalScore: 0,
        totalAttempts: 0,
      })
    }
    const entry = userScoreMap.get(uid)!
    const mod = s.module_name || 'unknown'
    if (!entry.scoresByModule[mod]) entry.scoresByModule[mod] = []
    entry.scoresByModule[mod].push(s.score || 0)

    // ⬇️ NEW: Track WPM + accuracy for typing module
    if (mod === 'typing') {
      if (typeof s.wpm === 'number' && s.wpm > 0) {
        if (!entry.wpmByModule[mod]) entry.wpmByModule[mod] = []
        entry.wpmByModule[mod].push(s.wpm)
      }
      if (typeof s.accuracy === 'number' && s.accuracy > 0) {
        if (!entry.accuracyByModule[mod]) entry.accuracyByModule[mod] = []
        entry.accuracyByModule[mod].push(s.accuracy)
      }
    }

    entry.totalScore += s.score || 0
    entry.totalAttempts += 1
  })

  const list = Array.from(userScoreMap.values()).map((u) => {
    const moduleAverages: Record<string, number> = {}
    Object.keys(u.scoresByModule).forEach((mod) => {
      const arr = u.scoresByModule[mod]
      moduleAverages[mod] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
    })

    // ⬇️ NEW: Compute per-module WPM stats
    const moduleWpmAvg: Record<string, number> = {}
    const moduleWpmBest: Record<string, number> = {}
    const moduleAccuracyAvg: Record<string, number> = {}

    Object.keys(u.wpmByModule).forEach((mod) => {
      const arr = u.wpmByModule[mod]
      moduleWpmAvg[mod] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
      moduleWpmBest[mod] = Math.max(...arr)
    })
    Object.keys(u.accuracyByModule).forEach((mod) => {
      const arr = u.accuracyByModule[mod]
      moduleAccuracyAvg[mod] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
    })

    const overallAverage = u.totalAttempts > 0
      ? Math.round(u.totalScore / u.totalAttempts)
      : 0

    return {
      ...u,
      moduleAverages,
      moduleWpmAvg,
      moduleWpmBest,
      moduleAccuracyAvg,
      overallAverage,
    }
  })

  const sorted = [...list].sort((a, b) => {
    // ⬇️ NEW: For typing, rank by best WPM instead of score
    if (rankingModuleFilter === 'typing') {
      const aWpm = a.moduleWpmBest.typing ?? -1
      const bWpm = b.moduleWpmBest.typing ?? -1
      return bWpm - aWpm
    }
    const getScore = (x: typeof a) => {
      if (rankingModuleFilter === 'overall') return x.overallAverage
      return x.moduleAverages[rankingModuleFilter] ?? -1
    }
    return getScore(b) - getScore(a)
  })

  return sorted.map((u, idx) => ({
    ...u,
    rank: idx + 1,
    // ⬇️ NEW: displayScore carries WPM for typing, score for others
    displayScore: rankingModuleFilter === 'overall'
      ? u.overallAverage
      : rankingModuleFilter === 'typing'
        ? (u.moduleWpmBest.typing ?? null)
        : (u.moduleAverages[rankingModuleFilter] ?? null),
    displayScoreUnit: rankingModuleFilter === 'typing' ? 'wpm' : 'percent',
    // ⬇️ NEW: Sub-metrics to show as small badges
    displayAccuracy: rankingModuleFilter === 'typing'
      ? (u.moduleAccuracyAvg.typing ?? null)
      : null,
    displayAvgWpm: rankingModuleFilter === 'typing'
      ? (u.moduleWpmAvg.typing ?? null)
      : null,
  }))
}, [allScores, users, rankingModuleFilter])

  const filteredRankings = useMemo(() => {
    if (!rankingSearch.trim()) return rankings
    const q = rankingSearch.toLowerCase()
    return rankings.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q)
    )
  }, [rankings, rankingSearch])

  const topThree = useMemo(() => {
    return rankingSearch.trim() === ''
      ? rankings.filter(r => r.displayScore !== null).slice(0, 3)
      : []
  }, [rankings, rankingSearch])

  // Profile Stats
  const profileStats = useMemo(() => {
  const scores = profileData.scores
  const total = scores.length
  const average = total > 0 ? Math.round(scores.reduce((a, c) => a + (c.score || 0), 0) / total) : 0
  const best = total > 0 ? Math.max(...scores.map(s => s.score || 0)) : 0
  const worst = total > 0 ? Math.min(...scores.map(s => s.score || 0)) : 0
  const certificates = profileData.certificates.length
  const tickets = profileData.tickets.length
  
  const moduleStats: Record<string, { count: number; avg: number; best: number }> = {}
  scores.forEach(s => {
    const m = s.module_name || 'unknown'
    if (!moduleStats[m]) moduleStats[m] = { count: 0, avg: 0, best: 0 }
    moduleStats[m].count++
    moduleStats[m].avg += s.score || 0
    moduleStats[m].best = Math.max(moduleStats[m].best, s.score || 0)
  })
  Object.keys(moduleStats).forEach(m => {
    moduleStats[m].avg = Math.round(moduleStats[m].avg / moduleStats[m].count)
  })

  // ⬇️ NEW: Compute typing-specific WPM/accuracy stats
  const typingScores = scores.filter(
    s => s.module_name === 'typing' && typeof s.wpm === 'number' && s.wpm > 0
  )
  const typingStats = typingScores.length > 0 ? {
    count: typingScores.length,
    avgWpm: Math.round(typingScores.reduce((a, s) => a + (s.wpm || 0), 0) / typingScores.length),
    bestWpm: Math.max(...typingScores.map(s => s.wpm || 0)),
    worstWpm: Math.min(...typingScores.map(s => s.wpm || 0)),
    avgAccuracy: Math.round(
      typingScores.reduce((a, s) => a + (s.accuracy || 0), 0) / typingScores.length
    ),
    bestAccuracy: Math.max(...typingScores.map(s => s.accuracy || 0)),
    // ⬇️ Bonus: WPM trend (first vs latest)
    wpmTrend: typingScores.length >= 2
      ? (() => {
          const sorted = [...typingScores].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
          return (sorted[sorted.length - 1].wpm || 0) - (sorted[0].wpm || 0)
        })()
      : null,
  } : null
  
  return { total, average, best, worst, certificates, tickets, moduleStats, typingStats }
}, [profileData])

  // LEARNING PROGRESS STATS
  const learningProfileStats = useMemo(() => {
    const completedIds = profileData.completedLessonIds || []
    const totalLessons = tutorials.length

    const byLevel: Record<string, { total: number; completed: number }> = {
      beginner: { total: 0, completed: 0 },
      intermediate: { total: 0, completed: 0 },
      upper_intermediate: { total: 0, completed: 0 },
      advanced: { total: 0, completed: 0 },
    }

    tutorials.forEach((lesson: any) => {
      const lvl = (lesson.level || 'beginner') as TutorialLevel
      if (byLevel[lvl]) {
        byLevel[lvl].total++
        if (completedIds.includes(lesson.id)) byLevel[lvl].completed++
      }
    })

    const totalCompleted = completedIds.filter((id: string) =>
      tutorials.some((l: any) => l.id === id)
    ).length

    const progressPct = totalLessons > 0
      ? Math.round((totalCompleted / totalLessons) * 100)
      : 0

    const recentlyCompleted = (profileData.lessonProgress || [])
      .map((row: any) => {
        const lesson = tutorials.find((l: any) => l.id === row.lesson_id)
        return lesson ? { ...lesson, completed_at: row.completed_at } : null
      })
      .filter(Boolean)
      .slice(0, 8)

    return {
      totalLessons,
      totalCompleted,
      progressPct,
      byLevel,
      recentlyCompleted,
    }
  }, [profileData, tutorials])

  // ============================================
  // PLATFORM STATISTICS COMPUTATION
  // ============================================
  const platformStats = useMemo(() => {
    const totalAttempts = allScores.length
    const totalUsersWithAttempts = new Set(allScores.map(s => s.user_id)).size

    const moduleUsage: Record<string, { 
      count: number; 
      totalScore: number; 
      bestScore: number; 
      worstScore: number;
      uniqueUsers: Set<string>;
    }> = {}

    allScores.forEach(s => {
      const mod = s.module_name?.toLowerCase() || 'unknown'
      if (!moduleUsage[mod]) {
        moduleUsage[mod] = {
          count: 0,
          totalScore: 0,
          bestScore: 0,
          worstScore: 100,
          uniqueUsers: new Set(),
        }
      }
      moduleUsage[mod].count++
      moduleUsage[mod].totalScore += s.score || 0
      moduleUsage[mod].bestScore = Math.max(moduleUsage[mod].bestScore, s.score || 0)
      moduleUsage[mod].worstScore = Math.min(moduleUsage[mod].worstScore, s.score || 0)
      if (s.user_id) moduleUsage[mod].uniqueUsers.add(s.user_id)
    })

    const moduleList = Object.entries(moduleUsage).map(([name, data]) => ({
      name,
      count: data.count,
      average: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
      best: data.bestScore,
      worst: data.count > 0 ? data.worstScore : 0,
      uniqueUsers: data.uniqueUsers.size,
      percentage: totalAttempts > 0 ? Math.round((data.count / totalAttempts) * 100) : 0,
    })).sort((a, b) => b.count - a.count)

    const mostUsed = moduleList[0] ?? null
    const leastUsed = moduleList[moduleList.length - 1] ?? null
    const highestAvg = [...moduleList].sort((a, b) => b.average - a.average)[0] ?? null
    const lowestAvg = [...moduleList].sort((a, b) => a.average - b.average)[0] ?? null

    const scoreBuckets = [
      { range: '0-49', min: 0, max: 49, count: 0, color: 'from-rose-500 to-red-500' },
      { range: '50-59', min: 50, max: 59, count: 0, color: 'from-rose-400 to-orange-400' },
      { range: '60-69', min: 60, max: 69, count: 0, color: 'from-amber-500 to-orange-500' },
      { range: '70-79', min: 70, max: 79, count: 0, color: 'from-yellow-500 to-amber-500' },
      { range: '80-89', min: 80, max: 89, count: 0, color: 'from-emerald-500 to-teal-500' },
      { range: '90-100', min: 90, max: 100, count: 0, color: 'from-emerald-400 to-cyan-400' },
    ]
    allScores.forEach(s => {
      const score = s.score || 0
      const bucket = scoreBuckets.find(b => score >= b.min && score <= b.max)
      if (bucket) bucket.count++
    })

    const now = Date.now()
    const daysMap = new Map<string, number>()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().slice(0, 10)
      daysMap.set(key, 0)
    }
    allScores.forEach(s => {
      if (!s.created_at) return
      const key = new Date(s.created_at).toISOString().slice(0, 10)
      if (daysMap.has(key)) {
        daysMap.set(key, (daysMap.get(key) || 0) + 1)
      }
    })
    const activityTimeline = Array.from(daysMap.entries()).map(([date, count]) => ({
      date,
      count,
    }))
    const peakDay = activityTimeline.reduce(
      (max, d) => (d.count > max.count ? d : max),
      { date: '', count: 0 }
    )

    const topPerformersByModule: Record<string, Array<{
      userId: string
      userName: string
      userEmail: string
      avg: number
      attempts: number
    }>> = {}

    Object.keys(moduleUsage).forEach(mod => {
      const userMap = new Map<string, { total: number; count: number }>()
      allScores
        .filter(s => s.module_name?.toLowerCase() === mod)
        .forEach(s => {
          if (!s.user_id) return
          if (!userMap.has(s.user_id)) userMap.set(s.user_id, { total: 0, count: 0 })
          const e = userMap.get(s.user_id)!
          e.total += s.score || 0
          e.count++
        })

      const arr = Array.from(userMap.entries()).map(([uid, data]) => {
        const u = users.find(x => x.id === uid)
        return {
          userId: uid,
          userName: u?.name || 'Unknown User',
          userEmail: u?.email || 'N/A',
          avg: Math.round(data.total / data.count),
          attempts: data.count,
        }
      }).sort((a, b) => b.avg - a.avg).slice(0, 3)

      topPerformersByModule[mod] = arr
    })

    return {
      totalAttempts,
      totalUsersWithAttempts,
      moduleList,
      mostUsed,
      leastUsed,
      highestAvg,
      lowestAvg,
      scoreBuckets,
      activityTimeline,
      peakDay,
      topPerformersByModule,
    }
  }, [allScores, users])

  // ============================================
  // SIDEBAR NAV ITEMS
  // ============================================
  const totalBpoRecords = useMemo(
    () => Object.values(bpoCounts).reduce((a, b) => a + b, 0),
    [bpoCounts]
  )

  const navItems: Array<{
    key: AdminTab
    label: string
    icon: string
    gradient: string
    badge?: number
    section: 'main' | 'content' | 'analytics'
  }> = [
    { key: 'overview', label: 'Overview', icon: 'grid', gradient: 'from-violet-500 to-purple-500', section: 'main' },
    { key: 'users', label: 'Users', icon: 'users', gradient: 'from-cyan-500 to-blue-500', badge: users.length, section: 'main' },
    { key: 'questions', label: 'Question Bank', icon: 'book', gradient: 'from-amber-500 to-orange-500', badge: questions.length, section: 'content' },
    { key: 'tutorials', label: 'Tutorials & Lessons', icon: 'graduation-cap', gradient: 'from-emerald-500 to-teal-500', badge: tutorials.length, section: 'content' },
    { key: 'topics', label: 'Learning Topics', icon: 'layers', gradient: 'from-cyan-500 to-blue-500', badge: topicCounts.topics, section: 'content' },
    { key: 'bpo', label: 'BPO Industry', icon: 'database', gradient: 'from-blue-500 to-indigo-500', badge: totalBpoRecords, section: 'content' },
    { key: 'suggestions', label: 'Suggestion Pool', icon: 'sparkles', gradient: 'from-amber-500 to-orange-500', badge: suggestionCount, section: 'content' },
    { key: 'rankings', label: 'Rankings', icon: 'trophy', gradient: 'from-yellow-500 to-amber-500', badge: rankings.length, section: 'analytics' },
    { key: 'statistics', label: 'Analytics', icon: 'bar-chart', gradient: 'from-fuchsia-500 to-pink-500', section: 'analytics' },
  ]

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(rgba(139,92,246,0.4)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-2xl border border-violet-400/30">
              <Icon name="cpu" className="w-10 h-10 text-white animate-pulse" glow />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-violet-500/30 blur-2xl animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-bold text-lg tracking-tight">Initializing Admin Console</p>
            <p className="text-xs font-mono text-violet-400 uppercase tracking-widest">Loading secure data stream...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white relative">
      <div className="fixed inset-0 opacity-[0.12] bg-[radial-gradient(rgba(139,92,246,0.4)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-violet-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col border-r border-violet-500/20 bg-[#0d0d12]/95 backdrop-blur-xl transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        } ${
          isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="shrink-0 h-16 border-b border-violet-500/20 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center border border-violet-400/30 shadow-lg shadow-violet-500/30">
                <Icon name="shield" className="w-5 h-5 text-white" glow />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d0d12] animate-pulse" />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <h1 className="text-sm font-black tracking-tight leading-none truncate">Admin Console</h1>
                <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest mt-1 truncate">
                  v3.2.0
                </p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
            aria-label="Close sidebar"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Main Section */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                Main
              </p>
            )}
            {navItems.filter(i => i.section === 'main').map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                active={activeTab === item.key}
                collapsed={isSidebarCollapsed}
                onClick={() => {
                  setActiveTab(item.key)
                  closeUserProfile()
                }}
              />
            ))}
          </div>

          {/* Content Section */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                Content
              </p>
            )}
            {navItems.filter(i => i.section === 'content').map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                active={activeTab === item.key}
                collapsed={isSidebarCollapsed}
                onClick={() => {
                  setActiveTab(item.key)
                  closeUserProfile()
                }}
              />
            ))}
          </div>

          {/* Analytics Section */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                Analytics
              </p>
            )}
            {navItems.filter(i => i.section === 'analytics').map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                active={activeTab === item.key}
                collapsed={isSidebarCollapsed}
                onClick={() => {
                  setActiveTab(item.key)
                  closeUserProfile()
                }}
              />
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="shrink-0 border-t border-violet-500/20 p-3 space-y-2">
          {!isSidebarCollapsed && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  System
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">Online</span>
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center' : 'justify-start'
            } gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white border border-violet-500/20 hover:border-violet-400/40 hover:bg-slate-900/50 transition-all disabled:opacity-50`}
            title="Refresh Data"
          >
            <Icon name="refresh" className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {!isSidebarCollapsed && <span>{refreshing ? 'Syncing...' : 'Refresh Data'}</span>}
          </button>

          <a
            href="/"
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center' : 'justify-start'
            } gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white border border-violet-500/20 hover:border-violet-400/40 hover:bg-slate-900/50 transition-all`}
            title="Public Hub"
          >
            <Icon name="home" className="w-4 h-4" />
            {!isSidebarCollapsed && <span>Public Hub</span>}
          </a>

          <div className={`flex items-center gap-2 ${
            isSidebarCollapsed ? 'flex-col' : ''
          }`}>
            <div className={`flex items-center gap-2.5 flex-1 min-w-0 ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}>
              <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-black text-sm">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider leading-none">Admin</span>
                  <span className="text-[11px] text-slate-400 truncate">{adminEmail}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-400/40 transition-all`}
              title="Sign Out"
            >
              <Icon name="log-out" className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 hover:text-white border border-violet-500/20 hover:border-violet-400/40 hover:bg-slate-900/50 transition-all"
          >
            <Icon name={isSidebarCollapsed ? 'chevron-right' : 'chevron-down'} className="w-3.5 h-3.5" />
            {!isSidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 h-16 border-b border-violet-500/20 bg-[#0B0B0D]/80 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl border border-violet-500/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-900/50 transition"
                aria-label="Open sidebar"
              >
                <Icon name="menu" className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black tracking-tight truncate">
                  {navItems.find(i => i.key === activeTab)?.label || 'Overview'}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono truncate">
                  {activeTab === 'overview' && 'Dashboard summary & quick actions'}
                  {activeTab === 'users' && 'Manage user accounts & permissions'}
                  {activeTab === 'questions' && 'Create, edit, and delete questions'}
                  {activeTab === 'tutorials' && 'Publish and organize training lessons'}
                  {activeTab === 'topics' && 'Manage career-readiness learning topics & sections'}
                  {activeTab === 'bpo' && 'Manage BPO industry knowledge base'}
                  {activeTab === 'suggestions' && 'Capture, vote on, and track ideas for the next update'}
                  {activeTab === 'rankings' && 'Leaderboard and top performers'}
                  {activeTab === 'statistics' && 'Platform analytics & insights'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/50 border border-violet-500/20">
                <Icon name="activity" className="w-4 h-4 text-emerald-400" glow />
                <span className="text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">SYS OK</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="text-slate-300">{currentTime.toLocaleTimeString()}</span>
                </span>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center"
                aria-label="Sign out"
              >
                <Icon name="log-out" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="px-4 sm:px-8 py-6 sm:py-8">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between gap-3">
              <span className="flex-1">{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline shrink-0">Dismiss</button>
            </div>
          )}

          {/* USER PROFILE VIEW */}
          {viewingUserId && profileData.user ? (
            <UserProfileView
              profileData={profileData}
              profileStats={profileStats}
              profileLoading={profileLoading}
              closeUserProfile={closeUserProfile}
              handleToggleAdmin={handleToggleAdmin}
              handleDeleteUser={handleDeleteUser}
              handleUpdatePassword={handleUpdatePassword}
              adminEmail={adminEmail}
              learningProfileStats={learningProfileStats}
              tutorials={tutorials}
            />
          ) : (
            <>
              {/* ============ OVERVIEW TAB ============ */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-6 sm:p-8">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

                    <div className="relative space-y-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest text-violet-300">
                        <Icon name="shield" className="w-3 h-3" glow />
                        Command Center
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Welcome back, <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Administrator</span>
                      </h2>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                        Oversee users, manage your question bank, publish training lessons, curate BPO industry knowledge, and analyze platform performance — all from one place.
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-4">
                    {[
                      { label: 'Users', value: stats.totalUsers, icon: 'users', gradient: 'from-violet-500 to-purple-500' },
                      { label: 'Admins', value: stats.admins, icon: 'crown', gradient: 'from-amber-500 to-orange-500' },
                      { label: 'Questions', value: stats.totalQuestions, icon: 'book', gradient: 'from-cyan-500 to-blue-500' },
                      { label: 'Lessons', value: tutorialStats.total, icon: 'graduation-cap', gradient: 'from-emerald-500 to-teal-500' },
                      { label: 'Topics', value: topicCounts.topics, icon: 'layers', gradient: 'from-cyan-500 to-blue-500' },
                      { label: 'BPO Items', value: totalBpoRecords, icon: 'database', gradient: 'from-blue-500 to-indigo-500' },
                      { label: 'Attempts', value: platformStats.totalAttempts, icon: 'activity', gradient: 'from-fuchsia-500 to-pink-500' },
                      { label: 'Ranked', value: rankings.length, icon: 'trophy', gradient: 'from-yellow-500 to-amber-500' },
                      { label: 'Ideas', value: suggestionCount, icon: 'sparkles', gradient: 'from-amber-500 to-orange-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-4">
                        <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
                        <div className="relative space-y-2">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                            <Icon name={stat.icon} className="w-4 h-4 text-white" glow />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-black text-white">
                              <AnimatedCounter value={stat.value} />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Two-column quick panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                      <div className="p-5 border-b border-violet-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <Icon name="users" className="w-4 h-4 text-cyan-400" glow />
                          </div>
                          <div>
                            <h3 className="text-sm font-black tracking-tight">Recent Users</h3>
                            <p className="text-[11px] text-slate-400">Latest sign-ups</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('users')}
                          className="text-[11px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
                        >
                          View all
                          <Icon name="chevron-right" className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="divide-y divide-violet-500/10 max-h-[320px] overflow-y-auto">
                        {users.slice(0, 5).map((u) => (
                          <button
                            key={u.id}
                            onClick={() => openUserProfile(u)}
                            className="w-full p-4 flex items-center gap-3 hover:bg-violet-500/[0.04] transition text-left"
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              u.is_admin ? 'bg-amber-500 text-white' : 'bg-violet-600 text-white'
                            }`}>
                              {(u.name || u.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white text-sm truncate">{u.name || 'Unnamed User'}</p>
                              <p className="text-[11px] text-slate-500 font-mono truncate">{u.email}</p>
                            </div>
                            {u.is_admin && (
                              <Icon name="crown" className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                          </button>
                        ))}
                        {users.length === 0 && (
                          <div className="p-8 text-center text-slate-500 text-xs">No users yet</div>
                        )}
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                      <div className="p-5 border-b border-violet-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Icon name="trophy" className="w-4 h-4 text-amber-400" glow />
                          </div>
                          <div>
                            <h3 className="text-sm font-black tracking-tight">Top Performers</h3>
                            <p className="text-[11px] text-slate-400">Overall leaderboard</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('rankings')}
                          className="text-[11px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
                        >
                          View all
                          <Icon name="chevron-right" className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="divide-y divide-violet-500/10 max-h-[320px] overflow-y-auto">
                        {rankings.slice(0, 5).map((r) => (
                          <button
                            key={r.userId}
                            onClick={() => {
                              const u = users.find(x => x.id === r.userId)
                              if (u) openUserProfile(u)
                            }}
                            className="w-full p-4 flex items-center gap-3 hover:bg-violet-500/[0.04] transition text-left"
                          >
                            <RankBadge rank={r.rank} />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white text-sm truncate">{r.userName}</p>
                              <p className="text-[11px] text-slate-500 font-mono truncate">{r.totalAttempts} attempts</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-black text-amber-400">{r.overallAverage}%</p>
                            </div>
                          </button>
                        ))}
                        {rankings.length === 0 && (
                          <div className="p-8 text-center text-slate-500 text-xs">No rankings yet</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 sm:p-6">
                    <h3 className="text-sm font-black tracking-tight mb-4 flex items-center gap-2">
                      <Icon name="zap" className="w-4 h-4 text-violet-400" glow />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                      <button
                        onClick={openCreateQuestionModal}
                        className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 hover:border-amber-400/60 transition-all text-left group"
                      >
                        <Icon name="plus" className="w-5 h-5 text-amber-400 mb-2" glow />
                        <p className="text-xs font-bold text-white">New Question</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Add to bank</p>
                      </button>
                      <button
                        onClick={openCreateTutorialModal}
                        className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 hover:border-emerald-400/60 transition-all text-left group"
                      >
                        <Icon name="graduation-cap" className="w-5 h-5 text-emerald-400 mb-2" glow />
                        <p className="text-xs font-bold text-white">New Lesson</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Publish training</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('topics')}
                        className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 hover:border-cyan-400/60 transition-all text-left group"
                      >
                        <Icon name="layers" className="w-5 h-5 text-cyan-400 mb-2" glow />
                        <p className="text-xs font-bold text-white">Learning Topics</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Manage career content</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('bpo')}
                        className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/30 hover:border-blue-400/60 transition-all text-left group"
                      >
                        <Icon name="database" className="w-5 h-5 text-blue-400 mb-2" glow />
                        <p className="text-xs font-bold text-white">BPO Content</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Manage knowledge</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('suggestions')}
                        className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 hover:border-amber-400/60 transition-all text-left group"
                      >
                        <Icon name="sparkles" className="w-5 h-5 text-amber-400 mb-2" glow />
                        <p className="text-xs font-bold text-white">Suggestion Pool</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Ideas & roadmap</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('rankings')}
                        className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/30 hover:border-yellow-400/60 transition-all text-left group"
                      >
                        <Icon name="trophy" className="w-5 h-5 text-yellow-400 mb-2" glow />
                        <p className="text-xs font-bold text-white">Leaderboard</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">View rankings</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('statistics')}
                        className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-pink-500/5 border border-fuchsia-500/30 hover:border-fuchsia-400/60 transition-all text-left group"
                      >
                        <Icon name="bar-chart" className="w-5 h-5 text-fuchsia-400 mb-2" glow />
                        <p className="text-xs font-bold text-white">Analytics</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Platform stats</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ USERS TAB ============ */}
              {activeTab === 'users' && (
                <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                  <div className="p-5 sm:p-6 border-b border-violet-500/20 space-y-4">
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Registry Accounts</h3>
                      <p className="text-xs text-slate-400">Click a user to view their complete profile and performance history.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by name or email..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400"
                        />
                      </div>
                      <div className="flex items-center gap-1 p-1 rounded-xl border border-violet-500/20 bg-slate-900/50">
                        {[{ key: 'all', label: 'All' }, { key: 'admin', label: 'Admins' }, { key: 'user', label: 'Users' }].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setFilterRole(opt.key as any)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                              filterRole === opt.key ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-violet-500/20 bg-slate-900/30 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                          <th className="p-4">User</th>
                          <th className="p-4 hidden md:table-cell">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4 hidden lg:table-cell">Joined</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-violet-500/10">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-12 text-center text-slate-500">No users match your filters.</td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => (
                            <tr
                              key={u.id}
                              onClick={() => openUserProfile(u)}
                              className="hover:bg-violet-500/[0.06] transition-colors group cursor-pointer"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                                    u.is_admin ? 'bg-amber-500 text-white' : 'bg-violet-600 text-white'
                                  }`}>
                                    {(u.name || u.email || '?').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors">
                                      {u.name || 'Unnamed User'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-mono md:hidden">{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell text-slate-400 text-xs font-mono">{u.email}</td>
                              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleToggleAdmin(u.id, u.is_admin, u.email)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                    u.is_admin
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                                      : 'bg-violet-500/10 text-violet-300 border-violet-500/20 hover:bg-violet-500/20'
                                  }`}
                                >
                                  <Icon name={u.is_admin ? 'crown' : 'users'} className="w-3.5 h-3.5" />
                                  <span>{u.is_admin ? 'Admin' : 'User'}</span>
                                </button>
                              </td>
                              <td className="p-4 hidden lg:table-cell text-xs text-slate-400">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openUserProfile(u)}
                                    className="px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                                  >
                                    <Icon name="user-check" className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Profile</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.email)}
                                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
                                  >
                                    <Icon name="trash" className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ============ QUESTIONS TAB ============ */}
              {activeTab === 'questions' && (
                <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                  <div className="p-5 sm:p-6 border-b border-violet-500/20 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black tracking-tight">Question Bank</h3>
                        <p className="text-xs text-slate-400">Create, Read, Update, and Delete reading and listening test questions.</p>
                      </div>
                      <button
                        onClick={openCreateQuestionModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-500/30 transition-all shrink-0"
                      >
                        <Icon name="plus" className="w-4 h-4" />
                        <span>Add New Question</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          value={questionSearch}
                          onChange={(e) => setQuestionSearch(e.target.value)}
                          placeholder="Search by question text or test title..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400"
                        />
                      </div>
                      <div className="flex items-center gap-1 p-1 rounded-xl border border-violet-500/20 bg-slate-900/50">
                        {[{ key: 'all', label: 'All' }, { key: 'reading', label: 'Reading' }, { key: 'listening', label: 'Listening' }].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setQuestionModuleFilter(opt.key as any)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                              questionModuleFilter === opt.key ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-violet-500/20 bg-slate-900/30 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                          <th className="p-4">Module & Test</th>
                          <th className="p-4">Question & Options</th>
                          <th className="p-4">Correct</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-violet-500/10">
                        {filteredQuestions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-12 text-center text-slate-500">
                              No questions found. Click "Add New Question" to create one.
                            </td>
                          </tr>
                        ) : (
                          filteredQuestions.map((q) => (
                            <tr key={q.id} className="hover:bg-violet-500/[0.04] transition-colors">
                              <td className="p-4 align-top">
                                <div className="space-y-1">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    q.module_id === 'reading' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  }`}>
                                    {q.module_id}
                                  </span>
                                  <p className="font-bold text-white text-xs">{q.test_title}</p>
                                </div>
                              </td>
                              <td className="p-4 space-y-2">
                                <p className="font-semibold text-slate-100 text-sm">{q.question_text}</p>
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(q.options) && q.options.map((opt: string, i: number) => (
                                    <span key={i} className={`px-2 py-0.5 rounded text-[11px] ${opt === q.correct_answer ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 align-top text-emerald-400 font-mono text-xs font-bold">
                                {q.correct_answer}
                              </td>
                              <td className="p-4 align-top text-right space-x-2">
                                <button onClick={() => openEditQuestionModal(q)} className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold">
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteQuestion(q.id)} className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ============ TUTORIALS TAB ============ */}
              {activeTab === 'tutorials' && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-[#151520]/80 to-teal-500/5 backdrop-blur-xl p-5 sm:p-8">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-3 max-w-2xl">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                          <Icon name="graduation-cap" className="w-3 h-3" glow />
                          Training Content
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                          Tutorials <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">& Lessons</span>
                        </h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Publish structured learning materials organized by difficulty level and order.
                        </p>
                      </div>

                      <button
                        onClick={openCreateTutorialModal}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all shrink-0"
                      >
                        <Icon name="plus" className="w-4 h-4" />
                        <span>Create New Lesson</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {(['beginner', 'intermediate', 'upper_intermediate', 'advanced'] as TutorialLevel[]).map((level) => {
                      const meta = getLevelMeta(level)
                      const count = tutorialStats.byLevel[level] || 0
                      const isActive = tutorialLevelFilter === level
                      return (
                        <button
                          key={level}
                          onClick={() => setTutorialLevelFilter(isActive ? 'all' : level)}
                          className={`relative overflow-hidden rounded-2xl border-2 backdrop-blur-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] text-left ${
                            isActive
                              ? `${meta.borderColor} ${meta.bgColor}/10`
                              : 'border-violet-500/20 bg-[#151520]/70 hover:border-violet-400/40'
                          }`}
                        >
                          <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${meta.gradient} opacity-10 rounded-full blur-2xl`} />
                          <div className="relative space-y-2">
                            <div className="flex items-center justify-between">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
                                <span className="text-base">{meta.emoji}</span>
                              </div>
                              {isActive && (
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.textColor}`}>
                                  Active
                                </span>
                              )}
                            </div>
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${meta.textColor} mb-1`}>
                                {meta.label}
                              </p>
                              <p className="text-2xl font-black text-white">{count}</p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                lesson{count === 1 ? '' : 's'}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                    <div className="p-5 border-b border-violet-500/20 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Icon name="layers" className="w-4 h-4 text-emerald-400" glow />
                          </div>
                          <div>
                            <h3 className="text-lg font-black tracking-tight">Lesson Library</h3>
                            <p className="text-xs text-slate-400">
                              {filteredTutorials.length} lesson{filteredTutorials.length === 1 ? '' : 's'} displayed
                            </p>
                          </div>
                        </div>
                        <div className="relative flex-1 sm:max-w-xs">
                          <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          <input
                            type="text"
                            value={tutorialSearch}
                            onChange={(e) => setTutorialSearch(e.target.value)}
                            placeholder="Search lessons..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400"
                          />
                        </div>
                      </div>
                    </div>

                    {filteredTutorials.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="inline-flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Icon name="graduation-cap" className="w-8 h-8 text-emerald-400" glow />
                          </div>
                          <p className="text-slate-300 font-bold">No lessons found</p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-violet-500/10">
                        {filteredTutorials.map((t) => {
                          const meta = getLevelMeta(t.level)
                          const isExpanded = expandedTutorialId === t.id
                          return (
                            <div key={t.id} className="hover:bg-violet-500/[0.02] transition-colors">
                              <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg text-white font-black text-lg`}>
                                  {t.order_index ?? '#'}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${meta.borderColor} ${meta.bgColor}/10 ${meta.textColor}`}>
                                      <span>{meta.emoji}</span>
                                      {meta.label}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500">
                                      Order #{t.order_index ?? 'N/A'}
                                    </span>
                                  </div>
                                  <h4 className="text-base font-bold text-white truncate">{t.title || 'Untitled Lesson'}</h4>
                                  <p className="text-xs text-slate-500 line-clamp-2">
                                    {t.content ? t.content.substring(0, 140) + (t.content.length > 140 ? '...' : '') : 'No content preview.'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => setExpandedTutorialId(isExpanded ? null : t.id)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700/60 text-xs font-bold transition-all"
                                  >
                                    <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => openEditTutorialModal(t)}
                                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold"
                                  >
                                    <Icon name="edit" className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTutorial(t.id)}
                                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold"
                                  >
                                    <Icon name="trash" className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              {isExpanded && (
                                <div className="px-5 pb-5">
                                  <div className={`p-5 rounded-2xl border ${meta.borderColor} bg-slate-900/40 space-y-2`}>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${meta.textColor}`}>
                                      Full Content
                                    </p>
                                    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                      {t.content || 'No content provided.'}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============ LEARNING TOPICS TAB ============ */}
              {activeTab === 'topics' && <TopicEditorView Icon={Icon} />}

              {/* ============ BPO TAB ============ */}
              {activeTab === 'bpo' && <BPOEditorView Icon={Icon} />}

              {/* ============ SUGGESTION POOL TAB ============ */}
              {activeTab === 'suggestions' && (
                <SuggestionPoolView Icon={Icon} adminEmail={adminEmail} userId={null} />
              )}

              {/* ============ RANKINGS TAB ============ */}
              {activeTab === 'rankings' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'overall', label: 'Overall', icon: 'trophy' },
                      { key: 'listening', label: 'Listening', icon: 'headphones' },
                      { key: 'reading', label: 'Reading', icon: 'book' },
                      { key: 'writing', label: 'Writing', icon: 'pencil' },
                      { key: 'speaking', label: 'Speaking', icon: 'mic' },
                      { key: 'typing', label: 'Typing (WPM)', icon: 'keyboard' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setRankingModuleFilter(opt.key as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                          rankingModuleFilter === opt.key
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-400/40 shadow-lg shadow-violet-500/30'
                            : 'bg-slate-900/50 text-slate-400 border-violet-500/20 hover:text-white hover:border-violet-400/40'
                        }`}
                      >
                        <Icon name={opt.icon as any} className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {topThree.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {[1, 0, 2].map((podiumIdx) => {
                        const r = topThree[podiumIdx]
                        if (!r) return null
                        const isFirst = r.rank === 1
                        const isSecond = r.rank === 2
                        const medalGradient = isFirst
                          ? 'from-amber-400 via-yellow-500 to-orange-500'
                          : isSecond
                            ? 'from-slate-300 via-slate-400 to-slate-500'
                            : 'from-amber-700 via-orange-700 to-amber-900'
                        const medalEmoji = isFirst ? '🥇' : isSecond ? '🥈' : '🥉'
                        const scaleClass = isFirst ? 'md:scale-105 md:z-10' : ''
                        const isTypingRanking = rankingModuleFilter === 'typing'

                        return (
                          <div
                            key={r.userId}
                            onClick={() => {
                              const u = users.find(x => x.id === r.userId)
                              if (u) openUserProfile(u)
                            }}
                            className={`group relative overflow-hidden rounded-3xl border-2 ${
                              isFirst ? 'border-amber-400/50' : isSecond ? 'border-slate-300/50' : 'border-amber-700/50'
                            } bg-[#151520]/80 backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${scaleClass}`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${medalGradient} opacity-[0.08]`} />
                            <div className={`absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br ${medalGradient} opacity-20 rounded-full blur-3xl`} />

                            <div className="relative flex flex-col items-center text-center space-y-4">
                              <div className="text-4xl">{medalEmoji}</div>
                              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${medalGradient} flex items-center justify-center font-black text-3xl text-white shadow-2xl border-2 border-white/20`}>
                                {(r.userName || '?').charAt(0).toUpperCase()}
                              </div>
                              <div className="space-y-1 w-full">
                                <h3 className="text-lg font-black text-white truncate">{r.userName}</h3>
                                <p className="text-xs text-slate-500 font-mono truncate">{r.userEmail}</p>
                              </div>
                              <div className={`w-full py-3 rounded-2xl border ${
                                isFirst ? 'bg-amber-500/10 border-amber-500/30' : isSecond ? 'bg-slate-400/10 border-slate-400/30' : 'bg-orange-700/10 border-orange-700/30'
                              }`}>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                  {isTypingRanking ? 'Best WPM' : 'Score'}
                                </p>
                                <p className={`text-4xl font-black ${isFirst ? 'text-amber-300' : isSecond ? 'text-slate-200' : 'text-orange-300'}`}>
                                  {r.displayScore ?? 0}{isTypingRanking ? '' : '%'}
                                </p>
                                {isTypingRanking && (
                                  <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                    words per minute
                                  </p>
                                )}
                              </div>

                              {/* ⬇️ NEW: Show accuracy sub-badge for typing rankings */}
                              {isTypingRanking && r.displayAccuracy !== null && (
                                <div className="w-full flex items-center justify-center gap-3 text-[10px] font-mono">
                                  <span className="text-slate-500">
                                    Avg: <span className="text-slate-300 font-bold">{r.displayAvgWpm ?? '—'} WPM</span>
                                  </span>
                                  <span className="text-slate-600">·</span>
                                  <span className="text-slate-500">
                                    Acc: <span className="text-emerald-300 font-bold">{r.displayAccuracy}%</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                    <div className="p-5 border-b border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black tracking-tight">
                          {rankingModuleFilter === 'overall' ? 'Overall Ranking' : `${rankingModuleFilter} Ranking`}
                        </h3>
                        <p className="text-xs text-slate-400">{filteredRankings.length} participants</p>
                      </div>
                      <div className="relative flex-1 sm:max-w-xs">
                        <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          value={rankingSearch}
                          onChange={(e) => setRankingSearch(e.target.value)}
                          placeholder="Search candidate..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>

                    {filteredRankings.length === 0 ? (
                      <div className="p-12 text-center text-slate-500 text-sm">No rankings yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                         <thead>
                          <tr className="border-b border-violet-500/20 bg-slate-900/30 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <th className="p-4 w-20">Rank</th>
                            <th className="p-4">Candidate</th>
                            <th className="p-4">{rankingModuleFilter === 'typing' ? 'Best WPM' : 'Score'}</th>
                            {rankingModuleFilter === 'typing' && (
                              <th className="p-4 hidden sm:table-cell">Accuracy</th>
                            )}
                            <th className="p-4 hidden md:table-cell">Attempts</th>
                            <th className="p-4 hidden lg:table-cell">{rankingModuleFilter === 'typing' ? 'Details' : 'Modules'}</th>
                          </tr>
                        </thead>
                          <tbody className="divide-y divide-violet-500/10">
                          {filteredRankings.map((r) => {
                            const u = users.find(x => x.id === r.userId)
                            const score = r.displayScore
                            const isTypingRanking = rankingModuleFilter === 'typing'

                            return (
                              <tr
                                key={r.userId}
                                onClick={() => u && openUserProfile(u)}
                                className="hover:bg-violet-500/[0.06] transition-colors cursor-pointer"
                              >
                                <td className="p-4"><RankBadge rank={r.rank} /></td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                      r.isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' : 'bg-gradient-to-br from-violet-500 to-purple-500 text-white'
                                    }`}>
                                      {(r.userName || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-white text-sm truncate">{r.userName}</p>
                                      <p className="text-[11px] text-slate-500 font-mono truncate">{r.userEmail}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  {score === null ? (
                                    <span className="text-slate-500 italic text-xs">No data</span>
                                  ) : isTypingRanking ? (
                                    // ⬇️ NEW: Show WPM with color-coded thresholds
                                    <div className="flex flex-col">
                                      <span className={`font-black text-lg ${
                                        score >= 60 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-rose-400'
                                      }`}>
                                        {score}
                                      </span>
                                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">WPM</span>
                                    </div>
                                  ) : (
                                    <span className={`font-black text-lg ${
                                      score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-rose-400'
                                    }`}>{score}%</span>
                                  )}
                                </td>
                                {/* ⬇️ NEW: Accuracy column (only shown when typing ranking) */}
                                {isTypingRanking && (
                                  <td className="p-4 hidden sm:table-cell">
                                    {r.displayAccuracy !== null ? (
                                      <span className={`font-bold text-sm ${
                                        r.displayAccuracy >= 95 ? 'text-emerald-400' :
                                        r.displayAccuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
                                      }`}>
                                        {r.displayAccuracy}%
                                      </span>
                                    ) : (
                                      <span className="text-slate-600 text-xs">—</span>
                                    )}
                                  </td>
                                )}
                                <td className="p-4 hidden md:table-cell">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                    {r.totalAttempts}
                                  </span>
                                </td>
                                <td className="p-4 hidden lg:table-cell">
                                  <div className="flex flex-wrap gap-1">
                                    {isTypingRanking ? (
                                      // ⬇️ NEW: For typing ranking, show WPM per typing attempts
                                      <>
                                        {r.displayAvgWpm !== null && (
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
                                            Avg: {r.displayAvgWpm} WPM
                                          </span>
                                        )}
                                        {r.moduleAverages.typing !== undefined && (
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                                            Score: {r.moduleAverages.typing}%
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      // Otherwise, existing module badges
                                      Object.entries(r.moduleAverages).slice(0, 3).map(([mod, avg]) => (
                                        <span key={mod} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                                          {mod}: {avg}%
                                        </span>
                                      ))
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============ STATISTICS TAB ============ */}
              {activeTab === 'statistics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {platformStats.mostUsed && (
                      <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-xl p-5">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
                        <div className="relative space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getModuleMeta(platformStats.mostUsed.name).gradient} flex items-center justify-center shadow-lg`}>
                              <Icon name={getModuleMeta(platformStats.mostUsed.name).icon} className="w-5 h-5 text-white" glow />
                            </div>
                            <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-1">Most Used</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">Top Module</p>
                            <p className="text-xl font-black text-white capitalize">{platformStats.mostUsed.name}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              <span className="font-bold text-white">{platformStats.mostUsed.count}</span> attempts
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {platformStats.highestAvg && (
                      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-xl p-5">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
                        <div className="relative space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getModuleMeta(platformStats.highestAvg.name).gradient} flex items-center justify-center shadow-lg`}>
                              <Icon name="trophy" className="w-5 h-5 text-white" glow />
                            </div>
                            <span className="text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-1">Easiest</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1">Highest Avg</p>
                            <p className="text-xl font-black text-white capitalize">{platformStats.highestAvg.name}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              <span className="font-bold text-amber-300">{platformStats.highestAvg.average}%</span> avg
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {platformStats.lowestAvg && (
                      <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-red-500/5 backdrop-blur-xl p-5">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl" />
                        <div className="relative space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getModuleMeta(platformStats.lowestAvg.name).gradient} flex items-center justify-center shadow-lg`}>
                              <Icon name="alert-circle" className="w-5 h-5 text-white" glow />
                            </div>
                            <span className="text-[9px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full px-2 py-1">Hardest</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1">Lowest Avg</p>
                            <p className="text-xl font-black text-white capitalize">{platformStats.lowestAvg.name}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              <span className="font-bold text-rose-300">{platformStats.lowestAvg.average}%</span> avg
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative overflow-hidden rounded-2xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-purple-500/5 backdrop-blur-xl p-5">
                      <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />
                      <div className="relative space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Icon name="activity" className="w-5 h-5 text-white" glow />
                          </div>
                          <span className="text-[9px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-2 py-1">Total</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1">Total Attempts</p>
                          <p className="text-3xl font-black text-white">{platformStats.totalAttempts}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {platformStats.totalUsersWithAttempts} unique users
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 sm:p-6">
                    <h3 className="text-base font-black tracking-tight mb-5 flex items-center gap-2">
                      <Icon name="bar-chart" className="w-4 h-4 text-violet-400" glow />
                      Module Usage Distribution
                    </h3>

                    {platformStats.moduleList.length === 0 ? (
                      <div className="p-12 text-center text-slate-500 text-sm">No module data yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {platformStats.moduleList.map((mod) => {
                          const meta = getModuleMeta(mod.name)
                          const maxCount = platformStats.moduleList[0]?.count || 1
                          const barWidth = maxCount > 0 ? (mod.count / maxCount) * 100 : 0
                          return (
                            <div key={mod.name} className="space-y-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                                    <Icon name={meta.icon} className="w-4 h-4 text-white" glow />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-white text-sm capitalize">{mod.name}</p>
                                    <p className="text-[11px] text-slate-500 font-mono">
                                      {mod.count} attempts · avg {mod.average}%
                                    </p>
                                  </div>
                                </div>
                                <p className={`text-xl font-black ${meta.textColor}`}>{mod.percentage}%</p>
                              </div>
                              <div className="relative h-2.5 bg-slate-800/60 rounded-full overflow-hidden">
                                <div
                                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${meta.gradient} rounded-full transition-all duration-700`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 sm:p-6">
                    <h3 className="text-base font-black tracking-tight mb-5 flex items-center gap-2">
                      <Icon name="pie-chart" className="w-4 h-4 text-amber-400" glow />
                      Score Distribution
                    </h3>

                    {platformStats.totalAttempts === 0 ? (
                      <div className="p-12 text-center text-slate-500 text-sm">No scores yet.</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-end justify-between gap-2 h-40">
                          {platformStats.scoreBuckets.map((bucket) => {
                            const maxCount = Math.max(...platformStats.scoreBuckets.map(b => b.count), 1)
                            const heightPercent = (bucket.count / maxCount) * 100
                            return (
                              <div key={bucket.range} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                                {bucket.count > 0 && (
                                  <span className="text-xs font-black text-white">{bucket.count}</span>
                                )}
                                <div
                                  className={`w-full bg-gradient-to-t ${bucket.color} rounded-t-lg transition-all duration-700`}
                                  style={{ height: `${Math.max(4, heightPercent)}%` }}
                                />
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex items-end justify-between gap-2 border-t border-violet-500/20 pt-2">
                          {platformStats.scoreBuckets.map((bucket) => (
                            <div key={bucket.range} className="flex-1 text-center">
                              <p className="text-[10px] font-mono font-bold text-slate-400">{bucket.range}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {Object.keys(platformStats.topPerformersByModule).length > 0 && (
                    <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 sm:p-6">
                      <h3 className="text-base font-black tracking-tight mb-5 flex items-center gap-2">
                        <Icon name="award" className="w-4 h-4 text-amber-400" glow />
                        Top Performers Per Module
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Object.entries(platformStats.topPerformersByModule).map(([modName, performers]) => {
                          const meta = getModuleMeta(modName)
                          const top = performers[0]
                          if (!top) return null
                          const u = users.find(x => x.id === top.userId)
                          return (
                            <div
                              key={modName}
                              onClick={() => u && openUserProfile(u)}
                              className={`group relative overflow-hidden rounded-2xl border ${meta.borderColor} bg-slate-900/30 backdrop-blur-xl p-4 space-y-3 cursor-pointer transition-all hover:scale-[1.02]`}
                            >
                              <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
                                  <Icon name={meta.icon} className="w-4 h-4 text-white" glow />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.textColor}`}>
                                  {meta.label}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-white text-xs truncate">{top.userName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{top.attempts}× attempts</p>
                              </div>
                              <div className={`py-2 rounded-xl bg-slate-950/40 text-center`}>
                                <p className={`text-2xl font-black ${meta.textColor}`}>{top.avg}%</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ============ MODALS ============ */}

      {/* QUESTION MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-violet-500/20 bg-[#151520] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-violet-500/20 pb-4">
              <h3 className="text-xl font-black text-white">
                {editingQuestionId !== null ? '✏️ Edit Question' : '➕ Create New Question'}
              </h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Module Type</label>
                  <select
                    value={qModuleId}
                    onChange={(e) => setQModuleId(e.target.value as any)}
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-violet-500/20 text-sm focus:outline-none focus:border-violet-400"
                  >
                    <option value="reading">Reading</option>
                    <option value="listening">Listening</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Test Title</label>
                  <input
                    type="text"
                    required
                    value={qTestTitle}
                    onChange={(e) => setQTestTitle(e.target.value)}
                    placeholder="e.g., Reading Test 1"
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-violet-500/20 text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              {qModuleId === 'reading' ? (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Passage Content</label>
                  <textarea
                    rows={3}
                    value={qPassage}
                    onChange={(e) => setQPassage(e.target.value)}
                    placeholder="Enter reading comprehension text..."
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-violet-500/20 text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Audio Script</label>
                  <textarea
                    rows={3}
                    value={qAudioScript}
                    onChange={(e) => setQAudioScript(e.target.value)}
                    placeholder="Enter listening transcript script..."
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-violet-500/20 text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Question Statement</label>
                <input
                  type="text"
                  required
                  value={qQuestionText}
                  onChange={(e) => setQQuestionText(e.target.value)}
                  placeholder="Enter the question text..."
                  className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-violet-500/20 text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Options (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={qOptionsStr}
                    onChange={(e) => setQOptionsStr(e.target.value)}
                    placeholder="Option A, Option B, Option C, Option D"
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-violet-500/20 text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Correct Answer</label>
                  <input
                    type="text"
                    required
                    value={qCorrectAnswer}
                    onChange={(e) => setQCorrectAnswer(e.target.value)}
                    placeholder="Must match exact option string"
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-violet-500/20 text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-violet-500/20">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-violet-500/30 hover:shadow-xl"
                >
                  {editingQuestionId !== null ? 'Save Changes' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TUTORIAL MODAL */}
      {showTutorialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/20 bg-[#151520] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Icon name="graduation-cap" className="w-5 h-5 text-white" glow />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                    Lesson Editor
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {editingTutorialId !== null ? 'Edit Lesson' : 'Create New Lesson'}
                  </h3>
                </div>
              </div>
              <button onClick={() => setShowTutorialModal(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveTutorial} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="e.g., Introduction to Customer Service"
                  className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-emerald-500/20 text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Difficulty Level</label>
                  <select
                    value={tLevel}
                    onChange={(e) => setTLevel(e.target.value as TutorialLevel)}
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-emerald-500/20 text-sm focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="beginner">🌱 Beginner</option>
                    <option value="intermediate">🚀 Intermediate</option>
                    <option value="upper_intermediate">⭐ Upper Intermediate</option>
                    <option value="advanced">🔥 Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Order Index</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={tOrderIndex}
                    onChange={(e) => setTOrderIndex(Number(e.target.value))}
                    placeholder="e.g., 1"
                    className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-emerald-500/20 text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Lesson Content</label>
                <textarea
                  rows={10}
                  required
                  value={tContent}
                  onChange={(e) => setTContent(e.target.value)}
                  placeholder="Enter the full lesson content..."
                  className="w-full mt-1.5 p-3 bg-slate-900 rounded-xl border border-emerald-500/20 text-sm focus:outline-none focus:border-emerald-400 leading-relaxed"
                />
                <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
                  {tContent.length} characters · {tContent.trim() ? tContent.trim().split(/\s+/).length : 0} words
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => setShowTutorialModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl"
                >
                  {editingTutorialId !== null ? 'Save Lesson' : 'Publish Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-violet-500/20 bg-[#151520]/95 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />
            
            <div className="relative text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Icon name="log-out" className="w-10 h-10 text-rose-400" glow />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Terminate Session?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">You are about to sign out of the Admin Console.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 py-4 px-6 rounded-xl border border-violet-500/20 bg-slate-800 text-white font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? <span>Signing Out...</span> : <span>Yes, Sign Out</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// ============================================
// SIDEBAR ITEM COMPONENT
// ============================================
function SidebarItem({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: {
    key: string
    label: string
    icon: string
    gradient: string
    badge?: number
  }
  active: boolean
  collapsed: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center ${
        collapsed ? 'justify-center' : 'justify-start'
      } gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all group ${
        active
          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
      }`}
      title={collapsed ? item.label : undefined}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/60" />
      )}
      <Icon
        name={item.icon}
        className={`w-5 h-5 shrink-0 ${active ? 'text-white' : ''}`}
        glow={active}
      />
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black ${
                active
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
              }`}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge !== undefined && item.badge > 0 && (
        <span
          className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center ${
            active ? 'bg-white text-violet-600' : 'bg-violet-500 text-white'
          }`}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </button>
  )
}

// ============================================
// USER PROFILE VIEW COMPONENT
// ============================================
function UserProfileView({
  profileData,
  profileStats,
  profileLoading,
  closeUserProfile,
  handleToggleAdmin,
  handleDeleteUser,
  handleUpdatePassword,
  adminEmail,
  learningProfileStats,
  tutorials,
}: {
  profileData: {
    user: any
    scores: any[]
    certificates: any[]
    tickets: any[]
    lessonProgress?: any[]
    completedLessonIds?: string[]
  }
  profileStats: {
  total: number
  average: number
  best: number
  worst: number
  certificates: number
  tickets: number
  moduleStats: Record<string, { count: number; avg: number; best: number }>
  typingStats: {
    count: number
    avgWpm: number
    bestWpm: number
    worstWpm: number
    avgAccuracy: number
    bestAccuracy: number
    wpmTrend: number | null
  } | null
}
  profileLoading: boolean
  closeUserProfile: () => void
  handleToggleAdmin: (userId: string, currentStatus: boolean, userEmail: string) => void
  handleDeleteUser: (userId: string, userEmail: string) => void
  handleUpdatePassword: (userId: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  adminEmail: string
  learningProfileStats: {
    totalLessons: number
    totalCompleted: number
    progressPct: number
    byLevel: Record<string, { total: number; completed: number }>
    recentlyCompleted: any[]
  }
  tutorials: any[]
}) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [showPasswordValue, setShowPasswordValue] = useState(false)
  const [showConfirmPasswordValue, setShowConfirmPasswordValue] = useState(false)

  useEffect(() => {
    if (showPasswordModal) {
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError('')
      setPasswordSuccess('')
      setShowPasswordValue(false)
      setShowConfirmPasswordValue(false)
    }
  }, [showPasswordModal])

  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: '', color: '', width: '0%' }
    let score = 0
    if (newPassword.length >= 8) score++
    if (newPassword.length >= 12) score++
    if (/[A-Z]/.test(newPassword)) score++
    if (/[a-z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^A-Za-z0-9]/.test(newPassword)) score++

    if (score <= 2) return { score, label: 'Weak', color: 'text-rose-400', bg: 'bg-rose-500', width: '25%' }
    if (score <= 4) return { score, label: 'Fair', color: 'text-amber-400', bg: 'bg-amber-500', width: '60%' }
    return { score, label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500', width: '100%' }
  }, [newPassword])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setPasswordError('Please fill in both password fields.')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setIsUpdatingPassword(true)

    const result = await handleUpdatePassword(profileData.user.id, newPassword)

    setIsUpdatingPassword(false)

    if (result.success) {
      setPasswordSuccess('Password updated successfully! The user can now sign in with the new password.')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess('')
      }, 2500)
    } else {
      setPasswordError(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={closeUserProfile}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-slate-300 hover:text-white hover:border-violet-400/40 font-bold text-xs transition-all"
      >
        <Icon name="arrow-left" className="w-4 h-4" />
        <span>Back to Registry</span>
      </button>

      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl border ${
                profileData.user.is_admin
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400/40 shadow-amber-500/30'
                  : 'bg-gradient-to-br from-violet-600 to-purple-600 border-violet-400/40 shadow-violet-500/30'
              }`}>
                <span className="text-white drop-shadow-lg">
                  {(profileData.user.name || profileData.user.email || '?').charAt(0).toUpperCase()}
                </span>
              </div>
              {profileData.user.is_admin && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 border-4 border-[#151520] flex items-center justify-center shadow-lg">
                  <Icon name="crown" className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  profileData.user.is_admin
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                }`}>
                  <Icon name={profileData.user.is_admin ? 'crown' : 'users'} className="w-3 h-3" glow />
                  {profileData.user.is_admin ? 'Administrator' : 'Standard User'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight truncate">
                {profileData.user.name || 'Unnamed User'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Icon name="mail" className="w-3.5 h-3.5" />
                <span className="font-mono truncate">{profileData.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Icon name="clock" className="w-3 h-3" />
                <span>
                  Joined {profileData.user.created_at
                    ? new Date(profileData.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-all"
            >
              <Icon name="key" className="w-4 h-4" />
              <span>Update Password</span>
            </button>
            <button
              onClick={() => handleToggleAdmin(profileData.user.id, profileData.user.is_admin, profileData.user.email)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs border transition-all ${
                profileData.user.is_admin
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border-violet-500/30'
              }`}
            >
              <Icon name={profileData.user.is_admin ? 'crown' : 'user-check'} className="w-4 h-4" />
              <span>{profileData.user.is_admin ? 'Demote to User' : 'Promote to Admin'}</span>
            </button>
            <button
              onClick={() => handleDeleteUser(profileData.user.id, profileData.user.email)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs transition-all"
            >
              <Icon name="trash" className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {profileLoading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-violet-400">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-bold text-sm uppercase tracking-widest">Loading Profile Data...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className={`grid grid-cols-2 gap-4 ${
            profileStats.typingStats ? 'lg:grid-cols-4 xl:grid-cols-7' : 'lg:grid-cols-5'
          }`}>
            {[
              { label: 'Attempts', value: profileStats.total, icon: 'activity', gradient: 'from-violet-500 to-purple-500' },
              { label: 'Average', value: `${profileStats.average}%`, icon: 'trending', gradient: 'from-cyan-500 to-blue-500' },
              { label: 'Best Score', value: `${profileStats.best}%`, icon: 'trophy', gradient: 'from-amber-500 to-orange-500' },
              { label: 'Certificates', value: profileStats.certificates, icon: 'shield', gradient: 'from-emerald-500 to-teal-500' },
              { label: 'Tickets', value: profileStats.tickets, icon: 'message-square', gradient: 'from-rose-500 to-pink-500' },
              // ⬇️ NEW: Show WPM cards only when typing stats exist
              ...(profileStats.typingStats ? [
                { label: 'Avg WPM', value: profileStats.typingStats.avgWpm, icon: 'keyboard', gradient: 'from-sky-500 to-blue-500' },
                { label: 'Best WPM', value: profileStats.typingStats.bestWpm, icon: 'zap', gradient: 'from-amber-500 to-orange-500' },
              ] : []),
            ].map((stat) => (
              <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-4">
                <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
                <div className="relative space-y-2">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon name={stat.icon} className="w-4 h-4 text-white" glow />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-black text-white">
                      {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} /> : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                  <Icon name="graduation-cap" className="w-5 h-5 text-white" glow />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Learning Progress</h3>
                  <p className="text-xs text-slate-400">
                    {learningProfileStats.totalCompleted} of {learningProfileStats.totalLessons} lessons completed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-500/20" />
                    <circle
                      cx="32" cy="32" r="26"
                      stroke="url(#learningProgressGradient)" strokeWidth="5" fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - learningProfileStats.progressPct / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="learningProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-white">{learningProfileStats.progressPct}%</span>
                  </div>
                </div>
              </div>
            </div>

            {learningProfileStats.totalLessons === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm border-t border-violet-500/10 pt-6">
                No lessons have been published yet.
              </div>
            ) : learningProfileStats.totalCompleted === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm border-t border-violet-500/10 pt-6">
                This user hasn't completed any lessons yet.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {(['beginner', 'intermediate', 'upper_intermediate', 'advanced'] as TutorialLevel[]).map((level) => {
                    const meta = getLevelMeta(level)
                    const lvl = learningProfileStats.byLevel[level]
                    const pct = lvl.total > 0 ? Math.round((lvl.completed / lvl.total) * 100) : 0
                    return (
                      <div
                        key={level}
                        className={`relative overflow-hidden rounded-2xl border ${meta.borderColor} ${meta.bgColor}/5 p-4 space-y-3`}
                      >
                        <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${meta.gradient} opacity-10 rounded-full blur-2xl`} />
                        <div className="relative flex items-center justify-between">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
                            <span className="text-sm">{meta.emoji}</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.textColor}`}>
                            {pct}%
                          </span>
                        </div>
                        <div className="relative">
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${meta.textColor} mb-1`}>
                            {meta.label}
                          </p>
                          <p className="text-xl font-black text-white">
                            {lvl.completed}<span className="text-slate-500 text-base">/{lvl.total}</span>
                          </p>
                        </div>
                        <div className="relative h-1.5 bg-slate-500/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${meta.gradient} rounded-full transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {learningProfileStats.recentlyCompleted.length > 0 && (
                  <div className="border-t border-violet-500/10 pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <Icon name="check" className="w-3.5 h-3.5 text-emerald-400" glow />
                      Recently Completed Lessons
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {learningProfileStats.recentlyCompleted.map((lesson: any) => {
                        const meta = getLevelMeta(lesson.level)
                        return (
                          <div
                            key={lesson.id}
                            className={`relative overflow-hidden rounded-xl border ${meta.borderColor} bg-slate-900/30 p-3 space-y-2`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${meta.borderColor} ${meta.bgColor}/10 ${meta.textColor}`}>
                                <span>{meta.emoji}</span>
                                {meta.label}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                #{lesson.order_index}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                              <Icon name="check" className="w-3 h-3" />
                              {lesson.completed_at
                                ? new Date(lesson.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Completed'}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {Object.keys(profileStats.moduleStats).length > 0 && (
            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Icon name="grid" className="w-4 h-4 text-violet-400" glow />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Module Breakdown</h3>
                  <p className="text-xs text-slate-400">Per-module attempts and scores</p>
                </div>
                {/* Typing Performance — only shown if user has typing records */}
                  {profileStats.typingStats && (
                    <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-[#151520]/80 to-blue-500/5 backdrop-blur-xl p-5 sm:p-6">
                      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

                      <div className="relative flex items-center justify-between gap-4 mb-5 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-lg">
                            <Icon name="keyboard" className="w-5 h-5 text-white" glow />
                          </div>
                          <div>
                            <h3 className="text-base font-black tracking-tight">Typing Performance</h3>
                            <p className="text-xs text-slate-400">
                              Based on {profileStats.typingStats.count} typing attempt{profileStats.typingStats.count === 1 ? '' : 's'}
                            </p>
                          </div>
                        </div>

                        {/* WPM Trend indicator */}
                        {profileStats.typingStats.wpmTrend !== null && (
                          <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            profileStats.typingStats.wpmTrend > 0
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : profileStats.typingStats.wpmTrend < 0
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                          }`}>
                            {profileStats.typingStats.wpmTrend > 0 ? (
                              <>
                                <Icon name="trending" className="w-3 h-3" />
                                <span>+{profileStats.typingStats.wpmTrend} WPM since first</span>
                              </>
                            ) : profileStats.typingStats.wpmTrend < 0 ? (
                              <>
                                <Icon name="trending-down" className="w-3 h-3" />
                                <span>{profileStats.typingStats.wpmTrend} WPM since first</span>
                              </>
                            ) : (
                              <>
                                <Icon name="scale" className="w-3 h-3" />
                                <span>No change</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-4 rounded-2xl border border-sky-500/30 bg-slate-900/40 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-300">Average WPM</p>
                          <p className="text-3xl font-black text-white">{profileStats.typingStats.avgWpm}</p>
                          <p className="text-[10px] text-slate-500 font-mono">words per minute</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-slate-900/40 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Best WPM</p>
                          <p className="text-3xl font-black text-white">{profileStats.typingStats.bestWpm}</p>
                          <p className="text-[10px] text-slate-500 font-mono">personal record</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-amber-500/30 bg-slate-900/40 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Avg Accuracy</p>
                          <p className="text-3xl font-black text-white">{profileStats.typingStats.avgAccuracy}%</p>
                          <p className="text-[10px] text-slate-500 font-mono">typing precision</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-violet-500/30 bg-slate-900/40 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300">Best Accuracy</p>
                          <p className="text-3xl font-black text-white">{profileStats.typingStats.bestAccuracy}%</p>
                          <p className="text-[10px] text-slate-500 font-mono">peak precision</p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.entries(profileStats.moduleStats).map(([module, data]) => (
                  <div key={module} className="p-4 rounded-2xl border border-violet-500/20 bg-slate-900/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 capitalize">{module}</span>
                      <span className="text-[10px] font-mono text-violet-400 font-bold">{data.count}×</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Average</span>
                          <span className="font-bold text-white">{data.avg}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${data.avg}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Best</span>
                          <span className="font-bold text-emerald-400">{data.best}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${data.best}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
            <div className="p-5 border-b border-violet-500/20 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Icon name="activity" className="w-4 h-4 text-cyan-400" glow />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">Performance Log</h3>
                <p className="text-xs text-slate-400">{profileData.scores.length} recorded attempts</p>
              </div>
            </div>
            {profileData.scores.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">No test attempts recorded yet.</div>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse text-sm">
                 <thead className="sticky top-0 bg-[#0d0d12] z-10">
                    <tr className="border-b border-violet-500/20 bg-slate-900/60 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <th className="p-4">#</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Module</th>
                      <th className="p-4">Score</th>
                      {/* ⬇️ NEW: WPM + Accuracy columns (only if typing stats exist) */}
                      {profileStats.typingStats && (
                        <>
                          <th className="p-4">WPM</th>
                          <th className="p-4">Accuracy</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-violet-500/10">
                    {profileData.scores.map((s, idx) => (
                      <tr key={s.id || idx} className="hover:bg-violet-500/[0.04] transition-colors">
                        <td className="p-4 text-slate-500 font-mono text-xs">{profileData.scores.length - idx}</td>
                        <td className="p-4 text-slate-400 text-xs">
                          {s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            s.module_name === 'reading' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                            s.module_name === 'listening' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            s.module_name === 'writing' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                            s.module_name === 'speaking' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            {s.module_name}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-black text-lg ${
                            (s.score || 0) >= 85 ? 'text-emerald-400' :
                            (s.score || 0) >= 70 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {s.score}%
                          </span>
                        </td>
                        {/* ⬇️ NEW: WPM + Accuracy values (only if typing stats exist) */}
                        {profileStats.typingStats && (
                          <>
                            <td className="p-4">
                              {s.module_name === 'typing' && typeof s.wpm === 'number' ? (
                                <span className={`font-black text-lg ${
                                  s.wpm >= 60 ? 'text-emerald-400' :
                                  s.wpm >= 40 ? 'text-amber-400' : 'text-rose-400'
                                }`}>
                                  {s.wpm}
                                </span>
                              ) : (
                                <span className="text-slate-600 text-xs">—</span>
                              )}
                            </td>
                            <td className="p-4">
                              {s.module_name === 'typing' && typeof s.accuracy === 'number' ? (
                                <span className={`font-bold text-sm ${
                                  s.accuracy >= 95 ? 'text-emerald-400' :
                                  s.accuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
                                }`}>
                                  {s.accuracy}%
                                </span>
                              ) : (
                                <span className="text-slate-600 text-xs">—</span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
            <div className="p-5 border-b border-violet-500/20 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Icon name="shield" className="w-4 h-4 text-emerald-400" glow />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">Earned Certificates</h3>
                <p className="text-xs text-slate-400">{profileData.certificates.length} issued</p>
              </div>
            </div>
            {profileData.certificates.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">No certificates earned yet.</div>
            ) : (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.certificates.map((cert, idx) => (
                  <div key={cert.id || idx} className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 space-y-3">
                    <div className="relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <Icon name="trophy" className="w-5 h-5 text-white" glow />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Certified</p>
                        <p className="text-xs font-bold text-white truncate">
                          {cert.certificate_code || cert.id?.substring(0, 12) || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Overall</span>
                        <span className="font-black text-emerald-400">{cert.overall_score || 0}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Issued</span>
                        <span className="text-slate-300 font-mono text-[11px]">
                          {cert.created_at ? new Date(cert.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
            <div className="p-5 border-b border-violet-500/20 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Icon name="message-square" className="w-4 h-4 text-rose-400" glow />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">Support Tickets</h3>
                <p className="text-xs text-slate-400">{profileData.tickets.length} submitted</p>
              </div>
            </div>
            {profileData.tickets.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">No support tickets submitted.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-violet-500/20 bg-slate-900/30 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <th className="p-4">Subject</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-violet-500/10">
                    {profileData.tickets.map((t, idx) => (
                      <tr key={t.id || idx} className="hover:bg-violet-500/[0.04] transition-colors">
                        <td className="p-4 font-bold text-white text-sm">{t.subject}</td>
                        <td className="p-4 text-slate-400 text-xs capitalize">{t.category}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.priority === 'high' ? 'bg-rose-500/20 text-rose-300' :
                            t.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-slate-500/20 text-slate-300'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            t.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-xs">
                          {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#151520] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Icon name="key" className="w-5 h-5 text-white" glow />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                    Security Update
                  </span>
                  <h3 className="text-lg font-black text-white">Update Password</h3>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
                aria-label="Close"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-violet-500/20 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                profileData.user.is_admin
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                  : 'bg-gradient-to-br from-violet-600 to-purple-600 text-white'
              }`}>
                {(profileData.user.name || profileData.user.email || '?').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{profileData.user.name || 'Unnamed User'}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{profileData.user.email}</p>
              </div>
            </div>

            {passwordError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-2">
                <Icon name="alert-circle" className="w-4 h-4 shrink-0 mt-0.5" glow />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-2">
                <Icon name="check" className="w-4 h-4 shrink-0 mt-0.5" glow />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="lock" className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type={showPasswordValue ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 chars)"
                    className="w-full pl-10 pr-12 py-3.5 bg-slate-900 rounded-xl border border-emerald-500/20 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordValue(!showPasswordValue)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 transition"
                    aria-label={showPasswordValue ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPasswordValue ? 'eye-off' : 'eye'} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Strength
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.bg} rounded-full transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <ul className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-500">
                    <li className={newPassword.length >= 8 ? 'text-emerald-400' : ''}>
                      {newPassword.length >= 8 ? '✓' : '○'} 8+ characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-emerald-400' : ''}>
                      {/[A-Z]/.test(newPassword) ? '✓' : '○'} Uppercase
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'text-emerald-400' : ''}>
                      {/[a-z]/.test(newPassword) ? '✓' : '○'} Lowercase
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-emerald-400' : ''}>
                      {/[0-9]/.test(newPassword) ? '✓' : '○'} Number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-400' : ''}>
                      {/[^A-Za-z0-9]/.test(newPassword) ? '✓' : '○'} Symbol
                    </li>
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="lock" className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type={showConfirmPasswordValue ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full pl-10 pr-12 py-3.5 bg-slate-900 rounded-xl border text-sm focus:outline-none transition-colors ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-rose-500/50 focus:border-rose-400'
                        : confirmPassword && newPassword === confirmPassword
                        ? 'border-emerald-500/50 focus:border-emerald-400'
                        : 'border-emerald-500/20 focus:border-emerald-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPasswordValue(!showConfirmPasswordValue)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 transition"
                    aria-label={showConfirmPasswordValue ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showConfirmPasswordValue ? 'eye-off' : 'eye'} className="w-4 h-4" />
                  </button>
                </div>
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <Icon name="check" className="w-3 h-3" /> Passwords match
                  </p>
                )}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                    <Icon name="x" className="w-3 h-3" /> Passwords do not match
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <p className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                  <Icon name="info" className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    The password is hashed with <strong className="text-slate-200">bcrypt (cost 12)</strong> before being stored. The user will need to sign in again with the new password.
                  </span>
                </p>
              </div>

              <div className="flex gap-3 pt-2 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={isUpdatingPassword}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isUpdatingPassword ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="check" className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}