import { useEffect } from 'react'
import type { Quake } from '../../types/quake'
import { popupPlacement } from '../../lib/popupPlacement'
import type { PopupPlacement } from '../../lib/popupPlacement'
import { MAP_HEIGHT, MAP_WIDTH, projectToMap } from '../../lib/projection'
import { timeAgo } from '../../lib/timeAgo'
import styles from './QuakePopup.module.css'

// Same threshold as the list: quakes at or above this get the coral badge.
const STRONG_MAGNITUDE = 4.5

interface QuakePopupProps {
  quake: Quake
  now: Date
  onClose: () => void
}

export function QuakePopup({ quake, now, onClose }: QuakePopupProps) {
  // Close when the Escape key is pressed. The cleanup removes the listener afterwards.
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const position = projectToMap(quake.latitude, quake.longitude)

  // On the map: sit on the marker (as a percentage, so it scales with the map).
  // Off the map: no marker to point at, so sit at the top-centre instead.
  const anchorStyle = position
    ? {
        left: `${(position.x / MAP_WIDTH) * 100}%`,
        top: `${(position.y / MAP_HEIGHT) * 100}%`,
      }
    : { left: '50%', top: '4%' }

  const placement: PopupPlacement = position
    ? popupPlacement(position, MAP_WIDTH, MAP_HEIGHT)
    : { vertical: 'below', horizontal: 'center' }

  const cardClass = `${styles.card} ${styles[placement.vertical]} ${styles[placement.horizontal]}`
  const badgeClass =
    quake.magnitude >= STRONG_MAGNITUDE
      ? `${styles.badge} ${styles.strong}`
      : styles.badge

  return (
    <div className={styles.anchor} style={anchorStyle}>
      <div
        className={cardClass}
        role="group"
        aria-label={`Earthquake near ${quake.locality}`}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <div className={styles.headline}>
          <span className={badgeClass}>{quake.magnitude.toFixed(1)}</span>
          <span className={styles.locality}>{quake.locality}</span>
        </div>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>Depth</dt>
            <dd>{quake.depthKm} km</dd>
          </div>
          <div className={styles.fact}>
            <dt>Time</dt>
            <dd>{timeAgo(quake.time, now)}</dd>
          </div>
        </dl>

        {!position && <p className={styles.note}>Off the edge of the map</p>}
        {position && <span className={styles.tail} />}
      </div>
    </div>
  )
}
