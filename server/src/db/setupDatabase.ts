import type { Knex } from 'knex'
import type { QuizQuestionSeed } from '../data/quizQuestions'
import { createTables } from './createTables'
import { seedQuizQuestions } from './seedQuizQuestions'

// Gets the database ready: makes the tables, then adds the starter questions.
// Safe to run every time the server starts.
export async function setupDatabase(
  db: Knex,
  questions: QuizQuestionSeed[],
): Promise<void> {
  await createTables(db)
  await seedQuizQuestions(db, questions)
}
