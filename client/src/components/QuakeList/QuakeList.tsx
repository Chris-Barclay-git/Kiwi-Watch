import type { Quake } from '../../types/quake'
import { timeAgo } from '../../lib/timeAgo'
import styles from './QuakeList.module.css'

// Quakes at or above this magnitude get the warmer "strong" badge.
const STRONG_MAGNITUDE = 4.5

interface QuakeListProps {
  quakes: Quake[]
  selectedQuakeId: string | null
  onSelectQuake: (quakeId: string) => void
  now: Date
}

export function QuakeList({
  quakes,
  selectedQuakeId,
  onSelectQuake,
  now,
}: QuakeListProps) {
  // Newest quake first. We copy the array first so we don't change the original.
  const newestFirst = [...quakes].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  )

  return (
    <ul className={styles.list} aria-label="Recent earthquakes">
      {newestFirst.map((quake) => {
        const isSelected = quake.id === selectedQuakeId
        const isStrong = quake.magnitude >= STRONG_MAGNITUDE

        const rowClass = isSelected
          ? `${styles.row} ${styles.selected}`
          : styles.row
        const badgeClass = isStrong
          ? `${styles.badge} ${styles.strong}`
          : styles.badge

        return (
          <li key={quake.id}>
            <button
              type="button"
              className={rowClass}
              aria-pressed={isSelected}
              onClick={() => onSelectQuake(quake.id)}
            >
              <span className={badgeClass}>{quake.magnitude.toFixed(1)}</span>
              <span className={styles.details}>
                <span className={styles.locality}>{quake.locality}</span>
                <span className={styles.time}>{timeAgo(quake.time, now)}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
