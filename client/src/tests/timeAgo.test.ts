import { describe, it, expect } from 'vitest'
import { timeAgo } from '../lib/timeAgo'

// A fixed "current time" so the tests give the same answer every day.
const NOW = new Date('2026-11-17T01:00:00.000Z')

describe('timeAgo', () => {
  it('says "just now" for under a minute', () => {
    // Arrange
    const thirtySecondsEarlier = '2026-11-17T00:59:30.000Z'

    // Act
    const text = timeAgo(thirtySecondsEarlier, NOW)

    // Assert
    expect(text).toBe('just now')
  })

  it('says minutes for under an hour', () => {
    // Arrange
    const fiveMinutesEarlier = '2026-11-17T00:55:00.000Z'

    // Act
    const text = timeAgo(fiveMinutesEarlier, NOW)

    // Assert
    expect(text).toBe('5 min ago')
  })

  it('says hours for under a day', () => {
    // Arrange
    const twoHoursEarlier = '2026-11-16T23:00:00.000Z'

    // Act
    const text = timeAgo(twoHoursEarlier, NOW)

    // Assert
    expect(text).toBe('2 hr ago')
  })

  it('says "1 day ago" for exactly one day', () => {
    // Arrange
    const oneDayEarlier = '2026-11-16T01:00:00.000Z'

    // Act
    const text = timeAgo(oneDayEarlier, NOW)

    // Assert
    expect(text).toBe('1 day ago')
  })

  it('says days for more than a day', () => {
    // Arrange
    const threeDaysEarlier = '2026-11-14T01:00:00.000Z'

    // Act
    const text = timeAgo(threeDaysEarlier, NOW)

    // Assert
    expect(text).toBe('3 days ago')
  })

  it('says "just now" if the time is slightly in the future', () => {
    // Arrange
    const fiveMinutesLater = '2026-11-17T01:05:00.000Z'

    // Act
    const text = timeAgo(fiveMinutesLater, NOW)

    // Assert
    expect(text).toBe('just now')
  })
})
