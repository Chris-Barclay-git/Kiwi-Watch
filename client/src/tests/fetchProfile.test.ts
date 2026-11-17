import { describe, it, expect } from 'vitest'
import type { Profile } from '../types/profile'
import { fetchProfile } from '../lib/fetchProfile'

const ACCESS_TOKEN = 'test-token'

const LEVEL_THREE_PROFILE: Profile = {
  xp: 45,
  level: 3,
  xpIntoLevel: 5,
  xpPerLevel: 20,
}

describe('fetchProfile', () => {
  it('returns the profile the server sends', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify(LEVEL_THREE_PROFILE), {
        status: 200,
      })) as typeof fetch

    // Act
    const profile = await fetchProfile(ACCESS_TOKEN, fakeFetch)

    // Assert
    expect(profile).toEqual(LEVEL_THREE_PROFILE)
  })

  it('asks the server for /api/quiz/profile', async () => {
    // Arrange
    let requestedUrl = ''
    const fakeFetch = (async (url: string) => {
      requestedUrl = url
      return new Response(JSON.stringify(LEVEL_THREE_PROFILE), { status: 200 })
    }) as typeof fetch

    // Act
    await fetchProfile(ACCESS_TOKEN, fakeFetch)

    // Assert
    expect(requestedUrl).toBe('/api/quiz/profile')
  })

  it('sends the access token', async () => {
    // Arrange
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (_url: string, init?: RequestInit) => {
      requestedInit = init
      return new Response(JSON.stringify(LEVEL_THREE_PROFILE), { status: 200 })
    }) as typeof fetch

    // Act
    await fetchProfile(ACCESS_TOKEN, fakeFetch)

    // Assert
    expect(requestedInit?.headers).toEqual({
      Authorization: 'Bearer test-token',
    })
  })

  it('throws an error when the server responds with a failure status', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response('Server error', { status: 500 })) as typeof fetch

    // Act
    const act = () => fetchProfile(ACCESS_TOKEN, fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('Server responded with status 500')
  })
})
