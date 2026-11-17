import { polygonToPath } from '../../lib/polygonToPath'
import type { Warning, WarningLevel } from '../../types/warning'
import styles from './WarningLayer.module.css'

// Which warnings are drawn on top of which. The worst ones go last, so they sit on top.
const LEVEL_ORDER: Record<WarningLevel, number> = {
  yellow: 0,
  orange: 1,
  red: 2,
}

interface WarningLayerProps {
  warnings: Warning[]
  clipId: string // the id of a clip shape that cuts the colour to the land
}

// Colours in the areas covered by weather warnings, inside the map's SVG.
export function WarningLayer({ warnings, clipId }: WarningLayerProps) {
  const warningsWorstLast = [...warnings].sort(
    (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
  )

  return (
    <g
      className={styles.layer}
      clipPath={`url(#${clipId})`}
      role="group"
      aria-label="Weather warnings"
    >
      {/* One warning can cover several areas, so each shape gets its own path. */}
      {warningsWorstLast.flatMap((warning) =>
        warning.polygons.map((polygon, index) => (
          <path
            key={`${warning.id}-${index}`}
            className={`${styles.area} ${styles[warning.level]}`}
            d={polygonToPath(polygon)}
          >
            <title>{`${warning.headline}: ${warning.areaDescription}`}</title>
          </path>
        )),
      )}
    </g>
  )
}
