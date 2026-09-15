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
// ENHANCED ADMIN DASHBOARD WITH CRUD
// ============================================
export default function AdminDashboardPage() {
  const [adminEmail, setAdminEmail] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // CRUD States
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 1. READ: Load Admin Data & Users
  const loadAdminData = async () => {
    try {
      setErrorMsg('')
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setAdminEmail(user.email)
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        setUsers(data)
      }
    } catch (err: any) {
      console.error('Error loading admin dashboard data:', err)
      setErrorMsg('Failed to fetch registry records: ' + (err.message || 'Unknown error'))
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

  // 2. UPDATE: Toggle Admin Role
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

  // 3. UPDATE: Save Inline Edited Name
  const handleSaveName = async (userId: string) => {
    try {
      setErrorMsg('')
      const { error } = await supabase
        .from('users')
        .update({ name: editName })
        .eq('id', userId)

      if (error) throw error
      setEditingId(null)
      await loadAdminData()
    } catch (err: any) {
      console.error('Error updating name:', err)
      alert('Failed to update name: ' + err.message)
    }
  }

  // 4. DELETE: Remove User Record
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
      alert('Deletion failed (Note: Foreign key constraints on related activity tables like module scores may require cascading deletes): ' + err.message)
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

  const stats = useMemo(() => {
    const total = users.length
    const admins = users.filter((u) => u.is_admin).length
    const regularUsers = total - admins
    const recentSignups = users.filter((u) => {
      if (!u.created_at) return false
      const diff = Date.now() - new Date(u.created_at).getTime()
      return diff < 7 * 24 * 60 * 60 * 1000 // last 7 days
    }).length
    return { total, admins, regularUsers, recentSignups }
  }, [users])

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
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-400"
                style={{ animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white relative">
      {/* Background grid pattern */}
      <div className="fixed inset-0 opacity-[0.12] bg-[radial-gradient(rgba(139,92,246,0.4)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Ambient glows */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-violet-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ============================================
          HEADER — FIXED AT TOP (always visible)
      ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-violet-500/20 bg-[#121218]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center border border-violet-400/30 shadow-lg shadow-violet-500/30">
                  <Icon name="shield" className="w-5 h-5 text-white" glow />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#121218] animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-black tracking-tight leading-none">
                  Admin Console
                </h1>
                <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest mt-1">
                  Restricted Node · v2.6.0 (CRUD Enabled)
                </p>
              </div>
            </div>

            {/* Center: Live Clock (Desktop) */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/50 border border-violet-500/20">
              <Icon name="activity" className="w-4 h-4 text-emerald-400" glow />
              <div className="text-xs font-mono">
                <span className="text-emerald-400 font-bold">SYS ONLINE</span>
                <span className="mx-2 text-slate-600">·</span>
                <span className="text-slate-300">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Admin Badge */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-black text-xs">
                  {adminEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider leading-none">
                    Admin
                  </span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                    {adminEmail}
                  </span>
                </div>
              </div>

              {/* Notification Bell */}
              <button className="relative w-10 h-10 rounded-xl flex items-center justify-center border border-violet-500/20 bg-slate-900/50 hover:border-violet-400/50 hover:bg-slate-800/50 transition-all">
                <Icon name="bell" className="w-4 h-4 text-slate-300" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>

              {/* Sign Out */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-400/40 text-xs font-bold transition-all"
              >
                <Icon name="log-out" className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              {/* Mobile sign out (icon only) */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400"
              >
                <Icon name="log-out" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer — pushes content below the fixed header */}
      <div className="h-16" aria-hidden="true" />

      {/* ============================================
          MAIN CONTENT
      ============================================ */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-xs font-bold uppercase underline">Dismiss</button>
          </div>
        )}

        {/* ============================================
            HERO / WELCOME BANNER
        ============================================ */}
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest text-violet-300">
                <Icon name="shield" className="w-3 h-3" glow />
                Authorized Command Center
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Administrator</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time oversight and CRUD management of the Cally database. Edit user accounts, toggle admin access, and maintain system security.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Icon name="refresh" className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Syncing...' : 'Refresh Data'}</span>
              </button>
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-violet-500/20 bg-slate-900/50 text-slate-300 hover:text-white hover:border-violet-400/40 hover:bg-slate-800/50 font-bold text-xs transition-all"
              >
                <Icon name="home" className="w-4 h-4" />
                <span>Public Hub</span>
              </a>
            </div>
          </div>
        </div>

        {/* ============================================
            METRIC CARDS
        ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: 'Total Users',
              value: stats.total,
              icon: 'users',
              gradient: 'from-violet-500 to-purple-500',
              glow: 'shadow-violet-500/30',
              trend: `+${stats.recentSignups} this week`,
              trendColor: 'text-emerald-400',
            },
            {
              label: 'Administrators',
              value: stats.admins,
              icon: 'crown',
              gradient: 'from-amber-500 to-orange-500',
              glow: 'shadow-amber-500/30',
              trend: 'Full access',
              trendColor: 'text-amber-400',
            },
            {
              label: 'Regular Users',
              value: stats.regularUsers,
              icon: 'user-check',
              gradient: 'from-cyan-500 to-blue-500',
              glow: 'shadow-cyan-500/30',
              trend: 'Standard access',
              trendColor: 'text-cyan-400',
            },
            {
              label: 'System Status',
              value: 100,
              displayValue: 'Online',
              icon: 'activity',
              gradient: 'from-emerald-500 to-teal-500',
              glow: 'shadow-emerald-500/30',
              trend: 'All systems operational',
              trendColor: 'text-emerald-400',
            },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-5 transition-all duration-300 hover:border-violet-400/40 hover:scale-[1.02]"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.glow}`}>
                    <Icon name={stat.icon} className="w-5 h-5 text-white" glow />
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${stat.trendColor}`}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-white">
                    {stat.displayValue || <AnimatedCounter value={stat.value} />}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================
            USER MANAGEMENT TABLE (CRUD)
        ============================================ */}
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

          {/* Table Header */}
          <div className="p-6 border-b border-violet-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="grid" className="w-4 h-4 text-violet-400" glow />
                  <h3 className="text-lg font-black tracking-tight">User Management (CRUD)</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Manage registry accounts, toggle role permissions, edit user profiles, and delete records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-violet-500/20 bg-slate-900/50 text-slate-300 hover:text-white hover:border-violet-400/40 text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Icon name="refresh" className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-violet-500/20 bg-slate-900/50 text-slate-300 hover:text-white hover:border-violet-400/40 text-xs font-bold transition-all">
                  <Icon name="download" className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-1 p-1 rounded-xl border border-violet-500/20 bg-slate-900/50">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'admin', label: 'Admins' },
                  { key: 'user', label: 'Users' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setFilterRole(opt.key as any)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      filterRole === opt.key
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
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
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                          <Icon name="users" className="w-6 h-6 text-violet-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-300">No users match your filters</p>
                        <p className="text-xs text-slate-500">Try adjusting the search query or role filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-violet-500/[0.04] transition-colors group">
                      
                      {/* User & Inline Name Edit */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                            u.is_admin
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30'
                              : 'bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30'
                          }`}>
                            <span className="text-white">{(u.name || u.email || '?').charAt(0).toUpperCase()}</span>
                            {u.is_admin && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#151520] flex items-center justify-center">
                                <Icon name="crown" className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            {editingId === u.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="px-2.5 py-1.5 rounded-lg border border-violet-500/40 bg-slate-900 text-white text-xs focus:outline-none"
                                />
                                <button
                                  onClick={() => handleSaveName(u.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-white truncate text-sm">{u.name || 'Unnamed User'}</p>
                                <button
                                  onClick={() => { setEditingId(u.id); setEditName(u.name || '') }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-violet-400 hover:text-violet-300 p-1"
                                  title="Edit Name"
                                >
                                  <Icon name="edit" className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            <p className="text-[11px] text-slate-500 font-mono truncate md:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Icon name="mail" className="w-3.5 h-3.5 text-slate-600" />
                          <span className="text-slate-400 text-xs font-mono truncate max-w-[200px]">{u.email}</span>
                        </div>
                      </td>

                      {/* Role Toggle Button */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleAdmin(u.id, u.is_admin, u.email)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            u.is_admin
                              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                              : 'bg-violet-500/10 text-violet-300 border-violet-500/20 hover:bg-violet-500/20'
                          }`}
                          title="Click to toggle admin status"
                        >
                          {u.is_admin ? (
                            <>
                              <Icon name="crown" className="w-3.5 h-3.5 text-amber-400" />
                              <span>Admin (Demote)</span>
                            </>
                          ) : (
                            <>
                              <Icon name="users" className="w-3.5 h-3.5 text-violet-400" />
                              <span>User (Promote)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Joined */}
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Icon name="clock" className="w-3.5 h-3.5 text-slate-600" />
                          <span className="text-xs">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-400/40 text-xs font-bold transition-all"
                          title="Delete user account"
                        >
                          <Icon name="trash" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="p-4 border-t border-violet-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                Showing <span className="text-violet-300 font-bold">{filteredUsers.length}</span> of{' '}
                <span className="text-violet-300 font-bold">{stats.total}</span> users
              </span>
              <div className="flex items-center gap-2 text-slate-500">
                <Icon name="activity" className="w-3 h-3 text-emerald-400" />
                <span className="font-mono">Live database sync · CRUD Active</span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================
            BOTTOM INFO STRIP
        ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Access Level', value: 'Super Admin', icon: 'shield', color: 'text-violet-400' },
            { label: 'Session Started', value: currentTime.toLocaleDateString(), icon: 'clock', color: 'text-cyan-400' },
            { label: 'Data Source', value: 'Supabase Live', icon: 'activity', color: 'text-emerald-400' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4 rounded-2xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Icon name={item.icon} className={`w-4 h-4 ${item.color}`} glow />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {item.label}
                </p>
                <p className="text-sm font-bold text-white truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================
            FOOTER
        ============================================ */}
        <footer className="pt-6 border-t border-violet-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <span className="text-[7px] font-black text-white">T</span>
            </div>
            <span>&copy; {new Date().getFullYear()} TephdyTech &bull; Admin Console v2.6.0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="shield" className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-500">Restricted Access · All actions logged</span>
          </div>
        </footer>
      </main>

      {/* ============================================
          LOGOUT CONFIRMATION MODAL
      ============================================ */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-violet-500/20 bg-[#151520]/95 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30 flex items-center justify-center mx-auto">
                  <Icon name="log-out" className="w-10 h-10 text-rose-400" glow />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-rose-500 border-2 border-[#151520] flex items-center justify-center">
                  <span className="text-white text-xs font-black">!</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Terminate Session?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  You are about to sign out of the Admin Console. All unsaved changes will be lost.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-black text-base shrink-0">
                    {adminEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 leading-none mb-1">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-white truncate">{adminEmail}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 py-4 px-6 rounded-xl border border-violet-500/20 bg-slate-800/50 text-white font-bold text-sm transition hover:bg-slate-700/50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition hover:shadow-xl hover:shadow-rose-500/50 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
        </div>
      )}

      {/* Add global animation keyframes */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
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