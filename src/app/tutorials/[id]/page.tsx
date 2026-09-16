'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LessonReaderPage() {
  const [lesson, setLesson] = useState<any>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [earnedCertificate, setEarnedCertificate] = useState<any>(null)
  
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  useEffect(() => {
    async function loadLessonAndProgress() {
      try {
        // 1. Fetch current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/admin/login') // or your user login route
          return
        }

        // 2. Fetch specific lesson details
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single()

        if (lessonError || !lessonData) {
          router.push('/tutorials')
          return
        }
        setLesson(lessonData)

        // 3. Check user progress for this lesson
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .single()

        if (progressData && progressData.completed) {
          setIsCompleted(true)
        }
      } catch (err) {
        console.error('Error loading lesson:', err)
      } finally {
        setLoading(false)
      }
    }

    if (lessonId) loadLessonAndProgress()
  }, [lessonId, router])

  // Function to handle completion and check for certificate eligibility
  const handleToggleComplete = async () => {
    setUpdating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const nextStatus = !isCompleted
      const timestamp = nextStatus ? new Date().toISOString() : null

      // Upsert user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: nextStatus,
          completed_at: timestamp
        }, { onConflict: 'user_id,lesson_id' })

      if (progressError) throw progressError
      setIsCompleted(nextStatus)

      // If they just completed the lesson, check if ALL lessons for this level are finished
      if (nextStatus) {
        await checkLevelCompletion(user.id, lesson.level)
      }
    } catch (err) {
      console.error('Error updating progress:', err)
      alert('Failed to update progress.')
    } finally {
      setUpdating(false)
    }
  }

  // Automatic Certificate Generation Logic
  const checkLevelCompletion = async (userId: string, levelName: string) => {
    try {
      // 1. Get all lessons belonging to this level
      const { data: levelLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('level', levelName)

      if (!levelLessons || levelLessons.length === 0) return

      const levelLessonIds = levelLessons.map(l => l.id)

      // 2. Get user's completed lessons for this level
      const { data: userCompletions } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('completed', true)
        .in('lesson_id', levelLessonIds)

      if (!userCompletions) return

      // 3. Compare counts
      if (userCompletions.length === levelLessons.length) {
        // Check if certificate already exists
        const { data: existingCert } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', userId)
          .eq('level_name', levelName)
          .single()

        if (!existingCert) {
          // Generate unique code
          const certCode = `ENG-${levelName.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          
          const { data: newCert, error: certError } = await supabase
            .from('certificates')
            .insert({
              user_id: userId,
              level_name: levelName,
              certificate_code: certCode
            })
            .select()
            .single()

          if (!certError && newCert) {
            setEarnedCertificate(newCert)
          }
        } else {
          setEarnedCertificate(existingCert)
        }
      }
    } catch (err) {
      console.error('Error checking level completion:', err)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center">Loading Lesson...</div>
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center border-b border-violet-500/20 pb-6">
          <button
            onClick={() => router.push('/tutorials')}
            className="px-4 py-2 rounded-xl border border-violet-500/20 bg-slate-900/50 text-xs font-bold text-slate-300 hover:text-white"
          >
            ← Back to Learning Hub
          </button>
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 capitalize">
            Level: {lesson?.level?.replace('_', ' ')}
          </span>
        </div>

        {/* Certificate Pop-up Notification Modal if Earned */}
        {earnedCertificate && (
          <div className="p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">🎉 Milestone Achieved!</span>
              <h3 className="text-xl font-black text-white">You've Unlocked a New Certificate!</h3>
              <p className="text-xs text-slate-300">You have completed all lessons in the {lesson?.level} level.</p>
            </div>
            <button
              onClick={() => router.push(`/certificates/${earnedCertificate.certificate_code}`)}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all shrink-0"
            >
              View Official Certificate →
            </button>
          </div>
        )}

        {/* Lesson Card */}
        <div className="rounded-3xl border border-violet-500/20 bg-[#151520]/70 backdrop-blur-xl p-8 sm:p-10 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white">{lesson?.title}</h1>
            <p className="text-xs text-slate-500 font-mono">Published in curriculum</p>
          </div>

          <div className="border-t border-violet-500/10 pt-6">
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 whitespace-pre-line text-sm sm:text-base">
              {lesson?.content}
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-violet-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Finished reading? Mark this lesson as complete to track your progress toward your certificate.
            </p>
            <button
              onClick={handleToggleComplete}
              disabled={updating}
              className={`px-6 py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                isCompleted
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
              }`}
            >
              {updating ? 'Saving...' : isCompleted ? '✓ Lesson Completed (Click to Undo)' : 'Mark as Complete'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}