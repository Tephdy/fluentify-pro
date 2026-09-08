import { NextResponse } from 'next/server';

const LISTENING_TOPICS = [
  'booking a guided city tour and museum tickets',
  'inquiring about student accommodation and rent terms',
  'registering for a community sports center membership',
  'a discussion between a student and a professor about a project deadline',
  'booking a holiday cottage and checking facility amenities',
  'calling a local library to ask about opening hours and membership fees',
  'interviewing for a part-time job at a bookstore',
];

const READING_TOPICS = [
  'the history and evolution of urban architectural techniques',
  'advancements in renewable energy and solar storage',
  'marine conservation and coral reef restoration projects',
  'the psychological impact of remote work on productivity',
  'the discovery and archaeological significance of ancient trade routes',
  'agricultural innovations in vertical farming',
];

const WRITING_TOPICS = [
  'Task 1: Summarizing a chart on global energy consumption patterns.',
  'Task 2: Essay on whether university education should be free for everyone.',
  'Task 2: Essay on the impact of artificial intelligence on future employment.',
];

const SPEAKING_TOPICS = [
  'Part 1: Questions about your hometown, daily routine, and hobbies.',
  'Part 2: Cue card describing a memorable journey or trip you took.',
  'Part 3: Discussion on the cultural importance of tourism.',
];

export async function POST(request: Request) {
  try {
    const { moduleType } = await request.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not defined in .env.local' },
        { status: 500 }
      );
    }

    // Select dynamic topic list based on module type
    let topics = LISTENING_TOPICS;
    if (moduleType === 'reading') topics = READING_TOPICS;
    if (moduleType === 'writing') topics = WRITING_TOPICS;
    if (moduleType === 'speaking') topics = SPEAKING_TOPICS;

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomIdSeed = Math.floor(Math.random() * 10000);

    const prompt = `You are an IELTS exam author. Generate a brand new, unique practice test set for the ${moduleType.toUpperCase()} module in valid JSON format.

TOPIC FOR THIS TEST: ${randomTopic} (Unique ID: ${randomIdSeed})

CRITICAL INSTRUCTIONS:
1. "id" for each question MUST be a unique string (e.g. "q1", "q2", "q3", "q4").
2. EVERY question MUST have "type" set to "radio" and include EXACTLY 4 distinct string options in "options". Do NOT leave options empty.
3. Every question MUST have non-empty text in "question" and a valid matching string in "correctAnswer".
4. ${
      moduleType === 'listening'
        ? 'Provide a clear, detailed dialogue or monologue script (150-200 words) about the topic in "audioScript". Avoid special quotes.'
        : 'Set "audioScript" to an empty string.'
    }
5. ${
      moduleType === 'reading'
        ? 'Provide an original academic reading passage (250-300 words) about the topic in "passage".'
        : 'Set "passage" to an empty string.'
    }
6. Generate exactly 4 creative comprehension questions tailored to the prompt.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'ielts_practice_test',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                audioScript: { type: 'string' },
                passage: { type: 'string' },
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string', enum: ['radio', 'text'] },
                      question: { type: 'string' },
                      options: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      correctAnswer: { type: 'string' },
                    },
                    required: ['id', 'type', 'question', 'options', 'correctAnswer'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['id', 'title', 'audioScript', 'passage', 'questions'],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.8,
        reasoning_effort: 'low',
        max_completion_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData?.error?.message || 'Failed to call Groq API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content received from AI model.' },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(content);

    // Fallback safeguard for Listening transcripts
    if (moduleType === 'listening' && (!parsedData.audioScript || parsedData.audioScript.trim() === '')) {
      parsedData.audioScript = `Welcome to the IELTS Listening test on ${randomTopic}. Please listen carefully to the conversation before answering the questions below.`;
    }

    return NextResponse.json(parsedData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}