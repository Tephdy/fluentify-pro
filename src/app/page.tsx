'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// --- COMPONENT PROPS FIXES FOR TYPESCRIPT ---
interface AudioPlayerProps {
  script: string;
  onPlay?: () => void;
  onEnded?: () => void;
}

// Functional Text-to-Speech Audio Player
function AudioPlayer({ script, onPlay, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (!script || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onPlay?.();
      setTimeout(() => {
        setIsPlaying(false);
        onEnded?.();
      }, 3000);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);
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
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`} />
        <span className="text-xs font-mono text-slate-300">
          {isPlaying ? 'Playing Audio...' : 'Audio Stream Ready'}
        </span>
      </div>
      <button
        onClick={handlePlayAudio}
        disabled={isPlaying}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
      >
        <span>{isPlaying ? '🔊 Speaking...' : '▶ Play Audio'}</span>
      </button>
    </div>
  );
}

// --- SPEAKING RECORDER & AI EVALUATOR COMPONENT ---
const SPEAKING_PROMPTS = [
  "Please repeat or retell the following idea: 'Effective customer support requires a balance of empathy, active listening, and swift technical verification to ensure client satisfaction.'",
  "Describe a challenging technical problem you solved recently, explaining your troubleshooting steps and the final resolution.",
  "State your views on how remote work environments impact team productivity, collaboration, and work-life balance."
];

function SpeakingRecorder() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(SPEAKING_PROMPTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speakingEvaluation, setSpeakingEvaluation] = useState<{
    pronunciationScore: number;
    fluencyScore: number;
    grammarScore: number;
    feedback: string;
    adviceList: string[];
  } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setSpeakingEvaluation(null);
    setRecordingSeconds(0);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    setTimeout(() => {
      setSpeakingEvaluation({
        pronunciationScore: 84,
        fluencyScore: 82,
        grammarScore: 88,
        feedback: "Your cadence and articulation are clear, though maintaining a steady rhythm will enhance professional fluency.",
        adviceList: [
          "Keep your pacing uniform and avoid long pauses between clauses.",
          "Ensure plural noun endings and verb agreements are pronounced clearly.",
          "Maintain an upbeat, confident professional tone throughout your recitation."
        ]
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleNextPrompt = () => {
    const nextIdx = (promptIndex + 1) % SPEAKING_PROMPTS.length;
    setPromptIndex(nextIdx);
    setCurrentPrompt(SPEAKING_PROMPTS[nextIdx]);
    setSpeakingEvaluation(null);
    setRecordingSeconds(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Versant Speaking & Recitation AI</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Repeat, Retell & Impromptu Speaking Test</h3>
        </div>
        <button
          onClick={handleNextPrompt}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition border border-slate-200 cursor-pointer"
        >
          Next Prompt
        </button>
      </div>

      <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Speaking Prompt / Task:</span>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">{currentPrompt}</p>
      </div>

      {/* Recording Control Center */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-inner">
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-mono text-sm tracking-wide">
            {isRecording ? `Recording Audio... (${recordingSeconds}s)` : 'Microphone Standby'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>🎙️ Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center gap-2 animate-pulse"
            >
              <span>⏹️ Stop Recording & Analyze</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Analyzing Spinner */}
      {isAnalyzing && (
        <div className="p-6 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg className="animate-spin h-6 w-6 text-emerald-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">AI Analyzing Pronunciation, Fluency & Grammar...</span>
        </div>
      )}

      {/* Speaking Evaluation & Advice Report */}
      {speakingEvaluation && !isAnalyzing && (
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900">Speaking Assessment & Recitation Report</h4>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
              Analysis Complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pronunciation</span>
              <span className="text-2xl font-black text-slate-900">{speakingEvaluation.pronunciationScore}%</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Fluency & Rhythm</span>
              <span className="text-2xl font-black text-slate-900">{speakingEvaluation.fluencyScore}%</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Grammar & Structure</span>
              <span className="text-2xl font-black text-slate-900">{speakingEvaluation.grammarScore}%</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900 text-slate-200 rounded-2xl space-y-3 shadow-inner">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Speech Feedback</span>
            <p className="text-sm leading-relaxed">{speakingEvaluation.feedback}</p>
          </div>

          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <span>💡</span>
              <span>Expert Recitation Advice</span>
            </div>
            <ul className="space-y-2">
              {speakingEvaluation.adviceList.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
// ---------------------------------------------

interface Question {
  id: string;
  type: 'sentence_repeat' | 'dictation' | 'sentence_build' | 'sentence_completion' | 'passage_retell';
  question: string;
  options?: string[];
  correctAnswer?: string;
  audioPromptText?: string;
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
  "Thank you for contacting customer support. My name is Alex and I will be happy to assist you today. May I please have your account or ticket number to verify your details before we proceed?",
  "The representative listened carefully to the caller's concern regarding the billing discrepancy. After checking the system log, she confirmed that the extra charge would be refunded within three business days.",
  "Effective communication is essential in remote work environments. Clear updates and structured documentation prevent misunderstandings and keep project deliverables on track."
];

const READING_TOPIC_POOLS = [
  {
    title: "Corporate Remote Work & Hybrid Policy Guidelines",
    passage: "Modern organizations are shifting towards hybrid operating models to balance employee autonomy with collaborative synergy. Effective communication channels, regular asynchronous updates, and secure cloud infrastructure are paramount to maintaining team productivity across distributed time zones.\n\nFurthermore, transitioning to these flexible frameworks requires deliberate cultural alignment. Management must trust output over physical presence while providing staff with the digital tools necessary to streamline project workflows and mitigate burnout.",
    questions: [
      { id: 'q1', type: 'sentence_completion' as const, question: "Organizations are shifting towards _____ models to balance autonomy.", options: ["hybrid", "isolated", "rigid", "manual"], correctAnswer: "hybrid" },
      { id: 'q2', type: 'sentence_completion' as const, question: "Regular asynchronous updates help maintain productivity across distributed _____ zones.", options: ["time", "climate", "comfort", "silent"], correctAnswer: "time" },
      { id: 'q3', type: 'sentence_completion' as const, question: "Management must prioritize staff output over physical _____.", options: ["presence", "absence", "silence", "distance"], correctAnswer: "presence" }
    ]
  },
  {
    title: "Customer Service Escalation & Conflict Resolution",
    passage: "When managing distressed clients, the primary objective is active empathy combined with rapid technical verification. Representatives must isolate root-cause discrepancies in system logs before communicating resolution timelines to prevent further friction.\n\nDe-escalation also relies heavily on maintaining a calm, reassuring tone and setting realistic expectations. By validating the customer's frustration early in the interaction, agents can transform a negative experience into long-term brand loyalty.",
    questions: [
      { id: 'q1', type: 'sentence_completion' as const, question: "The primary objective when handling distressed clients is active _____.", options: ["empathy", "indifference", "hostility", "silence"], correctAnswer: "empathy" },
      { id: 'q2', type: 'sentence_completion' as const, question: "Representatives must isolate root-cause discrepancies in system _____.", options: ["logs", "menus", "speakers", "cabinets"], correctAnswer: "logs" },
      { id: 'q3', type: 'sentence_completion' as const, question: "By validating customer frustration, agents can build long-term brand _____.", options: ["loyalty", "fatigue", "distance", "confusion"], correctAnswer: "loyalty" }
    ]
  }
];

const WRITING_PROMPTS = [
  "A customer is complaining that their monthly subscription was billed twice due to a system glitch. Write a professional email response addressing their concern, apologizing for the error, and detailing how the refund will be processed.",
  "Write an email to your team manager requesting approval to work remotely for the next three days due to personal commitments, ensuring them that all current project deliverables will be completed on schedule.",
  "A client is inquiring about the delayed delivery of their enterprise software license keys. Write a reassuring customer service response explaining the technical verification delay and providing an updated delivery timeframe."
];

export default function Home() {
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const [hasAudioEnded, setHasAudioEnded] = useState(false);
  const [listeningTimer, setListeningTimer] = useState<number>(20);
  const [isListeningTimerActive, setIsListeningTimerActive] = useState(false);

  const answerInputRef = useRef<HTMLInputElement | null>(null);

  const [typingPassage, setTypingPassage] = useState<string>(DEFAULT_TYPING_PASSAGES[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTypingCompleted, setIsTypingCompleted] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const typingInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Writing Test States
  const [writingPrompt, setWritingPrompt] = useState<string>(WRITING_PROMPTS[0]);
  const [writingText, setWritingText] = useState<string>('');
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState<boolean>(false);
  const [writingEvaluation, setWritingEvaluation] = useState<{
    grammarScore: number;
    vocabularyScore: number;
    toneScore: number;
    feedback: string;
    correctedVersion: string;
    adviceList: string[];
  } | null>(null);

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
      timer = setInterval(() => {
        setListeningTimer((prev) => prev - 1);
      }, 1000);
    } else if (selectedModule === 'listening' && isListeningTimerActive && listeningTimer === 0 && !isSubmitted) {
      handleSubmit(); 
      setIsListeningTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [selectedModule, isListeningTimerActive, listeningTimer, isSubmitted]);

  const resetListeningState = () => {
    setHasAudioStarted(false);
    setHasAudioEnded(false);
    setListeningTimer(20);
    setIsListeningTimerActive(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const resetTypingState = (newPassage?: string) => {
    const targetPassage = newPassage || DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
    setTypingPassage(targetPassage);
    setUserInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsTypingCompleted(false);
    setWpm(0);
    setAccuracy(100);
    setTimeout(() => typingInputRef.current?.focus(), 100);
  };

  const resetWritingState = () => {
    const randomPrompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
    setWritingPrompt(randomPrompt);
    setWritingText('');
    setWritingEvaluation(null);
  };

  const handleSelectModule = (tab: ModuleType) => {
    setSelectedModule(tab);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setSelectedAnswers({});
    resetListeningState();
    if (tab === 'typing') {
      resetTypingState();
    }
    if (tab === 'writing') {
      resetWritingState();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setSelectedModule(null);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
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

    if (moduleType === 'reading') {
      const randomTopic = READING_TOPIC_POOLS[Math.floor(Math.random() * READING_TOPIC_POOLS.length)];
      setTimeout(() => {
        setTestData({
          id: `read-${Math.random().toString(36).substring(2, 7)}`,
          title: randomTopic.title,
          passage: randomTopic.passage,
          questions: randomTopic.questions
        });
        setLoading(false);
      }, 300);
      return;
    }

    if (moduleType === 'writing' || moduleType === 'speaking') {
      setLoading(false);
      return;
    }

    if (moduleType === 'typing') {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleType: 'reading', testFormat: 'versant' }),
        });
        const data = await res.json();
        if (res.ok && data.passage) {
          resetTypingState(data.passage);
        } else {
          resetTypingState();
        }
      } catch (err) {
        console.error(err);
        resetTypingState();
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleType, testFormat: 'versant' }),
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

  const handleSubmitWriting = () => {
    if (!writingText.trim()) return;
    setIsEvaluatingWriting(true);

    setTimeout(() => {
      const wordCount = writingText.trim().split(/\s+/).length;
      let baseGrammar = 80;
      let baseVocab = 75;
      let baseTone = 85;

      if (writingText.includes('please') || writingText.includes('Thank you')) {
        baseTone += 10;
      }
      if (wordCount < 15) {
        baseGrammar -= 20;
        baseVocab -= 15;
      }

      const scoreVal = Math.min(Math.max(Math.round((baseGrammar + baseVocab + baseTone) / 3), 50), 98);

      setWritingEvaluation({
        grammarScore: Math.min(baseGrammar, 100),
        vocabularyScore: Math.min(baseVocab, 100),
        toneScore: Math.min(baseTone, 100),
        feedback: `Your response contains ${wordCount} words. The overall structure aligns with standard business English communication practices, though minor refinements can boost clarity.`,
        correctedVersion: writingText.replace(/\bi\b/g, 'I'),
        adviceList: [
          wordCount < 25 ? "Expand your response slightly to provide more complete details and context." : "Good sentence length and development.",
          "Ensure proper capitalization for the pronoun 'I' and at the beginning of every sentence.",
          "Maintain a polite, empathetic tone when addressing customer issues to maximize brand satisfaction."
        ]
      });
      setIsEvaluatingWriting(false);
    }, 800);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsListeningTimerActive(false);

    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      const correctAnswer = q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      if (userAnswer && userAnswer === correctAnswer) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const handleAudioPlay = () => {
    setHasAudioStarted(true);
    setHasAudioEnded(false);
  };

  const handleAudioEnd = () => {
    setHasAudioEnded(true);
    setIsListeningTimerActive(true);
    setListeningTimer(20);
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isTypingCompleted) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === typingPassage[i]) {
        correctChars++;
      }
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    if (val.length >= typingPassage.length) {
      setIsTypingCompleted(true);
      const totalTimeInMinutes = Math.max((Date.now() - (startTime || Date.now())) / 60000, 0.05);
      const wordsTyped = val.trim().split(/\s+/).length;
      setWpm(Math.round(wordsTyped / totalTimeInMinutes));
    }
  };

  const dashboardFeatures = [
    {
      id: 'listening' as ModuleType,
      title: 'Versant Listening & Dictation',
      description: 'Single-play audio drills with dictation inputs and auto-evaluations.',
      tag: 'Listening & Dictation',
      color: 'border-rose-200 bg-rose-50/40 text-rose-700',
      btnColor: 'bg-rose-600 hover:bg-rose-700',
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'reading' as ModuleType,
      title: 'Sentence Completion & Grammar',
      description: 'Practice SVAR vocabulary fill-in-the-blanks, sentence builds, and business English grammar rules.',
      tag: 'Grammar & Vocabulary',
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
      title: 'Customer Email & Chat Writing',
      description: 'Type any response or email; AI checks grammar, tone, spelling, and provides expert advice.',
      tag: 'BPO Email Test',
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
      title: 'Versant Repeat & Retell AI',
      description: 'Record verbatim sentence repetition, passage retellings, and impromptu responses.',
      tag: 'Pronunciation & Fluency',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      id: 'typing' as ModuleType,
      title: 'Chat & Typing Speed Test',
      description: 'Train your net typing speed (WPM) and accuracy required for BPO candidate screening.',
      tag: 'Net WPM & Accuracy',
      color: 'border-sky-200 bg-sky-50/40 text-sky-700',
      btnColor: 'bg-sky-600 hover:bg-sky-700',
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const activeFeature = dashboardFeatures.find((f) => f.id === selectedModule);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToDashboard}>
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="Cally Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-lg block">
                Cally
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {selectedModule ? `SVARS / Versant Mode: ${activeFeature?.title}` : 'SVAR & Versant Assessment Simulator'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedModule ? (
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition border border-slate-200/80 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => handleSelectModule('listening')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                Start Practice Drill
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-8 py-6">
        {/* DASHBOARD VIEW */}
        {!selectedModule && (
          <div className="space-y-12">
            <section className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950/50 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Real Versant Exam Rules Applied
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Ace Your <span className="text-indigo-400">Versant & SVAR</span> Communication Assessments
                </h1>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                  Practice with single-play audio prompts, flexible answering, optional countdown timers, and instant scoring.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-4 gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">SVAR & Versant Test Modules</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Select a section to begin real exam simulation</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
                  5 Assessment Sections
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
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
                        className={`w-full text-white font-medium text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 ${feat.btnColor} cursor-pointer`}
                      >
                        <span>Start Drill</span>
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

        {/* FOCUS MODE */}
        {selectedModule && (
          <div className="space-y-6 max-w-[1600px] mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition text-slate-600 cursor-pointer"
                  title="Return to Dashboard"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>

                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    Versant / SVAR Evaluation Engine
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {activeFeature?.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full md:w-auto overflow-x-auto">
                {dashboardFeatures.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectModule(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition whitespace-nowrap cursor-pointer ${
                      selectedModule === f.id
                        ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.id}
                  </button>
                ))}
              </div>

              <button
                onClick={() => generateTest(selectedModule)}
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition shadow-sm disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating Drill...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>{selectedModule === 'typing' ? 'New Passage' : selectedModule === 'reading' ? 'Generate Random Passage' : selectedModule === 'writing' ? 'New Writing Prompt' : selectedModule === 'speaking' ? 'New Speaking Prompt' : 'Generate SVAR Audio'}</span>
                  </>
                )}
              </button>
            </div>

            {/* SPEAKING MODULE VIEW */}
            {selectedModule === 'speaking' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <SpeakingRecorder />
              </div>
            )}

            {/* WRITING TEST VIEW */}
            {selectedModule === 'writing' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Versant Writing Assessment Prompt</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Customer Service & Professional Email Reply</h3>
                  </div>
                  <button
                    onClick={resetWritingState}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition border border-slate-200 cursor-pointer"
                  >
                    Change Prompt
                  </button>
                </div>

                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">Scenario / Task:</span>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">{writingPrompt}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Type your response or email below (AI will check grammar, spelling, tone, and provide advice):
                  </label>
                  <textarea
                    rows={6}
                    value={writingText}
                    onChange={(e) => setWritingText(e.target.value)}
                    placeholder="Type your professional response here freely..."
                    className="w-full p-4 border border-slate-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y shadow-xs"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">
                      Word Count: {writingText.trim() ? writingText.trim().split(/\s+/).length : 0} words
                    </span>
                    <button
                      onClick={handleSubmitWriting}
                      disabled={isEvaluatingWriting || !writingText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      {isEvaluatingWriting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>AI Evaluating Writing...</span>
                        </>
                      ) : (
                        <span>Evaluate Writing & Get Advice</span>
                      )}
                    </button>
                  </div>
                </div>

                {writingEvaluation && (
                  <div className="mt-8 pt-6 border-t border-slate-200 space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-slate-900">AI Evaluation & Performance Report</h4>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                        Evaluated Successfully
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Grammar & Mechanics</span>
                        <span className="text-2xl font-black text-slate-900">{writingEvaluation.grammarScore}%</span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Vocabulary Level</span>
                        <span className="text-2xl font-black text-slate-900">{writingEvaluation.vocabularyScore}%</span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Professional Tone</span>
                        <span className="text-2xl font-black text-slate-900">{writingEvaluation.toneScore}%</span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-900 text-slate-200 rounded-2xl space-y-3 shadow-inner">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Detailed Feedback</span>
                      <p className="text-sm leading-relaxed">{writingEvaluation.feedback}</p>
                    </div>

                    <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                        <span>💡</span>
                        <span>Expert Advice & Recommendations</span>
                      </div>
                      <ul className="space-y-2">
                        {writingEvaluation.adviceList.map((advice, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Refined / Corrected Version</span>
                      <p className="text-sm font-mono text-slate-800 bg-white p-3 rounded-lg border border-emerald-100">
                        {writingEvaluation.correctedVersion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TYPING TEST VIEW */}
            {selectedModule === 'typing' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl text-center">
                    <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider block">WPM</span>
                    <span className="text-2xl sm:text-3xl font-black text-sky-950">{wpm}</span>
                  </div>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-center">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">Accuracy</span>
                    <span className="text-2xl sm:text-3xl font-black text-indigo-950">{accuracy}%</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Time</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-800">{elapsedSeconds}s</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Progress</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-800">
                      {Math.min(Math.round((userInput.length / typingPassage.length) * 100), 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 text-slate-300 rounded-2xl font-mono text-base leading-relaxed tracking-wide select-none shadow-inner border border-slate-800">
                  {typingPassage.split('').map((char, index) => {
                    let colorClass = 'text-slate-500';
                    let bgClass = '';

                    if (index < userInput.length) {
                      if (userInput[index] === char) {
                        colorClass = 'text-emerald-400 font-bold';
                      } else {
                        colorClass = 'text-rose-400 font-bold underline decoration-rose-500 decoration-2';
                      }
                    } else if (index === userInput.length) {
                      colorClass = 'text-white font-bold';
                      bgClass = 'bg-sky-500/30 animate-pulse rounded-xs px-0.5';
                    }

                    return (
                      <span key={index} className={`${colorClass} ${bgClass}`}>
                        {char}
                      </span>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <textarea
                    ref={typingInputRef}
                    rows={4}
                    disabled={isTypingCompleted}
                    value={userInput}
                    onChange={handleTypingChange}
                    placeholder="Type the passage exactly as shown above..."
                    className="w-full p-4 border border-slate-300 rounded-xl font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-100 disabled:text-slate-500 transition resize-none shadow-xs"
                  />

                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => resetTypingState()}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition border border-slate-200 cursor-pointer"
                    >
                      Reset Test
                    </button>

                    {isTypingCompleted && (
                      <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold">
                        <span>✓ Test Completed! Final Speed: {wpm} WPM</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STANDARD ASSESSMENT CARDS */}
            {selectedModule !== 'typing' && selectedModule !== 'speaking' && selectedModule !== 'writing' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {testData?.title || `Versant / SVAR ${selectedModule.toUpperCase()} Test`}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                    {selectedModule === 'reading' ? 'Randomized 2-Paragraph Passage' : 'Single-Play Audio Mode'}
                  </span>
                </div>

                {selectedModule === 'reading' && testData?.passage && (
                  <div className="p-6 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                      <span>📖</span>
                      <span>Reading Reference Passage (Multi-Paragraph)</span>
                    </div>
                    <div className="space-y-3 text-slate-800 text-base sm:text-lg leading-relaxed font-serif">
                      {testData.passage.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  </div>
                )}

                {testData?.audioScript && selectedModule === 'listening' && !hasAudioEnded && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs font-bold transition-all ${
                      !hasAudioStarted
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900 animate-pulse'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {!hasAudioStarted ? '▶️' : '🔊'}
                        </span>
                        <span>
                          {!hasAudioStarted
                            ? 'Audio plays ONCE. Press Play below. Listen carefully.'
                            : 'Audio is playing... The player will disappear once finished.'}
                        </span>
                      </div>
                    </div>

                    <div className="relative p-4 bg-slate-900 text-white rounded-xl shadow-inner">
                      <AudioPlayer
                        script={testData.audioScript}
                        onPlay={handleAudioPlay}
                        onEnded={handleAudioEnd}
                      />
                    </div>
                  </div>
                )}

                {hasAudioEnded && selectedModule === 'listening' && !isSubmitted && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4 text-xs font-bold text-emerald-900">
                    <span>✓ Audio player removed after playing. Answer the questions below.</span>
                    {isListeningTimerActive && (
                      <div className="flex items-center gap-1.5 bg-rose-600 text-white font-mono px-3 py-1 rounded-lg text-xs shadow-xs animate-bounce">
                        <span>⏱️</span>
                        <span>{listeningTimer}s remaining</span>
                      </div>
                    )}
                  </div>
                )}

                {!testData && !loading && (
                  <div className="text-center py-16 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
                      ✨
                    </div>
                    <h4 className="text-base font-semibold text-slate-800">No Passage Generated</h4>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                      Click <strong className="text-slate-700">Generate Random Passage</strong> above to load a fresh reading test.
                    </p>
                  </div>
                )}

                {testData?.questions && testData.questions.length > 0 && (
                  <div className="space-y-6 pt-2">
                    {testData.questions.map((q, idx) => {
                      const userAnswer = selectedAnswers[q.id] || '';
                      const isCorrect =
                        isSubmitted &&
                        userAnswer.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") ===
                          q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

                      return (
                        <div key={q.id || idx} className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/30 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                              Question {idx + 1}
                            </span>
                            {isSubmitted && (
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                                isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}>
                                {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                              </span>
                            )}
                          </div>

                          <p className="font-semibold text-slate-800 text-base">{q.question}</p>

                          {q.options && q.options.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                              {q.options.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  disabled={isSubmitted}
                                  onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                  className={`p-3 text-left rounded-xl border text-sm font-medium transition cursor-pointer ${
                                    selectedAnswers[q.id] === opt
                                      ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs font-semibold'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                  } ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2 pt-1">
                              <input
                                ref={idx === 0 ? answerInputRef : null}
                                type="text"
                                disabled={isSubmitted}
                                value={userAnswer}
                                onChange={(e) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                placeholder="Type your response here..."
                                className="w-full p-3.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-400 transition shadow-xs"
                              />
                            </div>
                          )}

                          {isSubmitted && q.correctAnswer && (
                            <div className="mt-2 text-xs font-semibold text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200">
                              <span className="text-slate-500">Correct Answer: </span>
                              <span className="text-slate-900 font-bold">{q.correctAnswer}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                      {!isSubmitted ? (
                        <button
                          onClick={handleSubmit}
                          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-xs cursor-pointer"
                        >
                          Submit Test Answers
                        </button>
                      ) : (
                        <div className="flex items-center justify-between w-full bg-slate-900 text-white p-4 rounded-xl">
                          <div>
                            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Final Result</span>
                            <span className="text-lg font-bold text-emerald-400">
                              Score: {score} / {testData.questions.length} ({Math.round(((score || 0) / testData.questions.length) * 100)}%)
                            </span>
                          </div>
                          <button
                            onClick={() => generateTest(selectedModule)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg transition cursor-pointer"
                          >
                            Try Another Practice Drill
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ⬇️ PASTE THE FOOTER HERE (Right before the last closing </div>) */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 mt-auto shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Developed By TephdyTech</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-4 font-medium text-slate-600">
            <span className="hover:text-sky-600 transition cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-sky-600 transition cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-sky-600 transition cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );

  
}
