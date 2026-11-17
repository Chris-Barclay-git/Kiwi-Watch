import { describe, expect, it } from 'vitest'
import { EMERGENCY_LINK_GROUPS } from '../data/emergencyLinks'

describe('EMERGENCY_LINK_GROUPS', () => {
  it('has at least one link under every heading', () => {
    // Arrange
    const groups = EMERGENCY_LINK_GROUPS

    // Act
    const emptyHeadings = groups
      .filter((group) => group.links.length === 0)
      .map((group) => group.heading)

    // Assert
    expect(emptyHeadings).toEqual([])
  })

  it('only links to secure (https) addresses', () => {
    // Arrange
    const urls = EMERGENCY_LINK_GROUPS.flatMap((group) =>
      group.links.map((link) => link.url),
    )

    // Act
    const insecureUrls = urls.filter((url) => !url.startsWith('https://'))

    // Assert
    expect(insecureUrls).toEqual([])
  })

  it('does not list the same address twice', () => {
    // Arrange
    const urls = EMERGENCY_LINK_GROUPS.flatMap((group) =>
      group.links.map((link) => link.url),
    )

    // Act
    const uniqueUrls = new Set(urls)

    // Assert
    expect(uniqueUrls.size).toBe(urls.length)
  })
})
