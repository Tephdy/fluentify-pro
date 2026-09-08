'use client';

import { useState } from 'react';
import Image from 'next/image';
import AudioPlayer from '@/components/AudioPlayer';
import SpeakingRecorder from '@/components/SpeakingRecorder';

interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface TestData {
  id: string;
  title: string;
  audioScript?: string;
  passage?: string;
  questions: Question[];
}

type ModuleType = 'listening' | 'reading' | 'writing' | 'speaking';

export default function Home() {
  // Navigation & View Mode
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);

  // Practice State
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Submission & Scoring State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectModule = (tab: ModuleType) => {
    setSelectedModule(tab);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setSelectedAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setSelectedModule(null);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setSelectedAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateTest = async (moduleType: ModuleType) => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(null);
    setSelectedAnswers({});

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleType }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestData(data);
      } else {
        alert(data.error || 'Generation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to generation service');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.correctAnswer?.trim().toLowerCase();
      if (userAnswer && userAnswer === correctAnswer) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const dashboardFeatures = [
    {
      id: 'listening' as ModuleType,
      title: 'Listening Simulator',
      description: 'Practice multi-accent audio scripts with note completion and multiple-choice questions.',
      tag: 'Audio Drills',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
    },
    {
      id: 'reading' as ModuleType,
      title: 'Reading Comprehension',
      description: 'Analyze timed academic reading passages with instant evaluation and detailed answer keys.',
      tag: 'Timed Passages',
      color: 'border-amber-200 bg-amber-50/40 text-amber-700',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'writing' as ModuleType,
      title: 'Writing Assessment',
      description: 'Evaluate Task 1 reports and Task 2 essays with AI checking cohesion, grammar, and vocabulary.',
      tag: 'Essay Scoring',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-700',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'speaking' as ModuleType,
      title: 'Speaking Voice AI',
      description: 'Record speech responses, get real-time transcriptions, and receive instant band score feedback.',
      tag: 'Voice Analysis',
      color: 'border-rose-200 bg-rose-50/40 text-rose-700',
      btnColor: 'bg-rose-600 hover:bg-rose-700',
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
  ];

  const activeFeature = dashboardFeatures.find((f) => f.id === selectedModule);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToDashboard}>
            {/* Header Mascot Logo */}
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="Fluentify Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-lg block">
                Fluentify Pro
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {selectedModule ? `Focused View: ${activeFeature?.title}` : 'All-in-One AI Exam Suite'}
              </span>
            </div>
          </div>

          {/* Action button changes contextually */}
          <div className="flex items-center gap-4">
            {selectedModule ? (
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition border border-slate-200/80"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => handleSelectModule('listening')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-xs"
              >
                Quick Start
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-8 py-6">
        {/* ========================================================= */}
        {/* VIEW 1: DASHBOARD OVERVIEW (SHOWS WHEN NO MODULE IS CHOSEN) */}
        {/* ========================================================= */}
        {!selectedModule && (
          <div className="space-y-12">
            {/* Hero Banner */}
            <section className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950/50 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI Exam Engine Active
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Master Language Proficiency with <span className="text-indigo-400">Automated Intelligence</span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                  Select a module below to launch a distraction-free practice environment tailored specifically for that exam section.
                </p>
              </div>
            </section>

            {/* Feature Cards Grid */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-4 gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Assessment Dashboard</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Choose a section to enter dedicated focus mode</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
                  4 Core Modules Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {dashboardFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          {feat.icon}
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${feat.color}`}>
                          {feat.tag}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">{feat.title}</h3>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{feat.description}</p>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => handleSelectModule(feat.id)}
                        className={`w-full text-white font-medium text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 ${feat.btnColor}`}
                      >
                        <span>Launch {feat.title.split(' ')[0]}</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: DEDICATED MODULE FOCUS MODE (SHOWS WHEN A MODULE IS ACTIVE) */}
        {/* ========================================================= */}
        {selectedModule && (
          <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Top Toolbar Navigation & Module Selector */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition text-slate-600"
                  title="Return to Dashboard"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>

                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    Focused Practice Mode
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {activeFeature?.title}
                  </h2>
                </div>
              </div>

              {/* Module Quick Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full md:w-auto justify-between md:justify-start">
                {dashboardFeatures.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectModule(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      selectedModule === f.id
                        ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.id}
                  </button>
                ))}
              </div>

              {/* AI Test Generator Button */}
              <button
                onClick={() => generateTest(selectedModule)}
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate AI Test</span>
                  </>
                )}
              </button>
            </div>

            {/* Dedicated Active Test Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {testData?.title || `${selectedModule.toUpperCase()} Practice Engine`}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                  {selectedModule}
                </span>
              </div>

              {/* Listening Module: Audio Player */}
              {testData?.audioScript && selectedModule === 'listening' && (
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <AudioPlayer script={testData.audioScript} />
                </div>
              )}

              {/* Listening Module: Collapsible Transcript */}
              {testData?.audioScript && selectedModule === 'listening' && (
                <details className="group border border-slate-200 rounded-xl bg-slate-50 overflow-hidden text-sm text-slate-700 transition">
                  <summary className="font-medium text-slate-800 p-4 cursor-pointer hover:bg-slate-100/80 flex items-center justify-between">
                    <span>View Audio Transcript</span>
                    <span className="text-slate-400 text-xs group-open:rotate-180 transition-transform duration-200">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pt-1 border-t border-slate-200/60 whitespace-pre-line text-slate-600 bg-white">
                    {testData.audioScript}
                  </div>
                </details>
              )}

              {/* Reading Module: Passage Box */}
              {testData?.passage && selectedModule === 'reading' && (
                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm leading-relaxed text-slate-700 space-y-2">
                  <strong className="text-slate-900 font-semibold block text-xs uppercase tracking-wider">
                    Reading Passage
                  </strong>
                  <div className="whitespace-pre-line text-slate-800">{testData.passage}</div>
                </div>
              )}

              {/* Speaking Module Component */}
              {selectedModule === 'speaking' && (
                <SpeakingRecorder promptText={testData?.title || 'Speaking Practice Test'} />
              )}

              {/* Empty State Prompt */}
              {!testData && !loading && selectedModule !== 'speaking' && (
                <div className="text-center py-16 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
                    ✨
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">No Test Generated Yet</h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    Click <strong className="text-slate-700">Generate AI Test</strong> above to build a fresh set of practice questions for this section.
                  </p>
                </div>
              )}

              {/* Questions Area */}
              {selectedModule !== 'speaking' && testData?.questions && testData.questions.length > 0 && (
                <div className="space-y-5 pt-2">
                  {testData.questions.map((q, idx) => {
                    const userAnswer = selectedAnswers[q.id] || '';
                    const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();

                    return (
                      <div
                        key={q.id || idx}
                        className={`p-5 border rounded-xl transition space-y-3 ${
                          isSubmitted
                            ? isCorrect
                              ? 'border-emerald-200 bg-emerald-50/30'
                              : 'border-rose-200 bg-rose-50/30'
                            : 'border-slate-200/80 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-semibold text-slate-900 text-sm sm:text-base">
                            <span className="text-indigo-600 mr-1.5">{idx + 1}.</span>
                            {q.question || 'Answer the question below:'}
                          </p>
                          {isSubmitted && (
                            <span
                              className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                                isCorrect
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                            </span>
                          )}
                        </div>

                        {/* Multiple Choice Options */}
                        {q.options && q.options.length > 0 ? (
                          <div className="space-y-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isOptionSelected = userAnswer === opt;
                              const isCorrectOption =
                                opt.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();

                              let optionStyle = 'text-slate-700 hover:bg-slate-50 border-slate-200';
                              if (isSubmitted) {
                                if (isCorrectOption) optionStyle = 'text-emerald-800 bg-emerald-50/80 border-emerald-300 font-medium';
                                else if (isOptionSelected && !isCorrect) optionStyle = 'text-rose-700 bg-rose-50/80 border-rose-300 line-through';
                              } else if (isOptionSelected) {
                                optionStyle = 'text-indigo-900 bg-indigo-50/50 border-indigo-300 font-medium';
                              }

                              return (
                                <label
                                  key={optIdx}
                                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer text-sm transition ${optionStyle}`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    value={opt}
                                    disabled={isSubmitted}
                                    checked={isOptionSelected}
                                    onChange={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: opt })}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          /* Text Answer Input */
                          <div className="pt-1">
                            <input
                              type="text"
                              disabled={isSubmitted}
                              value={userAnswer}
                              placeholder="Type your answer here..."
                              onChange={(e) => setSelectedAnswers({ ...selectedAnswers, [q.id]: e.target.value })}
                              className="w-full max-w-md px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 transition"
                            />
                          </div>
                        )}

                        {/* Incorrect Answer Reveal */}
                        {isSubmitted && !isCorrect && (
                          <div className="mt-2 text-xs text-slate-700 bg-white/90 p-3 rounded-lg border border-slate-200 flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">Correct Answer:</span>
                            <span className="text-emerald-700 font-medium">{q.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit & Scoring Panel */}
              {selectedModule !== 'speaking' && testData?.questions && testData.questions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-xs text-sm"
                    >
                      Submit Test
                    </button>
                  ) : (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-indigo-50/70 border border-indigo-200/80 p-5 rounded-xl gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-indigo-950">
                          Your Score: {score} / {testData.questions.length}
                        </h4>
                        <p className="text-xs text-indigo-700 mt-0.5">
                          {score === testData.questions.length
                            ? 'Perfect score! Excellent work.'
                            : 'Review the highlighted correct answers above.'}
                        </p>
                      </div>
                      <button
                        onClick={() => generateTest(selectedModule)}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition shadow-xs"
                      >
                        Try Another Test
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 mt-12">
        <div className="w-full max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Fluentify Pro. Developed By TephdyTech.</p>
          <div className="flex items-center gap-4">
            <span>Voice & Audio Recognition</span>
            <span>•</span>
            <span>Groq AI Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}