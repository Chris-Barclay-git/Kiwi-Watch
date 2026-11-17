import { useState } from 'react'
import { loadPackedIds, savePackedIds } from '../lib/goBagStorage'
import type { SimpleStorage } from '../lib/goBagStorage'
import { togglePacked } from '../lib/goBagLogic'

// The browser's storage, or a do-nothing one if the browser blocks it.
function getBrowserStorage(): SimpleStorage {
  try {
    return window.localStorage
  } catch {
    return { getItem: () => null, setItem: () => {} }
  }
}

// Keeps track of which go bag items are packed, and remembers them in the browser.
export function useGoBag() {
  // We read the saved list once, when the page first opens.
  const [packedIds, setPackedIds] = useState<string[]>(() =>
    loadPackedIds(getBrowserStorage()),
  )

  // Ticks or unticks an item, then saves the new list.
  function toggleItem(itemId: string) {
    const newPackedIds = togglePacked(packedIds, itemId)
    setPackedIds(newPackedIds)
    savePackedIds(getBrowserStorage(), newPackedIds)
  }

  return { packedIds, toggleItem }
}
