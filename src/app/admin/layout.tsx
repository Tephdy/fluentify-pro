'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // 1. Get current logged-in user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          console.log("❌ Admin Layout: No active session found.")
          router.push('/')
          return
        }

        console.log("🔍 Logged-in User ID:", user.id)
        console.log("🔍 Logged-in Email:", user.email)

        // 2. Fetch admin status from public.users
        const { data: userDataList, error: dbError } = await supabase
          .from('users')
          .select('is_admin, id, email')
          .eq('id', user.id)
          .limit(1)

        console.log("🔍 Database Query Result:", userDataList)
        console.log("🔍 Database Query Error:", dbError)

        const userData = userDataList?.[0]

        if (dbError || !userData || userData.is_admin !== true) {
          console.log("❌ User is not an admin or query blocked by RLS.")
          router.push('/')
          return
        }

        // 3. Authorized!
        setAuthorized(true)
      } catch (err) {
        console.error("❌ Error verifying admin access:", err)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

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