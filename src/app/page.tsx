'use client';

import { 
  ModuleType, 
  DEFAULT_TYPING_PASSAGES, 
  FALLBACK_WRITING_PROMPTS_POOL, 
  FALLBACK_SPEAKING_PROMPTS_POOL, 
  FALLBACK_READING_QUESTIONS, 
  FALLBACK_LISTENING_QUESTIONS, 
  MOTIVATIONAL_QUOTES 
} from '../data/assessmentData';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

interface IconProps {
  name: string;
  className?: string;
}

function Icon({ name, className = "w-5 h-5" }: IconProps) {
  switch (name) {
    case 'audio':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    case 'mic':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    case 'stop':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="6" y="6" width="12" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'headphones':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
        </svg>
      );
    case 'book':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'pencil':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case 'keyboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />
        </svg>
      );
    case 'academic':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'trending':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'trending-down':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    case 'scale':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M15 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-9-3h6" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'refresh':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'clock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
      );
    case 'trophy':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v2a6 6 0 01-6 6H9a6 6 0 01-6-6V5a2 2 0 012-2zm0 10v2a5 5 0 005 5h4a5 5 0 005-5v-2m-9 9v3m-3 0h6" />
        </svg>
      );
    case 'alert-circle':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
      );
    case 'info':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4m0-7h.01" />
        </svg>
      );
    case 'sun':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.02-12.02l-1.41 1.41" />
        </svg>
      );
    case 'moon':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      );
    case 'download':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      );
    case 'x':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'menu':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case 'star':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l2.63 5.33 5.88.85-4.25 4.14 1 5.85L12 16.9l-5.26 2.77 1-5.85L3.5 9.68l5.87-.85L12 3.5z" />
        </svg>
      );
    default:
      return null;
  }
}

function RatingStar({ star, value, onPreview, onSelect }: {
  star: number;
  value: number;
  onPreview: (value: number) => void;
  onSelect: (value: number) => void;
}) {
  const fill = Math.max(0, Math.min(1, value - star + 1));

  const getRatingFromPointer = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    return ratio <= 0.5 ? star - 0.5 : star;
  };

  return (
    <button
      type="button"
      aria-label={`Rate ${star - 0.5} to ${star} stars`}
      onPointerMove={(e) => onPreview(getRatingFromPointer(e))}
      onPointerDown={(e) => onSelect(getRatingFromPointer(e))}
      onPointerLeave={() => onPreview(0)}
      className="relative w-10 h-10 p-1 transition-transform hover:scale-110 cursor-pointer touch-manipulation"
    >
      <svg className="absolute inset-1 w-8 h-8 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      {fill > 0 && (
        <div className="absolute inset-1 h-8 overflow-hidden pointer-events-none" style={{ width: `${fill * 100}%` }}>
          <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
      )}
    </button>
  );
}

interface AudioPlayerProps {
  script: string;
  onPlay?: () => void;
  onEnded?: () => void;
}

function AudioPlayer({ script, onPlay, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    const sanitizedScript = script.replace(/Maya/g, 'Cally');

    if (!sanitizedScript || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onPlay?.();
      setTimeout(() => {
        setIsPlaying(false);
        onEnded?.();
      }, 3000);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sanitizedScript);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`} />
        <span className="text-xs font-mono text-slate-300">
          {isPlaying ? 'Playing Audio Stream...' : 'Audio Stream Ready'}
        </span>
      </div>
      <button
        onClick={handlePlayAudio}
        disabled={isPlaying}
        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
      >
        <Icon name="audio" className="w-4 h-4" />
        <span>{isPlaying ? 'Speaking...' : 'Play Audio'}</span>
      </button>
    </div>
  );
}

function SpeakingRecorder({ prompts, onComplete }: { prompts: string[]; onComplete?: (score: number) => void }) {
  const promptList = prompts.length > 0 ? prompts : FALLBACK_SPEAKING_PROMPTS_POOL;
  const [currentPrompt, setCurrentPrompt] = useState(promptList[0]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [speakingEvaluation, setSpeakingEvaluation] = useState<{
    cefrLevel?: string;
    overallScore: number;
    taskAchievement: number;
    logicalConnectivity: number;
    lexicalDepth: number;
    grammaticalVersatility: number;
    pronunciation: number;
    feedback: string;
    transcript?: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const nextPrompt = prompts[0] || FALLBACK_SPEAKING_PROMPTS_POOL[0];
    setCurrentPrompt(nextPrompt);
    setSpeakingEvaluation(null);
    setIsAnalyzing(false);
    setRecordingSeconds(0);
  }, [prompts]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setSpeakingEvaluation(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        alert('Microphone access is not supported in this browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const supportedMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ];
      const mimeType =
        supportedMimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      const recorderMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorderMimeType,
        });
        if (audioBlob.size === 0) {
          setIsAnalyzing(false);
          alert('Recorded audio was empty. Please check your microphone connection.');
          return;
        }
        await sendAudioForEvaluation(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Unable to access microphone. Please ensure permissions are allowed.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const sendAudioForEvaluation = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
      formData.append('audio', audioBlob, `speech-recording.${extension}`);
      formData.append('prompt', currentPrompt);

      const res = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed on the server.');

      const evalResult = {
        cefrLevel: data.cefrLevel || 'B2',
        overallScore: data.overallScore || 80,
        taskAchievement: data.taskAchievement || 80,
        logicalConnectivity: data.logicalConnectivity || 80,
        lexicalDepth: data.lexicalDepth || 80,
        grammaticalVersatility: data.grammaticalVersatility || 80,
        pronunciation: data.pronunciation || 80,
        feedback: data.feedback || 'Detailed evaluation report generated.',
        transcript: data.transcript || '',
      };

      setSpeakingEvaluation(evalResult);
      if (onComplete) onComplete(evalResult.overallScore);
    } catch (err: any) {
      console.error(err);
      alert(`Error during evaluation: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Speaking Prompt / Task:</span>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">{currentPrompt}</p>
      </div>

      <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-inner">
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-mono text-sm tracking-wide text-center">
            {isRecording ? `Recording Audio... (${recordingSeconds}s)` : 'Microphone Standby'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="mic" className="w-4 h-4" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2 animate-pulse"
            >
              <Icon name="stop" className="w-4 h-4" />
              <span>Stop Recording & Analyze</span>
            </button>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="p-5 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg className="animate-spin h-6 w-6 text-emerald-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Whisper Transcribing & AI Evaluating Speech...</span>
        </div>
      )}

      {speakingEvaluation && !isAnalyzing && (
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">Speaking Assessment Report</h4>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 self-start sm:self-auto">
              Score: {speakingEvaluation.overallScore}%
            </span>
          </div>
          <p className="text-sm text-slate-600">{speakingEvaluation.feedback}</p>
        </div>
      )}
    </div>
  );
}

interface Question {
  id: string;
  type?: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface TestData {
  id: string;
  title: string;
  audioScript?: string;
  passage?: string;
  questions: Question[];
}

// ============================================================
// NEW: Types for the enhanced writing evaluation
// ============================================================
type WritingNoteType = 'success' | 'warning' | 'info';

interface WritingNote {
  type: WritingNoteType;
  message: string;
}

interface WritingEvaluationDetails {
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  taskAchievementScore: number;
  grammarNotes: WritingNote[];
  feedbackSummary: string;
}

export default function Home() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');

  const [theme, setTheme] = useState<'light' | 'dark' | 'midnight'>('light');

  const [appMode, setAppMode] = useState<'dashboard' | 'full_exam'>('dashboard');
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | ModuleType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [examStepIndex, setExamStepIndex] = useState(0); 
  const examSequence: ModuleType[] = ['listening', 'reading', 'writing', 'speaking', 'typing'];

  const [examScores, setExamScores] = useState<Record<ModuleType, number>>({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    typing: 0,
  });

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const [hasAudioEnded, setHasAudioEnded] = useState(false);
  const [listeningTimer, setListeningTimer] = useState<number>(60);
  const [isListeningTimerActive, setIsListeningTimerActive] = useState(false);

  const [typingPassage, setTypingPassage] = useState<string>(DEFAULT_TYPING_PASSAGES[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTypingCompleted, setIsTypingCompleted] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const typingInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [writingPrompt, setWritingPrompt] = useState<string>('');
  const [speakingPrompts, setSpeakingPrompts] = useState<string[]>([FALLBACK_SPEAKING_PROMPTS_POOL[0]]);
  const [usedSpeakingPrompts, setUsedSpeakingPrompts] = useState<string[]>([]);
  const [writingText, setWritingText] = useState<string>('');
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  // NEW: detailed writing evaluation result
  const [writingEvaluationDetails, setWritingEvaluationDetails] = useState<WritingEvaluationDetails | null>(null);

  const [usedListeningIds, setUsedListeningIds] = useState<string[]>([]);
  const [usedReadingIds, setUsedReadingIds] = useState<string[]>([]);
  const [usedWritingPrompts, setUsedWritingPrompts] = useState<string[]>([]);

  const [userScores, setUserScores] = useState<any[]>([]);
  const [userCertificates, setUserCertificates] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [generatedCertificateCode, setGeneratedCertificateCode] = useState<string>('TEPHDYTECH-BPO-2026-9412');

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userFeedback, setUserFeedback] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [antiCheatViolations, setAntiCheatViolations] = useState(0);
  const [showIntegrityWarning, setShowIntegrityWarning] = useState(false);
  const [integrityWarning, setIntegrityWarning] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isTimedEvaluationActive =
    (appMode === 'full_exam' && examStepIndex >= 0 && examStepIndex < 5) ||
    (selectedModule === 'listening' && isListeningTimerActive && !isSubmitted) ||
    (selectedModule === 'typing' && !!startTime && !isTypingCompleted);

  const registerIntegrityViolation = (message: string) => {
    setAntiCheatViolations((prev) => prev + 1);
    setIntegrityWarning(message);
    setShowIntegrityWarning(true);
  };

  const requestExamFullscreen = async () => {
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request was denied:', err);
      registerIntegrityViolation('Fullscreen mode is required for the official timed assessment.');
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmittingRating(true);
    try {
      const { error } = await supabase
        .from('system_ratings')
        .insert([
          {
            user_id: userId,
            rating: userRating,
            feedback: userFeedback.trim(),
          },
        ]);

      if (error) throw error;

      setRatingSubmitted(true);
      setTimeout(() => {
        setShowRatingModal(false);
        setRatingSubmitted(false);
        setUserFeedback('');
        setUserRating(5);
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting rating:', err.message);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  useEffect(() => {
    if (appMode === 'full_exam' && examStepIndex === 5) {
      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [appMode, examStepIndex]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cally_ui_theme') as 'light' | 'dark' | 'midnight';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'midnight') => {
    setTheme(newTheme);
    localStorage.setItem('cally_ui_theme', newTheme);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isTimedEvaluationActive) {
      setShowIntegrityWarning(false);
      setIntegrityWarning('');
      setAntiCheatViolations(0);
      if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      return;
    }

    const onVisibilityChange = () => {
      if (document.hidden) registerIntegrityViolation('Tab switching or leaving the assessment window is not allowed during the official exam.');
    };
    const onFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) registerIntegrityViolation('Fullscreen mode was exited. Return to fullscreen to continue the timed assessment.');
    };
    const blockClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      registerIntegrityViolation('Copy, cut, and paste are disabled during the official assessment.');
    };
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(key)) {
        e.preventDefault();
        registerIntegrityViolation('Clipboard and select-all shortcuts are disabled during the official assessment.');
      }
      if (key === 'f11') {
        e.preventDefault();
        registerIntegrityViolation('Please remain in fullscreen mode during the official assessment.');
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('copy', blockClipboard);
    document.addEventListener('cut', blockClipboard);
    document.addEventListener('paste', blockClipboard);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockShortcuts, true);

    requestExamFullscreen();

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('copy', blockClipboard);
      document.removeEventListener('cut', blockClipboard);
      document.removeEventListener('paste', blockClipboard);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockShortcuts, true);
    };
  }, [isTimedEvaluationActive]);

  const refreshUserStats = async () => {
    if (!userId) return;
    setLoadingStats(true);
    setStatsError(null);

    let firstError: string | null = null;

    const { data: scoresData, error: scoresError } = await supabase
      .from('module_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (scoresError) {
      console.error('Error fetching scores:', scoresError.message);
      firstError = scoresError.message;
    } else {
      setUserScores(scoresData || []);
    }

    const { data: certsData, error: certsError } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (certsError) {
      console.error('Error fetching certificates:', certsError.message);
      firstError = firstError || certsError.message;
    } else {
      setUserCertificates(certsData || []);
    }

    if (firstError) setStatsError(firstError);
    setLoadingStats(false);
  };

  useEffect(() => {
    refreshUserStats();
  }, [userId]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('cally_user_email');
    const savedName = localStorage.getItem('cally_user_name');
    const savedId = localStorage.getItem('cally_user_id');

    if (savedEmail && savedId) {
      setEmail(savedEmail);
      setUserName(savedName || '');
      setUserId(savedId);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const googleEmail = session.user.email;
        const googleName = session.user.user_metadata?.full_name || googleEmail?.split('@')[0];

        const { data, error } = await supabase
          .from('users')
          .upsert({ email: googleEmail, name: googleName }, { onConflict: 'email' })
          .select();

        if (error) {
          console.error('Error syncing user to database:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const currentUserId = (data[0] as any).id;
          setUserId(currentUserId);
          setUserName(googleName);
          setEmail(googleEmail || '');
          setIsLoggedIn(true);
        }
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isTypingCompleted) {
      interval = setInterval(() => {
        const now = Date.now();
        const durationInSeconds = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(durationInSeconds);

        if (durationInSeconds > 0) {
          const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
          const currentWpm = Math.round((wordsTyped / durationInSeconds) * 60);
          setWpm(currentWpm);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isTypingCompleted, userInput]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedModule === 'listening' && isListeningTimerActive && listeningTimer > 0 && !isSubmitted) {
      timer = setInterval(() => setListeningTimer((prev) => prev - 1), 1000);
    } else if (selectedModule === 'listening' && isListeningTimerActive && listeningTimer === 0 && !isSubmitted) {
      handleSubmitListening();
      setIsListeningTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [selectedModule, isListeningTimerActive, listeningTimer, isSubmitted]);

  const resetListeningState = () => {
    setHasAudioStarted(false);
    setHasAudioEnded(false);
    setListeningTimer(60);
    setIsListeningTimerActive(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setAuthError('');
    const derivedName = email.split('@')[0];
    const finalName = userName.trim() || derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    setUserName(finalName);

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (isSignUpMode && existingUser) {
        setAuthError('An account with this email already exists. Please sign in.');
        return;
      }

      if (!isSignUpMode && !existingUser) {
        setAuthError('No account found with this email. Please sign up first.');
        return;
      }

      let currentUserId = existingUser?.id;

      if (isSignUpMode && !existingUser) {
        const { data, error } = await supabase
          .from('users')
          .insert([{ email: email, name: finalName }])
          .select();

        if (error) {
          console.error('Sign up error:', error.message);
          setAuthError('Failed to create account.');
          return;
        }
        if (data && data.length > 0) {
          currentUserId = (data[0] as any).id;
        }
      }

      if (currentUserId) {
        setUserId(currentUserId);
        localStorage.setItem('cally_user_email', email);
        localStorage.setItem('cally_user_name', finalName);
        localStorage.setItem('cally_user_id', currentUserId);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setAuthError('An unexpected error occurred.');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
      setAuthError('Failed to sign in with Google.');
    }
  };

  const handleSelectSidebarTab = (tab: 'overview' | 'logs' | ModuleType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab === 'overview' || tab === 'logs') {
      setAppMode('dashboard');
      setSelectedModule(null);
      setTestData(null);
      setIsSubmitted(false);
      setScore(null);
      setShowScorePopup(false);
      setShowInstructionsModal(false);
      setSelectedAnswers({});
      setWritingEvaluationDetails(null);
      resetListeningState();
    } else {
      handleStartDashboardModule(tab);
    }
  };

  const handleStartDashboardModule = (mod: ModuleType) => {
    setAppMode('dashboard');
    setActiveTab(mod);
    setSelectedModule(mod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    resetListeningState();
    setShowInstructionsModal(true);

    if (mod === 'typing') {
      const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
      setTypingPassage(targetPassage);
      setUserInput('');
      setStartTime(null);
      setElapsedSeconds(0);
      setIsTypingCompleted(false);
      setWpm(0);
      setAccuracy(100);
    } else if (mod === 'writing' || mod === 'speaking' || mod === 'reading' || mod === 'listening') {
      generateTest(mod);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFullExam = () => {
    setAntiCheatViolations(0);
    setShowIntegrityWarning(false);
    setIntegrityWarning('');
    setAppMode('full_exam');
    setExamStepIndex(0);
    const firstMod = examSequence[0];
    setSelectedModule(firstMod);
    setActiveTab(firstMod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    resetListeningState();
    setShowInstructionsModal(true);
    generateTest(firstMod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setIsMobileMenuOpen(false);
    setAppMode('dashboard');
    setSelectedModule(null);
    setActiveTab('overview');
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setShowInstructionsModal(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    resetListeningState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateTest = async (moduleType: ModuleType) => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    setWritingEvaluationDetails(null);
    resetListeningState();

    if (moduleType === 'typing') {
      const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
      setTypingPassage(targetPassage);
      setUserInput('');
      setStartTime(null);
      setElapsedSeconds(0);
      setIsTypingCompleted(false);
      setWpm(0);
      setAccuracy(100);
      setLoading(false);
      return;
    }

    if (moduleType === 'writing') {
      const availableWriting = FALLBACK_WRITING_PROMPTS_POOL.filter(p => !usedWritingPrompts.includes(p));
      const targetPool = availableWriting.length > 0 ? availableWriting : FALLBACK_WRITING_PROMPTS_POOL;
      const selectedPrompt = targetPool[Math.floor(Math.random() * targetPool.length)];

      if (availableWriting.length > 0) {
        setUsedWritingPrompts(prev => [...prev, selectedPrompt]);
      } else {
        setUsedWritingPrompts([selectedPrompt]);
      }

      setWritingPrompt(selectedPrompt);
      setWritingText('');
      setLoading(false);
      return;
    }

    if (moduleType === 'speaking') {
      const availableSpeaking = FALLBACK_SPEAKING_PROMPTS_POOL.filter(
        (prompt) => !usedSpeakingPrompts.includes(prompt)
      );
      const targetPool =
        availableSpeaking.length > 0
          ? availableSpeaking
          : FALLBACK_SPEAKING_PROMPTS_POOL;

      const selectedPrompt =
        targetPool[Math.floor(Math.random() * targetPool.length)];

      setSpeakingPrompts([selectedPrompt]);

      if (availableSpeaking.length > 0) {
        setUsedSpeakingPrompts((prev) => [...prev, selectedPrompt]);
      } else {
        setUsedSpeakingPrompts([selectedPrompt]);
      }

      setLoading(false);
      return;
    }

    if (moduleType === 'reading') {
      const availableReading = FALLBACK_READING_QUESTIONS.filter(r => !usedReadingIds.includes(r.id));
      const targetPool = availableReading.length > 0 ? availableReading : FALLBACK_READING_QUESTIONS;
      const selectedItem = targetPool[Math.floor(Math.random() * targetPool.length)];

      if (availableReading.length > 0) {
        setUsedReadingIds(prev => [...prev, selectedItem.id]);
      } else {
        setUsedReadingIds([selectedItem.id]);
      }

      setTestData(selectedItem);
      setLoading(false);
      return;
    }

    if (moduleType === 'listening') {
      const availableListening = FALLBACK_LISTENING_QUESTIONS.filter(l => !usedListeningIds.includes(l.id));
      const targetPool = availableListening.length > 0 ? availableListening : FALLBACK_LISTENING_QUESTIONS;
      const selectedItem = targetPool[Math.floor(Math.random() * targetPool.length)];

      if (availableListening.length > 0) {
        setUsedListeningIds(prev => [...prev, selectedItem.id]);
      } else {
        setUsedListeningIds([selectedItem.id]);
      }

      setTestData(selectedItem);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleAdvanceExamStep = async (moduleScore: number) => {
    const currentMod = examSequence[examStepIndex];
    const updatedScores = { ...examScores, [currentMod]: moduleScore };
    setExamScores(updatedScores);

    const nextIndex = examStepIndex + 1;
    if (nextIndex < examSequence.length) {
      setExamStepIndex(nextIndex);
      const nextMod = examSequence[nextIndex];
      setSelectedModule(nextMod);
      setActiveTab(nextMod);
      setIsSubmitted(false);
      setScore(null);
      setShowScorePopup(false);
      setSelectedAnswers({});
      setWritingEvaluationDetails(null);
      resetListeningState();

      if (nextMod === 'typing') {
        const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
        setTypingPassage(targetPassage);
        setUserInput('');
        setStartTime(null);
        setElapsedSeconds(0);
        setIsTypingCompleted(false);
        setWpm(0);
        setAccuracy(100);
      } else {
        generateTest(nextMod);
      }
    } else {
      setExamStepIndex(5);
      try {
        const finalAvg = Math.round(Object.values(updatedScores).reduce((a, b) => a + b, 0) / 5);
        if (finalAvg >= 80) {
        const res = await fetch('/api/generate/save-exam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: userName || email.split('@')[0] || 'Candidate',
            examScores: updatedScores,
            overallScore: finalAvg,
          }),
        });
        const data = await res.json();
        if (data.success && data.certificateCode) {
          setGeneratedCertificateCode(data.certificateCode);
        }
        }
      } catch (err) {
        console.error('Failed to save exam session via API:', err);
      }
    }
  };

  const triggerConfetti = () => {
    try {
      (window as any).confetti?.({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error('Confetti error:', e);
    }
  };

  const handleScoreFinalized = async (finalPct: number) => {
    setScore(finalPct);
    setIsSubmitted(true);
    setShowScorePopup(true);

    if (userId && selectedModule) {
      const { data, error } = await supabase
        .from('module_scores')
        .insert([
          { 
            user_id: userId, 
            module_name: selectedModule, 
            score: finalPct,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) {
        console.error('Error saving module score:', error.message);
      } else if (data && data.length > 0) {
        setUserScores(prev => [data[0], ...prev.filter((item) => item.id !== data[0].id)]);
      }
      await refreshUserStats();
    }

    if (finalPct > 70) {
      triggerConfetti();
    } else {
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setMotivationalQuote(randomQuote);
    }

    if (appMode === 'full_exam') {
      setTimeout(() => {
        setShowScorePopup(false);
        handleAdvanceExamStep(finalPct);
      }, 4000);
    }
  };
  
  const handleSubmitListening = () => {
    if (isSubmitted) return;
    setIsListeningTimerActive(false);
    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      const correctAnswer = q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      if (userAnswer === correctAnswer) totalCorrect += 1;
    });

    const finalPct = Math.round((totalCorrect / testData.questions.length) * 100);
    handleScoreFinalized(finalPct);
  };

  const handleSubmitReading = () => {
    if (isSubmitted) return;
    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      const correctAnswer = q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      if (userAnswer === correctAnswer) totalCorrect += 1;
    });

    const finalPct = Math.round((totalCorrect / testData.questions.length) * 100);
    handleScoreFinalized(finalPct);
  };

  // ============================================================
  // UPDATED: Enhanced writing evaluation with detailed analysis
  // ============================================================
  const handleSubmitWriting = () => {
    if (!writingText.trim()) return;
    setIsEvaluatingWriting(true);
    setWritingEvaluationDetails(null);

    setTimeout(() => {
      const wordCount = writingText.trim().split(/\s+/).length;

      let grammarScore = 88;
      let vocabularyScore = 90;
      let coherenceScore = 85;
      let taskAchievement = 92;

      const grammarNotes: WritingNote[] = [];
      const sentences = writingText
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);
      const sentenceCount = sentences.length || 1;
      const avgSentenceLength = wordCount / sentenceCount;

      // --- Grammar scoring ---
      if (wordCount < 50) {
        grammarScore -= 15;
        grammarNotes.push({
          type: 'warning',
          message:
            'Your response is quite short. Aim for at least 150 words for a full task response.',
        });
      } else if (wordCount < 150) {
        grammarScore -= 5;
        grammarNotes.push({
          type: 'info',
          message: `You wrote ${wordCount} words. Try to expand to 150+ words for a complete response.`,
        });
      } else if (wordCount >= 150 && wordCount <= 300) {
        grammarScore += 5;
        grammarNotes.push({
          type: 'success',
          message: `Excellent word count (${wordCount} words) — well within the ideal range.`,
        });
      } else {
        grammarNotes.push({
          type: 'info',
          message: `You wrote ${wordCount} words. Consider being more concise if the task has a limit.`,
        });
      }

      if (avgSentenceLength > 30) {
        grammarScore -= 8;
        grammarNotes.push({
          type: 'warning',
          message:
            'Some sentences are very long. Consider splitting them for better readability.',
        });
      } else if (avgSentenceLength >= 12 && avgSentenceLength <= 22) {
        grammarScore += 4;
        grammarNotes.push({
          type: 'success',
          message: 'Your sentence lengths are varied and readable.',
        });
      }

      if (/[,]{2,}|\.{2,}|!{2,}/.test(writingText)) {
        grammarScore -= 5;
        grammarNotes.push({
          type: 'warning',
          message:
            'Avoid repeated punctuation (e.g., "!!" or "...") in formal writing.',
        });
      }

      const uncapitalized = sentences.filter((s) =>
        /^[a-z]/.test(s.trim())
      ).length;
      if (uncapitalized > 0) {
        grammarScore -= uncapitalized * 2;
        grammarNotes.push({
          type: 'warning',
          message: `${uncapitalized} sentence(s) don't start with a capital letter.`,
        });
      } else if (sentences.length > 0) {
        grammarNotes.push({
          type: 'success',
          message: 'All sentences begin with proper capitalization.',
        });
      }

      // --- Vocabulary scoring ---
      const words = writingText.toLowerCase().match(/\b[a-z']+\b/g) || [];
      const uniqueWords = new Set(words);
      const lexicalDiversity = words.length
        ? uniqueWords.size / words.length
        : 0;

      if (lexicalDiversity > 0.6) {
        vocabularyScore += 6;
        grammarNotes.push({
          type: 'success',
          message:
            'Great lexical variety — you use a rich range of vocabulary.',
        });
      } else if (lexicalDiversity < 0.35) {
        vocabularyScore -= 10;
        grammarNotes.push({
          type: 'warning',
          message:
            'Vocabulary is repetitive. Try using more synonyms and varied expressions.',
        });
      }

      const advancedWords = words.filter((w) => w.length > 7).length;
      if (advancedWords / Math.max(words.length, 1) > 0.15) {
        vocabularyScore += 5;
      } else if (advancedWords / Math.max(words.length, 1) < 0.05) {
        vocabularyScore -= 5;
        grammarNotes.push({
          type: 'info',
          message:
            'Consider incorporating more sophisticated or topic-specific vocabulary.',
        });
      }

      // --- Coherence scoring ---
      const linkingWords = [
        'however',
        'moreover',
        'furthermore',
        'therefore',
        'thus',
        'consequently',
        'in addition',
        'on the other hand',
        'for example',
        'for instance',
        'in conclusion',
        'firstly',
        'secondly',
        'finally',
        'meanwhile',
        'nevertheless',
      ];
      const lowerText = writingText.toLowerCase();
      const linkingCount = linkingWords.reduce(
        (acc, word) => acc + (lowerText.split(word).length - 1),
        0
      );

      if (linkingCount >= 4) {
        coherenceScore += 8;
        grammarNotes.push({
          type: 'success',
          message: 'Strong use of linking words to connect your ideas.',
        });
      } else if (linkingCount >= 1) {
        coherenceScore += 3;
        grammarNotes.push({
          type: 'info',
          message:
            'Some cohesive devices used. Add more transitions to improve flow.',
        });
      } else {
        coherenceScore -= 10;
        grammarNotes.push({
          type: 'warning',
          message:
            'No linking words detected. Use transitions like "however" or "therefore".',
        });
      }

      const paragraphs = writingText
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0);
      if (paragraphs.length >= 3) {
        coherenceScore += 5;
        grammarNotes.push({
          type: 'success',
          message: `Well-structured with ${paragraphs.length} paragraphs.`,
        });
      } else if (paragraphs.length === 1 && wordCount > 120) {
        coherenceScore -= 8;
        grammarNotes.push({
          type: 'warning',
          message:
            'Consider breaking your text into multiple paragraphs for clarity.',
        });
      }

      // --- Task achievement scoring ---
      if (wordCount < 50) {
        taskAchievement -= 25;
      } else if (wordCount < 100) {
        taskAchievement -= 12;
      } else if (wordCount >= 150) {
        taskAchievement += 5;
      }

      if (linkingCount >= 3 && paragraphs.length >= 2) {
        taskAchievement += 3;
      }

      const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
      grammarScore = clamp(grammarScore);
      vocabularyScore = clamp(vocabularyScore);
      coherenceScore = clamp(coherenceScore);
      taskAchievement = clamp(taskAchievement);

      const overallScore = clamp(
        (grammarScore + vocabularyScore + coherenceScore + taskAchievement) / 4
      );

      let feedbackSummary = '';
      if (overallScore >= 90) {
        feedbackSummary =
          'Outstanding work! Your writing demonstrates strong grammar, rich vocabulary, and clear organization.';
      } else if (overallScore >= 75) {
        feedbackSummary =
          'Good job! Your writing is clear and well-structured, with a few areas that could be polished further.';
      } else if (overallScore >= 60) {
        feedbackSummary =
          'Decent effort. Focus on expanding your vocabulary, varying sentence structure, and improving coherence.';
      } else {
        feedbackSummary =
          'Keep practicing! Work on length, grammar, and organizing your ideas into clear paragraphs with linking words.';
      }

      setWritingEvaluationDetails({
        overallScore,
        grammarScore,
        vocabularyScore,
        coherenceScore,
        taskAchievementScore: taskAchievement,
        grammarNotes,
        feedbackSummary,
      });

      setIsEvaluatingWriting(false);
      handleScoreFinalized(overallScore);
    }, 800);
  };

  const handleSpeakingComplete = (scoreVal: number) => {
    const finalScore = (scoreVal === 5 || scoreVal === 80) ? 0 : scoreVal;
    handleScoreFinalized(finalScore);
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isTypingCompleted) return;
    if (!startTime) setStartTime(Date.now());
    setUserInput(val);

    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === typingPassage[i]) correctChars++;
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    if (val.length >= typingPassage.length) {
      setIsTypingCompleted(true);
      const duration = Math.max((Date.now() - (startTime || Date.now())) / 60000, 0.05);
      const words = val.trim().split(/\s+/).length;
      const finalWpm = Math.round(words / duration);
      setWpm(finalWpm);

      const typingScore = Math.min(Math.max(finalWpm * 1.2, 50), 100);
      const finalRounded = Math.round(typingScore);
      handleScoreFinalized(finalRounded);
    }
  };

  const overallExamAverage = Math.round(
    Object.values(examScores).reduce((a, b) => a + b, 0) / 5
  );
  const certificateEligible = overallExamAverage >= 80;

  const handleRetakeAssessment = () => {
    setExamScores({ listening: 0, reading: 0, writing: 0, speaking: 0, typing: 0 });
    setAntiCheatViolations(0);
    setShowIntegrityWarning(false);
    setGeneratedCertificateCode('');
    setAppMode('dashboard');
    setExamStepIndex(0);
    setSelectedModule(null);
    setActiveTab('overview');
    setSelectedAnswers({});
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setShowInstructionsModal(false);
    setWritingEvaluationDetails(null);
    setTypingPassage(DEFAULT_TYPING_PASSAGES[0]);
    setUserInput('');
    setWpm(0);
    setAccuracy(100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    const element = document.getElementById('certificate-to-download');
    if (!element) {
      setIsDownloadingPdf(false);
      return;
    }

    try {
      if (!(window as any).html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      window.scrollTo(0, 0);

      const opt = {
        margin: 0,
        filename: `TephdyTech_Certificate_${(userName || 'Candidate').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };

      await (window as any).html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const dashboardFeatures = [
    {
      id: 'listening' as ModuleType,
      title: 'Listening & Dictation',
      description: 'Single-play audio drills with dictation inputs and auto-evaluations.',
      tag: 'Listening',
      color: 'border-rose-200 bg-rose-50/40 text-rose-700',
      btnColor: 'bg-rose-600 hover:bg-rose-700',
      instructions: "1. Click 'Play Audio' (plays ONCE).\n2. Answer the questions before the 1-minute timer expires.",
      icon: 'headphones',
    },
    {
      id: 'reading' as ModuleType,
      title: 'Sentence Completion & Grammar',
      description: 'Practice SVAR vocabulary fill-in-the-blanks and grammar rules.',
      tag: 'Reading',
      color: 'border-amber-200 bg-amber-50/40 text-amber-700',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      instructions: "1. Review reading passage.\n2. Answer the multiple choice questions.",
      icon: 'book',
    },
    {
      id: 'writing' as ModuleType,
      title: 'Customer Email & Chat Writing',
      description: 'Draft professional customer responses and emails.',
      tag: 'Writing',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-700',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      instructions: "1. Read scenario prompt.\n2. Draft professional email response.",
      icon: 'pencil',
    },
    {
      id: 'speaking' as ModuleType,
      title: 'Repeat & Retell AI',
      description: 'Record verbatim sentence repetition & prompt replies.',
      tag: 'Speaking',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      instructions: "1. Read prompt.\n2. Record audio via microphone and analyze.",
      icon: 'mic',
    },
    {
      id: 'typing' as ModuleType,
      title: 'Chat & Typing Speed Test',
      description: 'Train net WPM and accuracy for BPO candidate screening.',
      tag: 'Typing',
      color: 'border-sky-200 bg-sky-50/40 text-sky-700',
      btnColor: 'bg-sky-600 hover:bg-sky-700',
      instructions: "1. Type the displayed passage accurately to complete the module.",
      icon: 'keyboard',
    },
  ];

  const activeFeature = dashboardFeatures.find((f) => f.id === selectedModule);

  const themeClasses = {
    light: {
      bg: 'h-screen overflow-y-auto bg-slate-50/50 text-slate-800',
      header: 'bg-white/95 border-slate-200 text-slate-900',
      sidebar: 'bg-white border-slate-200 text-slate-700',
      card: 'bg-white border-slate-200 text-slate-900',
      textMuted: 'text-slate-500',
      tableHeader: 'border-slate-100 text-slate-400',
      tableRowHover: 'hover:bg-slate-50/50',
      divider: 'border-slate-100',
    },
    dark: {
      bg: 'h-screen overflow-y-auto bg-slate-950 text-slate-100',
      header: 'bg-slate-900/95 border-slate-800 text-white',
      sidebar: 'bg-slate-900 border-slate-800 text-slate-300',
      card: 'bg-slate-900 border-slate-800 text-white',
      textMuted: 'text-slate-400',
      tableHeader: 'border-slate-800 text-slate-400',
      tableRowHover: 'hover:bg-slate-800/50',
      divider: 'border-slate-800',
    },
    midnight: {
      bg: 'h-screen overflow-y-auto bg-[#090d16] text-blue-50',
      header: 'bg-[#0f172a]/95 border-blue-950 text-blue-100',
      sidebar: 'bg-[#0f172a] border-blue-950 text-blue-200',
      card: 'bg-[#111c33] border-blue-900/60 text-blue-50',
      textMuted: 'text-blue-300/70',
      tableHeader: 'border-blue-950 text-blue-400',
      tableRowHover: 'hover:bg-blue-950/40',
      divider: 'border-blue-950',
    }
  }[theme];

  // Helper functions for writing evaluation UI colors
  const getWritingScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-500';
    if (s >= 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getWritingBarColor = (s: number) => {
    if (s >= 85) return 'bg-emerald-500';
    if (s >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getWritingNoteStyles = (type: WritingNoteType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-600';
      case 'info':
      default:
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500';
    }
  };

  const getWritingNoteIcon = (type: WritingNoteType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`h-screen overflow-y-auto grid grid-cols-1 lg:grid-cols-12 ${themeClasses.bg}`}>
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image src="/logo.png" alt="TephdyTech Logo" fill priority className="object-contain" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">Cally Assessment Hub</span>
            </div>
            
            <div className="space-y-4 max-w-lg pt-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/30">
                <Icon name="sparkles" className="w-3.5 h-3.5" /> Official BPO Readiness & Certification Portal
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Master Your Skills. <br />
                <span className="text-indigo-400">Validate Your Career.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Take professional simulation exams, track your historical improvement logs, and earn verifiable BPO competency certificates instantly.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-10">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <Icon name="headphones" className="w-6 h-6 text-indigo-400" />
              <h4 className="text-xs font-bold">Listening Drills</h4>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <Icon name="book" className="w-6 h-6 text-amber-400" />
              <h4 className="text-xs font-bold">SVAR Reading</h4>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <Icon name="pencil" className="w-6 h-6 text-indigo-400" />
              <h4 className="text-xs font-bold">Business Writing</h4>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <Icon name="mic" className="w-6 h-6 text-emerald-400" />
              <h4 className="text-xs font-bold">AI Speaking</h4>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <Icon name="keyboard" className="w-6 h-6 text-sky-400" />
              <h4 className="text-xs font-bold">WPM Typing</h4>
            </div>
            <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-xl space-y-1 flex flex-col justify-center items-center text-center">
              <Icon name="academic" className="w-6 h-6 text-indigo-300" />
              <span className="text-xs font-bold text-indigo-300">Certified PDF</span>
            </div>
          </div>

          <div className="relative z-10 pt-8 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Developed by TephdyTech &bull; All rights reserved.
          </div>
        </div>

        <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
          <div className={`w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-xl border ${themeClasses.card} space-y-6`}>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black tracking-tight">
                {isSignUpMode ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className={`text-xs ${themeClasses.textMuted}`}>
                {isSignUpMode ? 'Sign up to begin your assessment journey' : 'Sign in to track your scores and certificates'}
              </p>
            </div>

            <div className="grid grid-cols-2 p-1 bg-slate-500/10 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setIsSignUpMode(false); setAuthError(''); }}
                className={`py-2.5 rounded-xl transition cursor-pointer ${!isSignUpMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUpMode(true); setAuthError(''); }}
                className={`py-2.5 rounded-xl transition cursor-pointer ${isSignUpMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-500 text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUpMode && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer"
              >
                {isSignUpMode ? 'Create Account & Start' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-slate-500/20"></div>
              <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-slate-500/20"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-500/30 bg-white dark:bg-slate-900 py-3.5 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-200 shadow-xs cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.87z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.14C3.18 21.38 7.26 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.2C.43 8.19 0 9.95 0 12s.43 3.81 1.2 5.38l4.07-3.14z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.26 0 3.18 2.62 1.2 6.62l4.07 3.14c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.bg} min-h-screen overflow-x-hidden flex flex-col font-sans transition-colors duration-300`} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-8 ${themeClasses.header}`}>
        <div className="w-full flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0" onClick={handleBackToDashboard}>
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
                <Image src="/logo.png" alt="TephdyTech Logo" fill priority className="object-contain" />
              </div>
              <span className="font-bold tracking-tight text-sm sm:text-lg truncate">Cally Assessment Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold min-w-0">
              <span className="truncate max-w-[150px]">Candidate: <strong className="text-indigo-500">{userName || 'Candidate'}</strong></span>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(false);
                setIsMobileMenuOpen(false);
                localStorage.removeItem('cally_user_email');
                localStorage.removeItem('cally_user_id');
              }}
              className="hidden sm:inline-flex px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition cursor-pointer text-xs font-semibold"
            >
              Sign Out
            </button>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="md:hidden w-11 h-11 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center transition shadow-sm"
            >
              <Icon name={isMobileMenuOpen ? 'x' : 'menu'} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"
          />

          <aside className={`absolute top-0 bottom-0 left-0 w-[min(88vw,340px)] ${themeClasses.sidebar} border-r shadow-2xl p-4 pt-5 flex flex-col overflow-y-auto`} style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))', paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Navigation</span>
                <p className="text-sm font-black text-slate-900 truncate">Cally Assessment Hub</p>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 text-slate-400">Workspace</span>
              <nav className="space-y-1 pt-1">
                <button
                  onClick={() => handleSelectSidebarTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition cursor-pointer text-left ${
                    activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon name="chart" className="w-5 h-5" />
                  <span>Dashboard Overview</span>
                </button>
                <button
                  onClick={() => handleSelectSidebarTab('logs')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition cursor-pointer text-left ${
                    activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon name="trending" className="w-5 h-5" />
                  <span>Performance Logs</span>
                </button>
              </nav>
            </div>

            <div className="space-y-1 mt-6">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 text-slate-400">Practice Modules</span>
              <nav className="space-y-1 pt-1">
                {dashboardFeatures.map((feat) => (
                  <button
                    key={feat.id}
                    onClick={() => handleSelectSidebarTab(feat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                      activeTab === feat.id ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon name={feat.icon} className="w-5 h-5 text-indigo-500" />
                      <span className="truncate">{feat.title}</span>
                    </span>
                    <span className="text-xs text-slate-400">&gt;</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <div className="px-3 py-3 mb-2 rounded-2xl bg-slate-50 border border-slate-200">
                <label htmlFor="mobile-theme" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Appearance</label>
                <div className="relative">
                  <select
                    id="mobile-theme"
                    value={theme}
                    onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'midnight')}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                    <option value="midnight">Midnight Theme</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">⌄</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleStartFullExam();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-4 py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Icon name="academic" className="w-5 h-5" />
                <span>Take Full Exam</span>
              </button>

              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsMobileMenuOpen(false);
                  localStorage.removeItem('cally_user_email');
                  localStorage.removeItem('cally_user_id');
                }}
                className="w-full mt-2 sm:hidden px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer text-sm font-bold"
              >
                Sign Out
              </button>

              <button
                onClick={() => setShowRatingModal(true)}
                className="w-full mt-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded-xl text-sm font-bold border border-amber-500/20 transition cursor-pointer flex items-center gap-2 justify-center"
              >
                <Icon name="star" className="w-4 h-4" />
                <span>Rate Us</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row w-full">
        <aside className={`hidden md:flex md:flex-col md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-72 border-r p-4 sm:p-6 shrink-0 space-y-6 ${themeClasses.sidebar}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 ${themeClasses.textMuted}`}>System Navigation</span>
            <nav className="space-y-1 pt-1">
            <button
                onClick={() => handleSelectSidebarTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer text-left ${
                  activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50'
                }`}
              >
                <Icon name="chart" className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>
              <button
                onClick={() => handleSelectSidebarTab('logs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer text-left ${
                  activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50'
                }`}
              >
                <Icon name="trending" className="w-4 h-4" />
                <span>Performance Logs</span>
              </button>
            </nav>
          </div>

          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 ${themeClasses.textMuted}`}>Practice Modules</span>
            <nav className="space-y-1 pt-1">
              {dashboardFeatures.map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => handleSelectSidebarTab(feat.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer text-left ${
                    activeTab === feat.id ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold shadow-xs' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon name={feat.icon} className="w-4 h-4 text-indigo-500" />
                    <span className="truncate">{feat.title}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className={`mt-auto pt-4 border-t ${themeClasses.divider}`}>
            <div className={`mb-3 p-3 rounded-2xl border ${themeClasses.card}`}>
              <label htmlFor="desktop-theme" className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${themeClasses.textMuted}`}>Appearance</label>
              <div className="relative">
                <select
                  id="desktop-theme"
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'midnight')}
                  className={`w-full appearance-none rounded-xl border px-3 py-2.5 pr-9 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${theme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-white'}`}
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="midnight">Midnight Theme</option>
                </select>
                <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center ${themeClasses.textMuted}`}>⌄</span>
              </div>
            </div>

            <button
              onClick={handleStartFullExam}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-4 py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mb-2"
            >
              <Icon name="academic" className="w-4 h-4" />
              <span>Take Full Exam</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRatingModal(true)}
              className="w-full mt-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded-xl text-xs sm:text-sm font-bold border border-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="star" className="w-4 h-4" />
              <span>Rate Us</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-8 pt-5 sm:pt-15 sm:pb-6">
          {isTimedEvaluationActive && (antiCheatViolations > 0 || !isFullscreen) && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-amber-600"><Icon name="alert-circle" className="w-4 h-4" /><span>Assessment Integrity: {antiCheatViolations} event{antiCheatViolations === 1 ? '' : 's'} detected{!isFullscreen ? ' • Fullscreen required' : ''}</span></div>
              {!isFullscreen && <button type="button" onClick={requestExamFullscreen} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold">Enter Fullscreen</button>}
            </div>
          )}
          {appMode === 'dashboard' && !selectedModule && activeTab === 'overview' && (
            <div className="space-y-8 sm:space-y-10 animate-fadeIn">
              <div className="p-6 sm:p-10 lg:p-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[2rem] space-y-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border border-slate-800">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,.18),transparent_30%)]" />
                <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/30">
                    <Icon name="sparkles" className="w-3.5 h-3.5" /> Cally Assessment & Certification Portal
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black">Welcome Back, {userName || 'Candidate'}!</h1>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Select a module from the left sidebar to practice your skills, or check your <strong>Performance Logs</strong> and official <strong>Full Exam</strong> pathway.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><span className="text-[10px] uppercase tracking-wider text-slate-400">Attempts</span><div className="text-xl font-black">{userScores.length}</div></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><span className="text-[10px] uppercase tracking-wider text-slate-400">Average</span><div className="text-xl font-black">{userScores.length ? Math.round(userScores.reduce((a,c)=>a+(c.score||0),0)/userScores.length) : 0}%</div></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><span className="text-[10px] uppercase tracking-wider text-slate-400">Best</span><div className="text-xl font-black">{userScores.length ? Math.max(...userScores.map(c=>c.score||0)) : 0}%</div></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><span className="text-[10px] uppercase tracking-wider text-slate-400">Certificate</span><div className="text-sm font-black mt-1">{userCertificates.length ? 'Earned' : 'Not yet earned'}</div></div>
                  </div>
                </div>
                <div className="shrink-0 relative z-10 w-full md:w-auto">
                  <button
                    onClick={handleStartFullExam}
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-base px-6 sm:px-8 py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-3"
                  >
                    <Icon name="academic" className="w-5 h-5" />
                    <span>Take Full Exam & Download Certificate</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`border-b pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 ${themeClasses.divider}`}>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Individual Practice Modules</h2>
                    <p className={`text-xs ${themeClasses.textMuted}`}>Practice freely module-by-module (No certificate generated)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                  {dashboardFeatures.map((feat) => (
                    <div
                      key={feat.id}
                      className={`border rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition ${themeClasses.card}`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                            <Icon name={feat.icon} className="w-6 h-6" />
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${feat.color}`}>
                            {feat.tag}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold">{feat.title}</h3>
                          <p className={`text-xs leading-relaxed ${themeClasses.textMuted}`}>{feat.description}</p>
                        </div>
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => handleStartDashboardModule(feat.id)}
                          className={`w-full min-h-11 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition cursor-pointer touch-manipulation ${feat.btnColor}`}
                        >
                          Practice Module
                        </button>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {appMode === 'dashboard' && !selectedModule && activeTab === 'logs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`border-b pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 ${themeClasses.divider}`}>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Performance & Historical Improvement Logs</h2>
                  <p className={`text-xs ${themeClasses.textMuted}`}>Chronological tracking of every test attempt, score evolution, and exam dates</p>
                </div>
                <button
                  type="button"
                  onClick={refreshUserStats}
                  disabled={loadingStats}
                  className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 disabled:opacity-50 text-indigo-500 text-xs font-bold rounded-xl transition cursor-pointer border border-indigo-500/20 flex items-center gap-1.5 shrink-0"
                >
                  <Icon name="refresh" className="w-3.5 h-3.5" />
                  <span>{loadingStats ? 'Refreshing...' : 'Refresh Logs'}</span>
                </button>
              </div>

              {statsError && (
                <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-start gap-3">
                  <Icon name="alert-circle" className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-rose-500">Couldn't load your performance logs</p>
                    <p className={`text-xs ${themeClasses.textMuted}`}>{statsError}</p>
                    <p className={`text-[11px] ${themeClasses.textMuted}`}>
                      This is usually a database permissions (Row Level Security) issue on the
                      <code className="mx-1 px-1 py-0.5 rounded bg-slate-500/10">module_scores</code>
                      or
                      <code className="mx-1 px-1 py-0.5 rounded bg-slate-500/10">certificates</code>
                      table rather than something wrong with this page.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-6 rounded-2xl border shadow-xs space-y-2 ${themeClasses.card}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Total Test Attempts</span>
                  <h3 className="text-3xl font-black">{userScores.length}</h3>
                  <p className={`text-[11px] ${themeClasses.textMuted}`}>Logged practice and exam sessions</p>
                </div>

                <div className={`p-6 rounded-2xl border shadow-xs space-y-2 ${themeClasses.card}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Historical Average Score</span>
                  <h3 className="text-3xl font-black text-indigo-500">
                    {userScores.length > 0 
                      ? Math.round(userScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / userScores.length) 
                      : 0}%
                  </h3>
                  <p className={`text-[11px] ${themeClasses.textMuted}`}>Average across all recorded attempts</p>
                </div>

                <div className={`p-6 rounded-2xl border shadow-xs space-y-2 ${themeClasses.card}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Best Performance</span>
                  <h3 className="text-3xl font-black text-emerald-500">
                    {userScores.length > 0 ? Math.max(...userScores.map(item => item.score || 0)) : 0}%
                  </h3>
                  <p className={`text-[11px] ${themeClasses.textMuted}`}>Highest score achieved in a single log</p>
                </div>
              </div>

              <div className={`rounded-2xl border p-6 sm:p-8 shadow-xs space-y-4 ${themeClasses.card}`}>
                <h3 className="text-base font-bold">Attempt Progress Timeline & Dates</h3>
                
                {loadingStats ? (
                  <div className={`text-center py-8 font-bold text-xs sm:text-sm ${themeClasses.textMuted}`}>
                    Loading historical progress logs...
                  </div>
                ) : userScores.length === 0 ? (
                  <div className={`text-center py-8 text-xs sm:text-sm ${themeClasses.textMuted}`}>
                    {statsError
                      ? 'Logs could not be loaded due to the error above.'
                      : 'No test attempts logged yet. Complete a practice module or full exam to start tracking your progress!'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${themeClasses.tableHeader}`}>
                          <th className="pb-3 px-3">Date Taken</th>
                          <th className="pb-3 px-3">Module</th>
                          <th className="pb-3 px-3">Score</th>
                          <th className="pb-3 px-3">Status / Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-500/10 text-xs sm:text-sm">
                        {userScores.map((log, index) => {
                          const formattedDate = log.created_at ? new Date(log.created_at).toLocaleString() : new Date().toLocaleString();
                          const previousAttempt = userScores.slice(index + 1).find(item => item.module_name === log.module_name);
                          const diff = previousAttempt ? log.score - previousAttempt.score : null;

                          return (
                            <tr key={log.id || index} className={`transition ${themeClasses.tableRowHover}`}>
                              <td className={`py-3 px-3 font-medium ${themeClasses.textMuted}`}>{formattedDate}</td>
                              <td className="py-3 px-3 font-bold capitalize">{log.module_name}</td>
                              <td className="py-3 px-3 font-black text-indigo-500">{log.score}%</td>
                              <td className="py-3 px-3">
                                {diff !== null ? (
                                  <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-[11px] ${
                                    diff > 0 ? 'bg-emerald-500/10 text-emerald-500' : diff < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                                  }`}>
                                    {diff > 0 ? <Icon name="trending" className="w-3.5 h-3.5" /> : diff < 0 ? <Icon name="trending-down" className="w-3.5 h-3.5" /> : <Icon name="scale" className="w-3.5 h-3.5" />}
                                    {diff > 0 ? `+${diff}% improvement` : diff < 0 ? `${diff}% drop` : 'No change'}
                                  </span>
                                ) : (
                                  <span className={`italic text-[11px] ${themeClasses.textMuted}`}>First recorded attempt</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {appMode === 'full_exam' && examStepIndex === 5 && (
            certificateEligible ? (
            <div className="space-y-6 sm:space-y-8 max-w-[1300px] mx-auto text-center animate-fadeIn">
              <div className="p-3 sm:p-6 bg-slate-100 rounded-3xl border border-slate-200 shadow-xl flex justify-center items-center overflow-hidden w-full">
                <div className="w-full overflow-hidden flex justify-center py-2 sm:py-0">
                  <div className="w-[1100px] h-[778px] sm:h-auto shrink-0 origin-top transform scale-[0.38] min-[360px]:scale-[0.42] min-[400px]:scale-[0.47] min-[500px]:scale-[0.58] min-[640px]:scale-[0.75] md:scale-[0.88] lg:scale-100 transition-transform">
                    <div
                      id="certificate-to-download"
                      style={{
                        width: '1100px',
                        backgroundColor: '#fbf9f4',
                        border: '16px solid #1e293b',
                        padding: '40px 60px',
                        boxSizing: 'border-box',
                        position: 'relative',
                        margin: '0 auto',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ border: '2px solid #b45309', padding: '30px 40px', position: 'relative' }}>
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                          <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: '#1e293b', fontWeight: '700' }}>
                            Cally Assessment Systems
                          </div>
                          <div style={{ fontSize: '11px', color: '#78350f', marginTop: '3px', fontWeight: '600' }}>EST. 2026</div>
                        </div>

                        <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#78350f', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', margin: '10px 0 5px 0', fontFamily: 'serif' }}>
                          Certificate of Achievement
                        </h1>
                        <div style={{ fontSize: '13px', color: '#1e293b', textAlign: 'center', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                          Official Verification of Professional BPO Competency
                        </div>

                        <div style={{ fontSize: '14px', color: '#475569', textAlign: 'center', fontStyle: 'italic', marginBottom: '5px' }}>This is to certify that</div>
                        <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e293b', textAlign: 'center', margin: '0 auto 15px auto', paddingBottom: '4px', borderBottom: '2px solid #cbd5e1', display: 'table', fontFamily: 'serif' }}>
                          {userName || 'Candidate'}
                        </div>

                        <p style={{ fontSize: '13px', color: '#334155', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                          has successfully demonstrated exceptional proficiency across all official Cally assessment modules, showcasing linguistic mastery, professional communication skills, and technical competency required for the Business Process Outsourcing (BPO) industry.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 30px', maxWidth: '850px', margin: '0 auto 25px auto', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                          <div>Listening & Dictation ({examScores.listening}%)</div>
                          <div>Speaking Simulation ({examScores.speaking}%)</div>
                          <div>Reading & Grammar ({examScores.reading}%)</div>
                          <div>Chat & Typing Accuracy ({examScores.typing}%) &bull; Speed: {wpm} WPM</div>
                          <div>Business Writing Composition ({examScores.writing}%)</div>
                          <div style={{ color: '#b45309', fontWeight: '700' }}>Final Cumulative Rating: ({overallExamAverage}%)</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '20px', marginTop: '10px' }}>
                          <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>
                            Authorized Electronic Validation
                          </div>

                          <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#ffffff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px double #fef3c7', textAlign: 'center', fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <span>Official</span>
                            <span>Verified</span>
                          </div>

                          <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>
                            Cally Authority
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '11px', color: '#64748b', fontWeight: '600', letterSpacing: '1px' }}>
                          DATE OF ISSUE: [{new Date().toLocaleDateString().toUpperCase()}] &bull; CERTIFICATE ID: [{generatedCertificateCode}]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 sm:p-8 border rounded-3xl space-y-6 shadow-xl ${themeClasses.card}`}>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black">Exam Finished Successfully!</h2>
                  <p className={`text-xs sm:text-sm ${themeClasses.textMuted}`}>Your verified Cally certificate file (.pdf) is ready for download.</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    disabled={isDownloadingPdf}
                    onClick={handleDownloadPDF}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Icon name="download" className="w-4 h-4" />
                    <span>{isDownloadingPdf ? 'Generating .pdf file...' : 'Download Certificate (.pdf)'}</span>
                  </button>
                  <button
                    onClick={handleBackToDashboard}
                    className="w-full sm:w-auto bg-slate-500/10 hover:bg-slate-500/20 font-bold text-sm px-6 py-3.5 rounded-xl transition cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center animate-fadeIn">
              <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl ${themeClasses.card}`}>
                <div className="mx-auto w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5"><Icon name="alert-circle" className="w-10 h-10" /></div>
                <h2 className="text-2xl sm:text-3xl font-black">Certificate Not Available</h2>
                <p className={`mt-3 text-sm leading-relaxed ${themeClasses.textMuted}`}>Your final cumulative rating is <strong className="text-rose-500">{overallExamAverage}%</strong>. You do not qualify for a certificate of exceptional proficiency across all official Cally assessment modules.
                </p>
                <p className={`mt-2 text-xs ${themeClasses.textMuted}`}>A minimum final cumulative rating of 80% is required to receive the certificate.</p>
                <button onClick={handleRetakeAssessment} className="mt-7 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition">Retake Assessment</button>
              </div>
            </div>
          )
          )}

          {selectedModule && (appMode === 'dashboard' || (appMode === 'full_exam' && examStepIndex < 5)) && (
            <div className="space-y-4 sm:space-y-6 max-w-[1400px] mx-auto">
              <div className={`rounded-2xl border p-3.5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs ${themeClasses.card}`}>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={handleBackToDashboard}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2"
                  >
                    <Icon name="arrow-left" className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                  </button>
                  {appMode === 'dashboard' && selectedModule && (
                    <button
                      onClick={() => generateTest(selectedModule)}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-xl transition cursor-pointer border border-indigo-500/30 flex items-center justify-center gap-1.5"
                    >
                      <Icon name="refresh" className="w-4 h-4" />
                      <span>Generate New Test</span>
                    </button>
                  )}
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 block">
                    {appMode === 'full_exam' ? `Full Exam Step ${examStepIndex + 1} of 5` : 'Individual Practice Mode'}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold capitalize">{selectedModule} Module</h2>
                </div>
              </div>

              {selectedModule === 'speaking' && (
                <div className={`rounded-2xl border p-3 sm:p-8 shadow-xs ${themeClasses.card}`}>
                  <SpeakingRecorder
                    key={speakingPrompts[0] || 'speaking-default'}
                    prompts={speakingPrompts}
                    onComplete={handleSpeakingComplete}
                  />
                </div>
              )}

              {selectedModule === 'writing' && (
                <div className={`rounded-2xl border p-5 sm:p-8 shadow-xs space-y-6 ${themeClasses.card}`}>
                  <div className="p-4 sm:p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase block">Writing Prompt:</span>
                    <p className="text-sm sm:text-base font-medium">{writingPrompt}</p>
                  </div>
                  <textarea
                    rows={6}
                    value={writingText}
                    onChange={(e) => setWritingText(e.target.value)}
                    placeholder="Type your professional response here..."
                    className="w-full p-4 border border-slate-500/30 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={themeClasses.textMuted}>
                      {writingText.trim() ? writingText.trim().split(/\s+/).length : 0} words
                    </span>
                  </div>
                  <button
                    onClick={handleSubmitWriting}
                    disabled={isEvaluatingWriting || !writingText.trim()}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    {isEvaluatingWriting ? 'Evaluating...' : 'Submit Writing Assessment'}
                  </button>

                  {isEvaluatingWriting && (
                    <div className="p-5 text-center space-y-3 bg-slate-500/5 rounded-2xl border border-slate-500/10">
                      <svg className="animate-spin h-6 w-6 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider block">Analyzing your writing...</span>
                    </div>
                  )}

                  {/* ============================================================
                      NEW: Detailed Writing Evaluation Results Panel
                      ============================================================ */}
                  {writingEvaluationDetails && !isEvaluatingWriting && (
                    <div className={`mt-4 pt-6 border-t space-y-6 animate-fadeIn ${themeClasses.divider}`}>
                      {/* Overall Score */}
                      <div className="text-center border-b border-slate-500/10 pb-6">
                        <p className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>
                          Overall Writing Score
                        </p>
                        <p className={`text-5xl font-black mt-2 ${getWritingScoreColor(writingEvaluationDetails.overallScore)}`}>
                          {writingEvaluationDetails.overallScore}
                          <span className="text-2xl text-slate-400">/100</span>
                        </p>
                        <p className={`mt-3 text-sm max-w-2xl mx-auto leading-relaxed ${themeClasses.textMuted}`}>
                          {writingEvaluationDetails.feedbackSummary}
                        </p>
                      </div>

                      {/* Sub-scores */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider">Score Breakdown</h3>
                        {[
                          { label: 'Grammar', score: writingEvaluationDetails.grammarScore },
                          { label: 'Vocabulary', score: writingEvaluationDetails.vocabularyScore },
                          { label: 'Coherence', score: writingEvaluationDetails.coherenceScore },
                          { label: 'Task Achievement', score: writingEvaluationDetails.taskAchievementScore },
                        ].map((cat) => (
                          <div key={cat.label}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span>{cat.label}</span>
                              <span className={getWritingScoreColor(cat.score)}>
                                {cat.score}/100
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-500/20 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getWritingBarColor(cat.score)} transition-all duration-700`}
                                style={{ width: `${cat.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Feedback Notes */}
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Detailed Feedback</h3>
                        <div className="space-y-2">
                          {writingEvaluationDetails.grammarNotes.map((note, idx) => (
                            <div
                              key={idx}
                              className={`flex items-start gap-3 border rounded-xl p-3 text-xs font-medium ${getWritingNoteStyles(note.type)}`}
                            >
                              <span className="font-bold shrink-0">
                                {getWritingNoteIcon(note.type)}
                              </span>
                              <span>{note.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {isSubmitted && !showScorePopup && appMode === 'full_exam' && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-sm">
                          Writing Submitted! Advancing to next exam module...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedModule === 'typing' && (
                <div className={`rounded-2xl border p-5 sm:p-8 shadow-xs space-y-6 ${themeClasses.card}`}>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-sky-500/10 rounded-xl border border-sky-500/20">
                      <span className="text-xs text-sky-400 block font-bold uppercase">WPM</span>
                      <span className="text-2xl font-black">{wpm}</span>
                    </div>
                    <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <span className="text-xs text-indigo-400 block font-bold uppercase">Accuracy</span>
                      <span className="text-2xl font-black">{accuracy}%</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-slate-950 text-slate-300 rounded-2xl font-mono text-xs sm:text-base leading-relaxed overflow-x-auto border border-slate-800">
                    {typingPassage.split('').map((char, index) => {
                      let color = 'text-slate-500';
                      if (index < userInput.length) {
                        color = userInput[index] === char ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold underline';
                      }
                      return <span key={index} className={color}>{char}</span>;
                    })}
                  </div>

                  <textarea
                    ref={typingInputRef}
                    rows={4}
                    disabled={isTypingCompleted}
                    value={userInput}
                    onChange={handleTypingChange}
                    placeholder="Type passage here..."
                    className="w-full p-4 border border-slate-500/30 bg-transparent rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                  />
                  {isTypingCompleted && !showScorePopup && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-sm">
                      Typing Completed! Score Recorded: {score}% {appMode === 'full_exam' && '• Finalizing exam score...'}
                    </div>
                  )}
                </div>
              )}

              {(selectedModule === 'listening' || selectedModule === 'reading') && (
                <div className={`rounded-2xl border p-5 sm:p-8 shadow-xs space-y-6 ${themeClasses.card}`}>
                  {loading && <div className={`text-center py-12 font-bold ${themeClasses.textMuted}`}>Generating test questions...</div>}

                  {!loading && !testData && (
                    <button
                      onClick={() => generateTest(selectedModule)}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      Load {selectedModule.toUpperCase()} Test
                    </button>
                  )}

                  {testData && (
                    <div className="space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold">{testData.title}</h3>

                      {selectedModule === 'reading' && testData.passage && (
                        <div className="p-5 sm:p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl font-serif leading-relaxed shadow-xs text-xs sm:text-sm whitespace-pre-line">
                          {testData.passage}
                        </div>
                      )}

                      {selectedModule === 'listening' && testData.audioScript && !hasAudioEnded && (
                        <div className="p-4 bg-slate-950 text-white rounded-xl space-y-3 shadow-inner border border-slate-800">
                          <AudioPlayer
                            script={testData.audioScript}
                            onPlay={() => setHasAudioStarted(true)}
                            onEnded={() => {
                              setHasAudioEnded(true);
                              setIsListeningTimerActive(true);
                            }}
                          />
                        </div>
                      )}

                      {(selectedModule === 'reading' || hasAudioEnded) && (
                        <div className="space-y-6">
                          {selectedModule === 'listening' && isListeningTimerActive && !isSubmitted && (
                            <div className="p-3 bg-rose-600 text-white text-xs font-mono rounded-xl flex items-center justify-between animate-bounce shadow-xs">
                              <span className="flex items-center gap-1.5"><Icon name="clock" className="w-4 h-4" /> Time Remaining:</span>
                              <span>{listeningTimer}s</span>
                            </div>
                          )}

                          {testData.questions.map((q, idx) => (
                            <div key={q.id || idx} className="p-4 sm:p-5 bg-slate-500/5 border border-slate-500/10 rounded-xl space-y-3">
                              <p className="font-semibold text-sm sm:text-base">Question {idx + 1}: {q.question}</p>
                              <div className="grid grid-cols-1 gap-2">
                                {q.options?.map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    disabled={isSubmitted}
                                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    className={`p-3 text-left rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                                      selectedAnswers[q.id] === opt ? 'bg-amber-500/20 border-amber-500 text-amber-500 font-bold' : 'border-slate-500/20 bg-transparent'
                                  }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}

                          {!isSubmitted ? (
                            <button
                              onClick={selectedModule === 'listening' ? handleSubmitListening : handleSubmitReading}
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
                            >
                              Submit {selectedModule} Answers
                            </button>
                          ) : !showScorePopup && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-sm">
                              {selectedModule.toUpperCase()} Module Complete! Score Recorded: {score}% {appMode === 'full_exam' && '• Advancing to next exam module...'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {isTimedEvaluationActive && showIntegrityWarning && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl ${themeClasses.card}`}>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4"><Icon name="alert-circle" className="w-7 h-7" /></div>
            <h3 className="text-lg font-black">Assessment Integrity Warning</h3>
            <p className={`mt-2 text-sm leading-relaxed ${themeClasses.textMuted}`}>{integrityWarning}</p>
            <div className="mt-4 flex items-center justify-between text-xs"><span className={themeClasses.textMuted}>Integrity events detected</span><strong className="text-amber-500">{antiCheatViolations}</strong></div>
            {!isFullscreen && <p className="mt-3 text-xs font-bold text-rose-500">Fullscreen is required to continue.</p>}
            <button onClick={() => { if (document.fullscreenElement || !isTimedEvaluationActive) { setShowIntegrityWarning(false); } else { requestExamFullscreen(); } }} className="mt-6 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm">Return to Assessment</button>
          </div>
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className={`border rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative ${themeClasses.card}`}>
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">System Feedback</span>
                <h3 className="text-lg font-black">Rate & Recommend Cally</h3>
              </div>
              <button
                onClick={() => setShowRatingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center transition cursor-pointer"
              >
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>

            {ratingSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon name="sparkles" className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold">Thank you for your feedback!</h4>
                <p className={`text-xs ${themeClasses.textMuted}`}>Your review helps us improve the assessment platform.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="space-y-5">
                <div className="space-y-2 text-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Select Star Rating</label>
                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                      <RatingStar
                        key={star}
                        star={star}
                        value={hoverRating || userRating}
                        onPreview={setHoverRating}
                        onSelect={setUserRating}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Your Recommendation & Comments</label>
                  <textarea
                    rows={4}
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    placeholder="Tell us what you like about the system or what can be improved..."
                    className="w-full p-3.5 rounded-xl border border-slate-500/30 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRating}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer"
                >
                  {isSubmittingRating ? 'Submitting Review...' : 'Submit Rating & Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {showScorePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center space-y-5 transform animate-bounce-short">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner ${score !== null && score <= 70 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
              <Icon name={score !== null && score <= 70 ? 'alert-circle' : 'trophy'} className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Cally Assessment Hub Module Completed</span>
              <h3 className="text-2xl font-black">Your Score</h3>
            </div>
            
            <div className={`py-3 rounded-2xl border ${score !== null && score <= 70 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              <span className="text-5xl font-black">{score}%</span>
            </div>

            {score !== null && score <= 70 && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs italic font-medium leading-relaxed">
                {motivationalQuote}
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowScorePopup(false);
                  if (appMode === 'full_exam') {
                    handleAdvanceExamStep(score || 0);
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition shadow-md cursor-pointer"
              >
                {appMode === 'full_exam' ? 'Continue to Next Exam Module →' : 'Awesome, Close'}
              </button>

              {appMode === 'dashboard' && selectedModule && (
                <button
                  onClick={() => {
                    setShowScorePopup(false);
                    generateTest(selectedModule);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm py-3 px-4 rounded-xl transition cursor-pointer border border-slate-700 flex items-center justify-center gap-2"
                >
                  <Icon name="refresh" className="w-4 h-4" />
                  <span>Generate New Test</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showInstructionsModal && activeFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon name="info" className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-indigo-400 uppercase tracking-widest block">TephdyTech Module Guide</span>
                  <h3 className="text-base sm:text-lg font-black">{activeFeature.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer text-sm font-bold shrink-0"
              >
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
              {activeFeature.instructions}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition shadow-md cursor-pointer"
          >
              Got it, Let's Begin!
          </button>
          </div>
        </div>
      </div>
    )}

    <footer className={`w-full border-t py-5 px-3 sm:px-8 mt-auto shadow-xs ${themeClasses.header}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-center text-xs text-center">
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <span className="font-bold">Developed By TephdyTech</span>
          <span>&bull;</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>
  );
}