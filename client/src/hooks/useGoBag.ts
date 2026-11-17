import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { fetchPackedItemIds } from '../lib/fetchPackedItemIds'
import { togglePacked } from '../lib/goBagLogic'
import { requireToken } from '../lib/requireToken'
import { savePackedItem } from '../lib/savePackedItem'

// Where the go bag is up to. Only "ready" has the list of packed item ids.
export type GoBagState =
  | { status: 'loading' } // fetching the list
  | { status: 'loggedOut' } // the go bag belongs to a logged-in user
  | { status: 'error' } // the list couldn't be loaded
  | { status: 'ready'; packedIds: string[] }

// Keeps track of which go bag items the logged-in user has packed.
// The list is saved on our server, so it belongs to their account.
export function useGoBag() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [state, setState] = useState<GoBagState>({ status: 'loading' })

  // True when the last tick couldn't be saved.
  const [saveFailed, setSaveFailed] = useState(false)

  // Once we know the user is logged in, load their packed items.
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let cancelled = false

    requireToken(getAccessTokenSilently)
      .then((accessToken) => fetchPackedItemIds(accessToken))
      .then((packedIds) => {
        if (!cancelled) setState({ status: 'ready', packedIds })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    // If the page disappears before the list arrives, ignore it.
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, getAccessTokenSilently])

  // Ticks or unticks an item. The change shows straight away, then we save it.
  // If saving fails, we put the list back how it was.
  async function toggleItem(itemId: string) {
    if (state.status !== 'ready') {
      return
    }

    const previousIds = state.packedIds
    const packed = !previousIds.includes(itemId)

    setSaveFailed(false)
    setState({ status: 'ready', packedIds: togglePacked(previousIds, itemId) })

    try {
      const accessToken = await requireToken(getAccessTokenSilently)
      const savedIds = await savePackedItem(accessToken, itemId, packed)
      setState({ status: 'ready', packedIds: savedIds })
    } catch {
      setState({ status: 'ready', packedIds: previousIds })
      setSaveFailed(true)
    }
  }

  // Once Auth0 has finished checking, a logged-out visitor sees the "log in" message.
  const isLoggedOut = !isLoading && !isAuthenticated
  const visibleState: GoBagState = isLoggedOut ? { status: 'loggedOut' } : state

  return { state: visibleState, saveFailed, toggleItem }
}
