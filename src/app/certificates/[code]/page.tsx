'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CertificatePage() {
  const [certificate, setCertificate] = useState<any>(null)
  const [studentName, setStudentName] = useState<string>('Student')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const certificateCode = params.code as string

  useEffect(() => {
    async function fetchCertificateDetails() {
      try {
        // 1. Fetch certificate by unique code
        const { data: certData, error: certError } = await supabase
          .from('certificates')
          .select('*')
          .eq('certificate_code', certificateCode)
          .single()

        if (certError || !certData) {
          router.push('/tutorials')
          return
        }

        setCertificate(certData)

        // 2. Fetch the user's profile name from the users table
        const { data: userData } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', certData.user_id)
          .single()

        if (userData) {
          setStudentName(userData.name || userData.email || 'Valued Student')
        }
      } catch (err) {
        console.error('Error fetching certificate:', err)
      } finally {
        setLoading(false)
      }
    }

    if (certificateCode) fetchCertificateDetails()
  }, [certificateCode, router])

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center">Authenticating Credential...</div>
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl w-full space-y-6 relative z-10">
        
        {/* Navigation Bar (Hidden when printing) */}
        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={() => router.push('/tutorials')}
            className="px-4 py-2 rounded-xl border border-violet-500/20 bg-slate-900/50 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            ← Back to Learning Hub
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all"
          >
            🖨️ Print / Save PDF
          </button>
        </div>

        {/* Certificate Card */}
        <div className="bg-[#151520] border-2 border-violet-500/40 rounded-3xl p-10 sm:p-16 text-center relative shadow-2xl overflow-hidden print:bg-white print:text-black print:border-slate-800">
          
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono uppercase tracking-widest print:border-slate-400 print:text-slate-700">
              Official Certificate of Completion
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight print:text-black">
              English Learning Hub
            </h1>

            <p className="text-sm text-slate-400 print:text-slate-600">This credential is proudly presented to</p>

            <div className="py-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-violet-300 border-b-2 border-violet-500/20 pb-3 inline-block px-8 print:text-violet-900 print:border-slate-400">
                {studentName}
              </h2>
            </div>

            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed print:text-slate-700">
              For successfully mastering the core curriculum, completing all milestone assignments, and demonstrating proficiency in the 
              <span className="text-white font-bold capitalize print:text-black"> {certificate?.level_name?.replace('_', ' ')} Level</span>.
            </p>

            <div className="pt-12 flex flex-col sm:flex-row items-center justify-between border-t border-violet-500/20 text-xs text-slate-500 font-mono gap-4 print:border-slate-300 print:text-slate-600">
              <div>Issued Date: {new Date(certificate?.issued_at).toLocaleDateString()}</div>
              <div>Secure Credential ID: <span className="text-violet-400 print:text-slate-900 font-bold">{certificate?.certificate_code}</span></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}