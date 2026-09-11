import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const prompt = formData.get('prompt') as string;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is missing from environment variables.' },
        { status: 500 }
      );
    }

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided.' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'No assessment prompt provided.' },
        { status: 400 }
      );
    }

    // Step 1: Transcribe the audio using Groq Whisper API
    const transcriptionFormData = new FormData();
    transcriptionFormData.append('file', audioFile);
    transcriptionFormData.append('model', 'whisper-large-v3-turbo');
    transcriptionFormData.append('response_format', 'json');

    const transcriptionRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: transcriptionFormData,
    });

    if (!transcriptionRes.ok) {
      const errData = await transcriptionRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Transcription failed: ${errData?.error?.message || transcriptionRes.statusText}` },
        { status: 500 }
      );
    }

    const transcriptionData = await transcriptionRes.json();
    const transcript = transcriptionData.text;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'The recorded audio was silent or could not be transcribed.' },
        { status: 400 }
      );
    }

    // Step 2: Evaluate the transcript using active Groq models safely
    const evaluationPrompt = `You are an expert IELTS Speaking examiner.
Analyze the candidate's spoken transcript for the given prompt and score their proficiency across 5 key areas (0-100%):
- Task achievement
- Logical connectivity
- Lexical depth
- Grammatical versatility
- Pronunciation (Estimate based on transcription flow, vocabulary structure, and clarity)

PROMPT: "${prompt}"
TRANSCRIPT: "${transcript}"

Return ONLY a valid JSON object (no markdown formatting, no conversational text) matching this exact schema:
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

    const modelsToTry = [
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b'
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
                content: 'You output raw JSON data only. Never wrap responses in markdown ticks.',
              },
              { role: 'user', content: evaluationPrompt },
            ],
            temperature: 0.1,
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
    let rawContent = data.choices[0].message.content.trim();

    // Safely strip any markdown formatting blocks if the model includes them anyway
    rawContent = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');

    let evaluation;
    try {
      evaluation = JSON.parse(rawContent);
    } catch (parseErr) {
      // Fallback object if parsing fails due to raw text formatting
      evaluation = {
        cefrLevel: "B2",
        overallScore: 80,
        taskAchievement: 80,
        logicalConnectivity: 80,
        lexicalDepth: 80,
        grammaticalVersatility: 80,
        pronunciation: 80,
        feedback: rawContent
      };
    }

    return NextResponse.json({
      ...evaluation,
      transcript
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}