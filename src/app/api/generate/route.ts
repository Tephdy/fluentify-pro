import { NextResponse } from 'next/server';

const LISTENING_TOPICS = [
  'an angry customer disputing a duplicate charge on their credit card',
  'a BPO agent handling a cancellation request during a service outage',
  'a sales call for upselling an internet plan while managing objections',
  'a customer asking for a refund after a delayed delivery and poor service',
  'a support call about account verification and password reset security checks',
  'a technical support escalation with a frustrated client and a supervisor handoff',
  'a quality assurance review of an agent handling an empathy-driven complaint',
];

const READING_TOPICS = [
  'BPO customer service quality metrics and call resolution standards',
  'best practices in handling escalations and complaint de-escalation in support centers',
  'how account security procedures protect remote customer service teams',
  'performance coaching strategies for call center agents in high-volume environments',
  'the role of empathy, active listening, and SLA compliance in BPO operations',
  'customer retention tactics in outsourced sales and support teams',
];

const WRITING_TOPICS = [
  'Write a customer service email apologizing for a billing error and explaining refund steps.',
  'Write a professional response to an upset client who wants a supervisor after a failed technical fix.',
  'Write a follow-up email confirming a service recovery plan after a delayed shipment.',
  'Write a coaching note to a new BPO agent explaining how to handle a dissatisfied customer calmly.',
];

const SPEAKING_TOPICS = [
  'Describe how you would calm an angry customer who is demanding a refund immediately.',
  'Explain how you would handle a sales objection when a customer says the price is too high.',
  'Tell us how you would manage a service outage while maintaining trust and clear communication.',
  'Discuss how you would respond when a caller is frustrated because their issue has already been escalated twice.',
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

    let topics = LISTENING_TOPICS;
    if (moduleType === 'reading') topics = READING_TOPICS;
    if (moduleType === 'writing') topics = WRITING_TOPICS;
    if (moduleType === 'speaking') topics = SPEAKING_TOPICS;

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomIdSeed = Math.floor(Math.random() * 10000);

    const prompt = `You are an IELTS-style exam author focused on BPO / customer support / call center evaluation. Generate a brand new, unique behavioral assessment for the ${moduleType.toUpperCase()} module in valid JSON format.

TOPIC FOR THIS TEST: ${randomTopic} (Unique ID: ${randomIdSeed})

CRITICAL INSTRUCTIONS:
1. "id" for each question MUST be a unique string (e.g. "q1", "q2", ..., "q10").
2. EVERY question MUST have "type" set to "radio" and include EXACTLY 4 distinct string options in "options". Do NOT leave options empty.
3. Every question MUST have non-empty text in "question" and a valid matching string in "correctAnswer".
4. Make all questions closely related to BPO industry situations, customer service, call center behavior, escalation handling, sales objections, empathy, compliance, QA, retention, or account support.
5. If you include any agent or representative names in the script, questions, or choices, you MUST use the name "Cally". Do NOT use names like Maya, Alex, John, or Sarah for the agent.
6. ${
      moduleType === 'listening'
        ? 'Provide a comprehensive realistic BPO customer support call script (250-350 words) in "audioScript" about the scenario where the agent is named Cally, to support 10 questions. Keep it natural and workplace-appropriate. Avoid special quotes.'
        : 'Set "audioScript" to an empty string.'
    }
7. ${
      moduleType === 'reading'
        ? 'Provide a detailed original professional reading passage (400-500 words) about BPO operations, customer handling standards, service recovery, SLA expectations, or call center quality management in "passage".'
        : 'Set "passage" to an empty string.'
    }
8. For writing and speaking modules, the title should clearly describe a BPO situation or customer scenario.
9. Generate EXACTLY 10 behavioral multiple-choice questions tailored to the BPO scenario. Each question should test how an agent should respond professionally in a realistic customer support or sales situation.
10. Use realistic answer choices that include proper empathy, ownership, escalation, compliance, clarity, and customer-first behavior.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
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
        temperature: 0.7,
        max_tokens: 8192,
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

    // --- SANITIZATION BACKUP: Forcefully replace any lingering "Maya" with "Cally" across the entire JSON response ---
    const sanitizeText = (text: string) => (text ? text.replace(/Maya/g, 'Cally') : text);

    if (parsedData.title) parsedData.title = sanitizeText(parsedData.title);
    if (parsedData.audioScript) parsedData.audioScript = sanitizeText(parsedData.audioScript);
    if (parsedData.passage) parsedData.passage = sanitizeText(parsedData.passage);

    if (parsedData.questions && Array.isArray(parsedData.questions)) {
      parsedData.questions = parsedData.questions.map((q: any) => ({
        ...q,
        question: sanitizeText(q.question),
        correctAnswer: sanitizeText(q.correctAnswer),
        options: Array.isArray(q.options) ? q.options.map((opt: string) => sanitizeText(opt)) : q.options,
      }));
    }

    if (moduleType === 'listening' && (!parsedData.audioScript || parsedData.audioScript.trim() === '')) {
      parsedData.audioScript = `Welcome to the expanded IELTS Listening test on ${randomTopic}. Please listen carefully to the conversation with Cally before answering the 10 questions below.`;
    }

    return NextResponse.json(parsedData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}