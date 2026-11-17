import type { Knex } from 'knex'
import type { AnswerResult } from '../types/quiz'

export const XP_PER_CORRECT_ANSWER = 10

// Marks a user's answer, records it, and gives XP if they earned it.
// XP is only given the first time a question is answered correctly.
// Gives null if the question or option doesn't exist, or the option isn't one of
// that question's options.
export async function submitAnswer(
  db: Knex,
  userId: number,
  questionId: number,
  optionId: number,
): Promise<AnswerResult | null> {
  const question = await db('questions')
    .where({ id: questionId })
    .first('id', 'explanation')

  const chosenOption = await db('options')
    .where({ id: optionId, question_id: questionId })
    .first('id', 'is_correct')

  const correctOption = await db('options')
    .where({ question_id: questionId, is_correct: true })
    .first('id')

  if (!question || !chosenOption || !correctOption) {
    return null
  }

  const isCorrect = Boolean(chosenOption.is_correct)

  // All or nothing: the answer and the XP are saved together.
  return db.transaction(async (trx) => {
    const alreadyGotItRight = await trx('user_answers')
      .where({ user_id: userId, question_id: questionId, is_correct: true })
      .first('id')

    const xpEarned = isCorrect && !alreadyGotItRight ? XP_PER_CORRECT_ANSWER : 0

    await trx('user_answers').insert({
      user_id: userId,
      question_id: questionId,
      option_id: optionId,
      is_correct: isCorrect,
    })

    if (xpEarned > 0) {
      await trx('users').where({ id: userId }).increment('xp', xpEarned)
    }

    const user = await trx('users').where({ id: userId }).first('xp')

    return {
      isCorrect,
      correctOptionId: correctOption.id,
      explanation: question.explanation,
      xpEarned,
      totalXp: user?.xp ?? 0,
    }
  })
}
