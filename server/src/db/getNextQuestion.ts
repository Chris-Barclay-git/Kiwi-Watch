import type { Knex } from 'knex'
import type { QuizQuestion } from '../types/quiz'

// Puts things in a random order. Each item gets a random number and they are sorted by it.
function shuffle<T>(items: T[], random: () => number): T[] {
  return items
    .map((item) => ({ item, sortKey: random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ item }) => item)
}

// Picks a random question this user has not answered correctly yet, with its options
// in a random order. Gives null when they have got every question right.
// "random" is given a value between 0 and 1. It is a parameter so the tests can control it.
export async function getNextQuestion(
  db: Knex,
  userId: number,
  random: () => number = Math.random,
): Promise<QuizQuestion | null> {
  // The questions this user has already got right.
  const answeredCorrectly = db('user_answers')
    .where({ user_id: userId, is_correct: true })
    .select('question_id')

  const questions = await db('questions')
    .whereNotIn('id', answeredCorrectly)
    .select<
      { id: number; topic: string; text: string }[]
    >('id', 'topic', 'text')

  const chosenQuestion = questions[Math.floor(random() * questions.length)]
  if (!chosenQuestion) {
    return null
  }

  // We only ask for id and text, so "is_correct" never leaves the database.
  const options = await db('options')
    .where({ question_id: chosenQuestion.id })
    .select<{ id: number; text: string }[]>('id', 'text')

  return {
    id: chosenQuestion.id,
    topic: chosenQuestion.topic,
    text: chosenQuestion.text,
    options: shuffle(options, random),
  }
}
