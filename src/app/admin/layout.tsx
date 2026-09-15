'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip verification check if we are on the admin login page
    if (pathname === '/admin/login') {
      setLoading(false)
      setAuthorized(true)
      return
    }

    async function checkAdminStatus() {
      try {
        // 1. Get current logged-in browser session
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user || !user.email) {
          router.push('/admin/login')
          return
        }

        // 2. Fetch records safely from public.users
        const { data: allUsers, error: dbError } = await supabase
          .from('users')
          .select('*')

        if (dbError || !allUsers) {
          router.push('/admin/login')
          return
        }

        // 3. Match the user by email (case-insensitive)
        const userData = allUsers.find(
          (u: any) => u.email?.toLowerCase() === user.email?.toLowerCase()
        )

        // 4. Verify admin privileges
        if (!userData || userData.is_admin !== true) {
          await supabase.auth.signOut()
          router.push('/admin/login?error=unauthorized')
          return
        }

        // 5. Success! Grant entry
        setAuthorized(true)
      } catch (err) {
        console.error("Error verifying admin access:", err)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Verifying admin privileges...
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="admin-layout-wrapper">
      {children}
    </div>
  )
}