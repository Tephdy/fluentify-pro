import { NextResponse } from 'next/server';

const LISTENING_TOPICS = [
  'an angry customer disputing a duplicate charge on their credit card',
  'a BPO agent handling a cancellation request during a service outage',
  'a sales call for upselling an internet plan while managing objections',
  'a customer asking for a refund after a delayed delivery and poor service',
  'a support call about account verification and password reset security checks',
  'a technical support escalation with a frustrated client and a supervisor handoff',
  'a quality assurance review of an agent handling an empathy-driven complaint',
  'a customer inquiring about international roaming fees and data plan add-ons',
  'a troubleshooting session for a smart home device configuration failure',
  'a retention specialist negotiating a contract renewal with a customer planning to switch providers',
];

const READING_TOPICS = [
  'BPO customer service quality metrics and call resolution standards',
  'best practices in handling escalations and complaint de-escalation in support centers',
  'how account security procedures protect remote customer service teams',
  'performance coaching strategies for call center agents in high-volume environments',
  'the role of empathy, active listening, and SLA compliance in BPO operations',
  'customer retention tactics in outsourced sales and support teams',
  'artificial intelligence integration and human oversight in modern customer support workflows',
  'omnichannel communication strategies for seamless customer experience management',
  'managing agent burnout and maintaining mental wellness in high-stress support environments',
  'data privacy regulations like GDPR and HIPAA compliance in outsourced customer operations',
  'effective cross-cultural communication guidelines for global offshore customer support teams',
  'the impact of first-contact resolution (FCR) on overall customer satisfaction scores',
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
    const randomTimestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 999999);

    const prompt = `You are an expert professional test author. Generate a unique, high-quality assessment for the ${moduleType.toUpperCase()} module in valid JSON format. 

UNIQUE SESSION IDENTIFIER: ${randomTimestamp}-${randomSeed}
SPECIFIC FOCUS/TOPIC: ${randomTopic}

CRITICAL RULES:
1. "id" for each question must be unique (e.g., "q1", "q2", etc.).
2. Every question must have "type": "radio", exactly 4 distinct options, a non-empty question text, and a valid matching correctAnswer.
3. If representative or agent names appear anywhere, use ONLY the name "Cally". Never use Maya, John, or Sarah.
4. DO NOT use sequential or static drill numbers (like "Drill #19") in the title. Create a professional, descriptive title directly related to the topic focus.
5. ${
      moduleType === 'listening'
        ? 'Provide a comprehensive realistic BPO customer support call script (250-350 words) in "audioScript" centered on the topic focus. Set "passage" to an empty string.'
        : moduleType === 'reading'
        ? 'Provide a detailed, substantive, original professional reading passage (400-500 words split into multiple paragraphs) in the "passage" field that thoroughly analyzes the topic focus. Do NOT use short placeholder text or summaries. Set "audioScript" to an empty string.'
        : 'Set "audioScript" to an empty string and "passage" to an empty string.'
    }
6. Generate EXACTLY 10 multiple-choice questions directly assessing the text or scenario.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
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
        temperature: 0.95,
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

    return NextResponse.json(parsedData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}