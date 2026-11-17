import type { Quake } from '../../types/quake'
import { magnitudeToRingSize } from '../../lib/magnitude'
import { projectToMap } from '../../lib/projection'
import styles from './QuakeMarker.module.css'

const DOT_SIZE = 6

interface QuakeMarkerProps {
  quake: Quake
}

export function QuakeMarker({ quake }: QuakeMarkerProps) {
  const position = projectToMap(quake.latitude, quake.longitude)

  // Off the edge of the map (like the Kermadec Islands): nothing to draw.
  if (position === null) {
    return null
  }

  return (
    <g>
      {/* Bigger quake = bigger ring */}
      <circle
        className={styles.ring}
        cx={position.x}
        cy={position.y}
        r={magnitudeToRingSize(quake.magnitude)}
      />
      <circle
        className={styles.dot}
        cx={position.x}
        cy={position.y}
        r={DOT_SIZE}
      />
    </g>
  )
}
