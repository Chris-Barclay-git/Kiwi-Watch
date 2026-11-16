import { describe, it, expect } from 'vitest'
import { magnitudeToRingSize } from './magnitude'

describe('magnitudeToRingSize', () => {
  it('gives the smallest ring for the smallest magnitude', () => {
    // Arrange
    const smallestMagnitude = 1

    // Act
    const ringSize = magnitudeToRingSize(smallestMagnitude)

    // Assert
    expect(ringSize).toBe(6)
  })

  it('gives the largest ring for the largest magnitude', () => {
    // Arrange
    const largestMagnitude = 8

    // Act
    const ringSize = magnitudeToRingSize(largestMagnitude)

    // Assert
    expect(ringSize).toBe(40)
  })

  it('gives a middle-sized ring for a middle magnitude', () => {
    // Arrange
    const middleMagnitude = 4.5

    // Act
    const ringSize = magnitudeToRingSize(middleMagnitude)

    // Assert
    expect(ringSize).toBe(23)
  })

  it('never goes smaller than the smallest ring', () => {
    // Arrange
    const magnitudeBelowRange = -3

    // Act
    const ringSize = magnitudeToRingSize(magnitudeBelowRange)

    // Assert
    expect(ringSize).toBe(6)
  })

  it('never goes bigger than the largest ring', () => {
    // Arrange
    const magnitudeAboveRange = 9.5

    // Act
    const ringSize = magnitudeToRingSize(magnitudeAboveRange)

    // Assert
    expect(ringSize).toBe(40)
  })

  it('makes bigger quakes get bigger rings', () => {
    // Arrange
    const smallerQuake = 3
    const biggerQuake = 5

    // Act
    const smallerRing = magnitudeToRingSize(smallerQuake)
    const biggerRing = magnitudeToRingSize(biggerQuake)

    // Assert
    expect(biggerRing).toBeGreaterThan(smallerRing)
  })
})
