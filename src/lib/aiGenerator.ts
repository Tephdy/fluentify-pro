export interface GeneratedQuestion {
  id: number;
  type: 'text' | 'radio';
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface GeneratedTest {
  id: string;
  title: string;
  audioScript?: string;
  passage?: string;
  questions: GeneratedQuestion[];
}

export async function generateIELTSTest(
  moduleType: 'listening' | 'reading' | 'writing' | 'speaking'
): Promise<GeneratedTest> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ moduleType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error || `HTTP ${response.status}: Failed to generate test.`;
    throw new Error(message);
  }

  return response.json() as Promise<GeneratedTest>;
}