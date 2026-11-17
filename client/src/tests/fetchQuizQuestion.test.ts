import { describe, it, expect } from 'vitest'
import type { QuizQuestion } from '../types/quiz'
import { fetchQuizQuestion } from '../lib/fetchQuizQuestion'

const EARTHQUAKE_QUESTION: QuizQuestion = {
  id: 1,
  topic: 'earthquakes',
  text: "An earthquake starts and you're indoors. What should you do?",
  options: [
    { id: 2, text: 'Run outside as fast as you can' },
    { id: 1, text: 'Drop, Cover and Hold' },
  ],
}

describe('fetchQuizQuestion', () => {
  it('returns the question the server sends', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify({ question: EARTHQUAKE_QUESTION }), {
        status: 200,
      })) as typeof fetch

    // Act
    const question = await fetchQuizQuestion(fakeFetch)

    // Assert
    expect(question).toEqual(EARTHQUAKE_QUESTION)
  })

  it('returns null when the server has no questions left', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify({ question: null }), {
        status: 200,
      })) as typeof fetch

    // Act
    const question = await fetchQuizQuestion(fakeFetch)

    // Assert
    expect(question).toBeNull()
  })

  it('asks the server for /api/quiz/question', async () => {
    // Arrange
    let requestedUrl = ''
    const fakeFetch = (async (url: string) => {
      requestedUrl = url
      return new Response(JSON.stringify({ question: null }), { status: 200 })
    }) as typeof fetch

    // Act
    await fetchQuizQuestion(fakeFetch)

    // Assert
    expect(requestedUrl).toBe('/api/quiz/question')
  })

  it('throws an error when the server responds with a failure status', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response('Server error', { status: 500 })) as typeof fetch

    // Act
    const act = () => fetchQuizQuestion(fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('Server responded with status 500')
  })
})
