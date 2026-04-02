import { type ClassValue, clsx } from 'clsx';

// Simple utility for conditional class names
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Level hierarchy helper
export const levelHierarchy = {
  certificate: 1,
  diploma: 2,
  diploma_advanced: 3,
};

export function canAccessLevel(userLevel: string, subjectLevel: string): boolean {
  const userLevelNum = levelHierarchy[userLevel as keyof typeof levelHierarchy];
  const subjectLevelNum = levelHierarchy[subjectLevel as keyof typeof levelHierarchy];
  
  // User can access subjects at their level or below
  return userLevelNum >= subjectLevelNum;
}

// Translation helper
export function getTranslation<T extends Record<string, any>>(
  translations: T,
  language: string
): T[keyof T] {
  return translations[language as keyof T] || translations['es'];
}
