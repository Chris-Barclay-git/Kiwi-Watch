import { describe, expect, it } from 'vitest'
import {
  countPacked,
  groupItemsByCategory,
  togglePacked,
} from '../lib/goBagLogic'
import type { GoBagItem } from '../types/goBag'

describe('groupItemsByCategory', () => {
  it('puts items with the same category together, in the order they first appear', () => {
    // Arrange
    const items: GoBagItem[] = [
      { id: 'water', category: 'Water and food', name: 'Water', tip: '' },
      { id: 'torch', category: 'Light and power', name: 'Torch', tip: '' },
      { id: 'food', category: 'Water and food', name: 'Food', tip: '' },
    ]

    // Act
    const groups = groupItemsByCategory(items)

    // Assert
    expect(groups.map((group) => group.category)).toEqual([
      'Water and food',
      'Light and power',
    ])
    expect(groups[0].items.map((item) => item.id)).toEqual(['water', 'food'])
    expect(groups[1].items.map((item) => item.id)).toEqual(['torch'])
  })

  it('returns an empty list when there are no items', () => {
    // Arrange
    const items: GoBagItem[] = []

    // Act
    const groups = groupItemsByCategory(items)

    // Assert
    expect(groups).toEqual([])
  })
})

describe('countPacked', () => {
  const items: GoBagItem[] = [
    { id: 'water', category: 'Water and food', name: 'Water', tip: '' },
    { id: 'torch', category: 'Light and power', name: 'Torch', tip: '' },
    { id: 'cash', category: 'Documents and money', name: 'Cash', tip: '' },
  ]

  it('counts the items whose ids are in the packed list', () => {
    // Arrange
    const packedIds = ['water', 'cash']

    // Act
    const count = countPacked(items, packedIds)

    // Assert
    expect(count).toBe(2)
  })

  it('ignores packed ids that are not in the item list', () => {
    // Arrange
    const packedIds = ['water', 'an-item-we-removed']

    // Act
    const count = countPacked(items, packedIds)

    // Assert
    expect(count).toBe(1)
  })

  it('returns 0 when nothing is packed', () => {
    // Arrange
    const packedIds: string[] = []

    // Act
    const count = countPacked(items, packedIds)

    // Assert
    expect(count).toBe(0)
  })
})

describe('togglePacked', () => {
  it('adds the id when the item is not packed yet', () => {
    // Arrange
    const packedIds = ['water']

    // Act
    const result = togglePacked(packedIds, 'torch')

    // Assert
    expect(result).toEqual(['water', 'torch'])
  })

  it('removes the id when the item is already packed', () => {
    // Arrange
    const packedIds = ['water', 'torch']

    // Act
    const result = togglePacked(packedIds, 'water')

    // Assert
    expect(result).toEqual(['torch'])
  })

  it('does not change the list it was given', () => {
    // Arrange
    const packedIds = ['water']

    // Act
    togglePacked(packedIds, 'torch')

    // Assert
    expect(packedIds).toEqual(['water'])
  })
})
