import { describe, expect, it } from 'vitest'
import { selectQuakesToShow } from '../lib/selectQuakesToShow'

// Quakes are always given newest first, so "q1" is the newest in these tests.
describe('selectQuakesToShow', () => {
  it('returns two empty lists when there are no quakes', () => {
    // Arrange
    const quakes: { id: string; magnitude: number }[] = []
    const options = { minNotableMagnitude: 5, notableCount: 3, recentCount: 8 }

    // Act
    const result = selectQuakesToShow(quakes, options)

    // Assert
    expect(result.notable).toEqual([])
    expect(result.recent).toEqual([])
  })

  it('pins the newest quakes at or above the minimum, up to the count', () => {
    // Arrange
    // q2 is exactly on the minimum, so it counts. q6 qualifies but would be the 4th.
    const quakes = [
      { id: 'q1', magnitude: 2.0 },
      { id: 'q2', magnitude: 5.0 },
      { id: 'q3', magnitude: 4.0 },
      { id: 'q4', magnitude: 5.5 },
      { id: 'q5', magnitude: 6.1 },
      { id: 'q6', magnitude: 5.2 },
    ]
    const options = { minNotableMagnitude: 5, notableCount: 3, recentCount: 8 }

    // Act
    const result = selectQuakesToShow(quakes, options)

    // Assert
    expect(result.notable.map((quake) => quake.id)).toEqual(['q2', 'q4', 'q5'])
  })

  it('pins fewer than the count when fewer quakes qualify', () => {
    // Arrange
    const quakes = [
      { id: 'q1', magnitude: 2.0 },
      { id: 'q2', magnitude: 5.4 },
      { id: 'q3', magnitude: 3.1 },
    ]
    const options = { minNotableMagnitude: 5, notableCount: 3, recentCount: 8 }

    // Act
    const result = selectQuakesToShow(quakes, options)

    // Assert
    expect(result.notable.map((quake) => quake.id)).toEqual(['q2'])
  })

  it('pins nothing when no quake reaches the minimum', () => {
    // Arrange
    const quakes = [
      { id: 'q1', magnitude: 2.0 },
      { id: 'q2', magnitude: 4.9 },
    ]
    const options = { minNotableMagnitude: 5, notableCount: 3, recentCount: 8 }

    // Act
    const result = selectQuakesToShow(quakes, options)

    // Assert
    expect(result.notable).toEqual([])
    expect(result.recent.map((quake) => quake.id)).toEqual(['q1', 'q2'])
  })

  it('leaves pinned quakes out of the recent ones', () => {
    // Arrange
    // q2 is pinned, so the 2 recent quakes are q1 and q3, not q2.
    const quakes = [
      { id: 'q1', magnitude: 2.0 },
      { id: 'q2', magnitude: 5.5 },
      { id: 'q3', magnitude: 2.1 },
      { id: 'q4', magnitude: 2.2 },
      { id: 'q5', magnitude: 2.3 },
    ]
    const options = { minNotableMagnitude: 5, notableCount: 1, recentCount: 2 }

    // Act
    const result = selectQuakesToShow(quakes, options)

    // Assert
    expect(result.notable.map((quake) => quake.id)).toEqual(['q2'])
    expect(result.recent.map((quake) => quake.id)).toEqual(['q1', 'q3'])
  })

  it('shows a big quake in the recent ones when the pinned spots are full', () => {
    // Arrange
    // Four quakes qualify but only three spots are pinned, so the oldest drops into recent.
    const quakes = [
      { id: 'q1', magnitude: 5.0 },
      { id: 'q2', magnitude: 5.1 },
      { id: 'q3', magnitude: 5.2 },
      { id: 'q4', magnitude: 5.3 },
    ]
    const options = { minNotableMagnitude: 5, notableCount: 3, recentCount: 8 }

    // Act
    const result = selectQuakesToShow(quakes, options)

    // Assert
    expect(result.notable.map((quake) => quake.id)).toEqual(['q1', 'q2', 'q3'])
    expect(result.recent.map((quake) => quake.id)).toEqual(['q4'])
  })

  it('shows no more recent quakes than the count', () => {
    // Arrange
    const quakes = Array.from({ length: 10 }, (_, index) => ({
      id: `q${index + 1}`,
      magnitude: 2.0,
    }))
    const options = { minNotableMagnitude: 5, notableCount: 3, recentCount: 8 }

    // Act
    const result = selectQuakesToShow(quakes, options)

    // Assert
    expect(result.recent).toHaveLength(8)
    expect(result.recent[0].id).toBe('q1')
    expect(result.recent[7].id).toBe('q8')
  })
})
