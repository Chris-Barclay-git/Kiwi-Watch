import type { LatLng } from '../data/nzOutline'
import { projectToMap } from './projection'
import type { Point } from './projection'

// Turns a list of lat/lng points into an SVG path string that draws the shape.
// Example result: "M 0 0 L 500 0 L 500 710 Z"

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function formatPoint(point: Point): string {
  return `${roundToOneDecimal(point.x)} ${roundToOneDecimal(point.y)}`
}

export function outlineToPath(outline: LatLng[]): string {
  // Convert every lat/lng to a map position, and skip any that fall off the map.
  const points = outline
    .map(([latitude, longitude]) => projectToMap(latitude, longitude))
    .filter((point): point is Point => point !== null)

  if (points.length === 0) {
    return ''
  }

  // "M" = move to the first point, "L" = draw a line to the next one, "Z" = close the shape.
  const [firstPoint, ...otherPoints] = points
  const moveToStart = `M ${formatPoint(firstPoint)}`
  const lineToEachOtherPoint = otherPoints.map(
    (point) => `L ${formatPoint(point)}`,
  )

  return [moveToStart, ...lineToEachOtherPoint, 'Z'].join(' ')
}
