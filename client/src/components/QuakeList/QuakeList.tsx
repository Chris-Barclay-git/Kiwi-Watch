import type { Quake } from '../../types/quake'
import {
  QUAKE_LIST_OPTIONS,
  selectQuakesToShow,
} from '../../lib/selectQuakesToShow'
import { timeAgo } from '../../lib/timeAgo'
import styles from './QuakeList.module.css'

// Quakes at or above this magnitude get the warmer "strong" badge.
const STRONG_MAGNITUDE = 4.5

interface QuakeRowProps {
  quake: Quake
  isSelected: boolean
  onSelect: (quakeId: string) => void
  now: Date
}

// One quake in the list. It's a button, so it works with keyboard and screen readers.
function QuakeRow({ quake, isSelected, onSelect, now }: QuakeRowProps) {
  const isStrong = quake.magnitude >= STRONG_MAGNITUDE

  const rowClass = isSelected ? `${styles.row} ${styles.selected}` : styles.row
  const badgeClass = isStrong
    ? `${styles.badge} ${styles.strong}`
    : styles.badge

  return (
    <li>
      <button
        type="button"
        className={rowClass}
        aria-pressed={isSelected}
        onClick={() => onSelect(quake.id)}
      >
        <span className={badgeClass}>{quake.magnitude.toFixed(1)}</span>
        <span className={styles.details}>
          <span className={styles.locality}>{quake.locality}</span>
          <span className={styles.time}>{timeAgo(quake.time, now)}</span>
        </span>
      </button>
    </li>
  )
}

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

  // The newest big quakes, then the newest of the rest.
  const { notable, recent } = selectQuakesToShow(
    newestFirst,
    QUAKE_LIST_OPTIONS,
  )

  // Two groups, each with a title. A group with no quakes is left out.
  const groups = [
    {
      title: `Biggest lately (M${QUAKE_LIST_OPTIONS.minNotableMagnitude}+)`,
      quakes: notable,
    },
    { title: 'Latest', quakes: recent },
  ].filter((group) => group.quakes.length > 0)

  return (
    <div className={styles.list}>
      {groups.map((group) => (
        <section key={group.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.title}</h3>

          <ul className={styles.rows} aria-label={group.title}>
            {group.quakes.map((quake) => (
              <QuakeRow
                key={quake.id}
                quake={quake}
                isSelected={quake.id === selectedQuakeId}
                onSelect={onSelectQuake}
                now={now}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
