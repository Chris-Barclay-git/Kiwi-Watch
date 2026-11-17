import { describe, it, expect } from 'vitest'
import type { AnswerResult } from '../types/quiz'
import { submitQuizAnswer } from '../lib/submitQuizAnswer'

const ACCESS_TOKEN = 'test-token'

const RIGHT_ANSWER_RESULT: AnswerResult = {
  isCorrect: true,
  correctOptionId: 1,
  explanation: 'Drop, Cover and Hold is the advice from Civil Defence.',
  xpEarned: 10,
  totalXp: 10,
}

describe('submitQuizAnswer', () => {
  it('returns the result the server sends', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify(RIGHT_ANSWER_RESULT), {
        status: 200,
      })) as typeof fetch

    // Act
    const result = await submitQuizAnswer(ACCESS_TOKEN, 1, 1, fakeFetch)

    // Assert
    expect(result).toEqual(RIGHT_ANSWER_RESULT)
  })

  it('sends a POST request to /api/quiz/answer', async () => {
    // Arrange
    let requestedUrl = ''
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (url: string, init?: RequestInit) => {
      requestedUrl = url
      requestedInit = init
      return new Response(JSON.stringify(RIGHT_ANSWER_RESULT), { status: 200 })
    }) as typeof fetch

    // Act
    await submitQuizAnswer(ACCESS_TOKEN, 1, 1, fakeFetch)

    // Assert
    expect(requestedUrl).toBe('/api/quiz/answer')
    expect(requestedInit?.method).toBe('POST')
  })

  it('sends the question id and option id as JSON', async () => {
    // Arrange
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (_url: string, init?: RequestInit) => {
      requestedInit = init
      return new Response(JSON.stringify(RIGHT_ANSWER_RESULT), { status: 200 })
    }) as typeof fetch

    // Act
    await submitQuizAnswer(ACCESS_TOKEN, 3, 12, fakeFetch)

    // Assert
    expect(JSON.parse(String(requestedInit?.body))).toEqual({
      questionId: 3,
      optionId: 12,
    })
  })

  it('sends the access token and says the body is JSON', async () => {
    // Arrange
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (_url: string, init?: RequestInit) => {
      requestedInit = init
      return new Response(JSON.stringify(RIGHT_ANSWER_RESULT), { status: 200 })
    }) as typeof fetch

    // Act
    await submitQuizAnswer(ACCESS_TOKEN, 1, 1, fakeFetch)

    // Assert
    expect(requestedInit?.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    })
  })

  it('throws an error when the server responds with a failure status', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response('Not found', { status: 404 })) as typeof fetch

    // Act
    const act = () => submitQuizAnswer(ACCESS_TOKEN, 99, 1, fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('Server responded with status 404')
  })
})
