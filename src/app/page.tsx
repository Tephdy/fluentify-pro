'use client';
import bcrypt from 'bcryptjs';


import { 
  ModuleType, 
  DEFAULT_TYPING_PASSAGES, 
  FALLBACK_WRITING_PROMPTS_POOL, 
  FALLBACK_SPEAKING_PROMPTS_POOL, 
  FALLBACK_READING_QUESTIONS, 
  FALLBACK_LISTENING_QUESTIONS, 
  MOTIVATIONAL_QUOTES 
} from '../data/assessmentData';

import type {
  BPOIndustryOverview,
  BPOHistoricalTimeline,
  BPOCompany,
  BPOJobRole,
  BPOApplicationStep,
  BPORrequiredDocument,
  BPOSuccessTip,
} from '../data/bpoIndustryTypes';

// ⬇️ NEW: Learning Topics types (inline — or add to a separate file)
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



import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

// ============================================
// FLAT ICON COMPONENT
// ============================================
interface IconProps {
  name: string;
  className?: string;
  glow?: boolean;
}

function Icon({ name, className = "w-5 h-5", glow = false }: IconProps) {
  switch (name) {
    case 'audio':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    case 'mic':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    case 'stop':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="6" y="6" width="12" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'headphones':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
        </svg>
      );
    case 'book':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'pencil':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case 'keyboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />
        </svg>
      );
    case 'academic':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'trending':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'trending-down':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    case 'scale':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M15 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-9-3h6" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'refresh':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'clock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
      );
    case 'trophy':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v2a6 6 0 01-6 6H9a6 6 0 01-6-6V5a2 2 0 012-2zm0 10v2a5 5 0 005 5h4a5 5 0 005-5v-2m-9 9v3m-3 0h6" />
        </svg>
      );
    case 'alert-circle':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
      );
    case 'info':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4m0-7h.01" />
        </svg>
      );
    case 'sun':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.02-12.02l-1.41 1.41" />
        </svg>
      );
    case 'moon':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      );
    case 'download':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      );
    case 'x':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'menu':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case 'star':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l2.63 5.33 5.88.85-4.25 4.14 1 5.85L12 16.9l-5.26 2.77 1-5.85L3.5 9.68l5.87-.85L12 3.5z" />
        </svg>
      );
    case 'grid':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'settings':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
    case 'zap':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'activity':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case 'layers':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'cpu':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
        </svg>
      );
    case 'wifi':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
        </svg>
      );
    case 'battery':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="1" y="6" width="18" height="12" rx="2" />
          <path d="M23 13v-2" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      );
    case 'plus':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      );
    case 'log-out':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      );
    case 'lock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      );
    case 'file-text':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'check':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    default:
      return null;
  }
}

// ============================================
// FLAT LEGAL MODAL COMPONENT
// ============================================
function LegalModal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        <div className="shrink-0 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Icon name="file-text" className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block">
                Legal Document
              </span>
              <h3 className="text-lg font-black text-white">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition text-slate-400 hover:text-white hover:bg-slate-700"
            aria-label="Close"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5 text-slate-300 text-sm leading-relaxed">
          {children}
        </div>

        <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-slate-700 bg-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <Icon name="shield" className="w-3 h-3 text-emerald-400" />
            <span>Version 2.6.0 · Effective September 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// FLAT RATING STAR COMPONENT
// ============================================
function RatingStar({ star, value, onPreview, onSelect }: {
  star: number;
  value: number;
  onPreview: (value: number) => void;
  onSelect: (value: number) => void;
}) {
  const fill = Math.max(0, Math.min(1, value - star + 1));

  const getRatingFromPointer = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    return ratio <= 0.5 ? star - 0.5 : star;
  };

  return (
    <button
      type="button"
      aria-label={`Rate ${star - 0.5} to ${star} stars`}
      onPointerMove={(e) => onPreview(getRatingFromPointer(e))}
      onPointerDown={(e) => onSelect(getRatingFromPointer(e))}
      onPointerLeave={() => onPreview(0)}
      className="relative w-12 h-12 p-1 transition-all duration-200 hover:scale-110 cursor-pointer touch-manipulation"
    >
      <svg className="absolute inset-1 w-10 h-10 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      {fill > 0 && (
        <div className="absolute inset-1 h-10 overflow-hidden pointer-events-none transition-all duration-200" style={{ width: `${fill * 100}%` }}>
          <svg className="w-10 h-10 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
      )}
    </button>
  );
}

// ============================================
// FLAT AUDIO PLAYER
// ============================================
interface AudioPlayerProps {
  script: string;
  onPlay?: () => void;
  onEnded?: () => void;
}

function AudioPlayer({ script, onPlay, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(24).fill(0));
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAudioLevels(prev => prev.map(() => Math.random() * 100));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevels(Array(24).fill(0));
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayAudio = () => {
    const sanitizedScript = script.replace(/Maya/g, 'Cally');

    if (!sanitizedScript || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onPlay?.();
      setTimeout(() => {
        setIsPlaying(false);
        onEnded?.();
      }, 3000);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sanitizedScript);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-end gap-[2px] h-10">
          {audioLevels.map((level, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-75 ${
                isPlaying ? 'bg-indigo-500' : 'bg-slate-600'
              }`}
              style={{ 
                height: isPlaying ? `${Math.max(8, level)}%` : '8%',
              }}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-mono font-bold ${isPlaying ? 'text-indigo-400' : 'text-slate-400'}`}>
            {isPlaying ? '● LIVE' : '○ READY'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {isPlaying ? 'Audio Stream Active' : 'Awaiting Playback'}
          </span>
        </div>
      </div>

      <button
        onClick={handlePlayAudio}
        disabled={isPlaying}
        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 ${
          isPlaying 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        <Icon name="audio" className="w-4 h-4" />
        <span>{isPlaying ? 'Speaking...' : 'Play Audio'}</span>
      </button>
    </div>
  );
}

// ============================================
// FLAT SPEAKING RECORDER
// ============================================
function SpeakingRecorder({ prompts, onComplete }: { prompts: string[]; onComplete?: (score: number) => void }) {
  const promptList = prompts.length > 0 ? prompts : FALLBACK_SPEAKING_PROMPTS_POOL;
  const [currentPrompt, setCurrentPrompt] = useState(promptList[0]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  
  const [speakingEvaluation, setSpeakingEvaluation] = useState<{
    cefrLevel?: string;
    overallScore: number;
    taskAchievement: number;
    logicalConnectivity: number;
    lexicalDepth: number;
    grammaticalVersatility: number;
    pronunciation: number;
    feedback: string;
    transcript?: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const nextPrompt = prompts[0] || FALLBACK_SPEAKING_PROMPTS_POOL[0];
    setCurrentPrompt(nextPrompt);
    setSpeakingEvaluation(null);
    setIsAnalyzing(false);
    setRecordingSeconds(0);
  }, [prompts]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const animate = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const normalized = Array.from(dataArray.slice(0, 32)).map(v => (v / 255) * 100);
          setWaveformData(normalized);
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setWaveformData(Array(32).fill(0));
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setSpeakingEvaluation(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        alert('Microphone access is not supported in this browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const supportedMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ];
      const mimeType =
        supportedMimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      const recorderMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorderMimeType,
        });
        if (audioBlob.size === 0) {
          setIsAnalyzing(false);
          alert('Recorded audio was empty. Please check your microphone connection.');
          return;
        }
        await sendAudioForEvaluation(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Unable to access microphone. Please ensure permissions are allowed.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const sendAudioForEvaluation = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
      formData.append('audio', audioBlob, `speech-recording.${extension}`);
      formData.append('prompt', currentPrompt);

      const res = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed on the server.');

      const evalResult = {
        cefrLevel: data.cefrLevel || 'B2',
        overallScore: data.overallScore || 80,
        taskAchievement: data.taskAchievement || 80,
        logicalConnectivity: data.logicalConnectivity || 80,
        lexicalDepth: data.lexicalDepth || 80,
        grammaticalVersatility: data.grammaticalVersatility || 80,
        pronunciation: data.pronunciation || 80,
        feedback: data.feedback || 'Detailed evaluation report generated.',
        transcript: data.transcript || '',
      };

      setSpeakingEvaluation(evalResult);
      if (onComplete) onComplete(evalResult.overallScore);
    } catch (err: any) {
      console.error(err);
      alert(`Error during evaluation: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="p-5 sm:p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Icon name="mic" className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Speaking Task</span>
        </div>
        <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium">{currentPrompt}</p>
      </div>

      <div className="p-6 sm:p-8 bg-slate-900 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="font-mono text-lg font-bold text-white">
              {isRecording ? formatTime(recordingSeconds) : '00:00'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-[3px] h-20 w-full max-w-md">
            {waveformData.map((level, i) => (
              <div
                key={i}
                className={`flex-1 max-w-[8px] rounded-full transition-all duration-75 ${
                  isRecording 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-700'
                }`}
                style={{ 
                  height: isRecording ? `${Math.max(4, level)}%` : '4%',
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                disabled={isAnalyzing}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-3"
              >
                <Icon name="mic" className="w-5 h-5" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-3"
              >
                <Icon name="stop" className="w-5 h-5" />
                <span>Stop & Analyze</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="p-6 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-indigo-400 block">Whisper Transcribing...</span>
              <span className="text-xs text-slate-400">AI is evaluating your speech patterns, fluency, and pronunciation</span>
            </div>
          </div>
        </div>
      )}

      {speakingEvaluation && !isAnalyzing && (
        <div className="mt-6 pt-6 border-t border-slate-700 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Icon name="activity" className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Speaking Assessment Report</h4>
                <span className="text-xs text-slate-400">CEFR Level: {speakingEvaluation.cefrLevel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-400">Overall</span>
              <span className="text-2xl font-black text-white">{speakingEvaluation.overallScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Task', score: speakingEvaluation.taskAchievement, color: 'bg-indigo-500' },
              { label: 'Logic', score: speakingEvaluation.logicalConnectivity, color: 'bg-cyan-500' },
              { label: 'Lexical', score: speakingEvaluation.lexicalDepth, color: 'bg-emerald-500' },
              { label: 'Grammar', score: speakingEvaluation.grammaticalVersatility, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-white">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{speakingEvaluation.feedback}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// INTERFACES
// ============================================
interface Question {
  id: string;
  type?: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface TestData {
  id: string;
  title: string;
  audioScript?: string;
  passage?: string;
  questions: Question[];
}

type WritingNoteType = 'success' | 'warning' | 'info';

interface WritingNote {
  type: WritingNoteType;
  message: string;
}

interface WritingEvaluationDetails {
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  taskAchievementScore: number;
  grammarNotes: WritingNote[];
  feedbackSummary: string;
}

// ============================================
// LESSON INTERFACE & LEVEL META
// ============================================
interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'upper_intermediate' | 'advanced';
  order_index: number;
  content: string;
  created_at?: string;
}

const LESSON_LEVEL_META: Record<Lesson['level'], {
  label: string;
  emoji: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}> = {
  beginner: {
    label: 'Beginner',
    emoji: '🌱',
    color: 'bg-emerald-600',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500',
  },
  intermediate: {
    label: 'Intermediate',
    emoji: '🚀',
    color: 'bg-sky-600',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500',
  },
  upper_intermediate: {
    label: 'Upper Intermediate',
    emoji: '⭐',
    color: 'bg-violet-600',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500',
  },
  advanced: {
    label: 'Advanced',
    emoji: '🔥',
    color: 'bg-rose-600',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500',
  },
};

function getLessonLevelMeta(level: string) {
  return LESSON_LEVEL_META[level as Lesson['level']] ?? LESSON_LEVEL_META.beginner;
}

// ============================================
// FLAT PRONUNCIATION CARD
// ============================================
interface PronunciationItem {
  word: string;
  ipa?: string;
  example?: string;
}

function parsePronunciationItems(content: string): PronunciationItem[] {
  const items: PronunciationItem[] = [];
  const lines = content.split('\n');
  const ipaSlashRegex = /\/([^\/]{1,12})\/\s*[-–—]\s*([A-Za-z][A-Za-z\s'-]{0,40})/;
  const wordIpaRegex = /^([A-Za-z][A-Za-z\s'-]{0,40})\s*[-–—]\s*\/([^\/]{1,12})\//;
  const pairRegex = /^([A-Za-z]{2,20})\s*\/\s*([A-Za-z]{2,20})$/;
  const seen = new Set<string>();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.length > 200) continue;
    if (/^(LECTURE|LEARNING OBJECTIVES|PROFESSOR|PRACTICE|KEY TAKEAWAYS|END OF|INTRODUCTION|STRUCTURE|FUNCTION|EXAMPLES?)/i.test(line)) continue;

    const wordIpaMatch = line.match(wordIpaRegex);
    if (wordIpaMatch) {
      const word = wordIpaMatch[1].trim();
      const ipa = `/${wordIpaMatch[2]}/`;
      if (!seen.has(word.toLowerCase())) {
        seen.add(word.toLowerCase());
        items.push({ word, ipa });
      }
      continue;
    }

    const ipaSlashMatch = line.match(ipaSlashRegex);
    if (ipaSlashMatch) {
      const ipa = `/${ipaSlashMatch[1]}/`;
      const word = ipaSlashMatch[2].trim();
      if (!seen.has(word.toLowerCase())) {
        seen.add(word.toLowerCase());
        items.push({ word, ipa });
      }
      continue;
    }

    const pairMatch = line.match(pairRegex);
    if (pairMatch) {
      const w1 = pairMatch[1];
      const w2 = pairMatch[2];
      if (!seen.has(w1.toLowerCase())) {
        seen.add(w1.toLowerCase());
        items.push({ word: w1 });
      }
      if (!seen.has(w2.toLowerCase())) {
        seen.add(w2.toLowerCase());
        items.push({ word: w2 });
      }
      continue;
    }

    const singleWordMatch = line.match(/^[•\-*]?\s*([A-Za-z][A-Za-z'-]{2,25})$/);
    if (singleWordMatch) {
      const word = singleWordMatch[1];
      if (!seen.has(word.toLowerCase()) && items.length < 12) {
        seen.add(word.toLowerCase());
        items.push({ word });
      }
    }
  }
  return items.slice(0, 12);
}

function PronunciationCard({
  item,
  themeClasses,
  Icon,
}: {
  item: PronunciationItem;
  themeClasses: any;
  Icon: any;
}) {
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showVerify, setShowVerify] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxRecordSeconds = 6;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const speakReference = (rate: number = 0.9) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.word);
    utterance.rate = rate;
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsPlayingReference(true);
    utterance.onend = () => setIsPlayingReference(false);
    utterance.onerror = () => setIsPlayingReference(false);
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        alert('Microphone is not supported in this browser.');
        return;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setShowVerify(false);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const supportedMimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = supportedMimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        setIsRecording(false);
        setShowVerify(true);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          if (next >= maxRecordSeconds) {
            stopRecording();
            return 0;
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Could not access microphone. Please check your browser permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const playRecording = () => {
    if (!audioUrl) return;
    if (audioElRef.current) {
      audioElRef.current.pause();
    }
    const el = new Audio(audioUrl);
    audioElRef.current = el;
    el.onplay = () => setIsPlayingRecording(true);
    el.onended = () => setIsPlayingRecording(false);
    el.onerror = () => setIsPlayingRecording(false);
    el.play();
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setShowVerify(false);
    setRecordingSeconds(0);
  };

  return (
    <div className={`rounded-xl border p-4 sm:p-5 shadow-sm transition-all ${themeClasses.card}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg sm:text-xl font-black tracking-tight truncate">
              {item.word}
            </p>
            {item.ipa && (
              <p className="text-xs font-mono text-emerald-400 mt-0.5">
                {item.ipa}
              </p>
            )}
            {item.example && (
              <p className={`text-[11px] mt-1 italic ${themeClasses.textMuted}`}>
                e.g. "{item.example}"
              </p>
            )}
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Icon name="mic" className="w-2.5 h-2.5" />
            Pronunciation
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => speakReference(0.9)}
            disabled={isPlayingReference}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border ${
              isPlayingReference
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : `${themeClasses.border} ${themeClasses.cardHover}`
            }`}
          >
            <Icon name="audio" className="w-3.5 h-3.5" />
            <span>{isPlayingReference ? 'Playing…' : 'Listen'}</span>
          </button>

          <button
            onClick={() => speakReference(0.55)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border ${themeClasses.border} ${themeClasses.cardHover}`}
            title="Play at slow speed"
          >
            <Icon name="clock" className="w-3.5 h-3.5" />
            <span>Slow</span>
          </button>

          {!isRecording ? (
            <button
              onClick={startRecording}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Icon name="mic" className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer bg-rose-700 text-white animate-pulse"
            >
              <Icon name="stop" className="w-3.5 h-3.5" />
              <span>Stop ({maxRecordSeconds - recordingSeconds}s)</span>
            </button>
          )}

          {audioUrl && (
            <button
              onClick={playRecording}
              disabled={isPlayingRecording}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border ${
                isPlayingRecording
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/40'
                  : `${themeClasses.border} ${themeClasses.cardHover}`
              }`}
            >
              <Icon name="activity" className="w-3.5 h-3.5" />
              <span>{isPlayingRecording ? 'Playing…' : 'Play Mine'}</span>
            </button>
          )}

          {audioUrl && (
            <button
              onClick={resetRecording}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border ${themeClasses.border} ${themeClasses.cardHover}`}
              title="Discard recording"
            >
              <Icon name="refresh" className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>

        {showVerify && audioUrl && (
          <div className="pt-3 border-t border-slate-500/20 space-y-3 animate-fadeIn">
            <p className={`text-[11px] font-bold uppercase tracking-widest ${themeClasses.textMuted}`}>
              Self-Verification
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  🎯 Target
                </p>
                <p className="text-base font-black">{item.word}</p>
                {item.ipa && (
                  <p className="text-[11px] font-mono text-emerald-300 mt-0.5">{item.ipa}</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-1">
                  🎤 Your Attempt
                </p>
                <p className={`text-xs ${themeClasses.textMuted} leading-relaxed`}>
                  Compare your recording with the target. Focus on:
                </p>
                <ul className={`mt-1 text-[11px] space-y-0.5 ${themeClasses.textMuted}`}>
                  <li>• Vowel length</li>
                  <li>• Consonant clarity (θ, ð, r, l, v)</li>
                  <li>• Word stress</li>
                </ul>
              </div>
            </div>

            <div className={`flex items-center gap-2 text-[11px] font-mono ${themeClasses.textMuted}`}>
              <Icon name="check" className="w-3 h-3 text-emerald-400" />
              <span>Recording saved · {recordingSeconds}s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// PRONUNCIATION SECTION WRAPPER
// ============================================
function PronunciationPracticePanel({
  content,
  themeClasses,
  Icon,
}: {
  content: string;
  themeClasses: any;
  Icon: any;
}) {
  const items = useMemo(() => parsePronunciationItems(content), [content]);

  if (items.length === 0) return null;

  return (
    <div className={`mt-8 rounded-2xl border p-5 sm:p-6 shadow-sm ${themeClasses.card}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
          <Icon name="mic" className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-black tracking-tight">Pronunciation Practice</h3>
          <p className={`text-xs ${themeClasses.textMuted}`}>
            Listen, repeat, record, and compare your pronunciation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <PronunciationCard
            key={`${item.word}-${idx}`}
            item={item}
            themeClasses={themeClasses}
            Icon={Icon}
          />
        ))}
      </div>

      <p className={`mt-4 text-[10px] font-mono ${themeClasses.textMuted}`}>
        💡 Tip: Recordings stay in your browser only — nothing is uploaded.
      </p>
    </div>
  );
}

// ============================================
// DYNAMIC BPO INDUSTRY MODULE
// ============================================
function BPOIndustryModule({
  themeClasses,
  Icon,
}: {
  themeClasses: any;
  Icon: any;
}) {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'companies' | 'apply' | 'documents' | 'careers'
  >('overview');
  const [selectedCompany, setSelectedCompany] = useState<BPOCompany | null>(null);

  // Data states
  const [overview, setOverview] = useState<BPOIndustryOverview | null>(null);
  const [timeline, setTimeline] = useState<BPOHistoricalTimeline[]>([]);
  const [companies, setCompanies] = useState<BPOCompany[]>([]);
  const [jobRoles, setJobRoles] = useState<BPOJobRole[]>([]);
  const [applicationSteps, setApplicationSteps] = useState<BPOApplicationStep[]>([]);
  const [documents, setDocuments] = useState<BPORrequiredDocument[]>([]);
  const [successTips, setSuccessTips] = useState<BPOSuccessTip[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH ALL BPO DATA
  // ============================================
  const fetchBPOData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        overviewRes,
        timelineRes,
        companiesRes,
        rolesRes,
        stepsRes,
        docsRes,
        tipsRes,
      ] = await Promise.all([
        supabase.from('bpo_industry_overview').select('*').limit(1).maybeSingle(),
        supabase.from('bpo_historical_timeline').select('*').order('display_order', { ascending: true }),
        supabase.from('bpo_companies').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('bpo_job_roles').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('bpo_application_steps').select('*').order('step_number', { ascending: true }),
        supabase.from('bpo_required_documents').select('*').order('display_order', { ascending: true }),
        supabase.from('bpo_success_tips').select('*').order('display_order', { ascending: true }),
      ]);

      if (overviewRes.error) throw overviewRes.error;
      if (timelineRes.error) throw timelineRes.error;
      if (companiesRes.error) throw companiesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (stepsRes.error) throw stepsRes.error;
      if (docsRes.error) throw docsRes.error;
      if (tipsRes.error) throw tipsRes.error;

      setOverview(overviewRes.data as BPOIndustryOverview | null);
      setTimeline((timelineRes.data as BPOHistoricalTimeline[]) || []);
      setCompanies((companiesRes.data as BPOCompany[]) || []);
      setJobRoles((rolesRes.data as BPOJobRole[]) || []);
      setApplicationSteps((stepsRes.data as BPOApplicationStep[]) || []);
      setDocuments((docsRes.data as BPORrequiredDocument[]) || []);
      setSuccessTips((tipsRes.data as BPOSuccessTip[]) || []);
    } catch (err: any) {
      console.error('Error loading BPO data:', err.message);
      setError(err.message || 'Failed to load BPO industry data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBPOData();
  }, []);

  const sections = [
    { id: 'overview', label: 'Industry Overview', icon: 'chart' },
    { id: 'companies', label: 'Top Companies', icon: 'academic' },
    { id: 'apply', label: 'How to Apply', icon: 'file-text' },
    { id: 'documents', label: 'Documents Checklist', icon: 'shield' },
    { id: 'careers', label: 'Career Paths', icon: 'trending' },
  ];

  // Group tips by category
  const tipsByCategory = useMemo(() => {
    const grouped: Record<string, BPOSuccessTip[]> = {
      beforeApplying: [],
      duringInterview: [],
      onTheJob: [],
      healthAndWellness: [],
    };
    successTips.forEach((tip) => {
      if (grouped[tip.category]) grouped[tip.category].push(tip);
    });
    return grouped;
  }, [successTips]);

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className={`rounded-2xl border p-16 text-center ${themeClasses.card}`}>
        <div className="inline-flex items-center gap-3 text-indigo-400">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-bold text-sm uppercase tracking-widest">Loading BPO Industry Guide...</span>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-start gap-4">
        <Icon name="alert-circle" className="w-6 h-6 text-rose-400 shrink-0" />
        <div>
          <p className="text-sm font-bold text-rose-400">Couldn't load BPO industry data</p>
          <p className={`text-xs mt-1 ${themeClasses.textMuted}`}>{error}</p>
          <button
            onClick={fetchBPOData}
            className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${themeClasses.card}`}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Icon name="academic" className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                BPO Industry Preparation
              </h1>
              <p className={`text-sm mt-1 ${themeClasses.textMuted}`}>
                Comprehensive guide to launching your career in the Philippine BPO industry
              </p>
            </div>
          </div>
          <button
            onClick={fetchBPOData}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition border ${themeClasses.border} ${themeClasses.cardHover}`}
            title="Refresh data"
          >
            <Icon name="refresh" className="w-4 h-4" />
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mt-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-indigo-600 text-white'
                  : `${themeClasses.border} ${themeClasses.cardHover}`
              }`}
            >
              <Icon name={section.icon} className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== OVERVIEW SECTION ==================== */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {overview && (
            <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
              <h2 className="text-xl font-black mb-4">{overview.title}</h2>
              <div className="prose prose-invert max-w-none">
                <p className={`text-sm leading-relaxed whitespace-pre-line ${themeClasses.textSecondary}`}>
                  {overview.introduction}
                </p>
              </div>
            </div>
          )}

          {/* Key Statistics */}
          {overview?.key_statistics && Object.keys(overview.key_statistics).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(overview.key_statistics).map(([key, value]) => (
                <div key={key} className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted} block mb-1`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <span className="text-sm font-black leading-tight">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Historical Timeline */}
          {timeline.length > 0 && (
            <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
              <h2 className="text-xl font-black mb-6">History & Evolution</h2>
              <div className="space-y-4">
                {timeline.map((era, idx) => (
                  <div key={era.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                        {idx + 1}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-indigo-500/30 my-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                        {era.period}
                      </span>
                      <h3 className="text-base font-bold mt-1">{era.title}</h3>
                      <p className={`text-sm mt-2 leading-relaxed ${themeClasses.textMuted}`}>
                        {era.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Philippines */}
          {overview?.why_philippines && overview.why_philippines.length > 0 && (
            <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
              <h2 className="text-xl font-black mb-6">Why the Philippines Leads in BPO</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {overview.why_philippines.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <h3 className="text-sm font-bold text-indigo-400 mb-2">{item.advantage}</h3>
                    <p className={`text-xs leading-relaxed ${themeClasses.textMuted}`}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== COMPANIES SECTION ==================== */}
      {activeSection === 'companies' && (
        <div className="space-y-6">
          {selectedCompany ? (
            <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
              <button
                onClick={() => setSelectedCompany(null)}
                className={`text-xs font-bold ${themeClasses.accent} hover:underline mb-4 flex items-center gap-1 cursor-pointer`}
              >
                <Icon name="arrow-left" className="w-3.5 h-3.5" /> Back to Companies List
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shrink-0">
                  {selectedCompany.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedCompany.name}</h2>
                  <p className={`text-sm ${themeClasses.textMuted}`}>
                    {selectedCompany.founded && `Founded: ${selectedCompany.founded}`}
                    {selectedCompany.headquarters && ` • HQ: ${selectedCompany.headquarters}`}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedCompany.history && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-2">Company History</h3>
                    <p className={`text-sm leading-relaxed ${themeClasses.textSecondary}`}>
                      {selectedCompany.history}
                    </p>
                  </div>
                )}

                {selectedCompany.philippines_presence && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-2">Philippines Presence</h3>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>
                      {selectedCompany.philippines_presence}
                    </p>
                  </div>
                )}

                {selectedCompany.services?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-2">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.services.map((service, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCompany.application_notes && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <h3 className="text-sm font-bold text-emerald-400 mb-2">Application Notes</h3>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>
                      {selectedCompany.application_notes}
                    </p>
                  </div>
                )}

                {selectedCompany.website && (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg transition-colors"
                  >
                    <Icon name="chevron-right" className="w-4 h-4" />
                    Visit Careers Page
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
              <h2 className="text-xl font-black mb-2">Top BPO Companies in the Philippines</h2>
              <p className={`text-sm ${themeClasses.textMuted} mb-6`}>
                Major employers with significant Philippine operations. Click any company to learn more.
              </p>

              {companies.length === 0 ? (
                <div className={`text-center py-12 ${themeClasses.textMuted}`}>
                  No companies available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => setSelectedCompany(company)}
                      className={`p-5 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${themeClasses.card} ${themeClasses.cardHover}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shrink-0">
                          {company.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold truncate">{company.name}</h3>
                          {company.founded && (
                            <p className={`text-[10px] ${themeClasses.textMuted} mt-0.5`}>
                              {company.founded}
                            </p>
                          )}
                          {company.description && (
                            <p className={`text-xs mt-2 line-clamp-2 ${themeClasses.textMuted}`}>
                              {company.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== APPLY SECTION ==================== */}
      {activeSection === 'apply' && (
        <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
          <h2 className="text-xl font-black mb-2">How to Apply for BPO Jobs</h2>
          <p className={`text-sm ${themeClasses.textMuted} mb-6`}>
            Step-by-step guide to the BPO application process in the Philippines.
          </p>

          {applicationSteps.length === 0 ? (
            <div className={`text-center py-12 ${themeClasses.textMuted}`}>
              No application steps available yet.
            </div>
          ) : (
            <div className="space-y-5">
              {applicationSteps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                    {step.step_number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold">{step.title}</h3>
                    {step.description && (
                      <p className={`text-sm mt-2 leading-relaxed ${themeClasses.textMuted}`}>
                        {step.description}
                      </p>
                    )}
                    {step.tips?.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {step.tips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <span className="text-indigo-400 font-bold mt-0.5">•</span>
                            <span className={themeClasses.textMuted}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== DOCUMENTS SECTION ==================== */}
      {activeSection === 'documents' && (
        <div className="space-y-6">
          <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
            <h2 className="text-xl font-black mb-2">Required Documents Checklist</h2>
            <p className={`text-sm ${themeClasses.textMuted} mb-6`}>
              Prepare these documents before applying to streamline your application process.
            </p>

            {documents.length === 0 ? (
              <div className={`text-center py-12 ${themeClasses.textMuted}`}>
                No documents listed yet.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-xl border ${
                      doc.is_required
                        ? 'bg-rose-500/5 border-rose-500/20'
                        : 'bg-slate-500/5 border-slate-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        doc.is_required ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        <Icon name={doc.is_required ? 'check' : 'minus'} className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold">{doc.name}</h3>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            doc.is_required
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {doc.is_required ? 'Required' : 'Conditional'}
                          </span>
                        </div>
                        {doc.description && (
                          <p className={`text-xs mt-1.5 ${themeClasses.textMuted}`}>
                            {doc.description}
                          </p>
                        )}
                        {doc.notes && (
                          <p className={`text-[11px] mt-2 font-medium ${doc.is_required ? 'text-rose-400' : 'text-slate-400'}`}>
                            💡 {doc.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Success Tips */}
          {successTips.length > 0 && (
            <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
              <h2 className="text-xl font-black mb-6">Success Tips</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'beforeApplying', label: 'Before Applying', color: 'indigo' },
                  { key: 'duringInterview', label: 'During Interview', color: 'emerald' },
                  { key: 'onTheJob', label: 'On the Job', color: 'amber' },
                  { key: 'healthAndWellness', label: 'Health & Wellness', color: 'rose' },
                ].map(({ key, label, color }) => (
                  tipsByCategory[key]?.length > 0 && (
                    <div
                      key={key}
                      className={`p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/20`}
                    >
                      <h3 className={`text-sm font-bold text-${color}-400 mb-3`}>{label}</h3>
                      <ul className="space-y-1.5">
                        {tipsByCategory[key].map((tip) => (
                          <li key={tip.id} className={`text-xs flex items-start gap-2 ${themeClasses.textMuted}`}>
                            <span className={`text-${color}-400`}>•</span>
                            {tip.tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== CAREERS SECTION ==================== */}
      {activeSection === 'careers' && (
        <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
          <h2 className="text-xl font-black mb-2">BPO Career Paths</h2>
          <p className={`text-sm ${themeClasses.textMuted} mb-6`}>
            Explore different roles and advancement opportunities in the BPO industry.
          </p>

          {jobRoles.length === 0 ? (
            <div className={`text-center py-12 ${themeClasses.textMuted}`}>
              No career paths available yet.
            </div>
          ) : (
            <div className="space-y-5">
              {jobRoles.map((role) => (
                <div key={role.id} className={`p-5 rounded-xl border ${themeClasses.cardHover}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-bold">{role.title}</h3>
                    {role.salary_range && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0">
                        {role.salary_range}
                      </span>
                    )}
                  </div>
                  {role.description && (
                    <p className={`text-sm mb-4 ${themeClasses.textMuted}`}>{role.description}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {role.requirements?.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-2">Requirements</h4>
                        <ul className="space-y-1">
                          {role.requirements.map((req, rIdx) => (
                            <li key={rIdx} className={`text-[11px] flex items-start gap-1.5 ${themeClasses.textMuted}`}>
                              <span className="text-indigo-400">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {role.skills?.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">Key Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {role.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
// DYNAMIC LEARNING TOPICS MODULE
// ============================================
function LearningTopicsView({
  themeClasses,
  Icon,
}: {
  themeClasses: any;
  Icon: any;
}) {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [sections, setSections] = useState<LearningTopicSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<'all' | LearningTopic['level']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // LOAD ALL TOPICS
  // ============================================
  const loadTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTopics((data as LearningTopic[]) || []);
    } catch (err: any) {
      console.error('Error loading topics:', err.message);
      setError(err.message || 'Failed to load learning topics');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOAD SECTIONS FOR A SPECIFIC TOPIC
  // ============================================
  const loadSections = async (topicId: string) => {
    setSectionsLoading(true);
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
      setSections([]);
    } finally {
      setSectionsLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  // ============================================
  // HANDLE TOPIC SELECTION
  // ============================================
  const handleSelectTopic = (topic: LearningTopic) => {
    setSelectedTopic(topic);
    loadSections(topic.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedTopic(null);
    setSections([]);
  };

  // ============================================
  // FILTER TOPICS
  // ============================================
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesLevel = levelFilter === 'all' || t.level === levelFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [topics, levelFilter, searchQuery]);

  // ============================================
  // LOADING / ERROR STATES
  // ============================================
  if (loading) {
    return (
      <div className={`rounded-2xl border p-16 text-center ${themeClasses.card}`}>
        <div className="inline-flex items-center gap-3 text-indigo-400">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-bold text-sm uppercase tracking-widest">Loading Learning Topics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-start gap-4">
        <Icon name="alert-circle" className="w-6 h-6 text-rose-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-rose-400">Couldn't load topics</p>
          <p className={`text-xs mt-1 ${themeClasses.textMuted}`}>{error}</p>
          <button
            onClick={loadTopics}
            className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ============================================
// TOPIC SECTION CARD (Renders each section type) — THEME AWARE
// ============================================
function TopicSectionCard({
  section,
  index,
  themeClasses,
  Icon,
}: {
  section: LearningTopicSection;
  index: number;
  themeClasses: any;
  Icon: any;
}) {
  // Section type metadata — using theme-aware color tokens
  const sectionMeta: Record<string, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
    lesson: { label: 'Lesson', icon: 'book', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/30' },
    example: { label: 'Example', icon: 'file-text', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
    template: { label: 'Template', icon: 'file-text', color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30' },
    tip: { label: 'Tips', icon: 'sparkles', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
    checklist: { label: 'Checklist', icon: 'check', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
    script: { label: 'Scripts', icon: 'message-square', color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/30' },
    comparison: { label: 'Comparison', icon: 'scale', color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10', borderColor: 'border-fuchsia-500/30' },
  };

  const meta = sectionMeta[section.section_type] || sectionMeta.lesson;

  // ============================================
  // RENDER SECTION TYPE SPECIFIC CONTENT
  // ============================================
  const renderExamples = () => {
    if (!Array.isArray(section.examples) || section.examples.length === 0) return null;

    // Checklist type
    if (section.section_type === 'checklist') {
      return (
        <div className="space-y-2 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border ${themeClasses.card} border-emerald-500/20`}
            >
              <div className="w-5 h-5 rounded border-2 border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="check" className="w-3 h-3 text-emerald-400" />
              </div>
              <span className={`text-sm flex-1 ${themeClasses.textPrimary}`}>
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Script type
    if (section.section_type === 'script') {
      return (
        <div className="space-y-3 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div key={i} className="rounded-xl border border-rose-500/20 overflow-hidden">
              <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  {item.scenario || `Scenario ${i + 1}`}
                </span>
              </div>
              <div className={`p-4 ${themeClasses.card}`}>
                <p className={`text-sm leading-relaxed italic ${themeClasses.textPrimary}`}>
                  {item.script}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Template type
    if (section.section_type === 'template') {
      return (
        <div className="space-y-4 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div key={i} className="rounded-xl border border-violet-500/20 overflow-hidden">
              <div className="px-4 py-3 bg-violet-500/10 border-b border-violet-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 block">
                  {item.purpose || `Template ${i + 1}`}
                </span>
                {item.subject && (
                  <p className={`text-xs font-bold ${themeClasses.textPrimary}`}>
                    Subject: {item.subject}
                  </p>
                )}
              </div>
              <div className={`p-4 ${themeClasses.card}`}>
                <pre className={`text-xs leading-relaxed whitespace-pre-wrap font-mono ${themeClasses.textPrimary}`}>
                  {item.body}
                </pre>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Comparison type
    if (section.section_type === 'comparison') {
      return (
        <div className="space-y-3 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div key={i} className={`rounded-xl border border-fuchsia-500/20 p-4 ${themeClasses.card}`}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3">
                {item.aspect || `Aspect ${i + 1}`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.voice && (
                  <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                      🎤 Voice
                    </p>
                    <p className={`text-xs ${themeClasses.textPrimary}`}>{item.voice}</p>
                  </div>
                )}
                {item.chat_email && (
                  <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                      💬 Chat / Email
                    </p>
                    <p className={`text-xs ${themeClasses.textPrimary}`}>{item.chat_email}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default — generic object renderer (THEME-AWARE)
    return (
      <div className="space-y-3 mt-4">
        {section.examples.map((item: any, i: number) => (
          <div key={i} className={`rounded-xl border p-4 ${themeClasses.card} ${themeClasses.border}`}>
            <div className="space-y-3">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 text-sm">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className={`${themeClasses.textPrimary} font-medium`}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${themeClasses.card} ${themeClasses.border}`}>
      {/* Section header */}
      <div className={`p-5 border-b ${themeClasses.border}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 shrink-0 rounded-xl ${meta.bgColor} border ${meta.borderColor} flex items-center justify-center`}>
            <Icon name={meta.icon} className={`w-6 h-6 ${meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${meta.bgColor} ${meta.color} border ${meta.borderColor}`}>
                {meta.label}
              </span>
              <span className={`text-[10px] font-mono ${themeClasses.textMuted}`}>
                Section {index + 1}
              </span>
            </div>
            <h3 className={`text-lg font-black tracking-tight ${themeClasses.textPrimary}`}>
              {section.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <p className={`text-sm leading-relaxed whitespace-pre-line ${themeClasses.textSecondary}`}>
          {section.content}
        </p>

        {renderExamples()}

        {/* Key Points */}
        {Array.isArray(section.key_points) && section.key_points.length > 0 && (
          <div className={`mt-6 pt-5 border-t ${themeClasses.border}`}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
              <Icon name="sparkles" className="w-3.5 h-3.5" />
              Key Takeaways
            </h4>
            <ul className="space-y-2">
              {section.key_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span className={themeClasses.textMuted}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

  // ============================================
  // TOPIC DETAIL VIEW
  // ============================================
  if (selectedTopic) {
    const levelMeta = getLessonLevelMeta(selectedTopic.level);

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Back button + navigation */}
        <div className={`rounded-xl border p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${themeClasses.card}`}>
          <button
            onClick={handleBackToList}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 border ${themeClasses.border} ${themeClasses.cardHover}`}
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            <span>Back to All Topics</span>
          </button>

          <div className="flex items-center gap-3 justify-center">
            <span className={`text-xs font-mono ${themeClasses.textMuted}`}>
              {sections.length} section{sections.length === 1 ? '' : 's'}
            </span>
            <span className={`text-xs font-mono ${themeClasses.textMuted}`}>
              ~{selectedTopic.estimated_minutes} min read
            </span>
          </div>
        </div>

        {/* Topic Header */}
        <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${selectedTopic.gradient} flex items-center justify-center text-white shadow-lg`}>
              <Icon name={selectedTopic.icon} className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${levelMeta.borderColor} ${levelMeta.bgColor}/10 ${levelMeta.textColor}`}>
                  <span>{levelMeta.emoji}</span>
                  {levelMeta.label}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Icon name="clock" className="w-3 h-3" />
                  {selectedTopic.estimated_minutes} min
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {selectedTopic.title}
              </h1>
              {selectedTopic.subtitle && (
                <p className={`text-sm font-medium mt-1 ${themeClasses.accent}`}>
                  {selectedTopic.subtitle}
                </p>
              )}
              {selectedTopic.description && (
                <p className={`text-sm leading-relaxed mt-3 ${themeClasses.textMuted}`}>
                  {selectedTopic.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sections */}
        {sectionsLoading ? (
          <div className={`rounded-2xl border p-16 text-center ${themeClasses.card}`}>
            <div className="inline-flex items-center gap-3 text-indigo-400">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span className="font-bold text-sm uppercase tracking-widest">Loading content...</span>
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className={`rounded-2xl border p-16 text-center ${themeClasses.card}`}>
            <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${themeClasses.accentSoft}`}>
              <Icon name="file-text" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">No content yet</h3>
            <p className={`text-sm mt-2 ${themeClasses.textMuted}`}>
              This topic has no sections published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {sections.map((section, idx) => (
              <TopicSectionCard
                key={section.id}
                section={section}
                index={idx}
                themeClasses={themeClasses}
                Icon={Icon}
              />
            ))}
          </div>
        )}

        {/* Bottom navigation */}
        <div className={`rounded-xl border p-4 flex items-center justify-center ${themeClasses.card}`}>
          <button
            onClick={handleBackToList}
            className={`px-6 py-3 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 border ${themeClasses.border} ${themeClasses.cardHover}`}
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            <span>Back to All Topics</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // TOPICS LIST VIEW
  // ============================================
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero */}
      <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${themeClasses.accentSoft}`}>
              <Icon name="graduation-cap" className="w-3.5 h-3.5" />
              Career-Ready Learning Topics
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Professional Skills for <span className="text-indigo-400">BPO Success</span>
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${themeClasses.textMuted}`}>
              Master customer interaction, complaint handling, workplace tools, and administrative skills. Each topic includes practical templates, scripts, and checklists you can use on day one.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4">
            <div className={`p-6 rounded-2xl border ${themeClasses.card}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                Available
              </p>
              <p className="text-4xl font-black">{topics.length}</p>
              <p className={`text-[11px] ${themeClasses.textMuted}`}>
                topic{topics.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl border p-4 shadow-sm ${themeClasses.card}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="search" className={`w-4 h-4 ${themeClasses.textMuted}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics by title or description..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.border}`}
            />
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-lg border overflow-x-auto ${themeClasses.border}`}>
            {[
              { key: 'all', label: 'All Levels' },
              { key: 'beginner', label: 'Beginner' },
              { key: 'intermediate', label: 'Intermediate' },
              { key: 'upper_intermediate', label: 'Upper Int.' },
              { key: 'advanced', label: 'Advanced' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLevelFilter(opt.key as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  levelFilter === opt.key
                    ? 'bg-indigo-600 text-white'
                    : `${themeClasses.textMuted}`
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadTopics}
            disabled={loading}
            className={`px-4 py-3 rounded-lg text-xs font-bold transition cursor-pointer border flex items-center justify-center gap-2 disabled:opacity-50 ${themeClasses.border} ${themeClasses.cardHover}`}
          >
            <Icon name="refresh" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${themeClasses.card}`}>
          <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${themeClasses.accentSoft}`}>
            <Icon name="book" className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">
            {topics.length === 0 ? 'No topics available yet' : 'No matching topics'}
          </h3>
          <p className={`text-sm mt-2 ${themeClasses.textMuted}`}>
            {topics.length === 0
              ? 'Topics will appear here once they are published by an administrator.'
              : 'Try adjusting your filters or search query.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const levelMeta = getLessonLevelMeta(topic.level);
            return (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`group rounded-xl border p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${themeClasses.card} ${themeClasses.cardHover}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon name={topic.icon} className="w-7 h-7" />
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${levelMeta.borderColor} ${levelMeta.bgColor}/10 ${levelMeta.textColor}`}>
                      {levelMeta.emoji} {levelMeta.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold leading-snug group-hover:text-indigo-300 transition-colors">
                      {topic.title}
                    </h3>
                    {topic.subtitle && (
                      <p className={`text-xs font-semibold ${themeClasses.accent}`}>
                        {topic.subtitle}
                      </p>
                    )}
                    {topic.description && (
                      <p className={`text-xs leading-relaxed line-clamp-3 ${themeClasses.textMuted}`}>
                        {topic.description}
                      </p>
                    )}
                  </div>

                  <div className={`flex items-center justify-between pt-3 border-t ${themeClasses.border}`}>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono ${themeClasses.textMuted}`}>
                      <Icon name="clock" className="w-3 h-3" />
                      {topic.estimated_minutes} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Start learning
                      <Icon name="chevron-right" className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// TOPIC SECTION CARD (Renders each section type)
// ============================================
function TopicSectionCard({
  section,
  index,
  themeClasses,
  Icon,
}: {
  section: LearningTopicSection;
  index: number;
  themeClasses: any;
  Icon: any;
}) {
  // Section type metadata
  const sectionMeta: Record<string, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
    lesson: { label: 'Lesson', icon: 'book', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/30' },
    example: { label: 'Example', icon: 'file-text', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
    template: { label: 'Template', icon: 'file-text', color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30' },
    tip: { label: 'Tips', icon: 'sparkles', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
    checklist: { label: 'Checklist', icon: 'check', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
    script: { label: 'Scripts', icon: 'message-square', color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/30' },
    comparison: { label: 'Comparison', icon: 'scale', color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10', borderColor: 'border-fuchsia-500/30' },
  };

  const meta = sectionMeta[section.section_type] || sectionMeta.lesson;

  // ============================================
  // RENDER SECTION TYPE SPECIFIC CONTENT
  // ============================================
  const renderExamples = () => {
    if (!Array.isArray(section.examples) || section.examples.length === 0) return null;

    // Checklist type — render as simple check items
    if (section.section_type === 'checklist') {
      // Default — generic object renderer (THEME-AWARE)
      return (
        <div className="space-y-3 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div key={i} className={`rounded-xl border p-4 ${themeClasses.card} ${themeClasses.border}`}>
              <div className="space-y-2">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 text-sm">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className={themeClasses.textPrimary}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Script type — render scenario/script pairs
    if (section.section_type === 'script') {
      return (
        <div className="space-y-3 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div key={i} className="rounded-xl border border-rose-500/20 bg-rose-500/5 overflow-hidden">
              <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  {item.scenario || `Scenario ${i + 1}`}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed italic text-slate-200">
                  {item.script}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Template type — render email templates with subject + body
    if (section.section_type === 'template') {
      return (
        <div className="space-y-4 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div key={i} className="rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
              <div className="px-4 py-3 bg-violet-500/10 border-b border-violet-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 block">
                  {item.purpose || `Template ${i + 1}`}
                </span>
                {item.subject && (
                  <p className="text-xs font-bold text-white">
                    Subject: {item.subject}
                  </p>
                )}
              </div>
              <div className="p-4">
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-slate-200">
                  {item.body}
                </pre>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Comparison type — render aspect/voice/chat_email three-way
    if (section.section_type === 'comparison') {
      return (
        <div className="space-y-3 mt-4">
          {section.examples.map((item: any, i: number) => (
            <div key={i} className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3">
                {item.aspect || `Aspect ${i + 1}`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.voice && (
                  <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                      🎤 Voice
                    </p>
                    <p className="text-xs text-slate-200">{item.voice}</p>
                  </div>
                )}
                {item.chat_email && (
                  <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                      💬 Chat / Email
                    </p>
                    <p className="text-xs text-slate-200">{item.chat_email}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default — generic object renderer
    return (
      <div className="space-y-3 mt-4">
        {section.examples.map((item: any, i: number) => (
          <div key={i} className="rounded-xl border border-slate-500/20 bg-slate-500/5 p-4">
            <div className="space-y-2">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 text-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-slate-200">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${themeClasses.card}`}>
      {/* Section header */}
      <div className="p-5 border-b border-slate-500/10">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 shrink-0 rounded-xl ${meta.bgColor} border ${meta.borderColor} flex items-center justify-center`}>
            <Icon name={meta.icon} className={`w-6 h-6 ${meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${meta.bgColor} ${meta.color} border ${meta.borderColor}`}>
                {meta.label}
              </span>
              <span className={`text-[10px] font-mono ${themeClasses.textMuted}`}>
                Section {index + 1}
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight">
              {section.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <p className={`text-sm leading-relaxed whitespace-pre-line ${themeClasses.textSecondary}`}>
          {section.content}
        </p>

        {renderExamples()}

        {/* Key Points */}
        {Array.isArray(section.key_points) && section.key_points.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-500/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
              <Icon name="sparkles" className="w-3.5 h-3.5" />
              Key Takeaways
            </h4>
            <ul className="space-y-2">
              {section.key_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span className={themeClasses.textMuted}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// LEARNING MODULE VIEW COMPONENT
// ============================================
function LearningModuleView({
  lessons,
  filteredLessons,
  lessonStats,
  lessonsLoading,
  lessonsError,
  lessonLevelFilter,
  setLessonLevelFilter,
  lessonSearchQuery,
  setLessonSearchQuery,
  lessonStatusFilter,
  setLessonStatusFilter,
  selectedLesson,
  setSelectedLessonId,
  completedLessonIds,
  toggleLessonCompleted,
  reloadLessons,
  themeClasses,
  selectedLessonIndex,
  Icon,
}: {
  lessons: Lesson[];
  filteredLessons: Lesson[];
  lessonStats: { byLevel: Record<string, { total: number; completed: number }>; totalCompleted: number; progressPct: number; total: number };
  lessonsLoading: boolean;
  lessonsError: string | null;
  lessonLevelFilter: 'all' | Lesson['level'];
  setLessonLevelFilter: (v: 'all' | Lesson['level']) => void;
  lessonSearchQuery: string;
  setLessonSearchQuery: (v: string) => void;
  lessonStatusFilter: 'all' | 'completed' | 'incomplete';
  setLessonStatusFilter: (v: 'all' | 'completed' | 'incomplete') => void;
  selectedLesson: Lesson | null;
  setSelectedLessonId: (id: string | null) => void;
  completedLessonIds: string[];
  toggleLessonCompleted: (id: string) => void;
  reloadLessons: () => void;
  themeClasses: any;
  selectedLessonIndex: number;
  Icon: any;
}) {
  // ⬇️ NEW: Tab state for switching between English Lessons and BPO Guide
  // ⬅️ NEW: 3 tabs
  const [learningTab, setLearningTab] = useState<'lessons' | 'topics' | 'bpo'>('lessons');

  const currentLevelMeta = selectedLesson ? getLessonLevelMeta(selectedLesson.level) : null;
  const isCurrentCompleted = selectedLesson ? completedLessonIds.includes(selectedLesson.id) : false;

  const handlePrev = () => {
    if (selectedLessonIndex > 0) {
      setSelectedLessonId(filteredLessons[selectedLessonIndex - 1].id);
    }
  };
  const handleNext = () => {
    if (selectedLessonIndex >= 0 && selectedLessonIndex < filteredLessons.length - 1) {
      setSelectedLessonId(filteredLessons[selectedLessonIndex + 1].id);
    }
  };

  // ============ LESSON READER ============
  
  if (selectedLesson && currentLevelMeta) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={`rounded-xl border p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm ${themeClasses.card}`}>
        <button
          onClick={() => setSelectedLessonId(null)}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 border ${themeClasses.border} ${themeClasses.cardHover}`}
        >
          <Icon name="arrow-left" className="w-4 h-4" />
          <span>Back to Lesson Library</span>
        </button>

        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={handlePrev}
            disabled={selectedLessonIndex <= 0}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed ${themeClasses.border} ${themeClasses.cardHover}`}
          >
            <Icon name="arrow-left" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <span className={`text-xs font-mono ${themeClasses.textMuted} px-2`}>
            {selectedLessonIndex + 1} / {filteredLessons.length}
          </span>
          <button
            onClick={handleNext}
            disabled={selectedLessonIndex >= filteredLessons.length - 1}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed ${themeClasses.border} ${themeClasses.cardHover}`}
          >
            <span className="hidden sm:inline">Next</span>
            <Icon name="chevron-right" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${themeClasses.card}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className={`w-14 h-14 shrink-0 rounded-xl ${currentLevelMeta.color} flex items-center justify-center text-white font-black text-xl`}>
              {selectedLesson.order_index}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${currentLevelMeta.borderColor} ${currentLevelMeta.bgColor}/10 ${currentLevelMeta.textColor}`}>
                  <span>{currentLevelMeta.emoji}</span>
                  {currentLevelMeta.label}
                </span>
                {isCurrentCompleted && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Icon name="check" className="w-3 h-3" />
                    Completed
                  </span>
                )}
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${themeClasses.textPrimary}`}>
                {selectedLesson.title}
              </h2>
              <p className={`text-xs mt-1 ${themeClasses.textMuted}`}>
                Lesson {selectedLesson.order_index} of {lessons.length} · {selectedLesson.content.length.toLocaleString()} characters
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleLessonCompleted(selectedLesson.id)}
            className={`shrink-0 px-5 py-3 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
              isCurrentCompleted
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Icon name="check" className="w-4 h-4" />
            <span>{isCurrentCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 sm:p-10 shadow-sm ${themeClasses.card}`}>
        <article className="max-w-3xl mx-auto">
          <div className="max-w-none">
            {selectedLesson.content.split('\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return <div key={idx} className="h-3" />;

              if (/^-{3,}$/.test(trimmed)) {
                return <hr key={idx} className={`my-6 ${themeClasses.border}`} />;
              }

              const isHeading =
                /^[A-Z0-9][A-Z0-9\s\-&':,]{5,}$/.test(trimmed) ||
                /^\d+\.\s+[A-Z]/.test(trimmed);

              if (isHeading) {
                return (
                  <h3
                    key={idx}
                    className={`text-lg sm:text-xl font-black mt-8 mb-3 tracking-tight ${themeClasses.textPrimary}`}
                  >
                    {trimmed}
                  </h3>
                );
              }

              if (/^[•\-*]\s/.test(trimmed)) {
                return (
                  <div key={idx} className="flex items-start gap-3 ml-2 my-2">
                    <span className={`mt-2 w-1.5 h-1.5 rounded-full ${currentLevelMeta.color} shrink-0`} />
                    <p className={`flex-1 text-sm sm:text-base leading-relaxed ${themeClasses.textSecondary}`}>
                      {trimmed.replace(/^[•\-*]\s/, '')}
                    </p>
                  </div>
                );
              }

              return (
                <p
                  key={idx}
                  className={`text-sm sm:text-base leading-relaxed my-3 ${themeClasses.textSecondary}`}
                >
                  {trimmed}
                </p>
              );
            })}
          </div>
        </article>

        <PronunciationPracticePanel
          content={selectedLesson.content}
          themeClasses={themeClasses}
          Icon={Icon}
        />
      </div>

      <div className={`rounded-xl border p-4 flex items-center justify-between gap-3 shadow-sm ${themeClasses.card}`}>
        <button
          onClick={handlePrev}
          disabled={selectedLessonIndex <= 0}
          className={`flex-1 sm:flex-none px-5 py-3 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed ${themeClasses.border} ${themeClasses.cardHover}`}
        >
          <Icon name="arrow-left" className="w-4 h-4" />
          <span>Previous Lesson</span>
        </button>

        <button
          onClick={() => toggleLessonCompleted(selectedLesson.id)}
          className={`hidden sm:flex px-5 py-3 rounded-lg font-bold text-xs transition-all cursor-pointer items-center gap-2 ${
            isCurrentCompleted
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-indigo-600 text-white'
          }`}
        >
          <Icon name="check" className="w-4 h-4" />
          <span>{isCurrentCompleted ? 'Completed' : 'Mark Complete'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={selectedLessonIndex >= filteredLessons.length - 1}
          className={`flex-1 sm:flex-none px-5 py-3 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed ${themeClasses.border} ${themeClasses.cardHover}`}
        >
          <span>Next Lesson</span>
          <Icon name="chevron-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

  // ============ LESSON LIBRARY ============
  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Tab Switcher — now with 3 tabs */}
      <div className={`rounded-2xl border p-2 flex flex-wrap gap-2 ${themeClasses.card}`}>
        <button
          onClick={() => setLearningTab('lessons')}
          className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            learningTab === 'lessons'
              ? 'bg-indigo-600 text-white shadow-sm'
              : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
          }`}
        >
          <Icon name="book" className="w-4 h-4" />
          <span>English Lessons</span>
        </button>
        <button
          onClick={() => setLearningTab('topics')}
          className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            learningTab === 'topics'
              ? 'bg-indigo-600 text-white shadow-sm'
              : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
          }`}
        >
          <Icon name="graduation-cap" className="w-4 h-4" />
          <span>Career Topics</span>
        </button>
        <button
          onClick={() => setLearningTab('bpo')}
          className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            learningTab === 'bpo'
              ? 'bg-indigo-600 text-white shadow-sm'
              : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
          }`}
        >
          <Icon name="academic" className="w-4 h-4" />
          <span>BPO Industry Guide</span>
        </button>
      </div>

      {/* ⬇️⬇️⬇️ CONDITIONAL RENDER: BPO MODULE OR LESSON LIBRARY ⬇️⬇️⬇️ */}
      {learningTab === 'bpo' ? (
        <BPOIndustryModule themeClasses={themeClasses} Icon={Icon} />
      ) : learningTab === 'topics' ? (
        <LearningTopicsView themeClasses={themeClasses} Icon={Icon} />) : 
        (
        <>
          {/* ============================================
              ORIGINAL LESSON LIBRARY CONTENT
              ============================================ */}

          <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${themeClasses.card}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${themeClasses.accentSoft}`}>
                  <Icon name="book" className="w-3.5 h-3.5" />
                  Self-Paced Learning Library
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Master English, <span className="text-indigo-400">Step by Step</span>
                </h1>
                <p className={`text-sm sm:text-base leading-relaxed ${themeClasses.textMuted}`}>
                  Study grammar, phonics, conditionals, academic writing, and advanced discourse at your own pace. Track your progress as you complete each lesson.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-4">
                <div className="relative w-28 h-28">
                  <svg className="transform -rotate-90 w-28 h-28">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-500/20" />
                    <circle
                      cx="56" cy="56" r="48"
                      stroke="#6366f1" strokeWidth="8" fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - lessonStats.progressPct / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{lessonStats.progressPct}%</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                      Complete
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Progress</p>
                  <p className="text-2xl font-black">{lessonStats.totalCompleted} / {lessonStats.total}</p>
                  <p className={`text-[11px] ${themeClasses.textMuted}`}>lessons completed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(['beginner', 'intermediate', 'upper_intermediate', 'advanced'] as Lesson['level'][]).map((level) => {
              const meta = LESSON_LEVEL_META[level];
              const stats = lessonStats.byLevel[level];
              const isActive = lessonLevelFilter === level;
              const levelPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              return (
                <button
                  key={level}
                  onClick={() => setLessonLevelFilter(isActive ? 'all' : level)}
                  className={`rounded-xl border-2 p-4 text-left transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                    isActive
                      ? `${meta.borderColor} ${meta.bgColor}/10`
                      : `border-slate-500/20 ${themeClasses.card}`
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-lg ${meta.color} flex items-center justify-center`}>
                        <span className="text-base">{meta.emoji}</span>
                      </div>
                      {isActive && (
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${meta.textColor}`}>
                          Filtering
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${meta.textColor} mb-1`}>
                        {meta.label}
                      </p>
                      <p className="text-2xl font-black">{stats.total}</p>
                      <p className={`text-[10px] ${themeClasses.textMuted}`}>
                        {stats.completed} completed · {levelPct}%
                      </p>
                    </div>
                    <div className="h-1.5 bg-slate-500/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${meta.color} rounded-full transition-all duration-700`}
                        style={{ width: `${levelPct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className={`rounded-xl border p-4 shadow-sm ${themeClasses.card}`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="chart" className={`w-4 h-4 ${themeClasses.textMuted}`} />
                </div>
                <input
                  type="text"
                  value={lessonSearchQuery}
                  onChange={(e) => setLessonSearchQuery(e.target.value)}
                  placeholder="Search lessons by title or content..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.border}`}
                />
              </div>

              <div className={`flex items-center gap-1 p-1 rounded-lg border ${themeClasses.border}`}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'incomplete', label: 'To Do' },
                  { key: 'completed', label: 'Done' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setLessonStatusFilter(opt.key as any)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      lessonStatusFilter === opt.key
                        ? 'bg-indigo-600 text-white'
                        : `${themeClasses.textMuted}`
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                onClick={reloadLessons}
                disabled={lessonsLoading}
                className={`px-4 py-3 rounded-lg text-xs font-bold transition cursor-pointer border flex items-center justify-center gap-2 disabled:opacity-50 ${themeClasses.border} ${themeClasses.cardHover}`}
              >
                <Icon name="refresh" className={`w-3.5 h-3.5 ${lessonsLoading ? 'animate-spin' : ''}`} />
                <span>{lessonsLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>

            {(lessonLevelFilter !== 'all' || lessonSearchQuery || lessonStatusFilter !== 'all') && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                  Active filters:
                </span>
                {lessonLevelFilter !== 'all' && (
                  <button
                    onClick={() => setLessonLevelFilter('all')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${themeClasses.accentSoft} cursor-pointer`}
                  >
                    {LESSON_LEVEL_META[lessonLevelFilter].emoji} {LESSON_LEVEL_META[lessonLevelFilter].label}
                    <Icon name="x" className="w-3 h-3" />
                  </button>
                )}
                {lessonStatusFilter !== 'all' && (
                  <button
                    onClick={() => setLessonStatusFilter('all')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${themeClasses.accentSoft} cursor-pointer`}
                  >
                    Status: {lessonStatusFilter}
                    <Icon name="x" className="w-3 h-3" />
                  </button>
                )}
                <span className={`text-[10px] font-mono ml-auto ${themeClasses.textMuted}`}>
                  {filteredLessons.length} lesson{filteredLessons.length === 1 ? '' : 's'} shown
                </span>
              </div>
            )}
          </div>

          {lessonsError && (
            <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 flex items-start gap-4">
              <Icon name="alert-circle" className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-rose-400">Couldn't load lessons</p>
                <p className={`text-xs mt-1 ${themeClasses.textMuted}`}>{lessonsError}</p>
              </div>
            </div>
          )}

          {lessonsLoading ? (
            <div className={`rounded-2xl border p-16 text-center ${themeClasses.card}`}>
              <div className="inline-flex items-center gap-3 text-indigo-400">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-bold text-sm uppercase tracking-widest">Loading Lessons...</span>
              </div>
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className={`rounded-2xl border p-16 text-center ${themeClasses.card}`}>
              <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${themeClasses.accentSoft}`}>
                <Icon name="book" className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold">
                {lessons.length === 0 ? 'No lessons available yet' : 'No matching lessons'}
              </h3>
              <p className={`text-sm mt-2 ${themeClasses.textMuted}`}>
                {lessons.length === 0
                  ? 'Lessons will appear here once they are published to the database.'
                  : 'Try adjusting your filters or search query.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLessons.map((lesson) => {
                const meta = getLessonLevelMeta(lesson.level);
                const isCompleted = completedLessonIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`group rounded-xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${themeClasses.card} ${themeClasses.cardHover}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-11 h-11 rounded-lg ${meta.color} flex items-center justify-center text-white font-black text-base`}>
                          {lesson.order_index}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${meta.borderColor} ${meta.bgColor}/10 ${meta.textColor}`}>
                            {meta.emoji} {meta.label}
                          </span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <Icon name="check" className="w-2.5 h-2.5" />
                              Done
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base font-bold leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
                          {lesson.title}
                        </h3>
                        <p className={`text-xs leading-relaxed line-clamp-3 ${themeClasses.textMuted}`}>
                          {lesson.content.substring(0, 160).replace(/\n/g, ' ')}...
                        </p>
                      </div>

                      <div className={`flex items-center justify-between pt-3 border-t ${themeClasses.border}`}>
                        <span className={`text-[10px] font-mono ${themeClasses.textMuted}`}>
                          {lesson.content.length.toLocaleString()} chars
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                          Read lesson
                          <Icon name="chevron-right" className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </button>
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
// FLAT THEME CONFIGURATION
// ============================================
type ThemeMode = 'light' | 'dark' | 'midnight' | 'cyber' | 'emerald';

const themeConfigs: Record<ThemeMode, {
  name: string;
  bg: string;
  bgPattern: string;
  header: string;
  sidebar: string;
  card: string;
  cardHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  accentGlow: string;
  accentSoft: string;
  gradient: string;
}> = {
  light: {
    name: 'Clinical Light',
    bg: 'bg-slate-50',
    bgPattern: '',
    header: 'bg-white border-slate-200',
    sidebar: 'bg-white border-slate-200',
    card: 'bg-white border-slate-200',
    cardHover: 'hover:bg-slate-50 hover:border-indigo-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    border: 'border-slate-200',
    accent: 'text-indigo-600',
    accentGlow: '',
    accentSoft: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    gradient: 'bg-indigo-600',
  },
  dark: {
    name: 'Professional Dark',
    bg: 'bg-slate-950',
    bgPattern: '',
    header: 'bg-slate-900 border-slate-800',
    sidebar: 'bg-slate-900 border-slate-800',
    card: 'bg-slate-900 border-slate-800',
    cardHover: 'hover:bg-slate-800 hover:border-slate-700',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-200',
    textMuted: 'text-slate-400',
    border: 'border-slate-800',
    accent: 'text-indigo-400',
    accentGlow: '',
    accentSoft: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    gradient: 'bg-indigo-600',
  },
  midnight: {
    name: 'Deep Ocean',
    bg: 'bg-slate-950',
    bgPattern: '',
    header: 'bg-slate-900 border-slate-800',
    sidebar: 'bg-slate-900 border-slate-800',
    card: 'bg-slate-900 border-slate-800',
    cardHover: 'hover:bg-slate-800 hover:border-slate-700',
    textPrimary: 'text-blue-50',
    textSecondary: 'text-blue-100',
    textMuted: 'text-blue-300/70',
    border: 'border-slate-800',
    accent: 'text-cyan-400',
    accentGlow: '',
    accentSoft: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    gradient: 'bg-blue-600',
  },
  cyber: {
    name: 'Matrix Emerald',
    bg: 'bg-slate-950',
    bgPattern: '',
    header: 'bg-slate-900 border-slate-800',
    sidebar: 'bg-slate-900 border-slate-800',
    card: 'bg-slate-900 border-slate-800',
    cardHover: 'hover:bg-slate-800 hover:border-slate-700',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-100',
    textMuted: 'text-emerald-300/70',
    border: 'border-slate-800',
    accent: 'text-emerald-400',
    accentGlow: '',
    accentSoft: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    gradient: 'bg-emerald-600',
  },
  emerald: {
    name: 'Matrix Emerald',
    bg: 'bg-slate-950',
    bgPattern: '',
    header: 'bg-slate-900 border-slate-800',
    sidebar: 'bg-slate-900 border-slate-800',
    card: 'bg-slate-900 border-slate-800',
    cardHover: 'hover:bg-slate-800 hover:border-slate-700',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-100',
    textMuted: 'text-emerald-300/70',
    border: 'border-slate-800',
    accent: 'text-emerald-400',
    accentGlow: '',
    accentSoft: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    gradient: 'bg-emerald-600',
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Home() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const [appMode, setAppMode] = useState<'dashboard' | 'full_exam'>('dashboard');
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'support' | ModuleType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [examStepIndex, setExamStepIndex] = useState(0); 
  const examSequence: ModuleType[] = ['listening', 'reading', 'writing', 'speaking', 'typing'];

  const [examScores, setExamScores] = useState<Record<ModuleType, number>>({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    typing: 0,
    learning: 0,
  });

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [writingSubPrompts, setWritingSubPrompts] = useState<string[]>([]);
  const [writingSubIndex, setWritingSubIndex] = useState(0);
  const [writingDrafts, setWritingDrafts] = useState<string[]>([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const [hasAudioEnded, setHasAudioEnded] = useState(false);
  const [listeningTimer, setListeningTimer] = useState<number>(60);
  const [isListeningTimerActive, setIsListeningTimerActive] = useState(false);

  const [typingPassage, setTypingPassage] = useState<string>(DEFAULT_TYPING_PASSAGES[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTypingCompleted, setIsTypingCompleted] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const typingInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [writingPrompt, setWritingPrompt] = useState<string>('');
  const [speakingPrompts, setSpeakingPrompts] = useState<string[]>([FALLBACK_SPEAKING_PROMPTS_POOL[0]]);
  const [usedSpeakingPrompts, setUsedSpeakingPrompts] = useState<string[]>([]);
  const [writingText, setWritingText] = useState<string>('');
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  const [writingEvaluationDetails, setWritingEvaluationDetails] = useState<WritingEvaluationDetails | null>(null);

  const [usedListeningIds, setUsedListeningIds] = useState<string[]>([]);
  const [usedReadingIds, setUsedReadingIds] = useState<string[]>([]);
  const [usedWritingPrompts, setUsedWritingPrompts] = useState<string[]>([]);

  const [userScores, setUserScores] = useState<any[]>([]);
  const [userCertificates, setUserCertificates] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [generatedCertificateCode, setGeneratedCertificateCode] = useState<string>('TEPHDYTECH-BPO-2026-9412');

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userFeedback, setUserFeedback] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [antiCheatViolations, setAntiCheatViolations] = useState(0);
  const [showIntegrityWarning, setShowIntegrityWarning] = useState(false);
  const [integrityWarning, setIntegrityWarning] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ============================================
  // LEARNING MODULE STATE
  // ============================================
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [lessonLevelFilter, setLessonLevelFilter] = useState<'all' | Lesson['level']>('all');
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [lessonStatusFilter, setLessonStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const themeClasses = themeConfigs[theme];

  const isTimedEvaluationActive =
    (appMode === 'full_exam' && examStepIndex >= 0 && examStepIndex < 5) ||
    (selectedModule === 'listening' && isListeningTimerActive && !isSubmitted) ||
    (selectedModule === 'typing' && !!startTime && !isTypingCompleted);

  const registerIntegrityViolation = (message: string) => {
    setAntiCheatViolations((prev) => prev + 1);
    setIntegrityWarning(message);
    setShowIntegrityWarning(true);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsMobileMenuOpen(false);
      setShowLogoutModal(false);
      setIsLoggingOut(false);
      localStorage.removeItem('cally_user_email');
      localStorage.removeItem('cally_user_name');
      localStorage.removeItem('cally_user_id');
      setUserId(null);
      setUserName('');
      setEmail('');
      setPassword('');
    }, 600);
  };

  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('technical');
  const [newTicketPriority, setNewTicketPriority] = useState('medium');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error) setUserTickets(data || []);
    };
    fetchTickets();
  }, [userId, activeTab]);

  const handleOpenTicketDetails = async (ticket: any) => {
    setSelectedTicket(ticket);
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true });

    if (!error) setTicketMessages(data || []);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newTicketSubject.trim() || !newTicketMessage.trim()) return;

    setIsCreatingTicket(true);
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            user_id: userId,
            subject: newTicketSubject.trim(),
            category: newTicketCategory,
            priority: newTicketPriority,
            status: 'open',
          },
        ])
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { error: msgError } = await supabase        .from('ticket_messages')
        .insert([
          {
            ticket_id: ticketData.id,
            user_id: userId,
            message: newTicketMessage.trim(),
            is_admin: false,
          },
        ]);

      if (msgError) throw msgError;

      setUserTickets(prev => [ticketData, ...prev]);
      setNewTicketSubject('');
      setNewTicketMessage('');
      setShowNewTicketModal(false);
      alert('Support ticket submitted successfully!');
    } catch (err: any) {
      console.error('Error creating ticket:', err.message);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim() || !userId) return;

    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            user_id: userId,
            message: replyMessage.trim(),
            is_admin: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTicketMessages(prev => [...prev, data]);
      setReplyMessage('');
    } catch (err: any) {
      console.error('Error sending reply:', err.message);
    }
  };

  const requestExamFullscreen = async () => {
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request was denied:', err);
      registerIntegrityViolation('Fullscreen mode is required for the official timed assessment.');
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmittingRating(true);
    try {
      const { error } = await supabase
        .from('system_ratings')
        .insert([
          {
            user_id: userId,
            rating: userRating,
            feedback: userFeedback.trim(),
          },
        ]);

      if (error) throw error;

      setRatingSubmitted(true);
      setTimeout(() => {
        setShowRatingModal(false);
        setRatingSubmitted(false);
        setUserFeedback('');
        setUserRating(5);
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting rating:', err.message);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  useEffect(() => {
    if (appMode === 'full_exam' && examStepIndex === 5) {
      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [appMode, examStepIndex]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cally_ui_theme') as ThemeMode;
    if (savedTheme && themeConfigs[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('cally_ui_theme', newTheme);
    setShowThemeMenu(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isTimedEvaluationActive) {
      setShowIntegrityWarning(false);
      setIntegrityWarning('');
      setAntiCheatViolations(0);
      if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      return;
    }

    const onVisibilityChange = () => {
      if (document.hidden) registerIntegrityViolation('Tab switching or leaving the assessment window is not allowed during the official exam.');
    };
    const onFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) registerIntegrityViolation('Fullscreen mode was exited. Return to fullscreen to continue the timed assessment.');
    };
    const blockClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      registerIntegrityViolation('Copy, cut, and paste are disabled during the official assessment.');
    };
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(key)) {
        e.preventDefault();
        registerIntegrityViolation('Clipboard and select-all shortcuts are disabled during the official assessment.');
      }
      if (key === 'f11') {
        e.preventDefault();
        registerIntegrityViolation('Please remain in fullscreen mode during the official assessment.');
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('copy', blockClipboard);
    document.addEventListener('cut', blockClipboard);
    document.addEventListener('paste', blockClipboard);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockShortcuts, true);

    requestExamFullscreen();

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('copy', blockClipboard);
      document.removeEventListener('cut', blockClipboard);
      document.removeEventListener('paste', blockClipboard);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockShortcuts, true);
    };
  }, [isTimedEvaluationActive]);

  const refreshUserStats = async () => {
    if (!userId) return;
    setLoadingStats(true);
    setStatsError(null);

    let firstError: string | null = null;

    const { data: scoresData, error: scoresError } = await supabase
      .from('module_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (scoresError) {
      console.error('Error fetching scores:', scoresError.message);
      firstError = scoresError.message;
    } else {
      setUserScores(scoresData || []);
    }

    const { data: certsData, error: certsError } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (certsError) {
      console.error('Error fetching certificates:', certsError.message);
      firstError = firstError || certsError.message;
    } else {
      setUserCertificates(certsData || []);
    }

    if (firstError) setStatsError(firstError);
    setLoadingStats(false);
  };

  useEffect(() => {
    refreshUserStats();
  }, [userId]);

  // ============================================
  // CHECK ADMIN STATUS
  // ============================================
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error checking admin status:', error.message);
          setIsAdmin(false);
          return;
        }
        setIsAdmin(!!data?.is_admin);
      } catch (err) {
        console.error('Admin check failed:', err);
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [userId]);

  // ============================================
  // LOAD LESSONS FROM SUPABASE
  // ============================================
  const loadLessons = async () => {
    setLessonsLoading(true);
    setLessonsError(null);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons((data as Lesson[]) || []);
    } catch (err: any) {
      console.error('Error loading lessons:', err.message);
      setLessonsError(err.message || 'Failed to load lessons');
    } finally {
      setLessonsLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  // ============================================
  // LOAD LESSON PROGRESS FROM SUPABASE (per user)
  // ============================================
  const loadLessonProgress = async () => {
    if (!userId) {
      setCompletedLessonIds([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', userId);

      if (error) throw error;
      setCompletedLessonIds((data || []).map((row: any) => row.lesson_id));
    } catch (err: any) {
      console.error('Error loading lesson progress:', err.message);
      setCompletedLessonIds([]);
    }
  };

  useEffect(() => {
    loadLessonProgress();
  }, [userId]);

  // ============================================
  // TOGGLE LESSON COMPLETION (syncs to Supabase)
  // ============================================
  const toggleLessonCompleted = async (lessonId: string) => {
    if (!userId) {
      alert('Please sign in to save your lesson progress across devices.');
      return;
    }

    const isCurrentlyCompleted = completedLessonIds.includes(lessonId);

    setCompletedLessonIds(prev =>
      isCurrentlyCompleted
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );

    try {
      if (isCurrentlyCompleted) {
        const { error } = await supabase
          .from('lesson_progress')
          .delete()
          .eq('user_id', userId)
          .eq('lesson_id', lessonId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lesson_progress')
          .insert([{ user_id: userId, lesson_id: lessonId }]);
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Error syncing lesson progress:', err.message);
      setCompletedLessonIds(prev =>
        isCurrentlyCompleted
          ? [...prev, lessonId]
          : prev.filter(id => id !== lessonId)
      );
      alert('Failed to save progress. Please check your connection and try again.');
    }
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const matchesLevel = lessonLevelFilter === 'all' || lesson.level === lessonLevelFilter;
      const matchesSearch =
        lessonSearchQuery.trim() === '' ||
        lesson.title.toLowerCase().includes(lessonSearchQuery.toLowerCase()) ||
        lesson.content.toLowerCase().includes(lessonSearchQuery.toLowerCase());
      const isCompleted = completedLessonIds.includes(lesson.id);
      const matchesStatus =
        lessonStatusFilter === 'all' ||
        (lessonStatusFilter === 'completed' && isCompleted) ||
        (lessonStatusFilter === 'incomplete' && !isCompleted);
      return matchesLevel && matchesSearch && matchesStatus;
    });
  }, [lessons, lessonLevelFilter, lessonSearchQuery, lessonStatusFilter, completedLessonIds]);

  const lessonStats = useMemo(() => {
    const byLevel: Record<string, { total: number; completed: number }> = {
      beginner: { total: 0, completed: 0 },
      intermediate: { total: 0, completed: 0 },
      upper_intermediate: { total: 0, completed: 0 },
      advanced: { total: 0, completed: 0 },
    };
    lessons.forEach(l => {
      if (byLevel[l.level]) {
        byLevel[l.level].total++;
        if (completedLessonIds.includes(l.id)) byLevel[l.level].completed++;
      }
    });
    const totalCompleted = completedLessonIds.filter(id =>
      lessons.some(l => l.id === id)
    ).length;
    const progressPct = lessons.length > 0 ? Math.round((totalCompleted / lessons.length) * 100) : 0;
    return { byLevel, totalCompleted, progressPct, total: lessons.length };
  }, [lessons, completedLessonIds]);

  const selectedLesson = useMemo(() => {
    if (!selectedLessonId) return null;
    return lessons.find(l => l.id === selectedLessonId) || null;
  }, [selectedLessonId, lessons]);

  const selectedLessonIndex = useMemo(() => {
    if (!selectedLesson) return -1;
    return filteredLessons.findIndex(l => l.id === selectedLesson.id);
  }, [selectedLesson, filteredLessons]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('cally_user_email');
    const savedName = localStorage.getItem('cally_user_name');
    const savedId = localStorage.getItem('cally_user_id');

    if (savedEmail && savedId) {
      setEmail(savedEmail);
      setUserName(savedName || '');
      setUserId(savedId);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const googleEmail = session.user.email;
        const googleName = session.user.user_metadata?.full_name || googleEmail?.split('@')[0];

        const { data, error } = await supabase
          .from('users')
          .upsert(
            { email: googleEmail, name: googleName },
            { onConflict: 'email' }
          )
          .select('id, name, email, is_admin');

        if (error) {
          console.error('Error syncing user to database:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const row = data[0] as any;
          setUserId(row.id);
          setUserName(googleName);
          setEmail(googleEmail || '');
          setIsAdmin(!!row.is_admin);
          setIsLoggedIn(true);
        }
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isTypingCompleted) {
      interval = setInterval(() => {
        const now = Date.now();
        const durationInSeconds = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(durationInSeconds);

        if (durationInSeconds > 0) {
          const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
          const currentWpm = Math.round((wordsTyped / durationInSeconds) * 60);
          setWpm(currentWpm);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isTypingCompleted, userInput]);

  // ============================================
  // SUBMISSION HANDLERS (declared BEFORE the timer useEffect)
  // ============================================
  const handleSubmitListening = () => {
    if (isSubmitted) return;
    setIsListeningTimerActive(false);
    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      const correctAnswer = q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      if (userAnswer === correctAnswer) totalCorrect += 1;
    });

    const finalPct = Math.round((totalCorrect / testData.questions.length) * 100);
    handleScoreFinalized(finalPct);
  };

  const handleSubmitReading = () => {
    if (isSubmitted) return;
    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      const correctAnswer = q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      if (userAnswer === correctAnswer) totalCorrect += 1;
    });

    const finalPct = Math.round((totalCorrect / testData.questions.length) * 100);
    handleScoreFinalized(finalPct);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedModule === 'listening' && isListeningTimerActive && listeningTimer > 0 && !isSubmitted) {
      timer = setInterval(() => setListeningTimer((prev) => prev - 1), 1000);
    } else if (selectedModule === 'listening' && isListeningTimerActive && listeningTimer === 0 && !isSubmitted) {
      handleSubmitListening();
      setIsListeningTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [selectedModule, isListeningTimerActive, listeningTimer, isSubmitted]);

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [testData?.id]);

  const resetListeningState = () => {
    setHasAudioStarted(false);
    setHasAudioEnded(false);
    setListeningTimer(60);
    setIsListeningTimerActive(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const totalQuestions = testData?.questions?.length ?? 0;

  const handleSelectAnswer = (questionId: string, value: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const allQuestionsAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    if (isSignUpMode && !hasAcceptedTerms) {
      setAuthError('You must read and agree to the Privacy Policy and Terms of Service to create an account.');
      return;
    }

    if (isSignUpMode && password.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    setAuthError('');
    const derivedName = email.split('@')[0];
    const finalName = userName.trim() || derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    setUserName(finalName);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // ============================================
      // SIGN UP FLOW
      // ============================================
      if (isSignUpMode) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (existingUser) {
          setAuthError('An account with this email already exists. Please sign in.');
          return;
        }

        // Hash the password before storing
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
          .from('users')
          .insert([{
            email: normalizedEmail,
            name: finalName,
            password_hash: passwordHash,
          }])
          .select()
          .single();

        if (error) {
          console.error('Sign up error:', error.message);
          setAuthError('Failed to create account. Please try again.');
          return;
        }

        if (data) {
          setUserId(data.id);
          localStorage.setItem('cally_user_email', normalizedEmail);
          localStorage.setItem('cally_user_name', finalName);
          localStorage.setItem('cally_user_id', data.id);
          setHasAcceptedTerms(false);
          setIsLoggedIn(true);
        }
        return;
      }

      // ============================================
      // SIGN IN FLOW
      // ============================================
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, password_hash')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error) {
        console.error('Login lookup error:', error.message);
        setAuthError('An error occurred during sign in. Please try again.');
        return;
      }

      if (!user) {
        setAuthError('Invalid email or password.');
        return;
      }

      if (!user.password_hash) {
        setAuthError(
          'This account was created before password authentication was enabled. Please sign up again with a new password or use Google sign in.'
        );
        return;
      }

      const passwordMatches = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatches) {
        setAuthError('Invalid email or password.');
        return;
      }

      setUserId(user.id);
      setUserName(user.name || finalName);
      localStorage.setItem('cally_user_email', user.email);
      localStorage.setItem('cally_user_name', user.name || finalName);
      localStorage.setItem('cally_user_id', user.id);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Unexpected auth error:', err);
      setAuthError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    // Block Google signup if the user hasn't accepted Terms & Privacy
    if (isSignUpMode && !hasAcceptedTerms) {
      setAuthError('Please read and agree to the Terms of Service and Privacy Policy before continuing with Google signup.');
      return;
    }

    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
      setAuthError('Failed to sign in with Google.');
    }
  };

  const handleSelectSidebarTab = (tab: 'overview' | 'logs' | 'support' | ModuleType) => {
    setActiveTab(tab as any);
    setIsMobileMenuOpen(false);
    if (tab === 'overview' || tab === 'logs' || tab === 'support') {
      setAppMode('dashboard');
      setSelectedModule(null);
      setTestData(null);
      setIsSubmitted(false);
      setScore(null);
      setShowScorePopup(false);
      setShowInstructionsModal(false);
      setSelectedAnswers({});
      setWritingEvaluationDetails(null);
      setCurrentQuestionIndex(0);
      setWritingSubIndex(0);
      setWritingDrafts([]);
      setWritingSubPrompts([]);
      setSelectedLessonId(null);
      resetListeningState();
    } else {
      handleStartDashboardModule(tab);
      if (tab === 'learning') {
        loadLessonProgress();
      }
    }
  };

  const handleStartDashboardModule = (mod: ModuleType) => {
    setAppMode('dashboard');
    setActiveTab(mod);
    setSelectedModule(mod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    setCurrentQuestionIndex(0);
    setWritingSubIndex(0);
    setWritingDrafts([]);
    setWritingSubPrompts([]);
    resetListeningState();
    setShowInstructionsModal(true);

    if (mod === 'typing') {
      const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
      setTypingPassage(targetPassage);
      setUserInput('');
      setStartTime(null);
      setElapsedSeconds(0);
      setIsTypingCompleted(false);
      setWpm(0);
      setAccuracy(100);
    } else if (mod === 'learning') {
      setSelectedLessonId(null);
      loadLessonProgress();
    } else if (
      mod === 'writing' ||
      mod === 'speaking' ||
      mod === 'reading' ||
      mod === 'listening'
    ) {
      generateTest(mod as 'writing' | 'speaking' | 'reading' | 'listening');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFullExam = () => {
    setAntiCheatViolations(0);
    setShowIntegrityWarning(false);
    setIntegrityWarning('');
    setAppMode('full_exam');
    setExamStepIndex(0);
    const firstMod = examSequence[0];
    setSelectedModule(firstMod);
    setActiveTab(firstMod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    setCurrentQuestionIndex(0);
    setWritingSubIndex(0);
    setWritingDrafts([]);
    setWritingSubPrompts([]);
    resetListeningState();
    setShowInstructionsModal(true);
    generateTest(firstMod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setIsMobileMenuOpen(false);
    setAppMode('dashboard');
    setSelectedModule(null);
    setActiveTab('overview');
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setShowInstructionsModal(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    setCurrentQuestionIndex(0);
    setWritingSubIndex(0);
    setWritingDrafts([]);
    setWritingSubPrompts([]);
    setSelectedLessonId(null);
    resetListeningState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================
  // GENERATE TEST (SUPABASE + FALLBACK)
  // ============================================
  const generateTest = async (moduleType: ModuleType) => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    setCurrentQuestionIndex(0);
    resetListeningState();

    if (moduleType === 'learning') {
      setLoading(false);
      return;
    }

    if (moduleType === 'typing') {
      const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
      setTypingPassage(targetPassage);
      setUserInput('');
      setStartTime(null);
      setElapsedSeconds(0);
      setIsTypingCompleted(false);
      setWpm(0);
      setAccuracy(100);
      setLoading(false);
      return;
    }

    if (moduleType === 'writing') {
      const availableWriting = FALLBACK_WRITING_PROMPTS_POOL.filter(p => !usedWritingPrompts.includes(p));
      const targetPool = availableWriting.length > 0 ? availableWriting : FALLBACK_WRITING_PROMPTS_POOL;
      const selectedPrompt = targetPool[Math.floor(Math.random() * targetPool.length)];

      if (availableWriting.length > 0) {
        setUsedWritingPrompts(prev => [...prev, selectedPrompt]);
      } else {
        setUsedWritingPrompts([selectedPrompt]);
      }

      setWritingPrompt(selectedPrompt);

      const singlePrompt = `Write a professional customer response addressing the following scenario. Include a proper greeting, a clear body with the resolution or relevant details, and a professional closing.\n\nScenario: ${selectedPrompt}`;
      setWritingSubPrompts([singlePrompt]);
      setWritingSubIndex(0);
      setWritingDrafts(['']);
      setWritingText('');
      setLoading(false);
      return;
    }

    if (moduleType === 'speaking') {
      const availableSpeaking = FALLBACK_SPEAKING_PROMPTS_POOL.filter(
        (prompt) => !usedSpeakingPrompts.includes(prompt)
      );
      const targetPool =
        availableSpeaking.length > 0
          ? availableSpeaking
          : FALLBACK_SPEAKING_PROMPTS_POOL;

      const selectedPrompt =
        targetPool[Math.floor(Math.random() * targetPool.length)];

      setSpeakingPrompts([selectedPrompt]);

      if (availableSpeaking.length > 0) {
        setUsedSpeakingPrompts((prev) => [...prev, selectedPrompt]);
      } else {
        setUsedSpeakingPrompts([selectedPrompt]);
      }

      setLoading(false);
      return;
    }

    if (moduleType === 'reading' || moduleType === 'listening') {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('module_id', moduleType);

        if (error || !data || data.length === 0) {
          throw new Error(error?.message || 'No questions returned from Supabase');
        }

        const groupedMap = new Map<string, TestData>();
        data.forEach((row: any) => {
          if (!groupedMap.has(row.test_title)) {
            groupedMap.set(row.test_title, {
              id: row.test_title,
              title: row.test_title,
              passage: row.passage || undefined,
              audioScript: row.audio_script || undefined,
              questions: [],
            });
          }

          groupedMap.get(row.test_title)!.questions.push({
            id: row.id.toString(),
            question: row.question_text,
            options: row.options || [],
            correctAnswer: row.correct_answer,
          });
        });

        const testsArray = Array.from(groupedMap.values());
        const selectedItem = testsArray[Math.floor(Math.random() * testsArray.length)];

        setTestData(selectedItem);
        setCurrentQuestionIndex(0);
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to static local data:', err);
        
        const fallbackSource = moduleType === 'reading' ? FALLBACK_READING_QUESTIONS : FALLBACK_LISTENING_QUESTIONS;
        const selectedItem = fallbackSource[Math.floor(Math.random() * fallbackSource.length)];
        setTestData(selectedItem);
        setCurrentQuestionIndex(0);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(false);
  };

  const handleAdvanceExamStep = async (moduleScore: number) => {
    const currentMod = examSequence[examStepIndex];
    const updatedScores = { ...examScores, [currentMod]: moduleScore };
    setExamScores(updatedScores);

    const nextIndex = examStepIndex + 1;
    if (nextIndex < examSequence.length) {
      setExamStepIndex(nextIndex);
      const nextMod = examSequence[nextIndex];
      setSelectedModule(nextMod);
      setActiveTab(nextMod);
      setIsSubmitted(false);
      setScore(null);
      setShowScorePopup(false);
      setSelectedAnswers({});
      setWritingEvaluationDetails(null);
      setCurrentQuestionIndex(0);
      setWritingSubIndex(0);
      setWritingDrafts([]);
      setWritingSubPrompts([]);
      resetListeningState();

      if (nextMod === 'typing') {
        const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
        setTypingPassage(targetPassage);
        setUserInput('');
        setStartTime(null);
        setElapsedSeconds(0);
        setIsTypingCompleted(false);
        setWpm(0);
        setAccuracy(100);
      } else {
        generateTest(nextMod);
      }
    } else {
      setExamStepIndex(5);
      try {
        const finalAvg = Math.round(Object.values(updatedScores).reduce((a, b) => a + b, 0) / 5);
        if (finalAvg >= 80) {
        const res = await fetch('/api/generate/save-exam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: userName || email.split('@')[0] || 'Candidate',
            examScores: updatedScores,
            overallScore: finalAvg,
          }),
        });
        const data = await res.json();
        if (data.success && data.certificateCode) {
          setGeneratedCertificateCode(data.certificateCode);
        }
        }
      } catch (err) {
        console.error('Failed to save exam session via API:', err);
      }
    }
  };

  const triggerConfetti = () => {
    try {
      (window as any).confetti?.({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      console.error('Confetti error:', e);
    }
  };

  const handleScoreFinalized = async (
    finalPct: number,
    extraData?: { wpm?: number; accuracy?: number }
  ) => {
    setScore(finalPct);
    setIsSubmitted(true);
    setShowScorePopup(true);

    if (userId && selectedModule) {
      // Build the insert payload
      const insertPayload: any = {
        user_id: userId,
        module_name: selectedModule,
        score: finalPct,
        created_at: new Date().toISOString(),
      };

      // ⬇️ NEW: Save typing-specific metrics when available
      if (selectedModule === 'typing' && extraData) {
        if (typeof extraData.wpm === 'number') insertPayload.wpm = extraData.wpm;
        if (typeof extraData.accuracy === 'number') insertPayload.accuracy = extraData.accuracy;
      }

      const { data, error } = await supabase
        .from('module_scores')
        .insert([insertPayload])
        .select();
      
      if (error) {
        console.error('Error saving module score:', error.message);
      } else if (data && data.length > 0) {
        setUserScores(prev => [data[0], ...prev.filter((item) => item.id !== data[0].id)]);
      }
      await refreshUserStats();
    }

    if (finalPct > 70) {
      triggerConfetti();
    } else {
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setMotivationalQuote(randomQuote);
    }

    if (appMode === 'full_exam') {
      setTimeout(() => {
        setShowScorePopup(false);
        handleAdvanceExamStep(finalPct);
      }, 4000);
    }
  };

  const handleSubmitWriting = () => {
    if (!writingText.trim()) return;
    setIsEvaluatingWriting(true);
    setWritingEvaluationDetails(null);

    setTimeout(() => {
      const wordCount = writingText.trim().split(/\s+/).length;

      let grammarScore = 88;
      let vocabularyScore = 90;
      let coherenceScore = 85;
      let taskAchievement = 92;

      const grammarNotes: WritingNote[] = [];
      const sentences = writingText
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);
      const sentenceCount = sentences.length || 1;
      const avgSentenceLength = wordCount / sentenceCount;

      if (wordCount < 50) {
        grammarScore -= 15;
        grammarNotes.push({
          type: 'warning',
          message: 'Your response is quite short. Aim for at least 150 words for a full task response.',
        });
      } else if (wordCount < 150) {
        grammarScore -= 5;
        grammarNotes.push({
          type: 'info',
          message: `You wrote ${wordCount} words. Try to expand to 150+ words for a complete response.`,
        });
      } else if (wordCount >= 150 && wordCount <= 300) {
        grammarScore += 5;
        grammarNotes.push({
          type: 'success',
          message: `Excellent word count (${wordCount} words) — well within the ideal range.`,
        });
      } else {
        grammarNotes.push({
          type: 'info',
          message: `You wrote ${wordCount} words. Consider being more concise if the task has a limit.`,
        });
      }

      if (avgSentenceLength > 30) {
        grammarScore -= 8;
        grammarNotes.push({
          type: 'warning',
          message: 'Some sentences are very long. Consider splitting them for better readability.',
        });
      } else if (avgSentenceLength >= 12 && avgSentenceLength <= 22) {
        grammarScore += 4;
        grammarNotes.push({
          type: 'success',
          message: 'Your sentence lengths are varied and readable.',
        });
      }

      if (/[,]{2,}|\.{2,}|!{2,}/.test(writingText)) {
        grammarScore -= 5;
        grammarNotes.push({
          type: 'warning',
          message: 'Avoid repeated punctuation (e.g., "!!" or "...") in formal writing.',
        });
      }

      const uncapitalized = sentences.filter((s) =>
        /^[a-z]/.test(s.trim())
      ).length;
      if (uncapitalized > 0) {
        grammarScore -= uncapitalized * 2;
        grammarNotes.push({
          type: 'warning',
          message: `${uncapitalized} sentence(s) don't start with a capital letter.`,
        });
      } else if (sentences.length > 0) {
        grammarNotes.push({
          type: 'success',
          message: 'All sentences begin with proper capitalization.',
        });
      }

      const words = writingText.toLowerCase().match(/\b[a-z']+\b/g) || [];
      const uniqueWords = new Set(words);
      const lexicalDiversity = words.length
        ? uniqueWords.size / words.length
        : 0;

      if (lexicalDiversity > 0.6) {
        vocabularyScore += 6;
        grammarNotes.push({
          type: 'success',
          message: 'Great lexical variety — you use a rich range of vocabulary.',
        });
      } else if (lexicalDiversity < 0.35) {
        vocabularyScore -= 10;
        grammarNotes.push({
          type: 'warning',
          message: 'Vocabulary is repetitive. Try using more synonyms and varied expressions.',
        });
      }

      const advancedWords = words.filter((w) => w.length > 7).length;
      if (advancedWords / Math.max(words.length, 1) > 0.15) {
        vocabularyScore += 5;
      } else if (advancedWords / Math.max(words.length, 1) < 0.05) {
        vocabularyScore -= 5;
        grammarNotes.push({
          type: 'info',
          message: 'Consider incorporating more sophisticated or topic-specific vocabulary.',
        });
      }

      const linkingWords = [
        'however', 'moreover', 'furthermore', 'therefore', 'thus',
        'consequently', 'in addition', 'on the other hand', 'for example',
        'for instance', 'in conclusion', 'firstly', 'secondly', 'finally',
        'meanwhile', 'nevertheless',
      ];
      const lowerText = writingText.toLowerCase();
      const linkingCount = linkingWords.reduce(
        (acc, word) => acc + (lowerText.split(word).length - 1),
        0
      );

      if (linkingCount >= 4) {
        coherenceScore += 8;
        grammarNotes.push({
          type: 'success',
          message: 'Strong use of linking words to connect your ideas.',
        });
      } else if (linkingCount >= 1) {
        coherenceScore += 3;
        grammarNotes.push({
          type: 'info',
          message: 'Some cohesive devices used. Add more transitions to improve flow.',
        });
      } else {
        coherenceScore -= 10;
        grammarNotes.push({
          type: 'warning',
          message: 'No linking words detected. Use transitions like "however" or "therefore".',
        });
      }

      const paragraphs = writingText
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0);
      if (paragraphs.length >= 3) {
        coherenceScore += 5;
        grammarNotes.push({
          type: 'success',
          message: `Well-structured with ${paragraphs.length} paragraphs.`,
        });
      } else if (paragraphs.length === 1 && wordCount > 120) {
        coherenceScore -= 8;
        grammarNotes.push({
          type: 'warning',
          message: 'Consider breaking your text into multiple paragraphs for clarity.',
        });
      }

      if (wordCount < 50) {
        taskAchievement -= 25;
      } else if (wordCount < 100) {
        taskAchievement -= 12;
      } else if (wordCount >= 150) {
        taskAchievement += 5;
      }

      if (linkingCount >= 3 && paragraphs.length >= 2) {
        taskAchievement += 3;
      }

      const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
      grammarScore = clamp(grammarScore);
      vocabularyScore = clamp(vocabularyScore);
      coherenceScore = clamp(coherenceScore);
      taskAchievement = clamp(taskAchievement);

      const overallScore = clamp(
        (grammarScore + vocabularyScore + coherenceScore + taskAchievement) / 4
      );

      let feedbackSummary = '';
      if (overallScore >= 90) {
        feedbackSummary = 'Outstanding work! Your writing demonstrates strong grammar, rich vocabulary, and clear organization.';
      } else if (overallScore >= 75) {
        feedbackSummary = 'Good job! Your writing is clear and well-structured, with a few areas that could be polished further.';
      } else if (overallScore >= 60) {
        feedbackSummary = 'Decent effort. Focus on expanding your vocabulary, varying sentence structure, and improving coherence.';
      } else {
        feedbackSummary = 'Keep practicing! Work on length, grammar, and organizing your ideas into clear paragraphs with linking words.';
      }

      setWritingEvaluationDetails({
        overallScore,
        grammarScore,
        vocabularyScore,
        coherenceScore,
        taskAchievementScore: taskAchievement,
        grammarNotes,
        feedbackSummary,
      });

      setIsEvaluatingWriting(false);
      handleScoreFinalized(overallScore);
    }, 800);
  };

  const handleSpeakingComplete = (scoreVal: number) => {
    const finalScore = (scoreVal === 5 || scoreVal === 80) ? 0 : scoreVal;
    handleScoreFinalized(finalScore);
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const val = e.target.value;
  if (isTypingCompleted) return;
  if (!startTime) setStartTime(Date.now());
  setUserInput(val);

  let correctChars = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i] === typingPassage[i]) correctChars++;
  }
  const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
  setAccuracy(acc);

  if (val.length >= typingPassage.length) {
    setIsTypingCompleted(true);
    const duration = Math.max((Date.now() - (startTime || Date.now())) / 60000, 0.05);
    const words = val.trim().split(/\s+/).length;
    const finalWpm = Math.round(words / duration);
    setWpm(finalWpm);

    const typingScore = Math.min(Math.max(finalWpm * 1.2, 50), 100);
    const finalRounded = Math.round(typingScore);
    handleScoreFinalized(finalRounded, { wpm: finalWpm, accuracy: acc });
  }
};

  const overallExamAverage = Math.round(
    Object.values(examScores).reduce((a, b) => a + b, 0) / 5
  );
  const certificateEligible = overallExamAverage >= 80;

  const handleRetakeAssessment = () => {
    setExamScores({ listening: 0, reading: 0, writing: 0, speaking: 0, typing: 0, learning: 0 });
    setAntiCheatViolations(0);
    setShowIntegrityWarning(false);
    setGeneratedCertificateCode('');
    setAppMode('dashboard');
    setExamStepIndex(0);
    setSelectedModule(null);
    setActiveTab('overview');
    setSelectedAnswers({});
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setShowInstructionsModal(false);
    setWritingEvaluationDetails(null);
    setCurrentQuestionIndex(0);
    setWritingSubIndex(0);
    setWritingDrafts([]);
    setWritingSubPrompts([]);
    setTypingPassage(DEFAULT_TYPING_PASSAGES[0]);
    setUserInput('');
    setWpm(0);
    setAccuracy(100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    const element = document.getElementById('certificate-to-download');
    if (!element) {
      setIsDownloadingPdf(false);
      return;
    }

    try {
      if (!(window as any).html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      window.scrollTo(0, 0);

      const opt = {
        margin: 0,
        filename: `TephdyTech_Certificate_${(userName || 'Candidate').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };

      await (window as any).html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const dashboardFeatures = [
    {
      id: 'learning' as ModuleType,
      title: 'Learning & Lessons',
      description: 'Study grammar, phonics, conditionals, and academic writing at your own pace.',
      tag: 'Learning',
      icon: 'book',
      color: 'bg-indigo-600',
      instructions: "1. Browse lessons by level (Beginner → Advanced).\n2. Click any lesson to read its full content.\n3. Mark lessons as complete to track your progress.",
    },
    {
      id: 'listening' as ModuleType,
      title: 'Listening & Dictation',
      description: 'Single-play audio drills with dictation inputs and auto-evaluations.',
      tag: 'Listening',
      icon: 'headphones',
      color: 'bg-rose-600',
      instructions: "1. Click 'Play Audio' (plays ONCE).\n2. Answer each question one by one before the 1-minute timer expires.",
    },
    {
      id: 'reading' as ModuleType,
      title: 'Sentence Completion & Grammar',
      description: 'Practice SVAR vocabulary fill-in-the-blanks and grammar rules.',
      tag: 'Reading',
      icon: 'book',
      color: 'bg-amber-600',
      instructions: "1. Review reading passage.\n2. Answer each multiple-choice question one at a time.",
    },
    {
      id: 'writing' as ModuleType,
      title: 'Customer Email & Chat Writing',
      description: 'Draft professional customer responses and emails.',
      tag: 'Writing',
      icon: 'pencil',
      color: 'bg-violet-600',
      instructions: "1. Read the scenario prompt carefully.\n2. Write a complete professional response in the text area.\n3. Click 'Submit Writing Assessment' when ready.",
    },
    {
      id: 'speaking' as ModuleType,
      title: 'Repeat & Retell AI',
      description: 'Record verbatim sentence repetition & prompt replies.',
      tag: 'Speaking',
      icon: 'mic',
      color: 'bg-emerald-600',
      instructions: "1. Read prompt.\n2. Record audio via microphone and analyze.",
    },
    {
      id: 'typing' as ModuleType,
      title: 'Chat & Typing Speed Test',
      description: 'Train net WPM and accuracy for BPO candidate screening.',
      tag: 'Typing',
      icon: 'keyboard',
      color: 'bg-sky-600',
      instructions: "1. Type the displayed passage accurately to complete the module.",
    },
  ];

  const activeFeature = dashboardFeatures.find((f) => f.id === selectedModule);

  const getWritingScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-400';
    if (s >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getWritingBarColor = (s: number) => {
    if (s >= 85) return 'bg-emerald-500';
    if (s >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getWritingNoteStyles = (type: WritingNoteType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'info':
      default:
        return 'bg-violet-500/10 border-violet-500/30 text-violet-400';
    }
  };

  const getWritingNoteIcon = (type: WritingNoteType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  // ============================================
  // RENDER: LOGIN PAGE
  // ============================================
  if (!isLoggedIn) {
    return (
      <>
        {/* Mobile Login */}
        <div className="lg:hidden min-h-screen flex flex-col bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="relative w-20 h-20 mb-6">
              <Image src="/logo.png" alt="TephdyTech Logo" fill priority className="object-contain" />
            </div>
            
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
              <Icon name="sparkles" className="w-3.5 h-3.5" />
              Official BPO Readiness & Certification Portal
            </span>
            
            <h1 className="mt-6 text-3xl font-black tracking-tight leading-tight">
              Master Your Skills.<br />
              <span className="text-indigo-400">
                Validate Your Career.
              </span>
            </h1>
            
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Practice professional BPO simulations, track your progress, and earn a verifiable competency certificate.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
              {dashboardFeatures.slice(0, 4).map((feat) => (
                <div key={feat.id} className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left shadow-sm">
                  <div className={`w-8 h-8 rounded-lg ${feat.color} flex items-center justify-center`}>
                    <Icon name={feat.icon} className="w-4 h-4 text-white" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-white">{feat.tag}</p>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => { setAuthError(''); setShowAuthModal(true); }}
              className="mt-8 w-full max-w-sm py-4 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="academic" className="w-5 h-5" />
              Sign In / Sign Up
            </button>
            
            <p className="mt-4 text-[11px] text-slate-500">
              By continuing, you agree to our{' '}
              <button type="button" onClick={() => setShowTermsModal(true)} className="text-indigo-400 underline hover:text-indigo-300 font-semibold">
                Terms
              </button>
              {' '}&amp;{' '}
              <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-indigo-400 underline hover:text-indigo-300 font-semibold">
                Privacy Policy
              </button>
            </p>
          </div>
          
          <div className="relative z-10 px-6 pb-6 text-center text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} TephdyTech &bull; All rights reserved.
          </div>
        </div>

        {/* Desktop Login */}
        <div className="hidden lg:grid h-screen w-screen overflow-hidden grid-cols-12 bg-slate-950">
          <div className="col-span-6 h-full overflow-y-auto bg-slate-900 text-white p-16 flex flex-col justify-between relative border-r border-slate-800">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0">
                  <Image src="/logo.png" alt="TephdyTech Logo" fill priority className="object-contain" />
                </div>
                <span className="font-black text-2xl tracking-tight">Cally Assessment Hub</span>
              </div>
              
              <div className="space-y-5 max-w-lg pt-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/30">
                  <Icon name="sparkles" className="w-3.5 h-3.5" />
                  Official BPO Readiness & Certification Portal
                </span>
                <h1 className="text-5xl font-black tracking-tight leading-tight">
                  Master Your Skills. <br />
                  <span className="text-indigo-400">
                    Validate Your Career.
                  </span>
                </h1>
                <p className="text-slate-300 text-base leading-relaxed">
                  Take professional simulation exams, track your historical improvement logs, and earn verifiable BPO competency certificates instantly.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4 pt-10">
              {dashboardFeatures.map((feat) => (
                <div key={feat.id} className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-2 hover:border-indigo-500/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${feat.color} flex items-center justify-center`}>
                    <Icon name={feat.icon} className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xs font-bold">{feat.title}</h4>
                </div>
              ))}
              <div className="p-4 bg-indigo-950/50 border border-indigo-500/30 rounded-xl space-y-2 flex flex-col justify-center items-center text-center">
                <Icon name="academic" className="w-8 h-8 text-indigo-300" />
                <span className="text-xs font-bold text-indigo-300">Certified PDF</span>
              </div>
            </div>

            <div className="relative z-10 pt-8 text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Developed by TephdyTech &bull; All rights reserved.
            </div>
          </div>

          <div className="col-span-6 h-full overflow-y-auto flex items-center justify-center p-12 bg-slate-950 relative">
            <div className="relative w-full max-w-md rounded-2xl p-10 shadow-2xl border border-slate-700 bg-slate-900 space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black tracking-tight text-white">
                  {isSignUpMode ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-sm text-slate-400">
                  {isSignUpMode ? 'Sign up to begin your assessment journey' : 'Sign in to track your scores and certificates'}
                </p>
              </div>

              <div className="grid grid-cols-2 p-1.5 bg-slate-800 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setIsSignUpMode(false); setAuthError(''); }}
                  className={`py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    !isSignUpMode 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUpMode(true); setAuthError(''); }}
                  className={`py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isSignUpMode 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authError && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {isSignUpMode && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                  <input
                    type="password"
                    required
                    minLength={isSignUpMode ? 8 : undefined}
                    autoComplete={isSignUpMode ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  {isSignUpMode && (
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Minimum 8 characters. Use a mix of letters, numbers, and symbols.
                    </p>
                  )}
                </div>

                {isSignUpMode && (
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                        aria-checked={hasAcceptedTerms}
                        role="checkbox"
                        className={`relative shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-all flex items-center justify-center ${
                          hasAcceptedTerms
                            ? 'bg-indigo-600 border-indigo-500'
                            : 'bg-transparent border-slate-500/50 hover:border-indigo-400/60'
                        }`}
                      >
                        {hasAcceptedTerms && (
                          <Icon name="check" className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <label
                        onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                        className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none"
                      >
                        I have read and agree to the{' '}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
                          className="text-indigo-400 underline hover:text-indigo-300 font-semibold"
                        >
                          Terms of Service
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowPrivacyModal(true); }}
                          className="text-indigo-400 underline hover:text-indigo-300 font-semibold"
                        >
                          Privacy Policy
                        </button>
                        . I consent to the collection, processing, and storage of my data as described.
                      </label>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pl-8">
                      <span className="flex items-center gap-1">
                        <Icon name="shield" className="w-3 h-3 text-emerald-400" />
                        GDPR Compliant
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="lock" className="w-3 h-3 text-cyan-400" />
                        256-bit Encrypted
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSignUpMode && !hasAcceptedTerms}
                  className={`w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSignUpMode ? 'Create Account & Start' : 'Sign In to Dashboard'}
                </button>
              </form>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="px-3 text-xs font-bold uppercase tracking-widest text-slate-500">Or</span>
                <div className="flex-grow border-t border-slate-700"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isSignUpMode && !hasAcceptedTerms}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800 py-4 font-bold text-sm text-white transition-colors duration-200 hover:bg-slate-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={isSignUpMode && !hasAcceptedTerms ? 'Please accept the Terms of Service and Privacy Policy first' : 'Continue with Google'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.87z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.14C3.18 21.38 7.26 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.2C.43 8.19 0 9.95 0 12s.43 3.81 1.2 5.38l4.07-3.14z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.26 0 3.18 2.62 1.2 6.62l4.07 3.14c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="text-center text-[10px] text-slate-500 leading-relaxed">
                By signing in or creating an account, you acknowledge that you have read and understood our{' '}
                <button type="button" onClick={() => setShowTermsModal(true)} className="text-indigo-400 underline hover:text-indigo-300">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-indigo-400 underline hover:text-indigo-300">
                  Privacy Policy
                </button>
                .
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Auth Modal */}
        <div className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity ${showAuthModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!showAuthModal}>
          <button type="button" aria-label="Close login dialog" onClick={() => setShowAuthModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8 bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Account Access</span>
                <h2 className="text-2xl font-black text-white">{isSignUpMode ? 'Create Your Account' : 'Welcome Back'}</h2>
              </div>
              <button type="button" onClick={() => setShowAuthModal(false)} className="w-10 h-10 rounded-lg flex items-center justify-center transition text-slate-400 hover:text-white hover:bg-slate-800">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 p-1.5 bg-slate-800 rounded-xl text-xs font-bold mb-6">
              <button type="button" onClick={() => { setIsSignUpMode(false); setAuthError(''); }} className={`py-3 rounded-lg transition ${!isSignUpMode ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Sign In</button>
              <button type="button" onClick={() => { setIsSignUpMode(true); setAuthError(''); }} className={`py-3 rounded-lg transition ${isSignUpMode ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Create Account</button>
            </div>
            
            {authError && <div className="mb-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 text-center">{authError}</div>}
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUpMode && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder="Enter your full name" className="mt-1.5 w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="candidate@example.com" className="mt-1.5 w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                <input
                  type="password"
                  required
                  minLength={isSignUpMode ? 8 : undefined}
                  autoComplete={isSignUpMode ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {isSignUpMode && (
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                      aria-checked={hasAcceptedTerms}
                      role="checkbox"
                      className={`relative shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-all flex items-center justify-center ${
                        hasAcceptedTerms
                          ? 'bg-indigo-600 border-indigo-500'
                          : 'bg-transparent border-slate-500/50 hover:border-indigo-400/60'
                      }`}
                    >
                      {hasAcceptedTerms && (
                        <Icon name="check" className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <label
                      onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                      className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none"
                    >
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
                        className="text-indigo-400 underline hover:text-indigo-300 font-semibold"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowPrivacyModal(true); }}
                        className="text-indigo-400 underline hover:text-indigo-300 font-semibold"
                      >
                        Privacy Policy
                      </button>
                      .
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSignUpMode && !hasAcceptedTerms}
                className="w-full py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSignUpMode ? 'Create Account & Start' : 'Sign In to Dashboard'}
              </button>
            </form>
            
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-700"/>
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Or</span>
              <div className="flex-1 border-t border-slate-700"/>
            </div>
            
            <button
              onClick={handleGoogleLogin}
              disabled={isSignUpMode && !hasAcceptedTerms}
              className="w-full py-4 rounded-lg border border-slate-700 bg-slate-800 text-white font-bold text-sm transition hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              title={isSignUpMode && !hasAcceptedTerms ? 'Please accept the Terms of Service and Privacy Policy first' : 'Continue with Google'}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.87z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.14C3.18 21.38 7.26 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.2C.43 8.19 0 9.95 0 12s.43 3.81 1.2 5.38l4.07-3.14z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.26 0 3.18 2.62 1.2 6.62l4.07 3.14c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="mt-4 text-center text-[10px] text-slate-500 leading-relaxed">
              By continuing, you acknowledge our{' '}
              <button type="button" onClick={() => setShowTermsModal(true)} className="text-indigo-400 underline">
                Terms
              </button>
              {' '}&amp;{' '}
              <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-indigo-400 underline">
                Privacy Policy
              </button>
              .
            </div>
          </div>
        </div>

        {/* Legal Modals */}
        <LegalModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          title="Privacy Policy"
        >
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-slate-400 text-xs italic">
                Effective Date: September 15, 2026 · Last Updated: September 16, 2026
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                This Privacy Policy explains how <strong className="text-slate-100">TephdyTech</strong> ("TephdyTech," "we," "us," or "our") collects, uses, discloses, retains, and protects personal information through the <strong className="text-slate-100">Cally Assessment Hub</strong> platform (the "Service"). It is designed to comply with the <strong className="text-slate-100">General Data Protection Regulation (GDPR)</strong>, the <strong className="text-slate-100">California Consumer Privacy Act as amended by the California Privacy Rights Act (CCPA/CPRA)</strong>, the <strong className="text-slate-100">California Online Privacy Protection Act (CalOPPA)</strong>, and other applicable data protection laws. Please read this Policy carefully.
              </p>
            </div>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
                Who We Are (Data Controller)
              </h4>
              <p>
                <strong className="text-slate-200">Data Controller:</strong> TephdyTech. — Contact Details.
              </p>
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-1 font-mono text-xs">
                <p className="text-slate-300">📧 tephdytech@gmail.com</p>
              </div>
              <p className="text-slate-400 text-xs">
                Where applicable, TephdyTech has designated an EU representative under Article 27 GDPR. Contact details are available upon request via dpo@tephdytech.com. This Policy applies to all personal information collected through the Service, including website, mobile applications, assessment modules, and support channels.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
                Personal Information We Collect
              </h4>
              <p className="font-semibold text-slate-200">We collect the following categories of personal information:</p>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Information You Provide</p>
                  <ul className="space-y-2 pl-4 text-sm">
                    <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Account Information:</strong> Full name, email address, hashed password, and profile details.</span></li>
                    <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Assessment Data:</strong> Test responses, scores, module attempts, completion times, and proficiency ratings.</span></li>
                    <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Audio Recordings:</strong> Voice samples recorded during Speaking assessments, used solely for AI-based evaluation and deleted after processing.</span></li>
                    <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Support Communications:</strong> Ticket subject, message content, category, and priority.</span></li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Information Collected Automatically</p>
                  <ul className="space-y-2 pl-4 text-sm">
                    <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Technical Data:</strong> IP address, browser type, device identifiers, operating system, and session integrity logs.</span></li>
                    <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Usage Data:</strong> Pages visited, features used, time spent, and click patterns.</span></li>
                    <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Location Data:</strong> General geographic location derived from IP address.</span></li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Sensitive Personal Information (CPRA)</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Under the CPRA, the following are classified as <strong className="text-slate-100">sensitive personal information</strong> and receive heightened protections: <strong className="text-slate-100">Audio Recordings</strong> (voice samples for AI evaluation) and <strong className="text-slate-100">Account Login Credentials</strong>. We collect sensitive personal information only for the specific purposes disclosed in Section 3 and do not use it beyond those purposes.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">3</span>
                Purposes and Legal Bases for Processing
              </h4>

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">GDPR Legal Bases (Article 6)</p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Account Creation & Management:</strong> Performance of a contract.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Assessment Delivery & Scoring:</strong> Performance of a contract.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Audio Evaluation (Speaking Module):</strong> Explicit consent, obtained before recording.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Service Improvement & Analytics:</strong> Legitimate interests, balanced against your rights.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Legal Compliance:</strong> Legal obligation.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Marketing Communications:</strong> Consent.</span></li>
              </ul>

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 pt-2">CCPA/CPRA Business Purposes</p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Service Delivery:</strong> To provide, operate, and maintain the assessment and certification platform.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Assessment Evaluation:</strong> To process and score your module responses using AI and rule-based engines.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Authentication & Security:</strong> To verify identity, prevent fraud, and protect against unauthorized access.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Customer Support:</strong> To respond to inquiries and manage support tickets.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Service Improvement:</strong> To analyze usage patterns and enhance functionality.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Legal Compliance:</strong> To comply with applicable laws and legal processes.</span></li>
              </ul>

              <p className="text-xs text-slate-400 pt-2">
                We do not use your personal information for automated decision-making or profiling that produces legal or similarly significant effects without your explicit consent and appropriate safeguards.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">4</span>
                How We Share and Disclose Personal Information
              </h4>

              <p className="text-sm">We may disclose personal information to the following categories of third parties:</p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Service Providers / Processors:</strong> Cloud hosting, database management, analytics, email delivery.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">AI Evaluation Providers:</strong> Speech evaluation and writing assessment.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Payment Processors:</strong> (If applicable) for premium services.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Legal & Regulatory Authorities:</strong> As required by law.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Professional Advisors:</strong> Legal, audit, and insurance purposes.</span></li>
              </ul>

              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <p className="text-sm font-bold text-emerald-400">We do not sell your personal information.</p>
                <p className="text-sm font-bold text-emerald-400">We do not share your personal information for cross-context behavioral advertising.</p>
                <p className="text-xs text-slate-400">
                  Under the CPRA, "sharing" means disclosing personal information to a third party for cross-context behavioral advertising, whether for monetary or other valuable consideration. TephdyTech does not engage in such sharing.
                </p>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 pt-2">CCPA/CPRA Disclosure — Past 12 Months</p>
              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="w-full text-xs">
                  <thead className="bg-slate-800">
                    <tr className="text-slate-300">
                      <th className="text-left p-2 font-bold">Category of PI</th>
                      <th className="text-left p-2 font-bold">Sold?</th>
                      <th className="text-left p-2 font-bold">Shared?</th>
                      <th className="text-left p-2 font-bold">Disclosed?</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    <tr className="border-t border-slate-700"><td className="p-2">Identifiers</td><td className="p-2">No</td><td className="p-2">No</td><td className="p-2">Yes</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Personal Records</td><td className="p-2">No</td><td className="p-2">No</td><td className="p-2">Yes</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Audio Recordings</td><td className="p-2">No</td><td className="p-2">No</td><td className="p-2">Yes</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Internet Activity</td><td className="p-2">No</td><td className="p-2">No</td><td className="p-2">Yes</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Sensitive PI</td><td className="p-2">No</td><td className="p-2">No</td><td className="p-2">Yes (limited)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">5</span>
                International Data Transfers
              </h4>
              <p>
                Your personal information may be transferred to, stored, and processed in countries outside your country of residence, including the <strong className="text-slate-200">United States</strong> and the <strong className="text-slate-200">Philippines</strong>.
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 pt-1">GDPR Transfer Safeguards (Chapter V)</p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Standard Contractual Clauses (SCCs)</strong> approved by the European Commission.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Adequacy Decisions</strong> where applicable.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Additional technical and organizational measures</strong> to ensure an essentially equivalent level of protection.</span></li>
              </ul>
              <p className="text-xs text-slate-400">
                Where personal information of Philippine citizens or residents is processed, we comply with <strong className="text-slate-300">Republic Act No. 10173</strong> (Data Privacy Act of 2012) and its Implementing Rules and Regulations.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">6</span>
                Data Retention
              </h4>
              <p className="text-sm">We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law.</p>
              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="w-full text-xs">
                  <thead className="bg-slate-800">
                    <tr className="text-slate-300">
                      <th className="text-left p-2 font-bold">Category</th>
                      <th className="text-left p-2 font-bold">Retention Period</th>
                      <th className="text-left p-2 font-bold">Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    <tr className="border-t border-slate-700"><td className="p-2">Account Information</td><td className="p-2">Account + 3 years</td><td className="p-2">Legal compliance</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Assessment Data</td><td className="p-2">Account + 5 years</td><td className="p-2">Certification verification</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Audio Recordings</td><td className="p-2">30 days post-eval</td><td className="p-2">Purpose fulfilled after scoring</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Support Tickets</td><td className="p-2">3 years post-resolution</td><td className="p-2">Customer service records</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Server Logs</td><td className="p-2">90 days</td><td className="p-2">Security monitoring</td></tr>
                    <tr className="border-t border-slate-700"><td className="p-2">Analytics Data</td><td className="p-2">26 months</td><td className="p-2">Service improvement</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">7</span>
                Your Rights
              </h4>

              <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">GDPR Rights (EEA/UK Data Subjects)</p>
                <ul className="space-y-1 pl-4 text-sm">
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Right to be Informed — Know how we collect and use your data.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Right of Access — Obtain a copy of your personal data.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Right to Rectification — Correct inaccurate or incomplete data.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Right to Erasure — Request deletion of your data.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Right to Restrict Processing — Limit how we use your data.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Right to Data Portability — Receive your data in a machine-readable format.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Right to Object — Object to processing based on legitimate interests.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Rights related to Automated Decision-Making.</span></li>
                </ul>
                <p className="text-xs text-slate-400 pt-1">
                  Contact <span className="font-mono text-indigo-300">dpo@tephdytech.com</span>. We will respond within <strong className="text-slate-300">one month</strong>, extendable by two months for complex requests. You may withdraw consent at any time and lodge a complaint with your local Data Protection Authority.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">CCPA/CPRA Rights (California Residents)</p>
                <ul className="space-y-1 pl-4 text-sm">
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Right to Know</strong> — Categories and specific pieces of PI collected.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Right to Delete</strong> — Request deletion of personal information.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Right to Correct</strong> — Request correction of inaccurate PI.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Right to Opt Out of Sale/Sharing</strong> — Not applicable; we do not sell or share.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Right to Limit Use of Sensitive PI.</strong></span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Right to Non-Discrimination</strong> — We will not discriminate for exercising your rights.</span></li>
                </ul>
                <p className="text-xs text-slate-400 pt-1">
                  Submit requests via your account settings or <span className="font-mono text-indigo-300">privacy@tephdytech.com</span>. We respond within <strong className="text-slate-300">45 days</strong>, extendable by an additional 45 days with notice. Authorized agents may submit requests with written permission. We honor <strong className="text-slate-300">Global Privacy Control (GPC)</strong> signals.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">CalOPPA Disclosures (California)</p>
                <ul className="space-y-1 pl-4 text-sm">
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Do Not Track (DNT):</strong> We do not currently honor browser DNT signals. Use GPC or contact us to opt out of tracking.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Third-Party Tracking:</strong> Analytics providers may collect data across sites; we do not authorize use for unrelated purposes.</span></li>
                  <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Review & Amendment:</strong> You may review, update, or delete your PI via your account or by contacting us.</span></li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Philippine DPA Rights</p>
                <p className="text-sm">
                  Under the Data Privacy Act of 2012, data subjects have rights including: right to be informed, right to object, right to access, right to rectification, right to erasure or blocking, right to damages, right to data portability, and the right to lodge a complaint with the <strong className="text-slate-200">National Privacy Commission (NPC)</strong>.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">8</span>
                Security Measures
              </h4>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Access Controls:</strong> Role-based limitations and authentication requirements.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Pseudonymization:</strong> Personal identifiers separated from assessment data where feasible.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Regular Audits:</strong> Security assessments and vulnerability testing.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Employee Training:</strong> Privacy and security training for all personnel.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Incident Response:</strong> Documented procedures for detecting and responding to breaches.</span></li>
              </ul>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Data Breach Notification:</strong> In the event of a personal data breach posing a risk to your rights and freedoms, we will notify affected data subjects and relevant supervisory authorities within <strong className="text-slate-300">72 hours</strong> as required by applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">9</span>
                Children's Privacy
              </h4>
              <p>
                The Service is not intended for individuals under the age of <strong className="text-slate-200">16</strong> (or <strong className="text-slate-200">13</strong> where applicable under COPPA). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately at <span className="font-mono text-indigo-300">tephdytech@gmail.com</span>.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">10</span>
                Changes to This Privacy Policy
              </h4>
              <p>
                We may update this Policy to reflect changes in our practices, technology, legal requirements, or other factors.
              </p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Material Changes:</strong> We will notify you via email or prominent notice at least <strong className="text-slate-200">30 days</strong> before changes take effect.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Non-Material Changes:</strong> We will update the "Last Updated" date and post the revised Policy.</span></li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">11</span>
                Contact Us
              </h4>
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-2 font-mono text-xs">
                <p className="text-slate-300">📧 tephdytech@gmail.com — General Privacy Inquiries</p>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">12</span>
                Additional Jurisdiction-Specific Disclosures
              </h4>
              <p className="text-sm">
                <strong className="text-slate-200">California "Shine the Light" Law:</strong> California residents may request information about our disclosure of personal information to third parties for direct marketing purposes. We do not disclose personal information to third parties for their direct marketing purposes.
              </p>
              <p className="text-sm">
                <strong className="text-slate-200">Notice at Collection (CCPA/CPRA):</strong> At or before the point of collection, we provide notice of categories of PI collected, purposes, whether PI is sold or shared, and retention periods. This Policy serves as our Notice at Collection.
              </p>
            </section>

            <div className="pt-4 border-t border-indigo-500/20">
              <p className="text-slate-300 text-sm leading-relaxed text-center font-semibold">
                By using the Cally Assessment Hub, you acknowledge that you have read and understood this Privacy Policy and consent to the practices described herein, to the extent consent is the applicable legal basis.
              </p>
            </div>
          </div>
        </LegalModal>

        <LegalModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          title="Terms of Service"
        >
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-slate-400 text-xs italic">
                Effective Date: September 15, 2026 · Last Updated: September 16, 2026
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and <strong className="text-slate-100">TephdyTech</strong> ("TephdyTech," "we," "us," or "our") governing your access to and use of the <strong className="text-slate-100">Cally Assessment Hub</strong> platform, including its website, mobile applications, assessment modules, and related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. <strong className="text-slate-100">If you do not agree with any part of these Terms, you must not use the Service.</strong>
              </p>
            </div>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
                Acceptance of Terms
              </h4>
              <p>
                By registering for an account, accessing, or using the Service, you represent and warrant that:
              </p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>You are at least <strong className="text-slate-200">16 years of age</strong> (or 13 where permitted under applicable local law and with parental consent);</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>You have the legal capacity to enter into a binding agreement;</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>You will comply with these Terms and all applicable laws and regulations; and</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>All information you provide is accurate, current, and complete.</span></li>
              </ul>
              <p className="text-xs text-slate-400">
                If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
                Description of the Service
              </h4>
              <p>
                The Cally Assessment Hub is a professional BPO readiness and certification platform that provides:
              </p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Practice modules in Listening, Reading, Writing, Speaking, Typing, and Learning;</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>AI-assisted and rule-based scoring of assessment responses;</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Performance tracking and historical improvement logs;</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>A full examination pathway leading to a verifiable Certificate of Achievement; and</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Support ticketing and user account management.</span></li>
              </ul>
              <p className="text-xs text-slate-400">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice, subject to applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">3</span>
                User Accounts and Responsibilities
              </h4>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities occurring under your account.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Accurate Information:</strong> You agree to provide truthful, accurate, and current registration details and to keep them updated.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Unauthorized Use:</strong> You must notify us immediately at <span className="font-mono text-indigo-300">tephdytech@gmail.com</span> of any unauthorized access or security breach.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Single-User License:</strong> Your account is personal and non-transferable. Sharing accounts or credentials is strictly prohibited.</span></li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">4</span>
                Acceptable Use Policy
              </h4>
              <p className="text-sm">You agree <strong className="text-rose-400">NOT</strong> to:</p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Cheat, use automated scripts, bots, or employ AI assistance during official timed assessments.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Copy, distribute, sell, sublicense, or reverse-engineer assessment content, questions, or answer keys.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Share certificates under a false identity or misrepresent your credentials to third parties.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Attempt to bypass anti-cheat, fullscreen, or integrity-monitoring mechanisms.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Upload malware, viruses, or any harmful code that may disrupt the Service.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Interfere with or disrupt the integrity or performance of the Service or its servers.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Harass, threaten, or abuse other users, staff, or support personnel.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Use the Service for any unlawful, fraudulent, or unauthorized purpose.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Scrape, harvest, or data-mine any content or user information from the Service.</span></li>
              </ul>
              <p className="text-xs text-slate-400">
                Violation of this policy may result in immediate suspension or termination of your account, invalidation of any certificates, and possible legal action.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">5</span>
                Assessment Integrity and Anti-Cheat
              </h4>
              <p className="text-sm">
                During official timed assessments, the Service enforces the following integrity measures:
              </p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Fullscreen Enforcement:</strong> You must remain in fullscreen mode for the duration of the assessment.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Tab-Switch Detection:</strong> Leaving the assessment window will be logged as an integrity violation.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Clipboard Restrictions:</strong> Copy, cut, paste, and select-all functions are disabled.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Violation Logging:</strong> Integrity events are recorded and may affect your final score or certification eligibility.</span></li>
              </ul>
              <p className="text-xs text-slate-400">
                By proceeding with an official assessment, you consent to these monitoring measures for the sole purpose of ensuring assessment integrity.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">6</span>
                Certificates and Eligibility
              </h4>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Eligibility:</strong> A Certificate of Achievement is issued only upon achieving a cumulative score of <strong className="text-slate-200">80% or higher</strong> across all five (5) full-examination modules.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Verification:</strong> Each certificate is assigned a unique Certificate ID for electronic validation.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">No Guarantee of Employment:</strong> Certificates demonstrate assessed competency only and do not constitute a guarantee of employment, promotion, or professional outcome.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Revocation:</strong> We reserve the right to revoke any certificate obtained through fraud, misrepresentation, or breach of these Terms.</span></li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">7</span>
                Intellectual Property Rights
              </h4>
              <p className="text-sm">
                All content, features, functionality, source code, assessment materials, questions, branding, logos, and design elements of the Service are the exclusive property of <strong className="text-slate-200">TephdyTech</strong> or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-sm">
                You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service strictly for personal, non-commercial assessment purposes. You may <strong className="text-slate-200">not</strong> reproduce, distribute, create derivative works from, publicly display, or commercially exploit any part of the Service without our prior written consent.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">8</span>
                User-Generated Content
              </h4>
              <p className="text-sm">
                You retain ownership of any content you submit to the Service (e.g., written responses, audio recordings). By submitting content, you grant TephdyTech a worldwide, non-exclusive, royalty-free license to process, store, and use that content <strong className="text-slate-200">solely for the purpose of delivering, scoring, and improving the Service</strong>, in accordance with our Privacy Policy.
              </p>
              <p className="text-sm">
                You represent and warrant that you own or have the necessary rights to any content you submit and that such content does not infringe the rights of any third party.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">9</span>
                Privacy and Data Protection
              </h4>
              <p className="text-sm">
                Our collection, use, and protection of your personal information is governed by our <strong className="text-slate-200">Privacy Policy</strong>, which is incorporated into these Terms by reference. By using the Service, you consent to the practices described therein.
              </p>
              <p className="text-xs text-slate-400">
                Where GDPR, CCPA/CPRA, CalOPPA, or the Philippine Data Privacy Act apply, you retain all statutory rights described in the Privacy Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">10</span>
                Payments, Fees, and Refunds
              </h4>
              <p className="text-sm">
                Certain features of the Service may be offered for a fee. All fees are stated in the applicable currency and are exclusive of taxes unless otherwise stated. Payments are processed by third-party payment processors subject to their own terms.
              </p>
              <p className="text-sm">
                Except where required by applicable law (including EU consumer protection rules on digital content), all fees are <strong className="text-slate-200">non-refundable</strong>. EU/UK consumers may have a 14-day right of withdrawal for digital services unless they expressly consent to immediate performance and waive that right.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">11</span>
                Disclaimers
              </h4>
              <p className="text-sm">
                THE SERVICE IS PROVIDED ON AN <strong className="text-slate-200">"AS IS"</strong> AND <strong className="text-slate-200">"AS AVAILABLE"</strong> BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-sm">
                We do not warrant that: (a) the Service will be uninterrupted, error-free, or secure; (b) assessment results will be accurate or meet your expectations; or (c) any errors in the Service will be corrected. AI-based evaluations are assistive tools and may not reflect every nuance of human language proficiency.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">12</span>
                Limitation of Liability
              </h4>
              <p className="text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TEPHDYTECH AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
              <p className="text-sm">
                OUR TOTAL AGGREGATE LIABILITY ARISING FROM OR RELATING TO THESE TERMS SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS (US$100).
              </p>
              <p className="text-xs text-slate-400">
                Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded under applicable law (including mandatory EU/UK consumer rights).
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">13</span>
                Indemnification
              </h4>
              <p className="text-sm">
                You agree to indemnify, defend, and hold harmless TephdyTech and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in any way connected with: (a) your use of the Service; (b) your violation of these Terms; or (c) your violation of any third-party rights.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">14</span>
                Suspension and Termination
              </h4>
              <p className="text-sm">
                We reserve the right to suspend or terminate your account, with or without notice, if you:
              </p>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Breach any provision of these Terms;</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Engage in fraudulent, abusive, or unlawful activity; or</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span>Pose a security or legal risk to TephdyTech or other users.</span></li>
              </ul>
              <p className="text-sm">
                You may terminate your account at any time through your account settings or by contacting <span className="font-mono text-indigo-300">tephdytech@gmail.com</span>. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination (e.g., IP rights, disclaimers, indemnification, limitation of liability) shall so survive.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">15</span>
                Modifications to the Terms
              </h4>
              <p className="text-sm">
                We may update these Terms from time to time. Material changes will be communicated via email or prominent notice on the Service at least <strong className="text-slate-200">30 days</strong> before they take effect. Continued use of the Service after the effective date constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">16</span>
                Governing Law and Dispute Resolution
              </h4>
              <p className="text-sm">
                These Terms shall be governed by and construed in accordance with the laws of the <strong className="text-slate-200">Republic of the Philippines</strong>, without regard to its conflict-of-law principles. Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts of <strong className="text-slate-200">[City], Philippines</strong>, unless mandatory consumer protection laws in your country of residence provide otherwise.
              </p>
              <p className="text-xs text-slate-400">
                EU/UK consumers retain the right to bring proceedings in the courts of their country of residence. Prior to formal proceedings, parties agree to attempt good-faith resolution via written notice to <span className="font-mono text-indigo-300">tephdytech@gmail.com</span>.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">17</span>
                General Provisions
              </h4>
              <ul className="space-y-2 pl-4 text-sm">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Entire Agreement:</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between you and TephdyTech.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in full force.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">No Waiver:</strong> Failure to enforce any right does not constitute a waiver of that right.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Assignment:</strong> You may not assign these Terms without our written consent; we may assign freely.</span></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Force Majeure:</strong> We are not liable for delays caused by events beyond our reasonable control.</span></li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">18</span>
                Contact Information
              </h4>
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-2 font-mono text-xs">
                <p className="text-slate-300">📧 tephdytech@gmail.com — Legal, Support & Privacy Inquiries</p>
                <p className="text-slate-400 pt-2">TephdyTech · Legal Department</p>
              </div>
            </section>

            <div className="pt-4 border-t border-indigo-500/20">
              <p className="text-slate-300 text-sm leading-relaxed text-center font-semibold">
                By accessing or using the Cally Assessment Hub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </LegalModal>
      </>
    );
  }

  // ============================================
  // RENDER: MAIN APP
  // ============================================
  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${themeClasses.bg} ${themeClasses.textPrimary}`}>
      
      <header className={`relative z-50 shrink-0 border-b px-4 sm:px-8 ${themeClasses.header}`}>
        <div className="w-full flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0" onClick={handleBackToDashboard}>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                <Image src="/logo.png" alt="TephdyTech Logo" fill priority className="object-contain" />
              </div>
              <div className="min-w-0">
                <span className="font-bold tracking-tight text-sm sm:text-lg truncate block">Cally Assessment Hub</span>
                <span className={`text-[10px] font-mono ${themeClasses.textMuted} hidden sm:block`}>
                  {themeClasses.name} Mode
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Admin Button — only visible to admins */}
            {isAdmin && (
              <a
                href="/admin"
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition-all border ${themeClasses.accentSoft} hover:opacity-80 cursor-pointer`}
                title="Open Admin Dashboard"
              >
                <Icon name="settings" className="w-4 h-4" />
                <span>Admin Panel</span>
              </a>
            )}

            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border ${themeClasses.border} ${themeClasses.cardHover}`}
                aria-label="Change theme"
              >
                <Icon name="layers" className="w-5 h-5" />
              </button>
              
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                  <div className={`absolute right-0 top-12 z-50 w-64 rounded-xl border shadow-xl p-2 ${themeClasses.card}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-2 ${themeClasses.textMuted}`}>
                      Interface Theme
                    </div>
                    {(Object.keys(themeConfigs) as ThemeMode[]).filter(t => t !== 'emerald').map((themeKey) => (
                      <button
                        key={themeKey}
                        onClick={() => handleThemeChange(themeKey)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          theme === themeKey 
                            ? 'bg-indigo-600 text-white' 
                            : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${themeConfigs[themeKey].gradient}`} />
                        <span>{themeConfigs[themeKey].name}</span>
                        {theme === themeKey && <span className="ml-auto">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                {(userName || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="truncate max-w-[120px] font-bold">{userName || 'Candidate'}</span>
                <span className={`text-[10px] ${themeClasses.textMuted}`}>{isAdmin ? 'Administrator' : 'Candidate'}</span>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="hidden sm:inline-flex px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition cursor-pointer text-xs font-bold border border-rose-500/20 items-center gap-1.5"
            >
              <Icon name="log-out" className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className={`md:hidden w-11 h-11 shrink-0 rounded-lg border flex items-center justify-center transition ${themeClasses.border} ${themeClasses.cardHover}`}
            >
              <Icon name={isMobileMenuOpen ? 'x' : 'menu'} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-row w-full min-h-0">
        <aside className={`hidden md:flex md:flex-col md:w-72 shrink-0 border-r p-5 space-y-6 overflow-y-auto ${themeClasses.sidebar}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 ${themeClasses.textMuted}`}>
              System Navigation
            </span>
            <nav className="space-y-1.5 pt-2">
              <button
                onClick={() => handleSelectSidebarTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer text-left ${
                  activeTab === 'overview' 
                    ? 'bg-indigo-600 text-white' 
                    : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                }`}
              >
                <Icon name="chart" className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>
              <button
                onClick={() => handleSelectSidebarTab('logs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer text-left ${
                  activeTab === 'logs' 
                    ? 'bg-indigo-600 text-white' 
                    : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                }`}
              >
                <Icon name="trending" className="w-4 h-4" />
                <span>Performance Logs</span>
              </button>
              <button
                onClick={() => handleSelectSidebarTab('support' as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer text-left ${
                  activeTab === 'support' 
                    ? 'bg-indigo-600 text-white' 
                    : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                }`}
              >
                <Icon name="info" className="w-4 h-4" />
                <span>Support Tickets</span>
              </button>
            </nav>
          </div>

          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 ${themeClasses.textMuted}`}>
              Practice Modules
            </span>
            <nav className="space-y-1.5 pt-2">
              {dashboardFeatures.map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => handleSelectSidebarTab(feat.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === feat.id 
                      ? `${themeClasses.accentSoft} border` 
                      : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-7 h-7 rounded-lg ${feat.color} flex items-center justify-center shrink-0`}>
                      <Icon name={feat.icon} className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="truncate">{feat.title}</span>
                  </div>
                  <Icon name="chevron-right" className="w-3.5 h-3.5 shrink-0 opacity-50" />
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={handleStartFullExam}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-4 py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Icon name="academic" className="w-5 h-5" />
            <span>Take Full Exam</span>
          </button>

          {isAdmin && (
            <a
              href="/admin"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-sm px-4 py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="settings" className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </a>
          )}

          <div className={`mt-auto pt-5 border-t ${themeClasses.border} space-y-3`}>
            <button
              type="button"
              onClick={() => setShowRatingModal(true)}
              className="w-full px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/20 transition-all cursor-pointer flex items-center gap-3 text-left"
            >
              <Icon name="star" className="w-4 h-4" />
              <span>Rate Us</span>
            </button>

            <div className={`p-3 rounded-xl border ${themeClasses.card} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                  System Status
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">Online</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <Icon name="wifi" className="w-3 h-3 text-emerald-400" />
                <span className={themeClasses.textMuted}>All systems operational</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 h-full overflow-y-auto">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
            {isTimedEvaluationActive && (antiCheatViolations > 0 || !isFullscreen) && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
                <div className="flex items-center gap-3 font-semibold text-amber-400">
                  <Icon name="alert-circle" className="w-5 h-5" />
                  <span className="text-sm">
                    Assessment Integrity: {antiCheatViolations} event{antiCheatViolations === 1 ? '' : 's'} detected
                    {!isFullscreen ? ' • Fullscreen required' : ''}
                  </span>
                </div>
                {!isFullscreen && (
                  <button
                    type="button"
                    onClick={requestExamFullscreen}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
                  >
                    Enter Fullscreen
                  </button>
                )}
              </div>
            )}

            {appMode === 'dashboard' && !selectedModule && activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <div className={`rounded-2xl border p-8 sm:p-12 ${themeClasses.card}`}>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${themeClasses.accentSoft}`}>
                        <Icon name="sparkles" className="w-3.5 h-3.5" />
                        Cally Assessment & Certification Portal
                      </span>
                      <h1 className="text-3xl sm:text-4xl font-black">
                        Welcome Back, <span className="text-indigo-400">{userName || 'Candidate'}</span>!
                      </h1>
                      <p className={`text-sm sm:text-base leading-relaxed ${themeClasses.textMuted}`}>
                        Select a module from the sidebar to practice your skills, or check your <strong className={themeClasses.textPrimary}>Performance Logs</strong> and official <strong className={themeClasses.textPrimary}>Full Exam</strong> pathway.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleStartFullExam}
                      className="shrink-0 w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-8 py-5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-3"
                    >
                      <Icon name="academic" className="w-6 h-6" />
                      <span>Take Full Exam</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                    {[
                      { label: 'Attempts', value: userScores.length, icon: 'activity', color: 'text-indigo-400' },
                      { label: 'Average', value: `${userScores.length ? Math.round(userScores.reduce((a,c)=>a+(c.score||0),0)/userScores.length) : 0}%`, icon: 'chart', color: 'text-cyan-400' },
                      { label: 'Best Score', value: `${userScores.length ? Math.max(...userScores.map(c=>c.score||0)) : 0}%`, icon: 'trophy', color: 'text-amber-400' },
                      { label: 'Certificate', value: userCertificates.length ? 'Earned' : 'Not Yet', icon: 'academic', color: 'text-emerald-400' },
                    ].map((stat) => (
                      <div key={stat.label} className={`rounded-xl border p-4 ${themeClasses.card}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name={stat.icon} className={`w-4 h-4 ${stat.color}`} />
                          <span className={`text-[10px] uppercase tracking-wider font-bold ${themeClasses.textMuted}`}>
                            {stat.label}
                          </span>
                        </div>
                        <div className="text-2xl font-black">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={`border-b pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${themeClasses.border}`}>
                    <div>
                      <h2 className="text-xl font-bold">Individual Practice Modules</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Practice freely module-by-module (No certificate generated)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                    {dashboardFeatures.map((feat) => (
                      <div
                        key={feat.id}
                        className={`rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${themeClasses.card} ${themeClasses.cardHover}`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-lg ${feat.color}`}>
                              <Icon name={feat.icon} className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${themeClasses.accentSoft}`}>
                              {feat.tag}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-base font-bold">{feat.title}</h3>
                            <p className={`text-xs leading-relaxed ${themeClasses.textMuted}`}>{feat.description}</p>
                          </div>
                        </div>
                        
                        <div className="pt-6">
                          <button
                            onClick={() => handleStartDashboardModule(feat.id)}
                            className={`w-full py-3 px-4 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${feat.color} hover:opacity-90`}
                          >
                            Practice Module
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {appMode === 'dashboard' && !selectedModule && activeTab === 'support' && (
              <div className="space-y-6 animate-fadeIn">
                <div className={`border-b pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${themeClasses.border}`}>
                  <div>
                    <h2 className="text-xl font-bold">Helpdesk & Support Tickets</h2>
                    <p className={`text-sm ${themeClasses.textMuted}`}>Submit inquiries, report technical glitches, or request score reviews</p>
                  </div>
                  <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Icon name="plus" className="w-4 h-4" />
                    <span>Create New Ticket</span>
                  </button>
                </div>

                {selectedTicket ? (
                  <div className={`rounded-xl border p-6 space-y-6 ${themeClasses.card}`}>
                    <div className={`flex items-center justify-between border-b pb-4 ${themeClasses.border}`}>
                      <div>
                        <button
                          onClick={() => setSelectedTicket(null)}
                          className={`text-xs font-bold ${themeClasses.accent} hover:underline mb-2 flex items-center gap-1 cursor-pointer`}
                        >
                          <Icon name="arrow-left" className="w-3.5 h-3.5" /> Back to Tickets List
                        </button>
                        <h3 className="text-lg font-bold">{selectedTicket.subject}</h3>
                        <span className={`text-xs ${themeClasses.textMuted} capitalize`}>
                          Category: {selectedTicket.category} &bull; Status: {selectedTicket.status}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        selectedTicket.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {selectedTicket.status}
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {ticketMessages.map((msg, idx) => (
                        <div key={idx} className={`p-4 rounded-xl space-y-2 ${
                          msg.is_admin 
                            ? `${themeClasses.accentSoft} ml-6` 
                            : `bg-slate-500/5 border ${themeClasses.border} mr-6`
                        }`}>
                          <div className={`flex items-center justify-between text-[11px] font-bold ${themeClasses.textMuted}`}>
                            <span>{msg.is_admin ? 'Support Agent' : 'You'}</span>
                            <span>{new Date(msg.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendReply} className={`flex gap-3 pt-4 border-t ${themeClasses.border}`}>
                      <input
                        type="text"
                        required
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply message..."
                        className={`flex-1 p-4 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.border}`}
                      />
                      <button
                        type="submit"
                        className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className={`rounded-xl border p-8 ${themeClasses.card}`}>
                    {userTickets.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto ${themeClasses.accentSoft}`}>
                          <Icon name="info" className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold">No support tickets found</h4>
                        <p className={`text-sm ${themeClasses.textMuted}`}>
                          Have a question or issue? Create a new ticket to get assistance.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${themeClasses.border} ${themeClasses.textMuted}`}>
                              <th className="pb-4 px-4">Subject</th>
                              <th className="pb-4 px-4">Category</th>
                              <th className="pb-4 px-4">Priority</th>
                              <th className="pb-4 px-4">Status</th>
                              <th className="pb-4 px-4">Date</th>
                              <th className="pb-4 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-500/10 text-sm">
                            {userTickets.map((ticket) => (
                              <tr key={ticket.id} className={`transition ${themeClasses.cardHover}`}>
                                <td className="py-4 px-4 font-bold">{ticket.subject}</td>
                                <td className="py-4 px-4 capitalize">{ticket.category}</td>
                                <td className="py-4 px-4 capitalize font-semibold">{ticket.priority}</td>
                                <td className="py-4 px-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                  }`}>
                                    {ticket.status}
                                  </span>
                                </td>
                                <td className={`py-4 px-4 ${themeClasses.textMuted}`}>
                                  {new Date(ticket.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button
                                    onClick={() => handleOpenTicketDetails(ticket)}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${themeClasses.accentSoft}`}
                                  >
                                    View Thread
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {showNewTicketModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className={`border rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative ${themeClasses.card}`}>
                      <div className={`flex items-center justify-between border-b pb-4 ${themeClasses.border}`}>
                        <h3 className="text-xl font-black">Create Support Ticket</h3>
                        <button
                          onClick={() => setShowNewTicketModal(false)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition cursor-pointer ${themeClasses.cardHover}`}
                        >
                          <Icon name="x" className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateTicket} className="space-y-5">
                        <div className="space-y-2">
                          <label className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                            Subject / Issue Summary
                          </label>
                          <input
                            type="text"
                            required
                            value={newTicketSubject}
                            onChange={(e) => setNewTicketSubject(e.target.value)}
                            placeholder="e.g., Audio playback error in listening module"
                            className={`w-full p-4 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.border}`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Category</label>
                            <select
                              value={newTicketCategory}
                              onChange={(e) => setNewTicketCategory(e.target.value)}
                              className={`w-full p-4 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${themeClasses.border}`}
                            >
                              <option value="technical">Technical Bug</option>
                              <option value="scoring">Score Dispute</option>
                              <option value="account">Account Issue</option>
                              <option value="general">General Inquiry</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Priority</label>
                            <select
                              value={newTicketPriority}
                              onChange={(e) => setNewTicketPriority(e.target.value)}
                              className={`w-full p-4 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${themeClasses.border}`}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                            Description / Details
                          </label>
                          <textarea
                            rows={5}
                            required
                            value={newTicketMessage}
                            onChange={(e) => setNewTicketMessage(e.target.value)}
                            placeholder="Describe your issue in detail..."
                            className={`w-full p-4 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed ${themeClasses.border}`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isCreatingTicket}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer"
                        >
                          {isCreatingTicket ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {appMode === 'dashboard' && !selectedModule && activeTab === 'logs' && (
              <div className="space-y-6 animate-fadeIn">
                <div className={`border-b pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${themeClasses.border}`}>
                  <div>
                    <h2 className="text-xl font-bold">Performance & Historical Improvement Logs</h2>
                    <p className={`text-sm ${themeClasses.textMuted}`}>
                      Chronological tracking of every test attempt, score evolution, and exam dates
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={refreshUserStats}
                    disabled={loadingStats}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer border flex items-center gap-2 shrink-0 ${themeClasses.accentSoft} disabled:opacity-50`}
                  >
                    <Icon name="refresh" className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
                    <span>{loadingStats ? 'Refreshing...' : 'Refresh Logs'}</span>
                  </button>
                </div>

                {statsError && (
                  <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-start gap-4">
                    <Icon name="alert-circle" className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-rose-400">Couldn't load your performance logs</p>
                      <p className={`text-xs ${themeClasses.textMuted}`}>{statsError}</p>
                    </div>
                  </div>
                )}

                {/* Compute typing stats inline */}
                {(() => {
                  const typingScores = userScores.filter(s => s.module_name === 'typing' && typeof s.wpm === 'number' && s.wpm > 0);
                  const typingAvgWpm = typingScores.length > 0
                    ? Math.round(typingScores.reduce((a, s) => a + (s.wpm || 0), 0) / typingScores.length)
                    : 0;
                  const typingBestWpm = typingScores.length > 0
                    ? Math.max(...typingScores.map(s => s.wpm || 0))
                    : 0;

                  const statCards = [
                    { label: 'Total Test Attempts', value: userScores.length, sub: 'Logged practice and exam sessions', color: 'text-indigo-400' },
                    { label: 'Historical Average Score', value: `${userScores.length > 0 ? Math.round(userScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / userScores.length) : 0}%`, sub: 'Average across all recorded attempts', color: 'text-cyan-400' },
                    { label: 'Best Performance', value: `${userScores.length > 0 ? Math.max(...userScores.map(item => item.score || 0)) : 0}%`, sub: 'Highest score achieved in a single log', color: 'text-emerald-400' },
                  ];

                  // ⬇️ NEW: Add typing stats card if the user has typing attempts
                  if (typingScores.length > 0) {
                    statCards.push({
                      label: 'Typing Speed (Avg WPM)',
                      value: `${typingAvgWpm}`,
                      sub: `Best: ${typingBestWpm} WPM · ${typingScores.length} attempt${typingScores.length === 1 ? '' : 's'}`,
                      color: 'text-sky-400',
                    });
                  }

                  return (
                    <div className={`grid grid-cols-1 sm:grid-cols-3 ${typingScores.length > 0 ? 'lg:grid-cols-4' : ''} gap-5`}>
                      {statCards.map((stat) => (
                        <div key={stat.label} className={`p-6 rounded-xl border ${themeClasses.card}`}>
                          <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                            {stat.label}
                          </span>
                          <h3 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</h3>
                          <p className={`text-[11px] mt-1 ${themeClasses.textMuted}`}>{stat.sub}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <div className={`rounded-xl border p-6 sm:p-8 space-y-5 ${themeClasses.card}`}>
                  <h3 className="text-lg font-bold">Attempt Progress Timeline & Dates</h3>
                  
                  {loadingStats ? (
                    <div className={`text-center py-12 font-bold text-sm ${themeClasses.textMuted}`}>
                      Loading historical progress logs...
                    </div>
                  ) : userScores.length === 0 ? (
                    <div className={`text-center py-12 text-sm ${themeClasses.textMuted}`}>
                      {statsError
                        ? 'Logs could not be loaded due to the error above.'
                        : 'No test attempts logged yet. Complete a practice module or full exam to start tracking your progress!'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${themeClasses.border} ${themeClasses.textMuted}`}>
                            <th className="pb-4 px-4">Date Taken</th>
                            <th className="pb-4 px-4">Module</th>
                            <th className="pb-4 px-4">Score</th>
                            {/* ⬇️ NEW: WPM column header (only if user has typing attempts) */}
                            {userScores.some(s => s.module_name === 'typing') && (
                              <th className="pb-4 px-4">WPM</th>
                            )}
                            <th className="pb-4 px-4">Status / Improvement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-500/10 text-sm">
                          {userScores.map((log, index) => {
                            const formattedDate = log.created_at ? new Date(log.created_at).toLocaleString() : new Date().toLocaleString();
                            const previousAttempt = userScores.slice(index + 1).find(item => item.module_name === log.module_name);
                            const diff = previousAttempt ? log.score - previousAttempt.score : null;
                            const hasTypingScores = userScores.some(s => s.module_name === 'typing');

                            return (
                              <tr key={log.id || index} className={`transition ${themeClasses.cardHover}`}>
                                <td className={`py-4 px-4 font-medium ${themeClasses.textMuted}`}>{formattedDate}</td>
                                <td className="py-4 px-4 font-bold capitalize">{log.module_name}</td>
                                <td className={`py-4 px-4 font-black ${themeClasses.accent}`}>{log.score}%</td>
                                {/* ⬇️ NEW: WPM cell (only if user has typing attempts) */}
                                {hasTypingScores && (
                                  <td className="py-4 px-4">
                                    {log.module_name === 'typing' && typeof log.wpm === 'number' ? (
                                      <span className={`font-black ${
                                        log.wpm >= 60 ? 'text-emerald-400' :
                                        log.wpm >= 40 ? 'text-amber-400' : 'text-rose-400'
                                      }`}>
                                        {log.wpm}
                                      </span>
                                    ) : (
                                      <span className={`text-xs ${themeClasses.textMuted}`}>—</span>
                                    )}
                                  </td>
                                )}
                                <td className="py-4 px-4">
                                  {diff !== null ? (
                                    <span className={`inline-flex items-center gap-2 font-bold px-3 py-1.5 rounded-full text-[11px] ${
                                      diff > 0 ? 'bg-emerald-500/10 text-emerald-400' : diff < 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
                                    }`}>
                                      {diff > 0 ? <Icon name="trending" className="w-3.5 h-3.5" /> : diff < 0 ? <Icon name="trending-down" className="w-3.5 h-3.5" /> : <Icon name="scale" className="w-3.5 h-3.5" />}
                                      {diff > 0 ? `+${diff}% improvement` : diff < 0 ? `${diff}% drop` : 'No change'}
                                    </span>
                                  ) : (
                                    <span className={`italic text-[11px] ${themeClasses.textMuted}`}>First recorded attempt</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {appMode === 'full_exam' && examStepIndex === 5 && (
              certificateEligible ? (
                <div className="space-y-8 max-w-[1300px] mx-auto text-center animate-fadeIn">
                  <div className={`p-6 rounded-2xl border flex justify-center items-center overflow-hidden w-full ${themeClasses.card}`}>
                    <div className="w-full overflow-hidden flex justify-center py-4">
                      <div className="w-[1100px] h-[778px] sm:h-auto shrink-0 origin-top transform scale-[0.38] min-[360px]:scale-[0.42] min-[400px]:scale-[0.47] min-[500px]:scale-[0.58] min-[640px]:scale-[0.75] md:scale-[0.88] lg:scale-100 transition-transform">
                        <div
                          id="certificate-to-download"
                          style={{
                            width: '1100px',
                            backgroundColor: '#fbf9f4',
                            border: '16px solid #1e293b',
                            padding: '40px 60px',
                            boxSizing: 'border-box',
                            position: 'relative',
                            margin: '0 auto',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ border: '2px solid #b45309', padding: '30px 40px', position: 'relative' }}>
                            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                              <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: '#1e293b', fontWeight: '700' }}>
                                Cally Assessment Systems
                              </div>
                              <div style={{ fontSize: '11px', color: '#78350f', marginTop: '3px', fontWeight: '600' }}>EST. 2026</div>
                            </div>

                            <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#78350f', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', margin: '10px 0 5px 0', fontFamily: 'serif' }}>
                              Certificate of Achievement
                            </h1>
                            <div style={{ fontSize: '13px', color: '#1e293b', textAlign: 'center', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                              Official Verification of Professional BPO Competency
                            </div>

                            <div style={{ fontSize: '14px', color: '#475569', textAlign: 'center', fontStyle: 'italic', marginBottom: '5px' }}>This is to certify that</div>
                            <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e293b', textAlign: 'center', margin: '0 auto 15px auto', paddingBottom: '4px', borderBottom: '2px solid #cbd5e1', display: 'table', fontFamily: 'serif' }}>
                              {userName || 'Candidate'}
                            </div>

                            <p style={{ fontSize: '13px', color: '#334155', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                              has successfully demonstrated exceptional proficiency across all official Cally assessment modules, showcasing linguistic mastery, professional communication skills, and technical competency required for the Business Process Outsourcing (BPO) industry.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 30px', maxWidth: '850px', margin: '0 auto 25px auto', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                              <div>Listening & Dictation ({examScores.listening}%)</div>
                              <div>Speaking Simulation ({examScores.speaking}%)</div>
                              <div>Reading & Grammar ({examScores.reading}%)</div>
                              <div>Chat & Typing Accuracy ({examScores.typing}%) &bull; Speed: {wpm} WPM</div>
                              <div>Business Writing Composition ({examScores.writing}%)</div>
                              <div style={{ color: '#b45309', fontWeight: '700' }}>Final Cumulative Rating: ({overallExamAverage}%)</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '20px', marginTop: '10px' }}>
                              <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>
                                Authorized Electronic Validation
                              </div>

                              <div style={{ width: '70px', height: '70px', background: '#b45309', color: '#ffffff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid #fef3c7', textAlign: 'center', fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <span>Official</span>
                                <span>Verified</span>
                              </div>

                              <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>
                                Cally Authority
                              </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '11px', color: '#64748b', fontWeight: '600', letterSpacing: '1px' }}>
                              DATE OF ISSUE: [{new Date().toLocaleDateString().toUpperCase()}] &bull; CERTIFICATE ID: [{generatedCertificateCode}]
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-8 border rounded-2xl space-y-6 ${themeClasses.card}`}>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black">Exam Finished Successfully!</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>
                        Your verified Cally certificate file (.pdf) is ready for download.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        disabled={isDownloadingPdf}
                        onClick={handleDownloadPDF}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Icon name="download" className="w-5 h-5" />
                        <span>{isDownloadingPdf ? 'Generating .pdf file...' : 'Download Certificate (.pdf)'}</span>
                      </button>
                      <button
                        onClick={handleBackToDashboard}
                        className={`w-full sm:w-auto font-bold text-sm px-6 py-4 rounded-lg transition cursor-pointer border ${themeClasses.border} ${themeClasses.cardHover}`}
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto text-center animate-fadeIn">
                  <div className={`p-12 rounded-2xl border ${themeClasses.card}`}>
                    <div className="mx-auto w-20 h-20 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6">
                      <Icon name="alert-circle" className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black">Certificate Not Available</h2>
                    <p className={`mt-4 text-sm leading-relaxed ${themeClasses.textMuted}`}>
                      Your final cumulative rating is <strong className="text-rose-400">{overallExamAverage}%</strong>. 
                      You do not qualify for a certificate of exceptional proficiency across all official Cally assessment modules.
                    </p>
                    <p className={`mt-2 text-xs ${themeClasses.textMuted}`}>
                      A minimum final cumulative rating of 80% is required to receive the certificate.
                    </p>
                    <button
                      onClick={handleRetakeAssessment}
                      className="mt-8 w-full sm:w-auto px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors"
                    >
                      Retake Assessment
                    </button>
                  </div>
                </div>
              )
            )}

            {selectedModule && (appMode === 'dashboard' || (appMode === 'full_exam' && examStepIndex < 5)) && (
              <div className="space-y-6 max-w-[1400px] mx-auto">
                <div className={`rounded-xl border p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${themeClasses.card}`}>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={handleBackToDashboard}
                      className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 border ${themeClasses.border} ${themeClasses.cardHover}`}
                    >
                      <Icon name="arrow-left" className="w-4 h-4" />
                      <span>Back to Dashboard</span>
                    </button>
                    {appMode === 'dashboard' && selectedModule && selectedModule !== 'learning' && (
                      <button
                        onClick={() => generateTest(selectedModule)}
                        className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${themeClasses.accentSoft}`}
                      >
                        <Icon name="refresh" className="w-4 h-4" />
                        <span>New Test</span>
                      </button>
                    )}
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <span className={`text-xs font-bold uppercase tracking-wider block ${themeClasses.accent}`}>
                      {appMode === 'full_exam' ? `Full Exam Step ${examStepIndex + 1} of 5` : 'Individual Practice Mode'}
                    </span>
                    <h2 className="text-lg font-bold capitalize">{selectedModule} Module</h2>
                  </div>
                </div>

                {selectedModule === 'learning' && (
                  <LearningModuleView
                    lessons={lessons}
                    filteredLessons={filteredLessons}
                    lessonStats={lessonStats}
                    lessonsLoading={lessonsLoading}
                    lessonsError={lessonsError}
                    lessonLevelFilter={lessonLevelFilter}
                    setLessonLevelFilter={setLessonLevelFilter}
                    lessonSearchQuery={lessonSearchQuery}
                    setLessonSearchQuery={setLessonSearchQuery}
                    lessonStatusFilter={lessonStatusFilter}
                    setLessonStatusFilter={setLessonStatusFilter}
                    selectedLesson={selectedLesson}
                    setSelectedLessonId={setSelectedLessonId}
                    completedLessonIds={completedLessonIds}
                    toggleLessonCompleted={toggleLessonCompleted}
                    reloadLessons={loadLessons}
                    themeClasses={themeClasses}
                    selectedLessonIndex={selectedLessonIndex}
                    Icon={Icon}
                  />
                )}

                {selectedModule === 'speaking' && (
                  <div className={`rounded-2xl border p-6 sm:p-8 ${themeClasses.card}`}>
                    <SpeakingRecorder
                      key={speakingPrompts[0] || 'speaking-default'}
                      prompts={speakingPrompts}
                      onComplete={handleSpeakingComplete}
                    />
                  </div>
                )}

                {selectedModule === 'writing' && (
                  <div className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${themeClasses.card}`}>
                    <div className={`p-5 rounded-xl border ${themeClasses.accentSoft} space-y-2`}>
                      <span className={`text-xs font-bold uppercase block ${themeClasses.accent}`}>
                        Writing Scenario Prompt:
                      </span>
                      <p className="text-sm sm:text-base font-medium whitespace-pre-line leading-relaxed">
                        {writingSubPrompts[0] || writingPrompt}
                      </p>
                    </div>

                    <textarea
                      rows={14}
                      value={writingDrafts[0] ?? ''}
                      onChange={(e) => {
                        const updated = [e.target.value];
                        setWritingDrafts(updated);
                        setWritingText(e.target.value);
                      }}
                      placeholder="Type your complete professional response here..."
                      className={`w-full p-5 border rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y ${themeClasses.border}`}
                    />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className={`text-xs ${themeClasses.textMuted}`}>
                        Total: {writingText.trim() ? writingText.trim().split(/\s+/).length : 0} words
                      </span>

                      <button
                        type="button"
                        onClick={handleSubmitWriting}
                        disabled={isEvaluatingWriting || !writingText.trim()}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{isEvaluatingWriting ? 'Evaluating...' : 'Submit Writing Assessment'}</span>
                      </button>
                    </div>

                    {isEvaluatingWriting && (
                      <div className="p-6 text-center space-y-4 bg-slate-500/5 rounded-xl border border-slate-500/10">
                        <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className={`text-sm font-bold uppercase tracking-wider block ${themeClasses.textMuted}`}>
                          Analyzing your writing...
                        </span>
                      </div>
                    )}

                    {writingEvaluationDetails && !isEvaluatingWriting && (
                      <div className={`mt-6 pt-6 border-t space-y-8 animate-fadeIn ${themeClasses.border}`}>
                        <div className="text-center border-b border-slate-500/10 pb-8">
                          <p className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                            Overall Writing Score
                          </p>
                          <p className={`text-6xl font-black mt-3 ${getWritingScoreColor(writingEvaluationDetails.overallScore)}`}>
                            {writingEvaluationDetails.overallScore}
                            <span className="text-2xl text-slate-500">/100</span>
                          </p>
                          <p className={`mt-4 text-sm max-w-2xl mx-auto leading-relaxed ${themeClasses.textMuted}`}>
                            {writingEvaluationDetails.feedbackSummary}
                          </p>
                        </div>

                        <div className="space-y-5">
                          <h3 className="text-sm font-bold uppercase tracking-wider">Score Breakdown</h3>
                          {[
                            { label: 'Grammar', score: writingEvaluationDetails.grammarScore },
                            { label: 'Vocabulary', score: writingEvaluationDetails.vocabularyScore },
                            { label: 'Coherence', score: writingEvaluationDetails.coherenceScore },
                            { label: 'Task Achievement', score: writingEvaluationDetails.taskAchievementScore },
                          ].map((cat) => (
                            <div key={cat.label}>
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span>{cat.label}</span>
                                <span className={getWritingScoreColor(cat.score)}>
                                  {cat.score}/100
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-slate-500/20 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getWritingBarColor(cat.score)} transition-all duration-700`}
                                  style={{ width: `${cat.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Detailed Feedback</h3>
                          <div className="space-y-3">
                            {writingEvaluationDetails.grammarNotes.map((note, idx) => (
                              <div
                                key={idx}
                                className={`flex items-start gap-3 border rounded-lg p-4 text-xs font-medium ${getWritingNoteStyles(note.type)}`}
                              >
                                <span className="font-bold shrink-0">
                                  {getWritingNoteIcon(note.type)}
                                </span>
                                <span>{note.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedModule === 'typing' && (
                  <div className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${themeClasses.card}`}>
                    <div className="grid grid-cols-2 gap-5">
                      <div className={`p-5 rounded-xl border ${themeClasses.accentSoft}`}>
                        <span className={`text-xs font-bold uppercase block ${themeClasses.accent}`}>WPM</span>
                        <span className="text-4xl font-black">{wpm}</span>
                      </div>
                      <div className={`p-5 rounded-xl border ${themeClasses.accentSoft}`}>
                        <span className={`text-xs font-bold uppercase block ${themeClasses.accent}`}>Accuracy</span>
                        <span className="text-4xl font-black">{accuracy}%</span>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-950 text-slate-300 rounded-xl font-mono text-sm sm:text-base leading-relaxed overflow-x-auto border border-slate-800">
                      {typingPassage.split('').map((char, index) => {
                        let color = 'text-slate-500';
                        if (index < userInput.length) {
                          color = userInput[index] === char ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold underline';
                        }
                        return <span key={index} className={color}>{char}</span>;
                      })}
                    </div>

                    <textarea
                      ref={typingInputRef}
                      rows={4}
                      disabled={isTypingCompleted}
                      value={userInput}
                      onChange={handleTypingChange}
                      placeholder="Type passage here..."
                      className={`w-full p-5 border rounded-xl bg-transparent font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.border}`}
                    />

                    {isTypingCompleted && !showScorePopup && (
                      <div className={`p-4 rounded-lg font-bold text-sm ${themeClasses.accentSoft}`}>
                        Typing Completed! Score Recorded: {score}% {appMode === 'full_exam' && '• Finalizing exam score...'}
                      </div>
                    )}
                  </div>
                )}

                {(selectedModule === 'listening' || selectedModule === 'reading') && (
                  <div className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${themeClasses.card}`}>
                    {loading && (
                      <div className={`text-center py-16 font-bold ${themeClasses.textMuted}`}>
                        Generating test questions...
                      </div>
                    )}

                    {!loading && !testData && (
                      <button
                        onClick={() => generateTest(selectedModule)}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-4 rounded-lg transition-colors cursor-pointer"
                      >
                        Load {selectedModule.toUpperCase()} Test
                      </button>
                    )}

                    {testData && (
                      <div className="space-y-8">
                        <h3 className="text-xl font-bold">{testData.title}</h3>

                        {selectedModule === 'reading' && testData.passage && (
                          <details
                            open
                            className={`p-6 rounded-xl font-serif leading-relaxed border ${themeClasses.accentSoft}`}
                          >
                            <summary className={`cursor-pointer font-sans font-bold text-xs uppercase tracking-wider mb-4 ${themeClasses.accent}`}>
                              Reading Passage (click to collapse)
                            </summary>
                            <div className="whitespace-pre-line text-sm">{testData.passage}</div>
                          </details>
                        )}

                        {selectedModule === 'listening' && testData.audioScript && !hasAudioEnded && (
                          <div className="p-5 bg-slate-950 text-white rounded-xl space-y-3 border border-slate-800">
                            <AudioPlayer
                              script={testData.audioScript}
                              onPlay={() => setHasAudioStarted(true)}
                              onEnded={() => {
                                setHasAudioEnded(true);
                                setIsListeningTimerActive(true);
                              }}
                            />
                          </div>
                        )}

                        {(selectedModule === 'reading' || hasAudioEnded) && (
                          <div className="space-y-8">
                            {selectedModule === 'listening' && isListeningTimerActive && !isSubmitted && (
                              <div className="p-4 bg-rose-600 text-white text-sm font-mono rounded-xl flex items-center justify-between animate-pulse">
                                <span className="flex items-center gap-2">
                                  <Icon name="clock" className="w-5 h-5" />
                                  Time Remaining:
                                </span>
                                <span className="text-lg font-black">{listeningTimer}s</span>
                              </div>
                            )}

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className={themeClasses.textMuted}>
                                  Question {currentQuestionIndex + 1} of {totalQuestions}
                                </span>
                                <span className={themeClasses.accent}>
                                  {answeredCount} / {totalQuestions} answered
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-500/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 transition-all duration-500"
                                  style={{
                                    width: `${((currentQuestionIndex + 1) / Math.max(totalQuestions, 1)) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {testData.questions[currentQuestionIndex] && (
                              <div className={`p-6 rounded-xl border space-y-5 ${themeClasses.cardHover}`}>
                                <p className="font-semibold text-base">
                                  {testData.questions[currentQuestionIndex].question}
                                </p>

                                <div className="grid grid-cols-1 gap-3">
                                  {testData.questions[currentQuestionIndex].options?.map((opt, oIdx) => {
                                    const qId = testData.questions[currentQuestionIndex].id;
                                    const isSelected = selectedAnswers[qId] === opt;
                                    const isCorrect =
                                      isSubmitted &&
                                      opt.trim().toLowerCase() ===
                                        (testData.questions[currentQuestionIndex].correctAnswer || '')
                                          .trim()
                                          .toLowerCase();
                                    const isWrongSelected = isSubmitted && isSelected && !isCorrect;

                                    return (
                                      <button
                                        key={oIdx}
                                        disabled={isSubmitted}
                                        onClick={() => handleSelectAnswer(qId, opt)}
                                        className={`p-4 text-left rounded-lg border text-sm font-medium transition-all cursor-pointer flex items-center gap-4 ${
                                          isCorrect
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                                            : isWrongSelected
                                              ? 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold'
                                              : isSelected
                                                ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                                                : `border-slate-500/20 bg-transparent hover:border-indigo-400`
                                        }`}
                                      >
                                        <span
                                          className={`w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                                            isSelected
                                              ? 'border-current bg-current/10'
                                              : 'border-slate-500/40'
                                          }`}
                                        >
                                          {String.fromCharCode(65 + oIdx)}
                                        </span>
                                        <span className="flex-1">{opt}</span>
                                        {isCorrect && <span className="text-emerald-400 text-lg">✓</span>}
                                        {isWrongSelected && <span className="text-rose-400 text-lg">✕</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <button
                                type="button"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                                className={`w-full sm:w-auto px-6 py-3 text-sm font-bold rounded-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 border ${themeClasses.border} ${themeClasses.cardHover}`}
                              >
                                <Icon name="arrow-left" className="w-4 h-4" />
                                <span>Previous</span>
                              </button>

                              <div className="flex-1 flex items-center justify-center gap-2 flex-wrap order-last sm:order-none w-full sm:w-auto">
                                {testData.questions.map((q, idx) => {
                                  const answered = !!selectedAnswers[q.id];
                                  const isCurrent = idx === currentQuestionIndex;
                                  return (
                                    <button
                                      key={q.id || idx}
                                      onClick={() => setCurrentQuestionIndex(idx)}
                                      aria-label={`Go to question ${idx + 1}`}
                                      className={`w-9 h-9 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center border-2 ${
                                        isCurrent
                                          ? 'bg-indigo-600 border-indigo-500 text-white scale-110'
                                          : answered
                                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                            : `bg-transparent border-slate-500/30 text-slate-400 hover:border-indigo-400`
                                      }`}
                                    >
                                      {idx + 1}
                                    </button>
                                  );
                                })}
                              </div>

                              {!isLastQuestion ? (
                                <button
                                  type="button"
                                  onClick={handleNextQuestion}
                                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                  <span>Next</span>
                                  <Icon name="chevron-right" className="w-4 h-4" />
                                </button>
                              ) : !isSubmitted ? (
                                <button
                                  type="button"
                                  onClick={selectedModule === 'listening' ? handleSubmitListening : handleSubmitReading}
                                  disabled={!allQuestionsAnswered}
                                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                  <span>
                                    {allQuestionsAnswered
                                      ? `Submit ${selectedModule} Answers`
                                      : `Answer all (${answeredCount}/${totalQuestions})`}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleBackToDashboard}
                                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
                                >
                                  Back to Dashboard
                                </button>
                              )}
                            </div>

                            {isSubmitted && !showScorePopup && (
                              <div className={`p-4 rounded-lg font-bold text-sm ${themeClasses.accentSoft}`}>
                                {selectedModule.toUpperCase()} Module Complete! Score Recorded: {score}%
                                {appMode === 'full_exam' && ' • Advancing to next exam module...'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <aside className={`absolute top-0 bottom-0 left-0 w-[min(88vw,340px)] ${themeClasses.sidebar} border-r shadow-2xl p-5 pt-6 flex flex-col overflow-y-auto`} style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))', paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <div className={`flex items-center justify-between pb-5 mb-5 border-b ${themeClasses.border}`}>
              <div className="min-w-0">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${themeClasses.textMuted}`}>
                  System Navigation
                </span>
                <p className="text-base font-black truncate mt-1">Cally Assessment Hub</p>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${themeClasses.cardHover}`}
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className={`flex items-center gap-3 p-3 mb-4 rounded-xl border ${themeClasses.card}`}>
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base">
                {(userName || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{userName || 'Candidate'}</p>
                <p className={`text-[10px] ${themeClasses.textMuted}`}>{isAdmin ? 'Administrator' : 'Candidate'}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 ${themeClasses.textMuted}`}>
                Workspace
              </span>
              <nav className="space-y-1.5 pt-2">
                <button
                  onClick={() => handleSelectSidebarTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer text-left ${
                    activeTab === 'overview' 
                      ? 'bg-indigo-600 text-white' 
                      : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                  }`}
                >
                  <Icon name="chart" className="w-5 h-5" />
                  <span>Dashboard Overview</span>
                </button>
                <button
                  onClick={() => handleSelectSidebarTab('logs')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer text-left ${
                    activeTab === 'logs' 
                      ? 'bg-indigo-600 text-white' 
                      : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                  }`}
                >
                  <Icon name="trending" className="w-5 h-5" />
                  <span>Performance Logs</span>
                </button>
                <button
                  onClick={() => handleSelectSidebarTab('support' as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer text-left ${
                    activeTab === 'support' 
                      ? 'bg-indigo-600 text-white' 
                      : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                  }`}
                >
                  <Icon name="info" className="w-5 h-5" />
                  <span>Support Tickets</span>
                </button>
              </nav>
            </div>

            <div className="space-y-1 mt-6">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 ${themeClasses.textMuted}`}>
                Practice Modules
              </span>
              <nav className="space-y-1.5 pt-2">
                {dashboardFeatures.map((feat) => (
                  <button
                    key={feat.id}
                    onClick={() => handleSelectSidebarTab(feat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                      activeTab === feat.id 
                        ? `${themeClasses.accentSoft} border` 
                        : `${themeClasses.textSecondary} ${themeClasses.cardHover}`
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg ${feat.color} flex items-center justify-center shrink-0`}>
                        <Icon name={feat.icon} className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="truncate">{feat.title}</span>
                    </span>
                    <Icon name="chevron-right" className="w-4 h-4 shrink-0 opacity-50" />
                  </button>
                ))}
              </nav>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleStartFullExam();
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-4 py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <Icon name="academic" className="w-5 h-5" />
                <span>Take Full Exam</span>
              </button>

              {isAdmin && (
                <a
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-sm px-4 py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-3"
                >
                  <Icon name="settings" className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </a>
              )}
            </div>

            <div className={`mt-auto pt-6 border-t ${themeClasses.border} space-y-3`}>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition cursor-pointer text-sm font-bold flex items-center justify-center gap-2"
              >
                <Icon name="log-out" className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              <button
                onClick={() => setShowRatingModal(true)}
                className="w-full px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-sm font-bold border border-amber-500/20 transition cursor-pointer flex items-center gap-2 justify-center"
              >
                <Icon name="star" className="w-4 h-4" />
                <span>Rate Us</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto border border-rose-500/30">
                <Icon name="log-out" className="w-10 h-10 text-rose-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">!</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Sign Out?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Are you sure you want to sign out of your account? Your progress and certificates are saved and will be available when you return.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base shrink-0">
                  {(userName || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-white truncate">{userName || 'Candidate'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{email || 'candidate@example.com'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 py-4 px-6 rounded-lg border border-slate-700 bg-slate-800 text-white font-bold text-sm transition hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 py-4 px-6 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <>
                    <Icon name="log-out" className="w-4 h-4" />
                    <span>Yes, Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrity Warning Modal */}
      {isTimedEvaluationActive && showIntegrityWarning && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border p-8 ${themeClasses.card}`}>
            <div className="w-16 h-16 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
              <Icon name="alert-circle" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black">Assessment Integrity Warning</h3>
            <p className={`mt-3 text-sm leading-relaxed ${themeClasses.textMuted}`}>{integrityWarning}</p>
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className={themeClasses.textMuted}>Integrity events detected</span>
              <strong className="text-amber-400">{antiCheatViolations}</strong>
            </div>
            {!isFullscreen && (
              <p className="mt-3 text-xs font-bold text-rose-400">Fullscreen is required to continue.</p>
            )}
            <button
              onClick={() => {
                if (document.fullscreenElement || !isTimedEvaluationActive) {
                  setShowIntegrityWarning(false);
                } else {
                  requestExamFullscreen();
                }
              }}
              className="mt-6 w-full py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors"
            >
              Return to Assessment
            </button>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`border rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6 relative ${themeClasses.card}`}>
            <div className={`flex items-center justify-between border-b pb-5 ${themeClasses.border}`}>
              <div className="space-y-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${themeClasses.accent}`}>
                  System Feedback
                </span>
                <h3 className="text-xl font-black">Rate & Recommend Cally</h3>
              </div>
              <button
                onClick={() => setShowRatingModal(false)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition cursor-pointer ${themeClasses.cardHover}`}
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {ratingSubmitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
                  <Icon name="sparkles" className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold">Thank you for your feedback!</h4>
                <p className={`text-sm ${themeClasses.textMuted}`}>
                  Your review helps us improve the assessment platform.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="space-y-6">
                <div className="space-y-4 text-center">
                  <label className={`text-xs font-bold uppercase tracking-wider block ${themeClasses.textMuted}`}>
                    Select Star Rating
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                      <RatingStar
                        key={star}
                        star={star}
                        value={hoverRating || userRating}
                        onPreview={setHoverRating}
                        onSelect={setUserRating}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider block ${themeClasses.textMuted}`}>
                    Your Recommendation & Comments
                  </label>
                  <textarea
                    rows={4}
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    placeholder="Tell us what you like about the system or what can be improved..."
                    className={`w-full p-4 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeClasses.border}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRating}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  {isSubmittingRating ? 'Submitting Review...' : 'Submit Rating & Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Score Popup */}
      {showScorePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`border rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center space-y-6 ${themeClasses.card}`}>
            <div className={`w-24 h-24 rounded-xl flex items-center justify-center mx-auto ${
              score !== null && score <= 70 
                ? 'bg-rose-500/20 text-rose-400' 
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Icon 
                name={score !== null && score <= 70 ? 'alert-circle' : 'trophy'} 
                className="w-12 h-12" 
              />
            </div>
            
            <div className="space-y-2">
              <span className={`text-xs font-bold uppercase tracking-widest block ${themeClasses.accent}`}>
                Module Completed
              </span>
              <h3 className="text-2xl font-black">Your Score</h3>
            </div>
            
            <div className={`py-4 rounded-xl border ${
              score !== null && score <= 70 
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <span className="text-6xl font-black">{score}%</span>
            </div>

            {/* ⬇️ NEW: Show WPM & Accuracy breakdown when typing module completes */}
            {selectedModule === 'typing' && wpm > 0 && (
              <div className="flex items-center justify-center gap-4 py-3 rounded-xl border border-sky-500/30 bg-sky-500/10">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sky-300">WPM</p>
                  <p className="text-3xl font-black text-white">{wpm}</p>
                </div>
                <div className="w-px h-10 bg-sky-500/30" />
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Accuracy</p>
                  <p className="text-3xl font-black text-white">{accuracy}%</p>
                </div>
              </div>
            )}

            {score !== null && score <= 70 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs italic font-medium leading-relaxed">
                {motivationalQuote}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setShowScorePopup(false);
                  if (appMode === 'full_exam') {
                    handleAdvanceExamStep(score || 0);
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-4 px-4 rounded-lg transition-colors cursor-pointer"
              >
                {appMode === 'full_exam' ? 'Continue to Next Module →' : 'Close'}
              </button>

              {appMode === 'dashboard' && selectedModule && selectedModule !== 'learning' && (
                <button
                  onClick={() => {
                    setShowScorePopup(false);
                    generateTest(selectedModule);
                  }}
                  className={`w-full font-bold text-sm py-3.5 px-4 rounded-lg transition cursor-pointer border flex items-center justify-center gap-2 ${themeClasses.border} ${themeClasses.cardHover}`}
                >
                  <Icon name="refresh" className="w-4 h-4" />
                  <span>Generate New Test</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructionsModal && activeFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`border rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative ${themeClasses.card}`}>
            <div className={`flex items-center justify-between border-b pb-5 ${themeClasses.border}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${activeFeature.color} flex items-center justify-center`}>
                  <Icon name={activeFeature.icon} className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest block ${themeClasses.accent}`}>
                    Module Guide
                  </span>
                  <h3 className="text-lg font-black">{activeFeature.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition cursor-pointer ${themeClasses.cardHover}`}
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-5 rounded-xl border text-sm leading-relaxed whitespace-pre-line font-medium ${themeClasses.cardHover}`}>
              {activeFeature.instructions}
            </div>

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-4 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Got it, Let's Begin!
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`relative z-10 shrink-0 border-t py-4 px-4 sm:px-8 ${themeClasses.header}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-center text-xs text-center">
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center">
                <span className="text-[8px] font-black text-white">T</span>
              </div>
              <span className="font-bold">Developed By TephdyTech</span>
            </div>
            <span className={themeClasses.textMuted}>&bull;</span>
            <span className={themeClasses.textMuted}>&copy; {new Date().getFullYear()} All rights reserved.</span>
            <span className={themeClasses.textMuted}>&bull;</span>
            <button type="button" onClick={() => setShowTermsModal(true)} className="hover:text-indigo-400 transition">
              Terms
            </button>
            <span className={themeClasses.textMuted}>&bull;</span>
            <button type="button" onClick={() => setShowPrivacyModal(true)} className="hover:text-indigo-400 transition">
              Privacy
            </button>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal (logged-in state) */}
      <LegalModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-slate-400 text-xs italic">
              Effective Date: September 15, 2026 · Last Updated: September 16, 2026
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              This Privacy Policy explains how <strong className="text-slate-100">TephdyTech</strong> ("TephdyTech," "we," "us," or "our") collects, uses, discloses, retains, and protects personal information through the <strong className="text-slate-100">Cally Assessment Hub</strong> platform (the "Service"). It is designed to comply with the <strong className="text-slate-100">General Data Protection Regulation (GDPR)</strong>, the <strong className="text-slate-100">California Consumer Privacy Act as amended by the California Privacy Rights Act (CCPA/CPRA)</strong>, the <strong className="text-slate-100">California Online Privacy Protection Act (CalOPPA)</strong>, and other applicable data protection laws. Please read this Policy carefully.
            </p>
          </div>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
              Who We Are (Data Controller)
            </h4>
            <p>
              <strong className="text-slate-200">Data Controller:</strong> TephdyTech. — Contact Details.
            </p>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-1 font-mono text-xs">
              <p className="text-slate-300">📧 tephdytech@gmail.com</p>
            </div>
            <p className="text-xs text-slate-400">
              Where applicable, TephdyTech has designated an EU representative under Article 27 GDPR. Contact details are available upon request via dpo@tephdytech.com.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
              Personal Information We Collect
            </h4>
            <p className="font-semibold text-slate-200">We collect the following categories of personal information:</p>
            <ul className="space-y-2 pl-4 text-sm">
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Account Information:</strong> Full name, email address, hashed password, and profile details.</span></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Assessment Data:</strong> Test responses, scores, module attempts, completion times, and proficiency ratings.</span></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Audio Recordings:</strong> Voice samples recorded during Speaking assessments, used solely for AI-based evaluation and deleted after processing.</span></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Technical Data:</strong> IP address, browser type, device identifiers, operating system, and session integrity logs.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">3</span>
              How We Use Your Information
            </h4>
            <ul className="space-y-2 pl-4 text-sm">
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Service Delivery:</strong> To provide, operate, and maintain the assessment and certification platform.</span></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Assessment Evaluation:</strong> To process and score your module responses using AI and rule-based engines.</span></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Authentication:</strong> To verify identity and protect against unauthorized access.</span></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span><span><strong className="text-slate-200">Improvement:</strong> To analyze usage patterns and improve the Service's functionality and user experience.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">4</span>
              Your Rights
            </h4>
            <p className="text-sm">
              Under GDPR, CCPA/CPRA, CalOPPA, and the Philippine Data Privacy Act, you have rights to access, correct, delete, restrict processing, and port your data. To exercise these rights, contact <span className="font-mono text-indigo-300">tephdytech@gmail.com</span>.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">5</span>
              Contact Us
            </h4>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-2 font-mono text-xs">
              <p className="text-slate-300">📧 tephdytech@gmail.com — General Privacy Inquiries</p>
            </div>
          </section>

          <div className="pt-4 border-t border-indigo-500/20">
            <p className="text-slate-300 text-sm leading-relaxed text-center font-semibold">
              By using the Cally Assessment Hub, you acknowledge that you have read and understood this Privacy Policy and consent to the practices described herein, to the extent consent is the applicable legal basis.
            </p>
          </div>
        </div>
      </LegalModal>

      {/* Terms of Service Modal (logged-in state) */}
      <LegalModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-slate-400 text-xs italic">
              Effective Date: September 15, 2026 · Last Updated: September 16, 2026
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and <strong className="text-slate-100">TephdyTech</strong> ("TephdyTech," "we," "us," or "our") governing your access to and use of the <strong className="text-slate-100">Cally Assessment Hub</strong> platform (the "Service").
            </p>
          </div>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
              Acceptance of Terms
            </h4>
            <p className="text-sm">
              By registering for an account, accessing, or using the Service, you agree to be bound by these Terms. You represent that you are at least <strong className="text-slate-200">16 years of age</strong> (or 13 where permitted under applicable local law and with parental consent) and have the legal capacity to enter into a binding agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
              Acceptable Use Policy
            </h4>
            <ul className="space-y-2 pl-4 text-sm">
              <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Cheat, use automated scripts, bots, or employ AI assistance during official timed assessments.</span></li>
              <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Copy, distribute, sell, sublicense, or reverse-engineer assessment content, questions, or answer keys.</span></li>
              <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Share certificates under a false identity or misrepresent your credentials to third parties.</span></li>
              <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Attempt to bypass anti-cheat, fullscreen, or integrity-monitoring mechanisms.</span></li>
              <li className="flex gap-3"><span className="text-rose-400 font-bold">✕</span><span>Use the Service for any unlawful, fraudulent, or unauthorized purpose.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">3</span>
              Assessment Integrity
            </h4>
            <p className="text-sm">
              During official timed assessments, fullscreen mode is enforced, tab-switching is logged, clipboard operations are disabled, and integrity violations may affect your final score or certification eligibility.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">4</span>
              Certificates
            </h4>
            <p className="text-sm">
              A Certificate of Achievement is issued only upon achieving a cumulative score of <strong className="text-slate-200">80% or higher</strong> across all five (5) full-examination modules. Certificates demonstrate assessed competency only and do not constitute a guarantee of employment.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">5</span>
              Contact Information
            </h4>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-2 font-mono text-xs">
              <p className="text-slate-300">📧 tephdytech@gmail.com — Legal, Support & Privacy Inquiries</p>
            </div>
          </section>

          <div className="pt-4 border-t border-indigo-500/20">
            <p className="text-slate-300 text-sm leading-relaxed text-center font-semibold">
              By accessing or using the Cally Assessment Hub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </LegalModal>
    </div>
  );
}