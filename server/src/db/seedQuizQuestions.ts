import type { Knex } from 'knex'
import type { QuizQuestionSeed } from '../data/quizQuestions'

// Puts the starter questions (and their options) into the database.
// If there are already questions in there, it does nothing, so restarting the
// server never adds them twice.
export async function seedQuizQuestions(
  db: Knex,
  questions: QuizQuestionSeed[],
): Promise<void> {
  const existingQuestion = await db('questions').first('id')
  if (existingQuestion) {
    return
  }

  // All or nothing: if something fails halfway, no half-added questions are left behind.
  await db.transaction(async (trx) => {
    for (const question of questions) {
      const [questionId] = await trx('questions').insert({
        topic: question.topic,
        text: question.text,
        explanation: question.explanation,
      })

      await trx('options').insert(
        question.options.map((option) => ({
          question_id: questionId,
          text: option.text,
          is_correct: option.isCorrect,
        })),
      )
    }
  })
}
