import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { QuizQuestionSeed } from '../data/quizQuestions'
import { createTables } from '../db/createTables'
import { seedQuizQuestions } from '../db/seedQuizQuestions'
import { submitAnswer, XP_PER_CORRECT_ANSWER } from '../db/submitAnswer'

// Two small made-up questions. Once they are in the database:
//   question 1 has options 1, 2, 3 (option 2 is correct)
//   question 2 has options 4, 5, 6 (option 4 is correct)
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

// Each test gets its own database that lives only in memory,
// with the tables, the two questions and two users (ids 1 and 2).
let db: Knex

beforeEach(async () => {
  db = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })
  await createTables(db)
  await seedQuizQuestions(db, TWO_QUESTIONS)
  await db('users').insert([
    { auth0_id: 'auth0|one' },
    { auth0_id: 'auth0|two' },
  ])
})

afterEach(async () => {
  await db.destroy()
})

describe('submitAnswer', () => {
  it('marks a right answer correct, gives XP, and shows the explanation', async () => {
    // Arrange
    // (user 1 picks option 2, the right answer to question 1)

    // Act
    const result = await submitAnswer(db, 1, 1, 2)

    // Assert
    expect(result).toEqual({
      isCorrect: true,
      correctOptionId: 2,
      explanation: 'Because one.',
      xpEarned: XP_PER_CORRECT_ANSWER,
      totalXp: XP_PER_CORRECT_ANSWER,
    })
  })

  it('marks a wrong answer incorrect, gives no XP, and shows the right answer', async () => {
    // Arrange
    // (user 1 picks option 1, a wrong answer to question 1)

    // Act
    const result = await submitAnswer(db, 1, 1, 1)

    // Assert
    expect(result).toEqual({
      isCorrect: false,
      correctOptionId: 2,
      explanation: 'Because one.',
      xpEarned: 0,
      totalXp: 0,
    })
  })

  it('adds up XP across different questions', async () => {
    // Arrange
    await submitAnswer(db, 1, 1, 2)

    // Act
    const result = await submitAnswer(db, 1, 2, 4)

    // Assert
    expect(result?.totalXp).toBe(XP_PER_CORRECT_ANSWER * 2)
    const user = await db('users').where({ id: 1 }).first()
    expect(user.xp).toBe(XP_PER_CORRECT_ANSWER * 2)
  })

  it('gives no XP the second time a question is answered correctly', async () => {
    // Arrange
    await submitAnswer(db, 1, 1, 2)

    // Act
    const result = await submitAnswer(db, 1, 1, 2)

    // Assert
    expect(result?.isCorrect).toBe(true)
    expect(result?.xpEarned).toBe(0)
    expect(result?.totalXp).toBe(XP_PER_CORRECT_ANSWER)
  })

  it('gives XP for a right answer after an earlier wrong one', async () => {
    // Arrange
    await submitAnswer(db, 1, 1, 1)

    // Act
    const result = await submitAnswer(db, 1, 1, 2)

    // Assert
    expect(result?.xpEarned).toBe(XP_PER_CORRECT_ANSWER)
  })

  it('records every answer, right or wrong', async () => {
    // Arrange
    await submitAnswer(db, 1, 1, 1)

    // Act
    await submitAnswer(db, 1, 1, 2)

    // Assert
    const answers = await db('user_answers').orderBy('id').select()
    expect(answers.map((answer) => answer.option_id)).toEqual([1, 2])
    expect(answers.map((answer) => Boolean(answer.is_correct))).toEqual([
      false,
      true,
    ])
  })

  it("keeps each user's XP separate", async () => {
    // Arrange
    await submitAnswer(db, 1, 1, 2)

    // Act
    const result = await submitAnswer(db, 2, 1, 2)

    // Assert
    expect(result?.xpEarned).toBe(XP_PER_CORRECT_ANSWER)
    const userOne = await db('users').where({ id: 1 }).first()
    expect(userOne.xp).toBe(XP_PER_CORRECT_ANSWER)
  })

  it('gives null and records nothing when the question does not exist', async () => {
    // Arrange
    const missingQuestionId = 99

    // Act
    const result = await submitAnswer(db, 1, missingQuestionId, 2)

    // Assert
    expect(result).toBeNull()
    expect(await db('user_answers').select()).toHaveLength(0)
  })

  it('gives null when the option belongs to a different question', async () => {
    // Arrange
    // Option 4 is the right answer to question 2, not question 1.

    // Act
    const result = await submitAnswer(db, 1, 1, 4)

    // Assert
    expect(result).toBeNull()
    const user = await db('users').where({ id: 1 }).first()
    expect(user.xp).toBe(0)
  })
})
