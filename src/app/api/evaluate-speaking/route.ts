import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { transcript, prompt } = await request.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is missing from environment variables.' },
        { status: 500 }
      );
    }

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'No transcript provided.' },
        { status: 400 }
      );
    }

    const evaluationPrompt = `You are an expert IELTS Speaking examiner.
Analyze the candidate's spoken transcript for the given prompt and score their proficiency across 5 key areas (0-100%):
- Task achievement
- Logical connectivity
- Lexical depth
- Grammatical versatility
- Pronunciation (Estimate based on transcription flow, vocabulary structure, and clarity)

PROMPT: "${prompt}"
TRANSCRIPT: "${transcript}"

Return ONLY a JSON object formatted strictly with these exact keys:
{
  "cefrLevel": "B2",
  "overallScore": 82,
  "taskAchievement": 80,
  "logicalConnectivity": 85,
  "lexicalDepth": 80,
  "grammaticalVersatility": 82,
  "pronunciation": 83,
  "feedback": "Detailed examiner feedback..."
}`;

    // Active production models on Groq Console
    const modelsToTry = [
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'qwen/qwen3.6-27b'
    ];

    let response: Response | null = null;
    let lastError = '';

    for (const model of modelsToTry) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are a strict JSON-only response generator for IELTS Speaking assessments.',
              },
              { role: 'user', content: evaluationPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
            max_tokens: 1024,
          }),
        });

        if (res.ok) {
          response = res;
          break;
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `Model ${model} returned status ${res.status}`;
        }
      } catch (e: any) {
        lastError = e.message;
      }
    }

    if (!response) {
      return NextResponse.json(
        { error: `Groq evaluation failed: ${lastError}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const evaluation = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(evaluation);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}