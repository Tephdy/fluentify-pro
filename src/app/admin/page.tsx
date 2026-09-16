'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
// MAIN ADMIN DASHBOARD
// ============================================
export default function AdminDashboardPage() {
  const [adminEmail, setAdminEmail] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'rankings'>('users')
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [allScores, setAllScores] = useState<any[]>([])
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
  }>({ user: null, scores: [], certificates: [], tickets: [] })
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

  const router = useRouter()

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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
    setProfileData({ user, scores: [], certificates: [], tickets: [] })

    try {
      const [scoresRes, certsRes, ticketsRes] = await Promise.all([
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
      ])

      setProfileData({
        user,
        scores: scoresRes.data || [],
        certificates: certsRes.data || [],
        tickets: ticketsRes.data || [],
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
    setProfileData({ user: null, scores: [], certificates: [], tickets: [] })
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
    // Group scores by user
    const userScoreMap = new Map<string, {
      userId: string
      userName: string
      userEmail: string
      isAdmin: boolean
      scoresByModule: Record<string, number[]>
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
          totalScore: 0,
          totalAttempts: 0,
        })
      }
      const entry = userScoreMap.get(uid)!
      const mod = s.module_name || 'unknown'
      if (!entry.scoresByModule[mod]) entry.scoresByModule[mod] = []
      entry.scoresByModule[mod].push(s.score || 0)
      entry.totalScore += s.score || 0
      entry.totalAttempts += 1
    })

    // Compute rankings
    const list = Array.from(userScoreMap.values()).map((u) => {
      const moduleAverages: Record<string, number> = {}
      Object.keys(u.scoresByModule).forEach((mod) => {
        const arr = u.scoresByModule[mod]
        moduleAverages[mod] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
      })

      const overallAverage = u.totalAttempts > 0
        ? Math.round(u.totalScore / u.totalAttempts)
        : 0

      return {
        ...u,
        moduleAverages,
        overallAverage,
      }
    })

    // Sort based on selected filter
    const sorted = [...list].sort((a, b) => {
      const getScore = (x: typeof a) => {
        if (rankingModuleFilter === 'overall') return x.overallAverage
        return x.moduleAverages[rankingModuleFilter] ?? -1
      }
      return getScore(b) - getScore(a)
    })

    return sorted.map((u, idx) => ({
      ...u,
      rank: idx + 1,
      displayScore: rankingModuleFilter === 'overall'
        ? u.overallAverage
        : (u.moduleAverages[rankingModuleFilter] ?? null),
    }))
  }, [allScores, users, rankingModuleFilter])

  // Filtered rankings for search
  const filteredRankings = useMemo(() => {
    if (!rankingSearch.trim()) return rankings
    const q = rankingSearch.toLowerCase()
    return rankings.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q)
    )
  }, [rankings, rankingSearch])

  // Top 3 for podium (only show if no search filter)
  const topThree = useMemo(() => {
    return rankingSearch.trim() === ''
      ? rankings.filter(r => r.displayScore !== null).slice(0, 3)
      : []
  }, [rankings, rankingSearch])

  // Profile Stats (computed for the viewed user)
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
    
    return { total, average, best, worst, certificates, tickets, moduleStats }
  }, [profileData])

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

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-violet-500/20 bg-[#121218]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center border border-violet-400/30 shadow-lg shadow-violet-500/30">
                  <Icon name="shield" className="w-5 h-5 text-white" glow />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#121218] animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-black tracking-tight leading-none">Admin Console</h1>
                <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest mt-1">
                  Restricted Node · v2.9.0 (Rankings)
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/50 border border-violet-500/20">
              <Icon name="activity" className="w-4 h-4 text-emerald-400" glow />
              <div className="text-xs font-mono">
                <span className="text-emerald-400 font-bold">SYS ONLINE</span>
                <span className="mx-2 text-slate-600">·</span>
                <span className="text-slate-300">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-black text-xs">
                  {adminEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider leading-none">Admin</span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{adminEmail}</span>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-400/40 text-xs font-bold transition-all"
              >
                <Icon name="log-out" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-16" aria-hidden="true" />

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline">Dismiss</button>
          </div>
        )}

        {/* USER PROFILE VIEW (conditional) */}
        {viewingUserId && profileData.user ? (
          <>
            <button
              onClick={closeUserProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-slate-300 hover:text-white hover:border-violet-400/40 font-bold text-xs transition-all"
            >
              <Icon name="arrow-left" className="w-4 h-4" />
              <span>Back to User Registry</span>
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
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Attempts', value: profileStats.total, icon: 'activity', gradient: 'from-violet-500 to-purple-500' },
                    { label: 'Average', value: `${profileStats.average}%`, icon: 'trending', gradient: 'from-cyan-500 to-blue-500' },
                    { label: 'Best Score', value: `${profileStats.best}%`, icon: 'trophy', gradient: 'from-amber-500 to-orange-500' },
                    { label: 'Certificates', value: profileStats.certificates, icon: 'shield', gradient: 'from-emerald-500 to-teal-500' },
                    { label: 'Tickets', value: profileStats.tickets, icon: 'message-square', gradient: 'from-rose-500 to-pink-500' },
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

                {Object.keys(profileStats.moduleStats).length > 0 && (
                  <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <Icon name="grid" className="w-4 h-4 text-violet-400" glow />
                      </div>
                      <div>
                        <h3 className="text-base font-black tracking-tight">Module Performance Breakdown</h3>
                        <p className="text-xs text-slate-400">Per-module attempt counts, average scores, and best scores</p>
                      </div>
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
                                <div
                                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                  style={{ width: `${data.avg}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-slate-400">Best</span>
                                <span className="font-bold text-emerald-400">{data.best}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                  style={{ width: `${data.best}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                  <div className="p-6 border-b border-violet-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Icon name="activity" className="w-4 h-4 text-cyan-400" glow />
                      </div>
                      <div>
                        <h3 className="text-base font-black tracking-tight">Performance Log History</h3>
                        <p className="text-xs text-slate-400">
                          {profileData.scores.length} recorded attempt{profileData.scores.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {profileData.scores.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                      No test attempts recorded yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[500px]">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead className="sticky top-0 bg-[#0d0d12] z-10">
                          <tr className="border-b border-violet-500/20 bg-slate-900/60 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <th className="p-4">#</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Module</th>
                            <th className="p-4">Score</th>
                            <th className="p-4">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-500/10">
                          {profileData.scores.map((s, idx) => {
                            const prev = profileData.scores.slice(idx + 1).find(x => x.module_name === s.module_name)
                            const diff = prev ? (s.score || 0) - (prev.score || 0) : null
                            return (
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
                                <td className="p-4">
                                  {diff !== null ? (
                                    <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-[10px] ${
                                      diff > 0 ? 'bg-emerald-500/10 text-emerald-400' :
                                      diff < 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
                                    }`}>
                                      {diff > 0 ? '↑' : diff < 0 ? '↓' : '—'}
                                      {diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : '0%'}
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-xs italic">First</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                  <div className="p-6 border-b border-violet-500/20 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Icon name="shield" className="w-4 h-4 text-emerald-400" glow />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight">Earned Certificates</h3>
                      <p className="text-xs text-slate-400">
                        {profileData.certificates.length} certificate{profileData.certificates.length === 1 ? '' : 's'} issued
                      </p>
                    </div>
                  </div>
                  {profileData.certificates.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                      No certificates earned yet. Requires 80%+ on Full Exam.
                    </div>
                  ) : (
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profileData.certificates.map((cert, idx) => (
                        <div
                          key={cert.id || idx}
                          className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 space-y-3"
                        >
                          <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                          <div className="relative flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                              <Icon name="trophy" className="w-5 h-5 text-white" glow />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Certified</p>
                              <p className="text-xs font-bold text-white truncate">
                                {cert.certificate_code || cert.id?.substring(0, 12) || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="relative space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Overall Score</span>
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
                  <div className="p-6 border-b border-violet-500/20 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                      <Icon name="message-square" className="w-4 h-4 text-rose-400" glow />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight">Support Tickets</h3>
                      <p className="text-xs text-slate-400">
                        {profileData.tickets.length} ticket{profileData.tickets.length === 1 ? '' : 's'} submitted
                      </p>
                    </div>
                  </div>
                  {profileData.tickets.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                      No support tickets submitted.
                    </div>
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
          </>
        ) : (
          <>
            {/* HERO BANNER */}
            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest text-violet-300">
                    <Icon name="shield" className="w-3 h-3" glow />
                    Command & Management Hub
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Welcome back, <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Administrator</span>
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Oversee system users, inspect complete performance histories, review the ranking leaderboard, and execute CRUD operations on your question bank.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-violet-500/30 hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    <Icon name="refresh" className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Syncing...' : 'Refresh Data'}</span>
                  </button>
                  <a
                    href="/"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-violet-500/20 bg-slate-900/50 text-slate-300 hover:text-white font-bold text-xs transition-all"
                  >
                    <Icon name="home" className="w-4 h-4" />
                    <span>Public Hub</span>
                  </a>
                </div>
              </div>
            </div>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: 'users', gradient: 'from-violet-500 to-purple-500', trend: `${stats.admins} admins` },
                { label: 'Total Questions', value: stats.totalQuestions, icon: 'book', gradient: 'from-cyan-500 to-blue-500', trend: `${stats.readingQuestions} reading / ${stats.listeningQuestions} listening` },
                { label: 'Admins Active', value: stats.admins, icon: 'crown', gradient: 'from-amber-500 to-orange-500', trend: 'Full privileges' },
                { label: 'System Status', value: 100, displayValue: 'Online', icon: 'activity', gradient: 'from-emerald-500 to-teal-500', trend: 'Operational' },
              ].map((stat) => (
                <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5">
                  <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon name={stat.icon} className="w-5 h-5 text-white" glow />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{stat.trend}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-black text-white">{stat.displayValue || <AnimatedCounter value={stat.value} />}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TAB SWITCHER */}
            <div className="flex border-b border-violet-500/20 gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-violet-500 text-violet-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon name="users" className="w-4 h-4" />
                <span>User Management ({users.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'questions'
                    ? 'border-violet-500 text-violet-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon name="book" className="w-4 h-4" />
                <span>Question Bank CRUD ({questions.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('rankings')}
                className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'rankings'
                    ? 'border-violet-500 text-violet-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon name="trophy" className="w-4 h-4" />
                <span>Rankings ({rankings.length})</span>
              </button>
            </div>

            {/* TAB 1: USER MANAGEMENT VIEW */}
            {activeTab === 'users' && (
              <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                <div className="p-6 border-b border-violet-500/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Registry Accounts</h3>
                      <p className="text-xs text-slate-400">Click a user to view their complete profile and performance history.</p>
                    </div>
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
                        <th className="p-4">Role Control</th>
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

            {/* TAB 2: QUESTION BANK CRUD VIEW */}
            {activeTab === 'questions' && (
              <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                <div className="p-6 border-b border-violet-500/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Question Bank CRUD Manager</h3>
                      <p className="text-xs text-slate-400">Create, Read, Update, and Delete reading and listening test questions stored in Supabase.</p>
                    </div>
                    <button
                      onClick={openCreateQuestionModal}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-500/30 transition-all"
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
                      {[{ key: 'all', label: 'All Modules' }, { key: 'reading', label: 'Reading' }, { key: 'listening', label: 'Listening' }].map((opt) => (
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
                        <th className="p-4">Correct Answer</th>
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

            {/* TAB 3: RANKINGS DASHBOARD */}
            {activeTab === 'rankings' && (
              <div className="space-y-6">
                {/* Ranking Hero */}
                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[#151520]/80 to-amber-500/5 backdrop-blur-xl p-6 sm:p-8">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

                  <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                        <Icon name="trophy" className="w-3 h-3" glow />
                        Hall of Excellence
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Performance <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">Leaderboard</span>
                      </h2>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Live rankings computed across all candidate attempts. Switch between overall performance and per-module leaderboards to identify top talent.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                      <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        <Icon name="refresh" className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>{refreshing ? 'Syncing...' : 'Refresh Rankings'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Module Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: 'overall', label: 'Overall', icon: 'trophy' },
                    { key: 'listening', label: 'Listening', icon: 'headphones' },
                    { key: 'reading', label: 'Reading', icon: 'book' },
                    { key: 'writing', label: 'Writing', icon: 'pencil' },
                    { key: 'speaking', label: 'Speaking', icon: 'mic' },
                    { key: 'typing', label: 'Typing', icon: 'keyboard' },
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
                      <Icon name={opt.icon === 'trophy' ? 'trophy' : opt.icon === 'book' ? 'book' : opt.icon === 'pencil' ? 'pencil' : opt.icon === 'mic' ? 'mic' : opt.icon === 'keyboard' ? 'keyboard' : 'headphones'} className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Top 3 Podium (only if not searching) */}
                {topThree.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Reorder for podium: 2nd | 1st | 3rd */}
                    {[1, 0, 2].map((podiumIdx) => {
                      const r = topThree[podiumIdx]
                      if (!r) return null
                      const isFirst = r.rank === 1
                      const isSecond = r.rank === 2
                      const isThird = r.rank === 3
                      const medalGradient = isFirst
                        ? 'from-amber-400 via-yellow-500 to-orange-500'
                        : isSecond
                          ? 'from-slate-300 via-slate-400 to-slate-500'
                          : 'from-amber-700 via-orange-700 to-amber-900'
                      const borderGlow = isFirst
                        ? 'border-amber-400/50 shadow-amber-500/30'
                        : isSecond
                          ? 'border-slate-300/50 shadow-slate-400/20'
                          : 'border-amber-700/50 shadow-amber-800/20'
                      const scaleClass = isFirst ? 'md:scale-105 md:z-10' : ''
                      const medalEmoji = isFirst ? '🥇' : isSecond ? '🥈' : '🥉'
                      const rankLabel = isFirst ? 'Champion' : isSecond ? 'Runner-Up' : 'Third Place'

                      return (
                        <div
                          key={r.userId}
                          onClick={() => {
                            const u = users.find(x => x.id === r.userId)
                            if (u) openUserProfile(u)
                          }}
                          className={`group relative overflow-hidden rounded-3xl border-2 ${borderGlow} bg-[#151520]/80 backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${scaleClass}`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${medalGradient} opacity-[0.08]`} />
                          <div className={`absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br ${medalGradient} opacity-20 rounded-full blur-3xl`} />

                          <div className="relative flex flex-col items-center text-center space-y-4">
                            <div className="text-4xl">{medalEmoji}</div>

                            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${medalGradient} flex items-center justify-center font-black text-3xl text-white shadow-2xl border-2 border-white/20`}>
                              {(r.userName || r.userEmail || '?').charAt(0).toUpperCase()}
                            </div>

                            <div className="space-y-1 w-full">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                isFirst
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                  : isSecond
                                    ? 'bg-slate-400/10 border-slate-400/30 text-slate-300'
                                    : 'bg-orange-700/10 border-orange-700/30 text-orange-300'
                              }`}>
                                <Icon name="award" className="w-3 h-3" />
                                {rankLabel}
                              </div>
                              <h3 className="text-lg font-black text-white truncate">{r.userName}</h3>
                              <p className="text-xs text-slate-500 font-mono truncate">{r.userEmail}</p>
                            </div>

                            <div className={`w-full py-3 rounded-2xl border ${
                              isFirst
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : isSecond
                                  ? 'bg-slate-400/10 border-slate-400/30'
                                  : 'bg-orange-700/10 border-orange-700/30'
                            }`}>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                {rankingModuleFilter === 'overall' ? 'Overall Average' : `${rankingModuleFilter} Score`}
                              </p>
                              <p className={`text-4xl font-black ${
                                isFirst ? 'text-amber-300' : isSecond ? 'text-slate-200' : 'text-orange-300'
                              }`}>
                                {r.displayScore ?? 0}%
                              </p>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 w-full">
                              <span className="flex items-center gap-1">
                                <Icon name="hash" className="w-3 h-3" />
                                Rank #{r.rank}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="activity" className="w-3 h-3" />
                                {r.totalAttempts} attempts
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Rankings Table */}
                <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
                  <div className="p-6 border-b border-violet-500/20 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <Icon name="hash" className="w-4 h-4 text-amber-400" glow />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight">
                            {rankingModuleFilter === 'overall'
                              ? 'Overall Ranking Table'
                              : `${rankingModuleFilter.charAt(0).toUpperCase() + rankingModuleFilter.slice(1)} Module Ranking`}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {filteredRankings.length} participant{filteredRankings.length === 1 ? '' : 's'} with recorded scores
                          </p>
                        </div>
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
                  </div>

                  {filteredRankings.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                          <Icon name="trophy" className="w-7 h-7 text-slate-500" />
                        </div>
                        <p className="text-slate-400 font-bold">
                          {rankingSearch.trim() ? 'No matching candidates found' : 'No score records available yet'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {rankingSearch.trim()
                            ? 'Try adjusting your search query.'
                            : 'Rankings will appear once candidates complete practice or full exam modules.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-violet-500/20 bg-slate-900/30 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <th className="p-4 w-20">Rank</th>
                            <th className="p-4">Candidate</th>
                            <th className="p-4">Module Score</th>
                            <th className="p-4 hidden md:table-cell">Attempts</th>
                            <th className="p-4 hidden lg:table-cell">Module Breakdown</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-500/10">
                          {filteredRankings.map((r) => {
                            const u = users.find(x => x.id === r.userId)
                            const score = r.displayScore
                            const scoreColor = score === null
                              ? 'text-slate-500'
                              : score >= 85 ? 'text-emerald-400'
                              : score >= 70 ? 'text-amber-400'
                              : 'text-rose-400'
                            return (
                              <tr
                                key={r.userId}
                                onClick={() => u && openUserProfile(u)}
                                className="hover:bg-violet-500/[0.06] transition-colors cursor-pointer group"
                              >
                                <td className="p-4">
                                  <RankBadge rank={r.rank} />
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                      r.isAdmin
                                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                                        : 'bg-gradient-to-br from-violet-500 to-purple-500 text-white'
                                    }`}>
                                      {(r.userName || r.userEmail || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors truncate">
                                        {r.userName}
                                        {r.isAdmin && (
                                          <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                            <Icon name="crown" className="w-2.5 h-2.5" />
                                            Admin
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-[11px] text-slate-500 font-mono truncate">{r.userEmail}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  {score === null ? (
                                    <span className="text-slate-500 italic text-xs">No data</span>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className={`font-black text-lg ${scoreColor}`}>
                                        {score}%
                                      </span>
                                      {score >= 90 && <span className="text-lg">🔥</span>}
                                      {score >= 80 && score < 90 && <span className="text-lg">⭐</span>}
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                    <Icon name="activity" className="w-3 h-3" />
                                    {r.totalAttempts}
                                  </span>
                                </td>
                                <td className="p-4 hidden lg:table-cell">
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(r.moduleAverages).slice(0, 5).map(([mod, avg]) => (
                                      <span
                                        key={mod}
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                          mod === 'reading' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' :
                                          mod === 'listening' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                                          mod === 'writing' ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' :
                                          mod === 'speaking' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                                          'bg-sky-500/15 text-sky-300 border-sky-500/30'
                                        }`}
                                      >
                                        {mod}: {avg}%
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (u) openUserProfile(u)
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 text-xs font-bold transition-all flex items-center gap-1.5 ml-auto"
                                  >
                                    <Icon name="user-check" className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Profile</span>
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Info Card */}
                <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                      <Icon name="info" className="w-5 h-5 text-violet-400" glow />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">How Rankings Are Calculated</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Ranked by <strong className="text-violet-300">average score</strong> across all recorded attempts.
                        {rankingModuleFilter === 'overall'
                          ? ' Overall Ranking blends every module.'
                          : ` Currently filtered to ${rankingModuleFilter} module scores only.`}
                        {' '}Candidates with the same score are ranked alphabetically. Only users with recorded attempts appear in this leaderboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* QUESTION CREATE / EDIT MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-violet-500/20 bg-[#151520] p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-violet-500/20 pb-4">
              <h3 className="text-xl font-black text-white">
                {editingQuestionId !== null ? '✏️ Edit Question Record' : '➕ Create New Question'}
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
                  <label className="text-xs font-bold text-slate-400 uppercase">Test Title / Batch</label>
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

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
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