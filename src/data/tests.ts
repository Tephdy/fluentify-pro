// src/data/tests.ts

export interface Question {
  id: number;
  type: 'fill-in-blank' | 'multiple-choice';
  prompt: string;
  options?: string[];
  correctAnswer: string;
}

export interface PracticeTest {
  id: string;
  title: string;
  module: 'listening' | 'reading';
  audioUrl?: string; // Optional for Reading
  passage?: string;   // Optional for Listening
  timeLimitMinutes: number;
  questions: Question[];
}

export const sampleListeningTest: PracticeTest = {
  id: 'listening-1',
  title: 'Listening Test 1: Hotel Booking Inquiry',
  module: 'listening',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample audio placeholder
  timeLimitMinutes: 30,
  questions: [
    {
      id: 1,
      type: 'fill-in-blank',
      prompt: 'Name of contact person: _________',
      correctAnswer: 'Sarah Jenkins',
    },
    {
      id: 2,
      type: 'multiple-choice',
      prompt: 'Type of room requested:',
      options: ['Single Room', 'Double Room', 'Deluxe Suite'],
      correctAnswer: 'Double Room',
    },
    {
      id: 3,
      type: 'fill-in-blank',
      prompt: 'Length of stay: _________ nights',
      correctAnswer: '3',
    },
  ],
};

// Convert raw score to estimated IELTS Band
export function getBandScore(correctCount: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  const percentage = (correctCount / totalQuestions) * 100;

  if (percentage >= 90) return 9.0;
  if (percentage >= 80) return 8.0;
  if (percentage >= 70) return 7.0;
  if (percentage >= 60) return 6.0;
  if (percentage >= 50) return 5.0;
  return 4.5;
}