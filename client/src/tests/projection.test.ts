import { describe, it, expect } from 'vitest'
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  NZ_BOUNDS,
  isInsideMap,
  projectToMap,
} from '../lib/projection'

// Real places we reuse as test data.
const AUCKLAND = { latitude: -36.85, longitude: 174.76 }
const WELLINGTON = { latitude: -41.29, longitude: 174.78 }
const CHRISTCHURCH = { latitude: -43.53, longitude: 172.64 }
const SYDNEY = { latitude: -33.87, longitude: 151.2 }
const KERMADEC_ISLANDS = { latitude: -30.5, longitude: -177.9 }

describe('projectToMap', () => {
  it('puts the north-west corner at the top-left of the map', () => {
    // Arrange
    const { north, west } = NZ_BOUNDS

    // Act
    const point = projectToMap(north, west)

    // Assert
    expect(point).toEqual({ x: 0, y: 0 })
  })

  it('puts the south-east corner at the bottom-right of the map', () => {
    // Arrange
    const { south, east } = NZ_BOUNDS

    // Act
    const point = projectToMap(south, east)

    // Assert
    expect(point?.x).toBeCloseTo(MAP_WIDTH)
    expect(point?.y).toBeCloseTo(MAP_HEIGHT)
  })

  it('puts the middle of the bounds in the middle of the map', () => {
    // Arrange
    const middleLatitude = (NZ_BOUNDS.north + NZ_BOUNDS.south) / 2
    const middleLongitude = (NZ_BOUNDS.west + NZ_BOUNDS.east) / 2

    // Act
    const point = projectToMap(middleLatitude, middleLongitude)

    // Assert
    expect(point?.x).toBeCloseTo(MAP_WIDTH / 2)
    expect(point?.y).toBeCloseTo(MAP_HEIGHT / 2)
  })

  it('places Wellington south of Auckland (further down the map)', () => {
    // Arrange
    const aucklandInput = AUCKLAND
    const wellingtonInput = WELLINGTON

    // Act
    const auckland = projectToMap(
      aucklandInput.latitude,
      aucklandInput.longitude,
    )
    const wellington = projectToMap(
      wellingtonInput.latitude,
      wellingtonInput.longitude,
    )

    // Assert
    expect(wellington!.y).toBeGreaterThan(auckland!.y)
  })

  it('places Christchurch west of Auckland (further left on the map)', () => {
    // Arrange
    const aucklandInput = AUCKLAND
    const christchurchInput = CHRISTCHURCH

    // Act
    const auckland = projectToMap(
      aucklandInput.latitude,
      aucklandInput.longitude,
    )
    const christchurch = projectToMap(
      christchurchInput.latitude,
      christchurchInput.longitude,
    )

    // Assert
    expect(christchurch!.x).toBeLessThan(auckland!.x)
  })

  it('returns null for a quake outside the map (Sydney)', () => {
    // Arrange
    const { latitude, longitude } = SYDNEY

    // Act
    const point = projectToMap(latitude, longitude)

    // Assert
    expect(point).toBeNull()
  })

  it('returns null for a quake far north-east of NZ (Kermadec Islands)', () => {
    // Arrange
    const { latitude, longitude } = KERMADEC_ISLANDS

    // Act
    const point = projectToMap(latitude, longitude)

    // Assert
    expect(point).toBeNull()
  })
})

describe('isInsideMap', () => {
  it('is true for a quake in Wellington', () => {
    // Arrange
    const { latitude, longitude } = WELLINGTON

    // Act
    const result = isInsideMap(latitude, longitude)

    // Assert
    expect(result).toBe(true)
  })

  it('is false for a quake off the edge of the map', () => {
    // Arrange
    const latitudeSouthOfTheMap = -60
    const longitude = 174

    // Act
    const result = isInsideMap(latitudeSouthOfTheMap, longitude)

    // Assert
    expect(result).toBe(false)
  })
})
