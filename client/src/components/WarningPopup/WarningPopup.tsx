import { useEffect, useRef } from 'react'
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
  const cardRef = useRef<HTMLDivElement>(null)

  // When the card opens, scroll it into view if it is off the screen (handy on phones).
  useEffect(() => {
    cardRef.current?.scrollIntoView({ block: 'nearest' })
  }, [])

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

  const badgeClass = `${styles.badge} ${styles[warning.level]}`
  const levelLabel = LEVEL_LABEL[warning.level]

  // The card sits just below the map, so it never covers the land.
  return (
    <div
      ref={cardRef}
      className={styles.card}
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

      <div className={styles.details}>
        {warning.description && <p>{warning.description}</p>}
        {warning.instruction && (
          <p>
            <strong>What to do:</strong> {warning.instruction}
          </p>
        )}
      </div>
    </div>
  )
}
