import { useEffect, useState } from 'react'
import { fetchWarnings } from '../lib/fetchWarnings'
import type { Warning } from '../types/warning'

// The three situations the screen can be in.
export type WarningsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; warnings: Warning[] }

const REFRESH_EVERY_MS = 5 * 60_000 // five minutes, the same as the server's cache

// Loads the current weather warnings when the component first appears,
// then asks again every five minutes.
export function useWarnings(): WarningsState {
  const [state, setState] = useState<WarningsState>({ status: 'loading' })

  useEffect(() => {
    // If the component goes away before an answer arrives, we ignore the answer.
    let isStillWanted = true

    async function loadWarnings() {
      try {
        const warnings = await fetchWarnings()
        if (isStillWanted) setState({ status: 'ready', warnings })
      } catch {
        // If a refresh fails, keep showing the warnings we already have.
        // Only show the error if we never got any.
        if (isStillWanted) {
          setState((current) =>
            current.status === 'ready' ? current : { status: 'error' },
          )
        }
      }
    }

    loadWarnings()
    const timerId = setInterval(loadWarnings, REFRESH_EVERY_MS)

    // When the component goes away, stop the timer.
    return () => {
      isStillWanted = false
      clearInterval(timerId)
    }
  }, [])

  return state
}
