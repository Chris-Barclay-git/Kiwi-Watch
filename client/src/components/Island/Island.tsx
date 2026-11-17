import type { Warning } from '../../types/warning'
import { WarningLayer } from '../WarningLayer/WarningLayer'
import styles from './Island.module.css'

interface IslandProps {
  name: string // shown as a tooltip and read out by screen readers
  path: string // the SVG path that draws this island's shape
  warnings: Warning[] // weather warnings to colour in on this island
}

export function Island({ name, path, warnings }: IslandProps) {
  // The green layer is cut to the island's own shape, so it needs its own clip id.
  const clipId = `clip-${name.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <g className={styles.island}>
      <title>{name}</title>

      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
      </defs>

      {/* Layer 1: the shadow on the sea */}
      <path className={styles.shadow} d={path} />

      {/* Layers 2 to 5 move together when you hover */}
      <g className={styles.body}>
        {/* Layer 2: yellow base with the thick outline */}
        <path className={styles.base} d={path} />

        {/* Layer 3: green fill, shifted down-right and clipped to the island,
            so a thin yellow edge shows along the top-left */}
        <g clipPath={`url(#${clipId})`}>
          <path className={styles.grass} d={path} transform="translate(7 7)" />
        </g>

        {/* Layer 4: weather colours, cut to this island so they hop with it */}
        <WarningLayer warnings={warnings} clipId={clipId} />

        {/* Layer 5: outline again on top to keep the edge crisp */}
        <path className={styles.outline} d={path} />
      </g>
    </g>
  )
}
