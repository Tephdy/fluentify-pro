'use client';

import { useState, useEffect } from 'react';

interface AudioPlayerProps {
  script: string;
}

export default function AudioPlayer({ script }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Cleanup speech if user leaves the page or script changes
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [script]);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support text-to-speech audio.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95; // Slightly slower for natural listening practice

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-indigo-950 text-sm">🎧 Listening Audio Track</h3>
          <p className="text-xs text-indigo-600">Listen to the prompt before answering the questions below.</p>
        </div>
        <div className="flex space-x-2">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-md font-medium transition"
            >
              {isPaused ? 'Resume' : 'Play Audio'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-4 py-2 rounded-md font-medium transition"
            >
              Pause
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 text-xs px-3 py-2 rounded-md transition"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}