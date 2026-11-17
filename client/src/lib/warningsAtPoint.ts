import type { Warning, WarningLevel } from '../types/warning'
import { projectToMapClamped } from './projection'
import type { Point } from './projection'

// Worst first, so the most serious alert is at the top of the card.
const LEVEL_RANK: Record<WarningLevel, number> = {
  red: 0,
  orange: 1,
  yellow: 2,
}

// Is the point inside the shape? Draw a line sideways from the point and count how many
// edges it crosses: an odd number means the point is inside.
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]
    const b = polygon[j]

    const edgeStraddlesPoint = a.y > point.y !== b.y > point.y
    if (!edgeStraddlesPoint) {
      continue
    }

    // Where that edge is, sideways, at the height of the point.
    const edgeX = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    if (point.x < edgeX) {
      inside = !inside
    }
  }

  return inside
}

// Every warning that covers this point on the map, worst first.
// A warning with several areas is listed once, even if more than one area covers the point.
export function warningsAtPoint(warnings: Warning[], point: Point): Warning[] {
  return warnings
    .filter((warning) =>
      warning.polygons.some((polygon) =>
        isPointInPolygon(
          point,
          polygon.map(({ latitude, longitude }) =>
            projectToMapClamped(latitude, longitude),
          ),
        ),
      ),
    )
    .sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level])
}
