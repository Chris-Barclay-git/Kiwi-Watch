import { describe, expect, it } from 'vitest'
import { levelForXp, XP_PER_LEVEL } from '../lib/levelForXp'

describe('levelForXp', () => {
  it('starts everyone on level 1 with no progress', () => {
    // Arrange
    const xp = 0

    // Act
    const info = levelForXp(xp)

    // Assert
    expect(info).toEqual({ level: 1, xpIntoLevel: 0, xpPerLevel: XP_PER_LEVEL })
  })

  it('stays on level 1 until the last point before the next level', () => {
    // Arrange
    const xp = XP_PER_LEVEL - 1

    // Act
    const info = levelForXp(xp)

    // Assert
    expect(info.level).toBe(1)
    expect(info.xpIntoLevel).toBe(XP_PER_LEVEL - 1)
  })

  it('moves to level 2 at exactly one level of XP', () => {
    // Arrange
    const xp = XP_PER_LEVEL

    // Act
    const info = levelForXp(xp)

    // Assert
    expect(info.level).toBe(2)
    expect(info.xpIntoLevel).toBe(0)
  })

  it('shows the progress through a later level', () => {
    // Arrange
    const xp = XP_PER_LEVEL * 2 + 5

    // Act
    const info = levelForXp(xp)

    // Assert
    expect(info.level).toBe(3)
    expect(info.xpIntoLevel).toBe(5)
  })

  it('treats negative XP as 0', () => {
    // Arrange
    const xp = -15

    // Act
    const info = levelForXp(xp)

    // Assert
    expect(info.level).toBe(1)
    expect(info.xpIntoLevel).toBe(0)
  })

  it('ignores part of a point of XP', () => {
    // Arrange
    const xp = XP_PER_LEVEL - 0.5

    // Act
    const info = levelForXp(xp)

    // Assert
    expect(info.level).toBe(1)
    expect(info.xpIntoLevel).toBe(XP_PER_LEVEL - 1)
  })
})
