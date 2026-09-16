import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (adjust with your keys or pass as props)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function LearningHub({ session }: { session: any }) {
  const [lessons, setLessons] = useState<any[]>([])
  const [progress, setProgress] = useState<string[]>([]) // array of completed lesson_ids
  const [certificates, setCertificates] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null)
  const [activeLevel, setActiveLevel] = useState<'beginner' | 'intermediate' | 'upper_intermediate' | 'advanced'>('beginner')
  const [loading, setLoading] = useState(true)

  const levels = [
    { id: 'beginner', label: 'Beginner (A1-A2)' },
    { id: 'intermediate', label: 'Intermediate (B1)' },
    { id: 'upper_intermediate', label: 'Upper-Intermediate (B2)' },
    { id: 'advanced', label: 'Advanced (C1-C2)' },
  ]

  useEffect(() => {
    if (session) {
      loadStudentData()
    }
  }, [session])

  const loadStudentData = async () => {
    setLoading(true)
    try {
      // 1. Fetch all lessons
      const { data: lessonsData, error: lError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true })
      if (lError) throw lError
      setLessons(lessonsData || [])

      // 2. Fetch user progress
      const { data: progData, error: pError } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', session.user.id)
        .eq('completed', true)
      if (pError) throw pError
      setProgress(progData ? progData.map((p) => p.lesson_id) : [])

      // 3. Fetch certificates
      const { data: certData, error: cError } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', session.user.id)
      if (cError) throw cError
      setCertificates(certData || [])
    } catch (err: any) {
      console.error('Error loading hub data:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleLessonComplete = async (lessonId: string) => {
    const isCompleted = progress.includes(lessonId)
    const newCompletedState = !isCompleted

    try {
      if (newCompletedState) {
        // Upsert progress as completed
        const { error } = await supabase.from('user_progress').upsert(
          { user_id: session.user.id, lesson_id: lessonId, completed: true, completed_at: new Date() },
          { onConflict: 'user_id,lesson_id' }
        )
        if (error) throw error
        setProgress([...progress, lessonId])
        checkLevelCompletion([...progress, lessonId], activeLevel)
      } else {
        // Mark incomplete
        const { error } = await supabase
          .from('user_progress')
          .update({ completed: false })
          .eq('user_id', session.user.id)
          .eq('lesson_id', lessonId)
        if (error) throw error
        setProgress(progress.filter((id) => id !== lessonId))
      }
    } catch (err: any) {
      alert('Failed to update progress: ' + err.message)
    }
  }

  const checkLevelCompletion = async (currentProgress: string[], levelKey: string) => {
    const levelLessons = lessons.filter((l) => l.level === levelKey)
    if (levelLessons.length === 0) return

    const allDone = levelLessons.every((l) => currentProgress.includes(l.id))
    if (allDone) {
      // Check if certificate already exists
      const hasCert = certificates.some((c) => c.level_name === levelKey)
      if (!hasCert) {
        const certCode = 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase()
        const { data, error } = await supabase
          .from('certificates')
          .insert([{ user_id: session.user.id, level_name: levelKey, certificate_code: certCode }])
          .select()
        
        if (!error && data) {
          setCertificates([...certificates, data[0]])
          alert(`Congratulations! You unlocked the Certificate for ${levelKey.toUpperCase()}!`)
        }
      }
    }
  }

  const filteredLessons = lessons.filter((l) => l.level === activeLevel)
  const completedCount = filteredLessons.filter((l) => progress.includes(l.id)).length
  const progressPercentage = filteredLessons.length > 0 ? Math.round((completedCount / filteredLessons.length) * 100) : 0
  const hasCertificate = certificates.some((c) => c.level_name === activeLevel)

  if (loading) return <div className="p-6 text-white">Loading Learning Hub...</div>

  return (
    <div className="max-w-6xl mx-auto p-6 text-white space-y-6">
      {/* Header & Level Selection Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black">English Learning Academy</h1>
          <p className="text-slate-400 text-sm">Master your grammar curriculum tier by tier.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => { setActiveLevel(lvl.id as any); setSelectedLesson(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeLevel === lvl.id ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar & Certificate Banner */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-2/3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold capitalize">{activeLevel.replace('_', ' ')} Progress</span>
            <span className="text-violet-400 font-bold">{progressPercentage}% Complete ({completedCount}/{filteredLessons.length})</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-violet-500 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        {hasCertificate && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <span>🏆 Certificate Unlocked!</span>
          </div>
        )}
      </div>

      {/* Main Content Area: Split View (Lesson List vs Lesson Reader) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lesson List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Curriculum Lessons</h2>
          {filteredLessons.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No lessons available for this level yet.</p>
          ) : (
            filteredLessons.map((lesson, idx) => {
              const isDone = progress.includes(lesson.id)
              const isSelected = selectedLesson?.id === lesson.id
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? 'bg-violet-600/20 border-violet-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm line-clamp-1">{lesson.title}</span>
                  </div>
                  {isDone && <span className="text-emerald-400 text-xs font-bold">Done</span>}
                </div>
              )
            })
          )}
        </div>

        {/* Lesson Reader / Viewer */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[400px]">
          {selectedLesson ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
                <button
                  onClick={() => toggleLessonComplete(selectedLesson.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    progress.includes(selectedLesson.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-violet-600 text-white hover:bg-violet-500'
                  }`}
                >
                  {progress.includes(selectedLesson.id) ? '✓ Completed' : 'Mark as Complete'}
                </button>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedLesson.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-slate-500">
              <p className="text-base font-medium">Select a lesson from the left panel to begin reading.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}