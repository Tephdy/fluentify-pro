// ============================================
// BPO INDUSTRY TYPES
// ============================================

export interface BPOIndustryOverview {
  id: string;
  title: string;
  introduction: string;
  key_statistics: Record<string, string | string[]>;
  why_philippines: Array<{ advantage: string; description: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface BPOHistoricalTimeline {
  id: string;
  period: string;
  title: string;
  description: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BPOCompany {
  id: string;
  slug: string;
  name: string;
  founded: string | null;
  headquarters: string | null;
  philippines_presence: string | null;
  description: string | null;
  history: string | null;
  services: string[];
  website: string | null;
  application_notes: string | null;
  logo_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BPOJobRole {
  id: string;
  title: string;
  description: string | null;
  requirements: string[];
  salary_range: string | null;
  skills: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BPOApplicationStep {
  id: string;
  step_number: number;
  title: string;
  description: string | null;
  tips: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BPORrequiredDocument {
  id: string;
  name: string;
  description: string | null;
  is_required: boolean;
  notes: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BPOSuccessTip {
  id: string;
  category: 'beforeApplying' | 'duringInterview' | 'onTheJob' | 'healthAndWellness';
  tip: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}