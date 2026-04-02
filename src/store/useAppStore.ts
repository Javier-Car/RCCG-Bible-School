import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Level } from '@/lib/db/schema';

interface QuizProgress {
  moduleId: string;
  answers: Record<string, string | number>;
  score: number | null;
  completedAt: string | null;
}

interface AppStore {
  // Settings
  language: Language;
  level: Level;
  darkMode: boolean;
  
  // Quiz progress (stored in localStorage)
  quizProgress: Record<string, QuizProgress>;
  
  // Actions
  setLanguage: (language: Language) => void;
  setLevel: (level: Level) => void;
  toggleDarkMode: () => void;
  
  // Quiz actions
  saveQuizAnswer: (moduleId: string, questionId: string, answer: string | number) => void;
  completeQuiz: (moduleId: string, score: number) => void;
  resetQuiz: (moduleId: string) => void;
  getQuizProgress: (moduleId: string) => QuizProgress | null;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      language: 'es',
      level: 'certificate',
      darkMode: false,
      quizProgress: {},
      
      // Settings actions
      setLanguage: (language) => set({ language }),
      setLevel: (level) => set({ level }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Quiz actions
      saveQuizAnswer: (moduleId, questionId, answer) => {
        set((state) => {
          const currentProgress = state.quizProgress[moduleId] || {
            moduleId,
            answers: {},
            score: null,
            completedAt: null,
          };
          
          return {
            quizProgress: {
              ...state.quizProgress,
              [moduleId]: {
                ...currentProgress,
                answers: {
                  ...currentProgress.answers,
                  [questionId]: answer,
                },
              },
            },
          };
        });
      },
      
      completeQuiz: (moduleId, score) => {
        set((state) => ({
          quizProgress: {
            ...state.quizProgress,
            [moduleId]: {
              ...state.quizProgress[moduleId],
              score,
              completedAt: new Date().toISOString(),
            },
          },
        }));
      },
      
      resetQuiz: (moduleId) => {
        set((state) => {
          const newProgress = { ...state.quizProgress };
          delete newProgress[moduleId];
          return { quizProgress: newProgress };
        });
      },
      
      getQuizProgress: (moduleId) => {
        return get().quizProgress[moduleId] || null;
      },
    }),
    {
      name: 'rcbs-app-storage',
      partialize: (state) => ({
        language: state.language,
        level: state.level,
        darkMode: state.darkMode,
        quizProgress: state.quizProgress,
      }),
    }
  )
);
