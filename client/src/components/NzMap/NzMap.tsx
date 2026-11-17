import { useRef } from 'react'
import type { MouseEvent } from 'react'
import {
  NORTH_ISLAND,
  SOUTH_ISLAND,
  STEWART_ISLAND,
} from '../../data/nzOutline'
import { outlineToPath } from '../../lib/outlineToPath'
import { MAP_HEIGHT, MAP_WIDTH } from '../../lib/projection'
import type { Point } from '../../lib/projection'
import type { Quake } from '../../types/quake'
import type { Warning } from '../../types/warning'
import { Island } from '../Island/Island'
import { QuakeMarker } from '../QuakeMarker/QuakeMarker'
import { QuakePopup } from '../QuakePopup/QuakePopup'
import { WarningPopup } from '../WarningPopup/WarningPopup'
import styles from './NzMap.module.css'

// The islands we draw: a name for the tooltip, and the SVG shape built from the outline.
const ISLANDS = [
  { name: 'North Island', path: outlineToPath(NORTH_ISLAND) },
  { name: 'South Island', path: outlineToPath(SOUTH_ISLAND) },
  { name: 'Stewart Island', path: outlineToPath(STEWART_ISLAND) },
]

interface NzMapProps {
  selectedQuake: Quake | null // the quake to mark on the map, or null for none
  warnings: Warning[] // the weather warnings to colour in
  selectedWarning: Warning | null // the warning whose card is open, or null for none
  now: Date
  onSelectPoint: (point: Point) => void // called with the spot on the map that was clicked
  onClosePopup: () => void // closes whichever card is open
}

export function NzMap({
  selectedQuake,
  warnings,
  selectedWarning,
  now,
  onSelectPoint,
  onClosePopup,
}: NzMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Turns a click on the screen into a spot on the map's own 500 x 710 grid,
  // then tells the app which spot was clicked.
  function handleAreaClick(event: MouseEvent<SVGPathElement>) {
    const screenToMap = svgRef.current?.getScreenCTM()?.inverse()
    if (!screenToMap) {
      return
    }

    const mapPoint = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      screenToMap,
    )
    onSelectPoint({ x: mapPoint.x, y: mapPoint.y })
  }

  return (
    <div className={styles.wrapper}>
      {/* The viewBox is the map's own coordinate system (the same 500 wide by 710 tall
          that projectToMap uses). The browser scales it to fit the screen. */}
      <svg
        ref={svgRef}
        className={styles.map}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="group"
        aria-label="Map of New Zealand"
      >
        {/* Each island draws its own weather colours, so they hop with it. */}
        {ISLANDS.map((island) => (
          <Island
            key={island.name}
            name={island.name}
            path={island.path}
            warnings={warnings}
            onSelectArea={handleAreaClick}
          />
        ))}

        {/* Drawn last so it sits on top of everything.
            The key restarts the pulse each time a different quake is picked. */}
        {selectedQuake && (
          <QuakeMarker key={selectedQuake.id} quake={selectedQuake} />
        )}
      </svg>

      {/* The info cards sit on top of the map, pointing at their spot. */}
      {selectedQuake && (
        <QuakePopup
          key={selectedQuake.id}
          quake={selectedQuake}
          now={now}
          onClose={onClosePopup}
        />
      )}

      {selectedWarning && (
        <WarningPopup
          key={selectedWarning.id}
          warning={selectedWarning}
          onClose={onClosePopup}
        />
      )}
    </div>
  )
}
