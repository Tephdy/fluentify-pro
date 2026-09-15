'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase' // Uses your centralized client configuration

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCertificates: 0,
    openTickets: 0,
    avgRating: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        // Fetch counts in parallel from your Supabase tables
        const [usersRes, certsRes, ticketsRes, ratingsRes] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
          supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('system_ratings').select('rating'),
        ])

        // Calculate average rating if ratings exist
        let avg = 0
        if (ratingsRes.data && ratingsRes.data.length > 0) {
          const sum = ratingsRes.data.reduce((acc, curr) => acc + curr.rating, 0)
          avg = Number((sum / ratingsRes.data.length).toFixed(1))
        }

        setStats({
          totalUsers: usersRes.count || 0,
          totalCertificates: certsRes.count || 0,
          openTickets: ticketsRes.count || 0,
          avgRating: avg,
        })
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminStats()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading admin dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cally Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor user activity, certificates, and system feedback in real-time.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Certificates Issued</p>
            <p className="text-3xl font-bold mt-2">{stats.totalCertificates}</p>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Open Support Tickets</p>
            <p className="text-3xl font-bold mt-2 text-primary">{stats.openTickets}</p>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Average System Rating</p>
            <p className="text-3xl font-bold mt-2">⭐ {stats.avgRating} / 5</p>
          </div>

        </div>

        {/* Quick Actions / Navigation Section */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Management</h3>
          <div className="flex flex-wrap gap-4">
            <a href="/admin/users" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
              Manage Users
            </a>
            <a href="/admin/tickets" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90">
              View Support Tickets
            </a>
            <a href="/admin/ratings" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90">
              Check System Ratings
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}