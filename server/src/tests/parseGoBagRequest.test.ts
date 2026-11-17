import { describe, expect, it } from 'vitest'
import { parseItemId, parsePacked } from '../lib/parseGoBagRequest'

describe('parseItemId', () => {
  it('accepts a simple id', () => {
    // Arrange
    const itemId = 'water'

    // Act
    const result = parseItemId(itemId)

    // Assert
    expect(result).toBe('water')
  })

  it('accepts an id with a number and dashes', () => {
    // Arrange
    const itemId = 'power-bank-2'

    // Act
    const result = parseItemId(itemId)

    // Assert
    expect(result).toBe('power-bank-2')
  })

  it('rejects an empty id', () => {
    // Arrange
    const itemId = ''

    // Act
    const result = parseItemId(itemId)

    // Assert
    expect(result).toBeNull()
  })

  it('rejects an id with capital letters, spaces or symbols', () => {
    // Arrange
    const badIds = ['Water', 'power bank', 'torch!', '../etc']

    // Act
    const results = badIds.map((itemId) => parseItemId(itemId))

    // Assert
    expect(results).toEqual([null, null, null, null])
  })

  it('rejects an id that is too long', () => {
    // Arrange
    const itemId = 'a'.repeat(51)

    // Act
    const result = parseItemId(itemId)

    // Assert
    expect(result).toBeNull()
  })

  it('rejects something that is not text', () => {
    // Arrange
    const notText = [42, undefined, null, ['water']]

    // Act
    const results = notText.map((itemId) => parseItemId(itemId))

    // Assert
    expect(results).toEqual([null, null, null, null])
  })
})

describe('parsePacked', () => {
  it('gives true when packed is true', () => {
    // Arrange
    const body = { packed: true }

    // Act
    const result = parsePacked(body)

    // Assert
    expect(result).toBe(true)
  })

  it('gives false when packed is false', () => {
    // Arrange
    const body = { packed: false }

    // Act
    const result = parsePacked(body)

    // Assert
    expect(result).toBe(false)
  })

  it('gives null when packed is not true or false', () => {
    // Arrange
    const body = { packed: 'true' }

    // Act
    const result = parsePacked(body)

    // Assert
    expect(result).toBeNull()
  })

  it('gives null when packed is missing', () => {
    // Arrange
    const body = {}

    // Act
    const result = parsePacked(body)

    // Assert
    expect(result).toBeNull()
  })

  it('gives null when the body is not an object', () => {
    // Arrange
    const bodies = [undefined, null, 'packed', 7]

    // Act
    const results = bodies.map((body) => parsePacked(body))

    // Assert
    expect(results).toEqual([null, null, null, null])
  })
})
