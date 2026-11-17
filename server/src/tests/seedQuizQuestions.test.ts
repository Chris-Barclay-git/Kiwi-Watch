import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { QUIZ_QUESTIONS } from '../data/quizQuestions'
import type { QuizQuestionSeed } from '../data/quizQuestions'
import { createTables } from '../db/createTables'
import { seedQuizQuestions } from '../db/seedQuizQuestions'

// Two small made-up questions, so these tests don't depend on the real ones.
const TWO_QUESTIONS: QuizQuestionSeed[] = [
  {
    topic: 'earthquakes',
    text: 'Question one?',
    explanation: 'Because one.',
    options: [
      { text: 'Wrong A', isCorrect: false },
      { text: 'Right A', isCorrect: true },
      { text: 'Wrong B', isCorrect: false },
    ],
  },
  {
    topic: 'floods',
    text: 'Question two?',
    explanation: 'Because two.',
    options: [
      { text: 'Right C', isCorrect: true },
      { text: 'Wrong C', isCorrect: false },
      { text: 'Wrong D', isCorrect: false },
    ],
  },
]

// Each test gets its own database that lives only in memory, with the tables ready.
let db: Knex

beforeEach(async () => {
  db = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })
  await createTables(db)
})

afterEach(async () => {
  await db.destroy()
})

describe('seedQuizQuestions', () => {
  it('adds the questions and all of their options', async () => {
    // Arrange
    // (two questions with three options each, and an empty database)

    // Act
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Assert
    const questions = await db('questions')
      .orderBy('id')
      .select('topic', 'text')
    const options = await db('options').select()
    expect(questions).toEqual([
      { topic: 'earthquakes', text: 'Question one?' },
      { topic: 'floods', text: 'Question two?' },
    ])
    expect(options).toHaveLength(6)
  })

  it('marks only the right option as correct', async () => {
    // Arrange
    // (question one has "Right A" as its only correct option)

    // Act
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Assert
    const correctOptions = await db('options')
      .where({ question_id: 1, is_correct: true })
      .select('text')
    expect(correctOptions).toEqual([{ text: 'Right A' }])
  })

  it('does nothing when there are already questions', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Act
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Assert
    const questions = await db('questions').select()
    const options = await db('options').select()
    expect(questions).toHaveLength(2)
    expect(options).toHaveLength(6)
  })
})

// Checks on the real question list, so a typo in it gets caught.
describe('QUIZ_QUESTIONS', () => {
  it('gives every question exactly one correct option', () => {
    // Arrange
    const questions = QUIZ_QUESTIONS

    // Act
    const correctCounts = questions.map(
      (question) =>
        question.options.filter((option) => option.isCorrect).length,
    )

    // Assert
    expect(correctCounts.every((count) => count === 1)).toBe(true)
  })

  it('gives every question at least three options', () => {
    // Arrange
    const questions = QUIZ_QUESTIONS

    // Act
    const optionCounts = questions.map((question) => question.options.length)

    // Assert
    expect(optionCounts.every((count) => count >= 3)).toBe(true)
  })

  it('has no two questions with the same text', () => {
    // Arrange
    const texts = QUIZ_QUESTIONS.map((question) => question.text)

    // Act
    const uniqueTexts = new Set(texts)

    // Assert
    expect(uniqueTexts.size).toBe(texts.length)
  })
})
