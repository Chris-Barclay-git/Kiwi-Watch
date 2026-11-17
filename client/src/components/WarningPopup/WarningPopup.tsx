import { useEffect } from 'react'
import { polygonCentre } from '../../lib/polygonCentre'
import { popupPlacement } from '../../lib/popupPlacement'
import type { PopupPlacement } from '../../lib/popupPlacement'
import { MAP_HEIGHT, MAP_WIDTH } from '../../lib/projection'
import type { Warning, WarningLevel } from '../../types/warning'
import styles from './WarningPopup.module.css'

// What we call each colour on the badge.
const LEVEL_LABEL: Record<WarningLevel, string> = {
  yellow: 'Watch',
  orange: 'Warning',
  red: 'Red warning',
}

// Turns a time from MetService into something short, like "Tue, 5:00 pm".
// If it can't be read as a time, we show it as it came.
function formatTime(time: string): string {
  const date = new Date(time)
  if (Number.isNaN(date.getTime())) {
    return time
  }
  return date.toLocaleString('en-NZ', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

interface WarningPopupProps {
  warning: Warning
  onClose: () => void
}

export function WarningPopup({ warning, onClose }: WarningPopupProps) {
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

  // The card points at the middle of the warning's first area.
  const position = polygonCentre(warning.polygons[0] ?? [])

  // Sit on that point (as a percentage, so it scales with the map),
  // or at the top-centre if the warning has no shape to point at.
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
  const badgeClass = `${styles.badge} ${styles[warning.level]}`
  const levelLabel = LEVEL_LABEL[warning.level]

  return (
    <div className={styles.anchor} style={anchorStyle}>
      <div
        className={cardClass}
        role="group"
        aria-label={`${levelLabel} for ${warning.areaDescription}`}
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
          <span className={badgeClass}>{levelLabel}</span>
          <span className={styles.title}>{warning.headline}</span>
        </div>

        <p className={styles.area}>{warning.areaDescription}</p>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>From</dt>
            <dd>{formatTime(warning.onset)}</dd>
          </div>
          <div className={styles.fact}>
            <dt>Until</dt>
            <dd>{formatTime(warning.expires)}</dd>
          </div>
        </dl>

        {/* The long text scrolls inside the card, so the card stays a sensible size. */}
        <div className={styles.details}>
          {warning.description && <p>{warning.description}</p>}
          {warning.instruction && (
            <p>
              <strong>What to do:</strong> {warning.instruction}
            </p>
          )}
        </div>

        {position && <span className={styles.tail} />}
      </div>
    </div>
  )
}
