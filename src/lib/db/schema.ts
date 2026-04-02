import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Levels enum as text
export const levels = ['certificate', 'diploma', 'diploma_advanced'] as const;
export type Level = typeof levels[number];

// Languages enum
export const languages = ['es', 'en', 'fr'] as const;
export type Language = typeof languages[number];

// Subjects table (Materias)
export const subjects = sqliteTable('subjects', {
  id: text('id').primaryKey(),
  order: integer('order').notNull().default(0),
  level: text('level', { enum: levels }).notNull().default('certificate'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  // Translations stored as JSON
  translations: text('translations', { mode: 'json' }).$type<{
    es: { title: string; description?: string };
    en: { title: string; description?: string };
    fr: { title: string; description?: string };
  }>().notNull(),
});

// Modules table
export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  // Translations stored as JSON
  translations: text('translations', { mode: 'json' }).$type<{
    es: { title: string; content?: string };
    en: { title: string; content?: string };
    fr: { title: string; content?: string };
  }>().notNull(),
});

// Questions table (for quizzes)
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['multiple_choice', 'fill_blank'] }).notNull(),
  order: integer('order').notNull().default(0),
  // Translations stored as JSON
  translations: text('translations', { mode: 'json' }).$type<{
    es: { question: string; options?: string[]; correctAnswer?: string | number };
    en: { question: string; options?: string[]; correctAnswer?: string | number };
    fr: { question: string; options?: string[]; correctAnswer?: string | number };
  }>().notNull(),
});

// Settings table for app configuration
export const settings = sqliteTable('settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value', { mode: 'json' }).notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Type exports
export type Subject = typeof subjects.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Setting = typeof settings.$inferSelect;
