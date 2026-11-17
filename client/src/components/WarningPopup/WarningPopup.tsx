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
  warnings: Warning[] // every warning covering the clicked spot, worst first
  onClose: () => void
}

export function WarningPopup({ warnings, onClose }: WarningPopupProps) {
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

  const hasSeveral = warnings.length > 1

  // One warning is described by its own name; several are described by how many there are.
  const cardLabel = hasSeveral
    ? `${warnings.length} weather alerts here`
    : `${LEVEL_LABEL[warnings[0].level]} for ${warnings[0].areaDescription}`

  // The card sits just below the map, so it never covers the land.
  return (
    <div
      ref={cardRef}
      className={styles.card}
      role="group"
      aria-label={cardLabel}
    >
      <button
        type="button"
        className={styles.close}
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>

      {hasSeveral && (
        <p className={styles.count}>{warnings.length} alerts here</p>
      )}

      {warnings.map((warning) => (
        <section key={warning.id} className={styles.warning}>
          <div className={styles.headline}>
            <span className={`${styles.badge} ${styles[warning.level]}`}>
              {LEVEL_LABEL[warning.level]}
            </span>
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
        </section>
      ))}
    </div>
  )
}
