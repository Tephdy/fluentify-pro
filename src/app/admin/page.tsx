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
// ENHANCED ADMIN DASHBOARD WITH USERS & QUESTIONS CRUD
// ============================================
export default function AdminDashboardPage() {
  const [adminEmail, setAdminEmail] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'questions'>('users')
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
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

  // 1. READ: Load Users and Questions from Supabase with Debugging
  const loadAdminData = async () => {
    try {
      setErrorMsg('')
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setAdminEmail(user.email)
      }

      // Fetch Users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) {
        console.error('Supabase users fetch error:', usersError)
        throw usersError
      }
      if (usersData) setUsers(usersData)

      // Fetch Questions with console debugging
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: false })

      console.log('DEBUG - Questions fetch response:', { questionsData, questionsError })

      if (questionsError) {
        console.error('Supabase questions fetch error:', questionsError)
        throw questionsError
      }
      
      if (questionsData) {
        setQuestions(questionsData)
      }

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

  // ==========================================
  // USERS CRUD HANDLERS
  // ==========================================
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
      await loadAdminData()
    } catch (err: any) {
      console.error('Error deleting user:', err)
      alert('Deletion failed: ' + err.message)
    }
  }

  // ==========================================
  // QUESTIONS CRUD HANDLERS
  // ==========================================
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
        // UPDATE
        const { error } = await supabase
          .from('questions')
          .update(payload)
          .eq('id', editingQuestionId)

        if (error) throw error
      } else {
        // CREATE
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

      {/* ============================================
          HEADER
      ============================================ */}
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
                  Restricted Node · v2.7.0 (Full CRUD)
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

      {/* ============================================
          MAIN CONTENT
      ============================================ */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline">Dismiss</button>
          </div>
        )}

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
                Oversee system users, manage roles, and execute full CRUD operations on your reading and listening test question bank.
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
          ].map((stat, idx) => (
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

        {/* ============================================
            TAB SWITCHER NAVIGATION
        ============================================ */}
        <div className="flex border-b border-violet-500/20 gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
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
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'questions'
                ? 'border-violet-500 text-violet-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Icon name="book" className="w-4 h-4" />
            <span>Question Bank CRUD ({questions.length})</span>
          </button>
        </div>

        {/* ============================================
            TAB 1: USER MANAGEMENT VIEW
        ============================================ */}
        {activeTab === 'users' && (
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
            <div className="p-6 border-b border-violet-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight">Registry Accounts</h3>
                  <p className="text-xs text-slate-400">Manage user roles, edit profiles, and purge inactive records.</p>
                </div>
              </div>

              {/* Filters */}
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

            {/* Users Table */}
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
                      <tr key={u.id} className="hover:bg-violet-500/[0.04] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                              u.is_admin ? 'bg-amber-500 text-white' : 'bg-violet-600 text-white'
                            }`}>
                              {(u.name || u.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              {editingUserId === u.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="px-2 py-1 rounded border border-violet-400 bg-slate-900 text-xs"
                                  />
                                  <button onClick={() => handleSaveName(u.id)} className="px-2 py-1 bg-emerald-600 rounded text-xs font-bold">Save</button>
                                  <button onClick={() => setEditingUserId(null)} className="px-2 py-1 bg-slate-800 rounded text-xs">Cancel</button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-white text-sm">{u.name || 'Unnamed User'}</p>
                                  <button onClick={() => { setEditingUserId(u.id); setEditName(u.name || '') }} className="opacity-0 group-hover:opacity-100 text-violet-400 p-1">
                                    <Icon name="edit" className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              <p className="text-[11px] text-slate-500 font-mono md:hidden">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-slate-400 text-xs font-mono">{u.email}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleAdmin(u.id, u.is_admin, u.email)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                              u.is_admin ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                            }`}
                          >
                            <Icon name={u.is_admin ? 'crown' : 'users'} className="w-3.5 h-3.5" />
                            <span>{u.is_admin ? 'Admin (Demote)' : 'User (Promote)'}</span>
                          </button>
                        </td>
                        <td className="p-4 hidden lg:table-cell text-xs text-slate-400">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteUser(u.id, u.email)} className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
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

        {/* ============================================
            TAB 2: QUESTION BANK CRUD VIEW
        ============================================ */}
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

              {/* Question Filters */}
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

            {/* Questions List Table */}
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
                        No questions found matching criteria (or RLS policies blocking read access). Click "Add New Question" to test insert/read.
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

      </main>

      {/* ============================================
          QUESTION CREATE / EDIT MODAL
      ============================================ */}
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

      {/* ============================================
          LOGOUT CONFIRMATION MODAL
      ============================================ */}
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