import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { QuizQuestionSeed } from '../data/quizQuestions'
import { createTables } from '../db/createTables'
import { getNextQuestion } from '../db/getNextQuestion'
import { seedQuizQuestions } from '../db/seedQuizQuestions'

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

// A "random" number that is always the lowest or the highest it can be.
const alwaysLowest = () => 0
const alwaysHighest = () => 0.99

// Each test gets its own database that lives only in memory, with the tables ready.
let db: Knex

beforeEach(async () => {
  db = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })
  await createTables(db)
  await db('users').insert([
    { auth0_id: 'auth0|one' },
    { auth0_id: 'auth0|two' },
  ])
})

afterEach(async () => {
  await db.destroy()
})

describe('getNextQuestion', () => {
  it('gives null when there are no questions', async () => {
    // Arrange
    // (no questions were added)

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    expect(question).toBeNull()
  })

  it('picks the first question when the random number is lowest', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    expect(question?.text).toBe('Question one?')
  })

  it('picks the last question when the random number is highest', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Act
    const question = await getNextQuestion(db, 1, alwaysHighest)

    // Assert
    expect(question?.text).toBe('Question two?')
  })

  it('never says which option is correct or why', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    expect(question).toEqual({
      id: 1,
      topic: 'earthquakes',
      text: 'Question one?',
      options: expect.any(Array),
    })
    for (const option of question?.options ?? []) {
      expect(option).toEqual({
        id: expect.any(Number),
        text: expect.any(String),
      })
    }
  })

  it('includes every option of the question', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    const optionTexts = question?.options.map((option) => option.text).sort()
    expect(optionTexts).toEqual(['Right A', 'Wrong A', 'Wrong B'])
  })

  it('skips a question the user already got right', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)
    await db('user_answers').insert({
      user_id: 1,
      question_id: 1,
      option_id: 2,
      is_correct: true,
    })

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    expect(question?.text).toBe('Question two?')
  })

  it('offers a question again when the user got it wrong', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)
    await db('user_answers').insert({
      user_id: 1,
      question_id: 1,
      option_id: 1,
      is_correct: false,
    })

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    expect(question?.text).toBe('Question one?')
  })

  it('gives null when the user has got every question right', async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)
    await db('user_answers').insert([
      { user_id: 1, question_id: 1, option_id: 2, is_correct: true },
      { user_id: 1, question_id: 2, option_id: 4, is_correct: true },
    ])

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    expect(question).toBeNull()
  })

  it("does not count other users' answers", async () => {
    // Arrange
    await seedQuizQuestions(db, TWO_QUESTIONS)
    await db('user_answers').insert({
      user_id: 2,
      question_id: 1,
      option_id: 2,
      is_correct: true,
    })

    // Act
    const question = await getNextQuestion(db, 1, alwaysLowest)

    // Assert
    expect(question?.text).toBe('Question one?')
  })
})
