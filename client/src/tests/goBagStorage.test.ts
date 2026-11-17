import { describe, expect, it } from 'vitest'
import {
  GO_BAG_STORAGE_KEY,
  loadPackedIds,
  savePackedIds,
} from '../lib/goBagStorage'

describe('loadPackedIds', () => {
  it('returns the saved ids', () => {
    // Arrange
    const storage = {
      getItem: () => '["water","torch"]',
      setItem: () => {},
    }

    // Act
    const result = loadPackedIds(storage)

    // Assert
    expect(result).toEqual(['water', 'torch'])
  })

  it('looks under the go bag key', () => {
    // Arrange
    let keyAskedFor = ''
    const storage = {
      getItem: (key: string) => {
        keyAskedFor = key
        return null
      },
      setItem: () => {},
    }

    // Act
    loadPackedIds(storage)

    // Assert
    expect(keyAskedFor).toBe(GO_BAG_STORAGE_KEY)
  })

  it('returns an empty list when nothing is saved', () => {
    // Arrange
    const storage = { getItem: () => null, setItem: () => {} }

    // Act
    const result = loadPackedIds(storage)

    // Assert
    expect(result).toEqual([])
  })

  it('returns an empty list when the saved text is not valid JSON', () => {
    // Arrange
    const storage = { getItem: () => 'not json {', setItem: () => {} }

    // Act
    const result = loadPackedIds(storage)

    // Assert
    expect(result).toEqual([])
  })

  it('returns an empty list when the saved data is not a list of text', () => {
    // Arrange
    const storage = { getItem: () => '[1,2,3]', setItem: () => {} }

    // Act
    const result = loadPackedIds(storage)

    // Assert
    expect(result).toEqual([])
  })

  it('returns an empty list when the browser blocks storage', () => {
    // Arrange
    const storage = {
      getItem: () => {
        throw new Error('Storage is blocked')
      },
      setItem: () => {},
    }

    // Act
    const result = loadPackedIds(storage)

    // Assert
    expect(result).toEqual([])
  })
})

describe('savePackedIds', () => {
  it('saves the ids as JSON under the go bag key', () => {
    // Arrange
    const saved: Record<string, string> = {}
    const storage = {
      getItem: () => null,
      setItem: (key: string, value: string) => {
        saved[key] = value
      },
    }

    // Act
    savePackedIds(storage, ['water', 'torch'])

    // Assert
    expect(saved).toEqual({ [GO_BAG_STORAGE_KEY]: '["water","torch"]' })
  })

  it('does not crash when the browser blocks storage', () => {
    // Arrange
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('Storage is full')
      },
    }

    // Act
    const save = () => savePackedIds(storage, ['water'])

    // Assert
    expect(save).not.toThrow()
  })
})
