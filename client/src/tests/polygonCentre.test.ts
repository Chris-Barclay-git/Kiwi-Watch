import { describe, expect, it } from 'vitest'
import { polygonCentre } from '../lib/polygonCentre'
import type { GeoPoint } from '../types/warning'

describe('polygonCentre', () => {
  it('returns null for a shape with no points', () => {
    // Arrange
    const polygon: GeoPoint[] = []

    // Act
    const centre = polygonCentre(polygon)

    // Assert
    expect(centre).toBeNull()
  })

  it('returns the point itself for a shape with one point', () => {
    // Arrange
    // lat -36.5, lng 169 sits at x 125, y 142 on the 500 x 710 map
    const polygon: GeoPoint[] = [{ latitude: -36.5, longitude: 169 }]

    // Act
    const centre = polygonCentre(polygon)

    // Assert
    expect(centre?.x).toBeCloseTo(125)
    expect(centre?.y).toBeCloseTo(142)
  })

  it('returns the middle of a shape that covers the whole map', () => {
    // Arrange
    // The four corners of the map: top-left, top-right, bottom-right, bottom-left
    const polygon: GeoPoint[] = [
      { latitude: -33.5, longitude: 165.5 },
      { latitude: -33.5, longitude: 179.5 },
      { latitude: -48.5, longitude: 179.5 },
      { latitude: -48.5, longitude: 165.5 },
    ]

    // Act
    const centre = polygonCentre(polygon)

    // Assert
    expect(centre?.x).toBeCloseTo(250)
    expect(centre?.y).toBeCloseTo(355)
  })

  it('pulls points that are off the map back to the edge', () => {
    // Arrange
    // North of and east of the map, so it clamps to the top-right corner (500, 0)
    const polygon: GeoPoint[] = [{ latitude: -30, longitude: 200 }]

    // Act
    const centre = polygonCentre(polygon)

    // Assert
    expect(centre?.x).toBeCloseTo(500)
    expect(centre?.y).toBeCloseTo(0)
  })
})
