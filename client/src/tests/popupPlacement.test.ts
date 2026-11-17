import { describe, it, expect } from 'vitest'
import { popupPlacement } from '../lib/popupPlacement'

// A pretend map, so the numbers are easy to read.
const MAP_WIDTH = 100
const MAP_HEIGHT = 200

describe('popupPlacement', () => {
  it('puts the card above and centred for a marker in the middle', () => {
    // Arrange
    const markerInMiddle = { x: 50, y: 100 }

    // Act
    const placement = popupPlacement(markerInMiddle, MAP_WIDTH, MAP_HEIGHT)

    // Assert
    expect(placement).toEqual({ vertical: 'above', horizontal: 'center' })
  })

  it('puts the card below for a marker near the top edge', () => {
    // Arrange
    const markerNearTop = { x: 50, y: 10 }

    // Act
    const placement = popupPlacement(markerNearTop, MAP_WIDTH, MAP_HEIGHT)

    // Assert
    expect(placement.vertical).toBe('below')
  })

  it('lines the card up with the left edge for a marker near the left', () => {
    // Arrange
    const markerNearLeft = { x: 10, y: 100 }

    // Act
    const placement = popupPlacement(markerNearLeft, MAP_WIDTH, MAP_HEIGHT)

    // Assert
    expect(placement.horizontal).toBe('left')
  })

  it('lines the card up with the right edge for a marker near the right', () => {
    // Arrange
    const markerNearRight = { x: 90, y: 100 }

    // Act
    const placement = popupPlacement(markerNearRight, MAP_WIDTH, MAP_HEIGHT)

    // Assert
    expect(placement.horizontal).toBe('right')
  })

  it('handles the top-right corner (below and right)', () => {
    // Arrange
    const markerInTopRightCorner = { x: 95, y: 5 }

    // Act
    const placement = popupPlacement(
      markerInTopRightCorner,
      MAP_WIDTH,
      MAP_HEIGHT,
    )

    // Assert
    expect(placement).toEqual({ vertical: 'below', horizontal: 'right' })
  })
})
