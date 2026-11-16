import { describe, it, expect } from 'vitest'
import type { LatLng } from '../data/nzOutline'
import { NZ_BOUNDS } from '../lib/projection'
import { outlineToPath } from '../lib/outlineToPath'

describe('outlineToPath', () => {
  it('draws a shape through every point and closes it', () => {
    // Arrange
    const { north, south, west, east } = NZ_BOUNDS
    const outlineAroundWholeMap: LatLng[] = [
      [north, west],
      [north, east],
      [south, east],
      [south, west],
    ]

    // Act
    const path = outlineToPath(outlineAroundWholeMap)

    // Assert
    expect(path).toBe('M 0 0 L 500 0 L 500 710 L 0 710 Z')
  })

  it('skips points that are off the edge of the map', () => {
    // Arrange
    const { north, south, west, east } = NZ_BOUNDS
    const kermadecIslands: LatLng = [-30.5, -177.9]
    const outlineWithOnePointOffMap: LatLng[] = [
      [north, west],
      kermadecIslands,
      [south, east],
    ]

    // Act
    const path = outlineToPath(outlineWithOnePointOffMap)

    // Assert
    expect(path).toBe('M 0 0 L 500 710 Z')
  })

  it('returns an empty string when there are no points', () => {
    // Arrange
    const emptyOutline: LatLng[] = []

    // Act
    const path = outlineToPath(emptyOutline)

    // Assert
    expect(path).toBe('')
  })
})
