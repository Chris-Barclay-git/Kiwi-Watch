import { useEffect, useState } from 'react'
import { fetchQuakes } from '../lib/fetchQuakes'
import type { Quake } from '../types/quake'

// The three situations the screen can be in.
export type QuakesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; quakes: Quake[] }

// Loads the recent quakes once, when the component first appears.
export function useQuakes(): QuakesState {
  const [state, setState] = useState<QuakesState>({ status: 'loading' })

  useEffect(() => {
    // If the component goes away before the answer arrives, we ignore the answer.
    let isStillWanted = true

    async function loadQuakes() {
      try {
        const quakes = await fetchQuakes()
        if (isStillWanted) setState({ status: 'ready', quakes })
      } catch {
        if (isStillWanted) setState({ status: 'error' })
      }
    }

    loadQuakes()

    return () => {
      isStillWanted = false
    }
  }, [])

  return state
}
