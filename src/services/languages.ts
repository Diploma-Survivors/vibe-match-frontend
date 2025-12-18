import type { Language } from '@/types/submissions';

// Mock data
const MOCK_LANGUAGES: Language[] = [
  { id: 1, name: 'Java' },
  { id: 2, name: 'C++' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'JavaScript' },
  { id: 5, name: 'TypeScript' },
  { id: 6, name: 'Go' },
  { id: 7, name: 'Rust' },
  { id: 8, name: 'C#' },
  { id: 9, name: 'Kotlin' },
  { id: 10, name: 'Swift' },
  { id: 11, name: 'PHP' },
  { id: 12, name: 'Ruby' },
];

async function getAllLanguages(): Promise<Language[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_LANGUAGES;
}

export const LanguagesService = {
  getAllLanguages,
};
