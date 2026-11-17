import type { GeoPoint } from '../types/warning'
import { projectToMapClamped } from './projection'
import type { Point } from './projection'

// The middle of a warning shape, as a point on the map (the average of its corners).
// This is where the info card points. An empty shape has no middle, so it gives null.
export function polygonCentre(polygon: GeoPoint[]): Point | null {
  if (polygon.length === 0) {
    return null
  }

  const points = polygon.map(({ latitude, longitude }) =>
    projectToMapClamped(latitude, longitude),
  )

  const totalX = points.reduce((sum, point) => sum + point.x, 0)
  const totalY = points.reduce((sum, point) => sum + point.y, 0)

  return { x: totalX / points.length, y: totalY / points.length }
}
