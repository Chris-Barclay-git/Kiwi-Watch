import type { GeoPoint } from '../types/warning'
import { pointsToPath } from './outlineToPath'
import { projectToMapClamped } from './projection'

// Turns a weather warning's shape into an SVG path string.
// Points off the edge of the map are pulled back to the edge, so the shape
// keeps its form instead of losing corners.
export function polygonToPath(polygon: GeoPoint[]): string {
  const points = polygon.map(({ latitude, longitude }) =>
    projectToMapClamped(latitude, longitude),
  )

  return pointsToPath(points)
}
