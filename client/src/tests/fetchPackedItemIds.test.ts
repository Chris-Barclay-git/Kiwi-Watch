import { describe, it, expect } from 'vitest'
import { fetchPackedItemIds } from '../lib/fetchPackedItemIds'

const ACCESS_TOKEN = 'test-token'

const PACKED_IDS = ['torch', 'water']

describe('fetchPackedItemIds', () => {
  it('returns the packed ids the server sends', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify({ packedIds: PACKED_IDS }), {
        status: 200,
      })) as typeof fetch

    // Act
    const packedIds = await fetchPackedItemIds(ACCESS_TOKEN, fakeFetch)

    // Assert
    expect(packedIds).toEqual(PACKED_IDS)
  })

  it('asks the server for /api/go-bag', async () => {
    // Arrange
    let requestedUrl = ''
    const fakeFetch = (async (url: string) => {
      requestedUrl = url
      return new Response(JSON.stringify({ packedIds: PACKED_IDS }), {
        status: 200,
      })
    }) as typeof fetch

    // Act
    await fetchPackedItemIds(ACCESS_TOKEN, fakeFetch)

    // Assert
    expect(requestedUrl).toBe('/api/go-bag')
  })

  it('sends the access token', async () => {
    // Arrange
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (_url: string, init?: RequestInit) => {
      requestedInit = init
      return new Response(JSON.stringify({ packedIds: PACKED_IDS }), {
        status: 200,
      })
    }) as typeof fetch

    // Act
    await fetchPackedItemIds(ACCESS_TOKEN, fakeFetch)

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
    const act = () => fetchPackedItemIds(ACCESS_TOKEN, fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('Server responded with status 500')
  })
})
