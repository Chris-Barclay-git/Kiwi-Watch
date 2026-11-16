import {
  NORTH_ISLAND,
  SOUTH_ISLAND,
  STEWART_ISLAND,
} from '../../data/nzOutline'
import { outlineToPath } from '../../lib/outlineToPath'
import { MAP_HEIGHT, MAP_WIDTH } from '../../lib/projection'
import type { Quake } from '../../types/quake'
import { Island } from '../Island/Island'
import { QuakeMarker } from '../QuakeMarker/QuakeMarker'
import styles from './NzMap.module.css'

// The islands we draw: a name for the tooltip, and the SVG shape built from the outline.
const ISLANDS = [
  { name: 'North Island', path: outlineToPath(NORTH_ISLAND) },
  { name: 'South Island', path: outlineToPath(SOUTH_ISLAND) },
  { name: 'Stewart Island', path: outlineToPath(STEWART_ISLAND) },
]

interface NzMapProps {
  selectedQuake: Quake | null // the quake to mark on the map, or null for none
}

export function NzMap({ selectedQuake }: NzMapProps) {
  // The viewBox is the map's own coordinate system (the same 500 wide by 710 tall
  // that projectToMap uses). The browser scales it to fit the screen.
  return (
    <svg
      className={styles.map}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      role="group"
      aria-label="Map of New Zealand"
    >
      {ISLANDS.map((island) => (
        <Island key={island.name} name={island.name} path={island.path} />
      ))}

      {/* Drawn last so it sits on top of the islands.
          The key restarts the pulse each time a different quake is picked. */}
      {selectedQuake && (
        <QuakeMarker key={selectedQuake.id} quake={selectedQuake} />
      )}
    </svg>
  )
}
