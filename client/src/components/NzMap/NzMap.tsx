import {
  NORTH_ISLAND,
  SOUTH_ISLAND,
  STEWART_ISLAND,
} from '../../data/nzOutline'
import { outlineToPath } from '../../lib/outlineToPath'
import { MAP_HEIGHT, MAP_WIDTH } from '../../lib/projection'
import { Island } from '../Island/Island'
import styles from './NzMap.module.css'

// The islands we draw: a name for the tooltip, and the SVG shape built from the outline.
const ISLANDS = [
  { name: 'North Island', path: outlineToPath(NORTH_ISLAND) },
  { name: 'South Island', path: outlineToPath(SOUTH_ISLAND) },
  { name: 'Stewart Island', path: outlineToPath(STEWART_ISLAND) },
]

export function NzMap() {
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
    </svg>
  )
}
