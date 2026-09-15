import { supabase } from '@/lib/supabase';

export interface QuestionRecord {
  id?: string | number;
  module_id: 'listening' | 'reading';
  test_title: string;
  audio_script?: string;
  passage?: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

// 1. READ: Fetch all questions, optionally filtered by module
export async function getQuestions(moduleId?: 'listening' | 'reading') {
  let query = supabase.from('questions').select('*').order('id', { ascending: false });
  
  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching questions:', error.message);
    throw error;
  }
  return data || [];
}

// 2. CREATE: Add a new question to Supabase
export async function createQuestion(record: QuestionRecord) {
  const { data, error } = await supabase
    .from('questions')
    .insert([record])
    .select();

  if (error) {
    console.error('Error creating question:', error.message);
    throw error;
  }
  return data?.[0];
}

// 3. UPDATE: Edit an existing question by its ID
export async function updateQuestion(id: string | number, updates: Partial<QuestionRecord>) {
  const { data, error } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating question:', error.message);
    throw error;
  }
  return data?.[0];
}

// 4. DELETE: Remove a question by its ID
export async function deleteQuestion(id: string | number) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting question:', error.message);
    throw error;
  }
  return true;
}