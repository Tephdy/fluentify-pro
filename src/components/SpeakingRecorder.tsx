'use client';

import { useState, useRef } from 'react';

interface EvaluationResult {
  cefrLevel: string;
  overallScore: number;
  taskAchievement: number;
  logicalConnectivity: number;
  lexicalDepth: number;
  grammaticalVersatility: number;
  pronunciation: number;
  feedback: string;
}

interface SpeakingRecorderProps {
  promptText: string;
}

export default function SpeakingRecorder({ promptText }: SpeakingRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        'Speech Recognition is not supported on this browser. Try Google Chrome or Safari.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setErrorMessage(`Microphone error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setEvaluation(null);
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Could not initialize microphone access.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const analyzeSpeech = async () => {
    const trimmedTranscript = transcript.trim();
    if (!trimmedTranscript) {
      setErrorMessage('Please record or enter text before requesting evaluation.');
      return;
    }

    setEvaluating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ transcript: trimmedTranscript, prompt: promptText }),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        console.error('Non-JSON server response:', textResponse);
        throw new Error(`Server returned error status (${res.status}). Verify API route.`);
      }

      if (res.ok) {
        setEvaluation(data);
      } else {
        console.error('Evaluation endpoint error:', data);
        setErrorMessage(data.error || `Server returned error status ${res.status}`);
      }
    } catch (err: any) {
      console.error('Fetch exception:', err);
      setErrorMessage(
        err.message || 'Network error: Unable to connect to evaluation service.'
      );
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
            Speaking Practice
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Record your answer or refine your transcript below.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            AI Examiner
          </span>
        </div>
      </div>

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200/60 text-rose-800 text-xs sm:text-sm rounded-xl flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <svg
              className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-700 font-bold text-base leading-none transition"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-medium text-sm px-5 py-3 rounded-xl transition-all shadow-sm shadow-rose-200"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-medium text-sm px-5 py-3 rounded-xl transition-all shadow-sm"
          >
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-xs"></span>
            <span>Stop Recording</span>
          </button>
        )}

        {transcript && !isRecording && (
          <button
            onClick={analyzeSpeech}
            disabled={evaluating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-medium text-sm px-5 py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm shadow-indigo-100"
          >
            {evaluating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Evaluating Audio...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-indigo-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-6z"
                  />
                </svg>
                <span>Analyze Proficiency</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Transcription Editor */}
      {(transcript || isRecording) && (
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recorded Response
            </label>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Editable text preview
            </span>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Spoken words will display here in real-time..."
            className="w-full p-3.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y min-h-[110px]"
          />
        </div>
      )}

      {/* Comprehensive Evaluation Breakdown Display */}
      {evaluation && (
        <div className="mt-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
          {/* Header & CEFR Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                Proficiency Assessment
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Overall Performance: <span className="font-semibold text-slate-800">{evaluation.overallScore}%</span>
              </p>
            </div>
            <div className="self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs tracking-wide shadow-sm shadow-indigo-200">
                CEFR {evaluation.cefrLevel}
              </span>
            </div>
          </div>

          {/* Metric Bar Charts */}
          <div className="space-y-3.5">
            {[
              { label: 'Task Achievement', value: evaluation.taskAchievement },
              { label: 'Logical Connectivity', value: evaluation.logicalConnectivity },
              { label: 'Lexical Depth', value: evaluation.lexicalDepth },
              { label: 'Grammatical Versatility', value: evaluation.grammaticalVersatility },
              { label: 'Pronunciation & Flow', value: evaluation.pronunciation },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Feedback Container */}
          <div className="mt-5 pt-4 border-t border-slate-200/60">
            <strong className="text-indigo-950 font-semibold text-xs uppercase tracking-wider block mb-1.5">
              Examiner Analysis & Feedback
            </strong>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white border border-slate-200/60 p-4 rounded-xl shadow-2xs">
              {evaluation.feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}