// One thing to pack in the go bag.
export interface GoBagItem {
  id: string
  category: string
  name: string
  // A short hint on how much to pack, or why it matters
  tip: string
}

// All the items in one category, ready to show under a heading.
export interface GoBagGroup {
  category: string
  items: GoBagItem[]
}
