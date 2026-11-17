import { describe, expect, it } from 'vitest'
import { parseAnswerRequest } from '../lib/parseAnswerRequest'

describe('parseAnswerRequest', () => {
  it('gives back the ids from a good request', () => {
    // Arrange
    const body = { questionId: 3, optionId: 12 }

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toEqual({ questionId: 3, optionId: 12 })
  })

  it('ignores any extra fields', () => {
    // Arrange
    const body = { questionId: 3, optionId: 12, isCorrect: true, xp: 9999 }

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toEqual({ questionId: 3, optionId: 12 })
  })

  it('gives null when there is no body', () => {
    // Arrange
    const body = null

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toBeNull()
  })

  it('gives null when the body is not an object', () => {
    // Arrange
    const body = 'questionId=3&optionId=12'

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toBeNull()
  })

  it('gives null when questionId is missing', () => {
    // Arrange
    const body = { optionId: 12 }

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toBeNull()
  })

  it('gives null when optionId is missing', () => {
    // Arrange
    const body = { questionId: 3 }

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toBeNull()
  })

  it('gives null when the ids are text instead of numbers', () => {
    // Arrange
    const body = { questionId: '3', optionId: '12' }

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toBeNull()
  })

  it('gives null when an id is not a whole number', () => {
    // Arrange
    const body = { questionId: 3.5, optionId: 12 }

    // Act
    const result = parseAnswerRequest(body)

    // Assert
    expect(result).toBeNull()
  })
})
