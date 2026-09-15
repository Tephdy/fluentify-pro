import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchAssessments(moduleId: 'listening' | 'reading') {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('module_id', moduleId);

  if (error) {
    console.error(`Error fetching ${moduleId} questions:`, error.message);
    return [];
  }

  // Group flat rows back into tests by test_title
  const groupedMap = new Map();

  data.forEach((row) => {
    if (!groupedMap.has(row.test_title)) {
      groupedMap.set(row.test_title, {
        title: row.test_title,
        passage: row.passage || undefined,
        audioScript: row.audio_script || undefined,
        questions: [],
      });
    }

    groupedMap.get(row.test_title).questions.push({
      id: row.id,
      question: row.question_text,
      options: row.options,
      correctAnswer: row.correct_answer,
    });
  });

  return Array.from(groupedMap.values());
}