import { describe, expect, it } from 'vitest'
import { warningsAtPoint } from '../lib/warningsAtPoint'
import type { GeoPoint, Warning, WarningLevel } from '../types/warning'

// Makes a warning with only the parts that matter to these tests filled in.
function buildWarning(
  id: string,
  level: WarningLevel,
  polygons: GeoPoint[][],
): Warning {
  return {
    id,
    headline: 'Test warning',
    level,
    description: '',
    instruction: '',
    areaDescription: 'Test area',
    onset: '2026-11-17T09:00:00+13:00',
    expires: '2026-11-18T09:00:00+13:00',
    polygons,
  }
}

// Three square areas, in latitude and longitude. On the 500 x 710 map they cover:
//   AREA_A  x 161 to 304, y  71 to 166
//   AREA_B  x 232 to 375, y 308 to 402
//   AREA_C  x 196 to 339, y 118 to 213  (overlaps the bottom of AREA_A)
const AREA_A: GeoPoint[] = [
  { latitude: -35, longitude: 170 },
  { latitude: -35, longitude: 174 },
  { latitude: -37, longitude: 174 },
  { latitude: -37, longitude: 170 },
]
const AREA_B: GeoPoint[] = [
  { latitude: -40, longitude: 172 },
  { latitude: -40, longitude: 176 },
  { latitude: -42, longitude: 176 },
  { latitude: -42, longitude: 172 },
]
const AREA_C: GeoPoint[] = [
  { latitude: -36, longitude: 171 },
  { latitude: -36, longitude: 175 },
  { latitude: -38, longitude: 175 },
  { latitude: -38, longitude: 171 },
]

describe('warningsAtPoint', () => {
  it('returns an empty list when there are no warnings', () => {
    // Arrange
    const warnings: Warning[] = []

    // Act
    const result = warningsAtPoint(warnings, { x: 232, y: 118 })

    // Assert
    expect(result).toEqual([])
  })

  it('returns an empty list when the point is outside every area', () => {
    // Arrange
    const warnings = [
      buildWarning('a', 'yellow', [AREA_A]),
      buildWarning('b', 'orange', [AREA_B]),
    ]

    // Act
    const result = warningsAtPoint(warnings, { x: 50, y: 600 })

    // Assert
    expect(result).toEqual([])
  })

  it('returns only the warning whose area covers the point', () => {
    // Arrange
    const warnings = [
      buildWarning('a', 'yellow', [AREA_A]),
      buildWarning('b', 'orange', [AREA_B]),
    ]

    // Act
    const result = warningsAtPoint(warnings, { x: 300, y: 350 })

    // Assert
    expect(result.map((warning) => warning.id)).toEqual(['b'])
  })

  it('returns every overlapping warning, worst first', () => {
    // Arrange
    // The point sits where AREA_A and AREA_C overlap. The yellow one is listed first.
    const warnings = [
      buildWarning('yellow-a', 'yellow', [AREA_A]),
      buildWarning('orange-c', 'orange', [AREA_C]),
    ]

    // Act
    const result = warningsAtPoint(warnings, { x: 250, y: 140 })

    // Assert
    expect(result.map((warning) => warning.id)).toEqual([
      'orange-c',
      'yellow-a',
    ])
  })

  it('lists a warning once when several of its areas cover the point', () => {
    // Arrange
    // One warning with two overlapping areas, and a point inside both.
    const warnings = [buildWarning('both', 'orange', [AREA_A, AREA_C])]

    // Act
    const result = warningsAtPoint(warnings, { x: 250, y: 140 })

    // Assert
    expect(result).toHaveLength(1)
  })

  it('leaves the list it was given in its original order', () => {
    // Arrange
    const warnings = [
      buildWarning('yellow-a', 'yellow', [AREA_A]),
      buildWarning('orange-c', 'orange', [AREA_C]),
    ]

    // Act
    warningsAtPoint(warnings, { x: 250, y: 140 })

    // Assert
    expect(warnings.map((warning) => warning.id)).toEqual([
      'yellow-a',
      'orange-c',
    ])
  })
})
