export type OnboardingTimePerWeek = '2h' | '5h' | '10h';
export type OnboardingPace = 'fast' | 'deep';
export type OnboardingGender = 'male' | 'female' | 'other' | 'na';

export type Week4GoalChoice =
  | 'explain_ai_confident'
  | 'use_chatgpt_pro'
  | 'mini_workflow'
  | 'money_plan'
  | 'other';

export interface OnboardingData {
  phone: string;
  job: string;
  age: number;
  gender: OnboardingGender;
  education: string;
  level0to10: number;
  timePerWeek: OnboardingTimePerWeek;
  pace: OnboardingPace;
  tools?: string[];
  week4GoalChoice: Week4GoalChoice;
  week4GoalOtherText?: string;
  completedAt: string; // ISO
}

const ONBOARDING_KEY = 'ai_first_onboarding_v1';

export function loadOnboarding(): OnboardingData | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

export function saveOnboarding(data: OnboardingData): void {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
}

export function clearOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY);
}

export function isOnboardingComplete(data: OnboardingData | null | undefined): boolean {
  if (!data) return false;
  if (!data.phone?.trim()) return false;
  if (!data.job?.trim()) return false;
  if (!Number.isFinite(data.age)) return false;
  if (!data.gender) return false;
  if (!data.education?.trim()) return false;
  if (!Number.isFinite(data.level0to10)) return false;
  if (!data.timePerWeek) return false;
  if (!data.pace) return false;
  if (!data.week4GoalChoice) return false;
  if (data.week4GoalChoice === 'other' && !data.week4GoalOtherText?.trim()) return false;
  return true;
}

const PERSIAN_DIGITS: Record<string, string> = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

export function toEnglishDigits(input: string): string {
  return (input || '').replace(/[۰-۹٠-٩]/g, (d) => PERSIAN_DIGITS[d] ?? d);
}

export function normalizePhone(input: string): string {
  const s = toEnglishDigits(input)
    .trim()
    .replace(/[^\d+]/g, ''); // keep digits and leading +
  return s;
}

export function isValidIranPhone(input: string): boolean {
  const n = normalizePhone(input);
  // Accept: 09xxxxxxxxx, 9xxxxxxxxx, +989xxxxxxxxx, 989xxxxxxxxx
  const normalized = n.startsWith('+') ? n : n;
  return /^(\+98|98|0)?9\d{9}$/.test(normalized);
}


