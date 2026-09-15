'use client'

import { useState, useEffect } from 'react'
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
    case 'lock':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      )
    case 'mail':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
        </svg>
      )
    case 'alert-circle':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    case 'arrow-left':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
    case 'activity':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    case 'check':
      return (
        <svg className={`${className} ${glowClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    default:
      return null
  }
}

// ============================================
// ENHANCED ADMIN LOGIN PAGE
// ============================================
export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState<'idle' | 'verifying' | 'granted' | 'denied'>('idle')
  const router = useRouter()

  // Auto-check session on OAuth return
  useEffect(() => {
    async function verifyOAuthReturn() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (session?.user?.email) {
          setLoading(true)
          setSystemStatus('verifying')
          setErrorMsg('')

          const { data: allUsers, error: dbError } = await supabase
            .from('users')
            .select('*')

          const userData = allUsers?.find(
            (u: any) => u.email?.toLowerCase() === session.user.email?.toLowerCase()
          )

          if (!dbError && userData && userData.is_admin === true) {
            setSystemStatus('granted')
            setTimeout(() => {
              router.push('/admin')
              router.refresh()
            }, 800)
          } else {
            await supabase.auth.signOut()
            setSystemStatus('denied')
            setErrorMsg('Access Denied: This Google account does not have administrator privileges.')
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('OAuth verification error:', err)
        setLoading(false)
        setSystemStatus('idle')
      }
    }

    verifyOAuthReturn()
  }, [router])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSystemStatus('verifying')
    setErrorMsg('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Invalid login credentials.')
      }

      const { data: allUsers, error: dbError } = await supabase
        .from('users')
        .select('*')

      const userData = allUsers?.find(
        (u: any) => u.email?.toLowerCase() === email.toLowerCase()
      )

      if (dbError || !userData || userData.is_admin !== true) {
        await supabase.auth.signOut()
        setSystemStatus('denied')
        throw new Error('Access Denied: This account does not have administrator privileges.')
      }

      setSystemStatus('granted')
      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 800)
    } catch (err: any) {
      console.error('Admin login error:', err)
      setErrorMsg(err.message || 'An unexpected error occurred.')
      setLoading(false)
      if (systemStatus !== 'granted') setSystemStatus('idle')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setSystemStatus('verifying')
      setErrorMsg('')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      console.error('Google login error:', err)
      setErrorMsg(err.message || 'Failed to initialize Google login.')
      setLoading(false)
      setSystemStatus('idle')
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#0B0B0D] relative overflow-hidden p-4">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(rgba(139,92,246,0.4)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid lines decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-400 to-transparent" />
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
        <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="absolute w-4 h-4 rounded-full bg-emerald-400/30 animate-ping" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Secure Connection
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="cpu" className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold">
              Admin Node
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="relative rounded-3xl border border-violet-500/20 bg-[#151520]/85 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500" />

          {/* Scan line effect */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

          <div className="relative p-8 space-y-6">
            {/* Logo & Header */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-2xl border border-violet-400/30">
                  <Icon name="shield" className="w-8 h-8 text-white" glow />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest text-violet-300">
                    <Icon name="lock" className="w-3 h-3" />
                    Restricted Access
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Cally Admin Portal
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authorized personnel only. All access attempts are logged and monitored.
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            {systemStatus !== 'idle' && (
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                systemStatus === 'verifying'
                  ? 'bg-violet-500/10 border-violet-500/30'
                  : systemStatus === 'granted'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus === 'verifying'
                    ? 'bg-violet-400 animate-pulse'
                    : systemStatus === 'granted'
                      ? 'bg-emerald-400'
                      : 'bg-rose-400'
                }`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  systemStatus === 'verifying'
                    ? 'text-violet-300'
                    : systemStatus === 'granted'
                      ? 'text-emerald-300'
                      : 'text-rose-300'
                }`}>
                  {systemStatus === 'verifying' && 'Verifying Credentials...'}
                  {systemStatus === 'granted' && 'Access Granted — Redirecting'}
                  {systemStatus === 'denied' && 'Access Denied — Insufficient Privileges'}
                </span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="relative flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent" />
                <Icon name="alert-circle" className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" glow />
                <p className="relative text-xs font-semibold text-rose-300 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            )}

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white font-bold text-sm transition-all duration-300 hover:border-violet-400/50 hover:bg-slate-800/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.87z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.32 7.23 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.82 0 12s.43 3.88 1.18 5.4l4.09-3.16z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
              <span className="relative">
                {loading ? 'Verifying Admin Access...' : 'Continue with Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                or email
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Icon name="mail" className="w-3 h-3 text-violet-400" />
                  Admin Email
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 transition-opacity duration-300 ${
                    focusedField === 'email' ? 'opacity-100' : 'opacity-0'
                  } blur-sm`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="relative w-full px-4 py-3.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="admin@tephdytech.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Icon name="lock" className="w-3 h-3 text-violet-400" />
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 transition-opacity duration-300 ${
                    focusedField === 'password' ? 'opacity-100' : 'opacity-0'
                  } blur-sm`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="relative w-full px-4 py-3.5 rounded-xl border border-violet-500/20 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black text-sm shadow-lg shadow-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="shield" className="w-4 h-4" glow />
                      <span>Sign In with Email</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Security Features List */}
            <div className="pt-2 space-y-2">
              {[
                { label: 'End-to-end encrypted', icon: 'check' },
                { label: 'Session monitoring active', icon: 'check' },
                { label: 'IP address logged', icon: 'check' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <Icon name="check" className="w-3 h-3 text-emerald-400" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

            {/* Return Link */}
            <div className="text-center">
              <a
                href="/"
                className="group inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-violet-300 transition-colors"
              >
                <Icon name="arrow-left" className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Cally Public Hub</span>
              </a>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-violet-600" />
        </div>

        {/* Footer Info */}
        <div className="mt-4 flex items-center justify-between px-2 text-[10px] font-mono text-slate-600">
          <span>v2.6.0 · Secure Node</span>
          <span className="flex items-center gap-1.5">
            <Icon name="activity" className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-500">All Systems Operational</span>
          </span>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-4 text-center text-[10px] text-slate-600">
          &copy; {new Date().getFullYear()} TephdyTech &bull; Restricted Access Portal
        </div>
      </div>
    </div>
  )
}