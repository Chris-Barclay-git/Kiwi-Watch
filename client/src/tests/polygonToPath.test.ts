import { describe, it, expect } from 'vitest'
import type { GeoPoint } from '../types/warning'
import { polygonToPath } from '../lib/polygonToPath'

describe('polygonToPath', () => {
  it('draws a shape through every point', () => {
    // Arrange: three corners of the map (top-left, top-right, bottom-right)
    const polygon: GeoPoint[] = [
      { latitude: -33.5, longitude: 165.5 },
      { latitude: -33.5, longitude: 179.5 },
      { latitude: -48.5, longitude: 179.5 },
    ]

    // Act
    const path = polygonToPath(polygon)

    // Assert
    expect(path).toBe('M 0 0 L 500 0 L 500 710 Z')
  })

  it('converts a point to its place on the map', () => {
    // Arrange: near Taupo
    const polygon: GeoPoint[] = [{ latitude: -38.62, longitude: 176.02 }]

    // Act
    const path = polygonToPath(polygon)

    // Assert
    expect(path).toBe('M 375.7 242.3 Z')
  })

  it('pulls points off the edge of the map back to the edge', () => {
    // Arrange: the second and third points are well out to sea, beyond the map
    const polygon: GeoPoint[] = [
      { latitude: -33.5, longitude: 165.5 },
      { latitude: -20, longitude: 190 },
      { latitude: -60, longitude: 190 },
    ]

    // Act
    const path = polygonToPath(polygon)

    // Assert
    expect(path).toBe('M 0 0 L 500 0 L 500 710 Z')
  })

  it('keeps every point of a shape that is partly off the map', () => {
    // Arrange: five points, one of them past the east edge
    const polygon: GeoPoint[] = [
      { latitude: -38.4, longitude: 177.3 },
      { latitude: -38.4, longitude: 190 },
      { latitude: -40, longitude: 178 },
      { latitude: -45, longitude: 175 },
      { latitude: -38.4, longitude: 177.3 },
    ]

    // Act
    const path = polygonToPath(polygon)

    // Assert: one "M" for the start, then a "L" for each of the other four points
    const lineCount = (path.match(/L/g) ?? []).length
    expect(lineCount).toBe(4)
  })

  it('gives an empty string when there are no points', () => {
    // Arrange
    const polygon: GeoPoint[] = []

    // Act
    const path = polygonToPath(polygon)

    // Assert
    expect(path).toBe('')
  })
})
