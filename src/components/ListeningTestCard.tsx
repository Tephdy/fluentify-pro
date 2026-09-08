// src/components/ListeningTestCard.tsx
'use client';

import { useState } from 'react';
import { PracticeTest, getBandScore } from '@/data/tests';
import Timer from './Timer';
import { RefreshCw, CheckCircle, Volume2 } from 'lucide-react';

export default function ListeningTestCard({ test }: { test: PracticeTest }) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleInputChange = (questionId: number, value: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let correct = 0;
    test.questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const actualAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === actualAns) {
        correct++;
      }
    });
    setScore(correct);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {test.module}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">{test.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Timer
            initialMinutes={test.timeLimitMinutes}
            onTimeUp={handleSubmit}
            isActive={!isSubmitted}
          />
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition"
            title="Reset Test"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Audio Player */}
      {test.audioUrl && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-4">
          <Volume2 className="w-6 h-6 text-indigo-600 shrink-0" />
          <audio controls src={test.audioUrl} className="w-full h-10" />
        </div>
      )}

      {/* Questions Form */}
      <div className="space-y-6">
        {test.questions.map((q, index) => {
          const isCorrect =
            userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

          return (
            <div
              key={q.id}
              className={`p-4 rounded-lg border transition ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-rose-200 bg-rose-50/50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <label className="block text-sm font-medium text-slate-800 mb-2">
                <span className="font-bold mr-1">{index + 1}.</span> {q.prompt}
              </label>

              {q.type === 'fill-in-blank' && (
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={userAnswers[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full max-w-sm px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                />
              )}

              {q.type === 'multiple-choice' && q.options && (
                <div className="space-y-2 mt-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        disabled={isSubmitted}
                        checked={userAnswers[q.id] === opt}
                        onChange={() => handleInputChange(q.id, opt)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* Instant Answer Feedback */}
              {isSubmitted && (
                <div className="mt-3 text-xs font-semibold">
                  {isCorrect ? (
                    <p className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Correct
                    </p>
                  ) : (
                    <p className="text-rose-700">
                      Incorrect. Correct answer:{' '}
                      <span className="font-bold">{q.correctAnswer}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission & Score Display */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          Submit Test
        </button>
      ) : (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center space-y-1">
          <h3 className="text-lg font-bold text-indigo-950">Test Completed!</h3>
          <p className="text-sm text-indigo-800">
            Raw Score: <span className="font-bold">{score}</span> / {test.questions.length}
          </p>
          <p className="text-md font-extrabold text-indigo-600">
            Estimated Band Score: {score !== null ? getBandScore(score, test.questions.length) : 0}
          </p>
        </div>
      )}
    </div>
  );
}