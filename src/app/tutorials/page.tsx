'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LearningHubPage() {
  const [lessons, setLessons] = useState<any[]>([])
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<string>('beginner')
  const router = useRouter()

  useEffect(() => {
    async function loadHubData() {
      try {
        // 1. Fetch all lessons
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .order('order_index', { ascending: true })

        if (lessonsData) setLessons(lessonsData)

        // 2. Fetch logged-in user progress
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)

          if (progressData) setProgress(progressData)
        }
      } catch (err) {
        console.error('Error loading learning hub:', err)
      } finally {
        setLoading(false)
      }
    }

    loadHubData()
  }, [])

  const levels = [
    { key: 'beginner', title: 'Beginner (A1-A2)', desc: 'Core building blocks, alphabet, and basic tenses.' },
    { key: 'intermediate', title: 'Intermediate (B1)', desc: 'Continuous tenses, modals, and prepositions.' },
    { key: 'upper_intermediate', title: 'Upper-Intermediate (B2)', desc: 'Conditionals, reported speech, and clauses.' },
    { key: 'advanced', title: 'Advanced (C1-C2)', desc: 'Inversion, subjunctive mood, and nuanced styling.' },
  ]

  const filteredLessons = lessons.filter(l => l.level === selectedLevel)

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center">Loading Learning Hub...</div>
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-violet-500/20 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400">English Tutorials Hub</span>
            <h1 className="text-3xl font-black tracking-tight mt-1">Master English Step-by-Step</h1>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded-xl border border-violet-500/20 bg-slate-900/50 text-xs font-bold text-slate-300 hover:text-white"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Level Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {levels.map((lvl) => (
            <button
              key={lvl.key}
              onClick={() => setSelectedLevel(lvl.key)}
              className={`p-5 rounded-2xl text-left border transition-all ${
                selectedLevel === lvl.key
                  ? 'border-violet-400 bg-violet-600/20 shadow-lg shadow-violet-500/20'
                  : 'border-violet-500/20 bg-[#151520]/70 hover:border-violet-400/40'
              }`}
            >
              <h3 className="font-bold text-base mb-1">{lvl.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
            </button>
          ))}
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Curriculum Lessons</h2>
          
          {filteredLessons.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-violet-500/20 bg-[#151520]/70 text-slate-400">
              No lessons published for this level yet. Check back soon or add them via your Admin Console!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredLessons.map((lesson, idx) => {
                const isCompleted = progress.some(p => p.lesson_id === lesson.id && p.completed)
                return (
                  <div
                    key={lesson.id}
                    onClick={() => router.push(`/tutorials/${lesson.id}`)}
                    className="flex items-center justify-between p-5 rounded-2xl border border-violet-500/20 bg-[#151520]/70 hover:border-violet-400/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center font-mono font-bold text-violet-300">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-violet-300 transition-colors">{lesson.title}</h4>
                        <p className="text-xs text-slate-400 capitalize">Level: {lesson.level.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div>
                      {isCompleted ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          Completed ✓
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold group-hover:bg-violet-500/20">
                          Start Lesson →
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}