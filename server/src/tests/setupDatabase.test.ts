import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { QuizQuestionSeed } from '../data/quizQuestions'
import { setupDatabase } from '../db/setupDatabase'

// One small made-up question, so this test doesn't depend on the real ones.
const ONE_QUESTION: QuizQuestionSeed[] = [
  {
    topic: 'floods',
    text: 'Question one?',
    explanation: 'Because one.',
    options: [
      { text: 'Right A', isCorrect: true },
      { text: 'Wrong A', isCorrect: false },
    ],
  },
]

// Each test gets its own empty database that lives only in memory.
let db: Knex

beforeEach(() => {
  db = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })
})

afterEach(async () => {
  await db.destroy()
})

describe('setupDatabase', () => {
  it('makes the tables and adds the questions to an empty database', async () => {
    // Arrange
    // (an empty database, made in beforeEach)

    // Act
    await setupDatabase(db, ONE_QUESTION)

    // Assert
    const questions = await db('questions').select('text')
    const options = await db('options').select()
    expect(questions).toEqual([{ text: 'Question one?' }])
    expect(options).toHaveLength(2)
  })

  it('can run again without adding the questions twice', async () => {
    // Arrange
    await setupDatabase(db, ONE_QUESTION)

    // Act
    await setupDatabase(db, ONE_QUESTION)

    // Assert
    const questions = await db('questions').select()
    expect(questions).toHaveLength(1)
  })
})
