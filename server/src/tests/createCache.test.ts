import { describe, it, expect } from 'vitest'
import { createCache } from '../lib/createCache'

const ONE_MINUTE = 60_000

describe('createCache', () => {
  it('returns null when nothing has been saved', () => {
    // Arrange
    const cache = createCache<string[]>(ONE_MINUTE, () => 0)

    // Act
    const result = cache.get()

    // Assert
    expect(result).toBeNull()
  })

  it('returns the saved value while it is still fresh', () => {
    // Arrange
    let currentTime = 1_000_000
    const cache = createCache<string[]>(ONE_MINUTE, () => currentTime)
    const quakes = ['2026p863622', '2026p863208']

    // Act
    cache.set(quakes)
    currentTime += 59_000 // 59 seconds later
    const result = cache.get()

    // Assert
    expect(result).toEqual(quakes)
  })

  it('returns null once the value is older than the max age', () => {
    // Arrange
    let currentTime = 1_000_000
    const cache = createCache<string[]>(ONE_MINUTE, () => currentTime)

    // Act
    cache.set(['2026p863622'])
    currentTime += 61_000 // 61 seconds later
    const result = cache.get()

    // Assert
    expect(result).toBeNull()
  })

  it('starts the timer again when a new value is saved', () => {
    // Arrange
    let currentTime = 1_000_000
    const cache = createCache<string[]>(ONE_MINUTE, () => currentTime)
    const newQuakes = ['2026p863208']

    // Act
    cache.set(['2026p863622'])
    currentTime += 50_000
    cache.set(newQuakes) // saved again at 50 seconds
    currentTime += 50_000 // 100 seconds after the first save, 50 after the second
    const result = cache.get()

    // Assert
    expect(result).toEqual(newQuakes)
  })
})
