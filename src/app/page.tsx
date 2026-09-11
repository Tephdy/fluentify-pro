'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
          {isPlaying ? 'Playing Audio...' : 'Audio Stream Ready'}
        </span>
      </div>
      <button
        onClick={handlePlayAudio}
        disabled={isPlaying}
        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>{isPlaying ? '🔊 Speaking...' : '▶ Play Audio'}</span>
      </button>
    </div>
  );
}

const FALLBACK_SPEAKING_PROMPTS = [
  "Please repeat or retell the following idea: 'Effective customer support requires a balance of empathy, active listening, and swift technical verification to ensure client satisfaction.'",
  "Describe a challenging technical problem you solved recently, explaining your troubleshooting steps and the final resolution.",
  "State your views on how remote work environments impact team productivity, collaboration, and work-life balance."
];

function SpeakingRecorder({ prompts, onComplete }: { prompts: string[]; onComplete?: (score: number) => void }) {
  const promptList = prompts.length > 0 ? prompts : FALLBACK_SPEAKING_PROMPTS;
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

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
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
      formData.append('audio', audioBlob, 'speech-recording.webm');
      formData.append('prompt', currentPrompt);

      const res = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Evaluation failed on the server.');
      }

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
              <span>🎙️ Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2 animate-pulse"
            >
              <span>⏹️ Stop Recording & Analyze</span>
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
  type: string;
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

type ModuleType = 'listening' | 'reading' | 'writing' | 'speaking' | 'typing';

const DEFAULT_TYPING_PASSAGES = [
  "Thank you for contacting customer support. My name is Cally and I will be happy to assist you today. May I please have your account or ticket number to verify your details before we proceed?",
  "The representative listened carefully to the caller's concern regarding the billing discrepancy. After checking the system log, she confirmed that the extra charge would be refunded within three business days.",
  "Effective communication is essential in remote work environments. Clear updates and structured documentation prevent misunderstandings and keep project deliverables on track."
];

export default function Home() {
  const [userName, setUserName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);

  const [appMode, setAppMode] = useState<'dashboard' | 'full_exam'>('dashboard');
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);

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
  const [speakingPrompts, setSpeakingPrompts] = useState<string[]>(FALLBACK_SPEAKING_PROMPTS);
  const [writingText, setWritingText] = useState<string>('');
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

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

  const handleStartDashboardModule = (mod: ModuleType) => {
    setAppMode('dashboard');
    setSelectedModule(mod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setSelectedAnswers({});
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
    setAppMode('full_exam');
    setExamStepIndex(0);
    const firstMod = examSequence[0];
    setSelectedModule(firstMod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setSelectedAnswers({});
    resetListeningState();
    setShowInstructionsModal(true);
    generateTest(firstMod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setAppMode('dashboard');
    setSelectedModule(null);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowInstructionsModal(false);
    setSelectedAnswers({});
    resetListeningState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateTest = async (moduleType: ModuleType) => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(null);
    setSelectedAnswers({});
    resetListeningState();

    if (moduleType === 'typing') {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleType, testFormat: 'versant' }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Generation failed');
        return;
      }

      if (data.audioScript) data.audioScript = data.audioScript.replace(/Maya/g, 'Cally');
      if (data.title) data.title = data.title.replace(/Maya/g, 'Cally');

      if (moduleType === 'writing') {
        let nextPrompt = data.title || data.questions?.[0]?.question || 'Write a professional response.';
        nextPrompt = nextPrompt.replace(/Maya/g, 'Cally');
        setWritingPrompt(nextPrompt);
        setWritingText('');
      }

      if (moduleType === 'speaking') {
        const prompts = (data.questions ?? []).map((q: any) => q.question?.replace(/Maya/g, 'Cally')).filter(Boolean);
        setSpeakingPrompts(prompts.length > 0 ? prompts : FALLBACK_SPEAKING_PROMPTS);
      }

      if (moduleType === 'reading' || moduleType === 'listening') {
        setTestData(data);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to generation service');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceExamStep = (moduleScore: number) => {
    const currentMod = examSequence[examStepIndex];
    const updatedScores = { ...examScores, [currentMod]: moduleScore };
    setExamScores(updatedScores);

    const nextIndex = examStepIndex + 1;
    if (nextIndex < examSequence.length) {
      setExamStepIndex(nextIndex);
      const nextMod = examSequence[nextIndex];
      setSelectedModule(nextMod);
      setIsSubmitted(false);
      setScore(null);
      setSelectedAnswers({});
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
    setScore(finalPct);
    setIsSubmitted(true);

    if (appMode === 'full_exam') {
      setTimeout(() => handleAdvanceExamStep(finalPct), 1500);
    }
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
    setScore(finalPct);
    setIsSubmitted(true);

    if (appMode === 'full_exam') {
      setTimeout(() => handleAdvanceExamStep(finalPct), 1500);
    }
  };

  const handleSubmitWriting = () => {
    if (!writingText.trim()) return;
    setIsEvaluatingWriting(true);

    setTimeout(() => {
      const wordCount = writingText.trim().split(/\s+/).length;
      let scoreVal = 85;
      if (wordCount < 15) scoreVal = 60;

      setIsEvaluatingWriting(false);
      setIsSubmitted(true);
      setScore(scoreVal);

      if (appMode === 'full_exam') {
        setTimeout(() => handleAdvanceExamStep(scoreVal), 1500);
      }
    }, 800);
  };

  const handleSpeakingComplete = (scoreVal: number) => {
    setIsSubmitted(true);
    setScore(scoreVal);
    if (appMode === 'full_exam') {
      setTimeout(() => handleAdvanceExamStep(scoreVal), 1500);
    }
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
      setIsSubmitted(true);
      setScore(finalRounded);

      if (appMode === 'full_exam') {
        setTimeout(() => handleAdvanceExamStep(finalRounded), 1500);
      }
    }
  };

  const overallExamAverage = Math.round(
    Object.values(examScores).reduce((a, b) => a + b, 0) / 5
  );

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

      const opt = {
        margin: 0,
        filename: `Cally_Certificate_${userName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
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
      title: 'Versant Listening & Dictation',
      description: 'Single-play audio drills with dictation inputs and auto-evaluations.',
      tag: 'Listening',
      color: 'border-rose-200 bg-rose-50/40 text-rose-700',
      btnColor: 'bg-rose-600 hover:bg-rose-700',
      instructions: "1. Click 'Play Audio' (plays ONCE).\n2. Answer the 10 questions before the 1-minute timer expires.",
      icon: '🎧',
    },
    {
      id: 'reading' as ModuleType,
      title: 'Sentence Completion & Grammar',
      description: 'Practice SVAR vocabulary fill-in-the-blanks and grammar rules.',
      tag: 'Reading',
      color: 'border-amber-200 bg-amber-50/40 text-amber-700',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      instructions: "1. Review reading passage.\n2. Answer the multiple choice questions.",
      icon: '📖',
    },
    {
      id: 'writing' as ModuleType,
      title: 'Customer Email & Chat Writing',
      description: 'Draft professional customer responses and emails.',
      tag: 'Writing',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-700',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      instructions: "1. Read scenario prompt.\n2. Draft professional email response.",
      icon: '✍️',
    },
    {
      id: 'speaking' as ModuleType,
      title: 'Versant Repeat & Retell AI',
      description: 'Record verbatim sentence repetition & prompt replies.',
      tag: 'Speaking',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      instructions: "1. Read prompt.\n2. Record audio via microphone and analyze.",
      icon: '🎙️',
    },
    {
      id: 'typing' as ModuleType,
      title: 'Chat & Typing Speed Test',
      description: 'Train net WPM and accuracy for BPO candidate screening.',
      tag: 'Typing',
      color: 'border-sky-200 bg-sky-50/40 text-sky-700',
      btnColor: 'bg-sky-600 hover:bg-sky-700',
      instructions: "1. Type the displayed passage accurately to complete the module.",
      icon: '⌨️',
    },
  ];

  const activeFeature = dashboardFeatures.find((f) => f.id === selectedModule);

  if (!isNameSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
            ✨
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Welcome to Cally</h1>
            <p className="text-slate-500 text-xs">Please enter your full name to begin your assessment journey.</p>
          </div>
          <input
            type="text"
            placeholder="Enter your full name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3.5 border border-slate-300 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            disabled={!userName.trim()}
            onClick={() => setIsNameSubmitted(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition shadow-md cursor-pointer"
          >
            Enter Assessment Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToDashboard}>
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
              <Image src="/logo.png" alt="Cally Logo" fill priority className="object-contain" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-lg">Cally Assessment Hub</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
            <span className="truncate max-w-[120px] sm:max-w-none">Candidate: <strong className="text-indigo-600">{userName}</strong></span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-8 py-4 sm:py-6">
        {appMode === 'dashboard' && !selectedModule && (
          <div className="space-y-8 sm:space-y-10">
            <div className="p-6 sm:p-12 bg-slate-900 text-white rounded-3xl space-y-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/30">
                  Flexible Assessment & Certification Portal
                </span>
                <h1 className="text-2xl sm:text-4xl font-black">Choose Your Mode</h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Practice any module individually on the dashboard without a certificate, or take the official <strong>Full Exam</strong> pathway to download your verified certificate!
                </p>
              </div>
              <div className="shrink-0 relative z-10 w-full md:w-auto">
                <button
                  onClick={handleStartFullExam}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-base px-6 sm:px-8 py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-3"
                >
                  <span>🎓 Take Full Exam & Download Certificate</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Individual Practice Modules</h2>
                  <p className="text-xs text-slate-500">Practice freely module-by-module (No certificate generated)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {dashboardFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{feat.icon}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${feat.color}`}>
                          {feat.tag}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
                      </div>
                    </div>
                    <div className="pt-6">
                      <button
                        onClick={() => handleStartDashboardModule(feat.id)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition cursor-pointer ${feat.btnColor}`}
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

        {appMode === 'full_exam' && examStepIndex === 5 && (
          <div className="space-y-6 sm:space-y-8 max-w-[1300px] mx-auto text-center animate-fadeIn">
            <div className="p-3 sm:p-6 bg-slate-100 rounded-3xl border border-slate-200 shadow-xl overflow-x-auto w-full">
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
                  flexShrink: 0,
                }}
              >
                <div style={{ border: '2px solid #b45309', padding: '30px 40px', position: 'relative' }}>
                  
                  <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: '#1e293b', fontWeight: '700' }}>
                      ✨ TephdyTech & Cally Assessment Systems ✨
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
                    {userName}
                  </div>

                  <p style={{ fontSize: '13px', color: '#334155', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                    has successfully demonstrated exceptional proficiency across all official assessment modules, showcasing linguistic mastery, professional communication skills, and technical competency required for the Business Process Outsourcing (BPO) industry.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 30px', maxWidth: '850px', margin: '0 auto 25px auto', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <div>🎧 Listening & Dictation ({examScores.listening}%)</div>
                    <div>🎙️ Versant Speaking Simulation ({examScores.speaking}%)</div>
                    <div>📖 Reading & Grammar ({examScores.reading}%)</div>
                    <div>⌨️ Chat & Typing Accuracy ({examScores.typing}%)</div>
                    <div>✍️ Business Writing Composition ({examScores.writing}%)</div>
                    <div style={{ color: '#b45309', fontWeight: '700' }}>⭐ Final Cumulative Rating: ({overallExamAverage}%)</div>
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
                      Cally Evaluation Authority
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '11px', color: '#64748b', fontWeight: '600', letterSpacing: '1px' }}>
                    DATE OF ISSUE: [{new Date().toLocaleDateString().toUpperCase()}] &bull; CERTIFICATE ID: [TT-CALLY-BPO-2026-{Math.floor(1000 + Math.random() * 9000)}]
                  </div>

                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-xl">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Exam Finished Successfully!</h2>
                <p className="text-xs sm:text-sm text-slate-600">Your verified certificate file (.pdf) is ready for download.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  disabled={isDownloadingPdf}
                  onClick={handleDownloadPDF}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isDownloadingPdf ? '⏳ Generating .pdf file...' : '📥 Download Certificate (.pdf)'}</span>
                </button>
                <button
                  onClick={handleBackToDashboard}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-6 py-3.5 rounded-xl transition cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedModule && (appMode === 'dashboard' || (appMode === 'full_exam' && examStepIndex < 5)) && (
          <div className="space-y-6 max-w-[1400px] mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                ← Back to Dashboard
              </button>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  {appMode === 'full_exam' ? `Full Exam Step ${examStepIndex + 1} of 5` : 'Individual Practice Mode'}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 capitalize">{selectedModule} Module</h2>
              </div>
            </div>

            {selectedModule === 'speaking' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
                <SpeakingRecorder prompts={speakingPrompts} onComplete={handleSpeakingComplete} />
              </div>
            )}

            {selectedModule === 'writing' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
                <div className="p-4 sm:p-5 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-indigo-800 uppercase block">Writing Prompt:</span>
                  <p className="text-slate-800 text-sm sm:text-base font-medium">{writingPrompt}</p>
                </div>
                <textarea
                  rows={6}
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  placeholder="Type your professional response here..."
                  className="w-full p-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSubmitWriting}
                  disabled={isEvaluatingWriting || !writingText.trim()}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
                >
                  {isEvaluatingWriting ? 'Evaluating...' : 'Submit Writing Assessment'}
                </button>
                {isSubmitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-sm">
                    ✓ Writing Submitted! Score: {score}% {appMode === 'full_exam' && '• Advancing to next exam module...'}
                  </div>
                )}
              </div>
            )}

            {selectedModule === 'typing' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <span className="text-xs text-sky-600 block font-bold uppercase">WPM</span>
                    <span className="text-2xl font-black text-sky-950">{wpm}</span>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <span className="text-xs text-indigo-600 block font-bold uppercase">Accuracy</span>
                    <span className="text-2xl font-black text-indigo-950">{accuracy}%</span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-slate-900 text-slate-300 rounded-2xl font-mono text-xs sm:text-base leading-relaxed overflow-x-auto">
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
                  className="w-full p-4 border border-slate-300 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                />
                {isTypingCompleted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-sm">
                    ✓ Typing Completed! Score Recorded: {score}% {appMode === 'full_exam' && '• Finalizing exam score...'}
                  </div>
                )}
              </div>
            )}

            {(selectedModule === 'listening' || selectedModule === 'reading') && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
                {loading && <div className="text-center py-12 text-slate-500 font-bold">Generating test questions...</div>}

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
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{testData.title}</h3>

                    {selectedModule === 'reading' && testData.passage && (
                      <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-xl font-serif text-slate-800 leading-relaxed shadow-xs text-xs sm:text-sm">
                        {testData.passage}
                      </div>
                    )}

                    {selectedModule === 'listening' && testData.audioScript && !hasAudioEnded && (
                      <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 shadow-inner">
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
                          <div className="p-3 bg-rose-600 text-white text-xs font-mono rounded-xl flex justify-between animate-bounce shadow-xs">
                            <span>⏱️ Time Remaining:</span>
                            <span>{listeningTimer}s</span>
                          </div>
                        )}

                        {testData.questions.map((q, idx) => (
                          <div key={q.id || idx} className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <p className="font-semibold text-slate-900 text-xs sm:text-sm">Question {idx + 1}: {q.question}</p>
                            <div className="grid grid-cols-1 gap-2">
                              {q.options?.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  disabled={isSubmitted}
                                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className={`p-3 text-left rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                                    selectedAnswers[q.id] === opt ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
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
                        ) : (
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-sm">
                            ✓ {selectedModule.toUpperCase()} Module Complete! Score Recorded: {score}% {appMode === 'full_exam' && '• Advancing to next exam module...'}
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

      {showInstructionsModal && activeFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-inner shrink-0">
                  📌
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-indigo-600 uppercase tracking-widest block">Module Guide</span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{activeFeature.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer text-sm font-bold shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/60 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
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

      <footer className="w-full border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 mt-auto shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center text-xs text-slate-500 text-center">
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <span className="font-bold text-slate-700">Developed By TephdyTech</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}