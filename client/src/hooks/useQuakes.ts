import { useEffect, useState } from 'react'
import { fetchQuakes } from '../lib/fetchQuakes'
import type { Quake } from '../types/quake'

// The three situations the screen can be in.
export type QuakesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; quakes: Quake[]; updatedAt: Date }

const REFRESH_EVERY_MS = 60_000 // one minute, the same as the server's cache

// Loads the recent quakes when the component first appears,
// then asks again every minute.
export function useQuakes(): QuakesState {
  const [state, setState] = useState<QuakesState>({ status: 'loading' })

  useEffect(() => {
    // If the component goes away before an answer arrives, we ignore the answer.
    let isStillWanted = true

    async function loadQuakes() {
      try {
        const quakes = await fetchQuakes()
        if (isStillWanted) {
          setState({ status: 'ready', quakes, updatedAt: new Date() })
        }
      } catch {
        // If a refresh fails, keep showing the quakes we already have.
        // Only show the error if we never got any.
        if (isStillWanted) {
          setState((current) =>
            current.status === 'ready' ? current : { status: 'error' },
          )
        }
      }
    }

    loadQuakes()
    const timerId = setInterval(loadQuakes, REFRESH_EVERY_MS)

    // When the component goes away, stop the timer.
    return () => {
      isStillWanted = false
      clearInterval(timerId)
    }
  }, [])

  return state
}
