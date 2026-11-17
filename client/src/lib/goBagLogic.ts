import type { GoBagGroup, GoBagItem } from '../types/goBag'

// Sorts the items into categories, keeping the order they first appear in.
export function groupItemsByCategory(items: GoBagItem[]): GoBagGroup[] {
  const groups: GoBagGroup[] = []

  for (const item of items) {
    const existing = groups.find((group) => group.category === item.category)

    if (existing) {
      existing.items.push(item)
    } else {
      groups.push({ category: item.category, items: [item] })
    }
  }

  return groups
}

// How many of the items are packed. Ids that don't match an item are ignored.
export function countPacked(items: GoBagItem[], packedIds: string[]): number {
  return items.filter((item) => packedIds.includes(item.id)).length
}

// Ticks an item if it isn't packed yet, or unticks it if it is.
// Returns a new list and leaves the original alone.
export function togglePacked(packedIds: string[], itemId: string): string[] {
  if (packedIds.includes(itemId)) {
    return packedIds.filter((id) => id !== itemId)
  }
  return [...packedIds, itemId]
}
