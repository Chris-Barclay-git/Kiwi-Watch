import { describe, it, expect } from 'vitest'
import { savePackedItem } from '../lib/savePackedItem'

const ACCESS_TOKEN = 'test-token'

const PACKED_IDS = ['torch', 'water']

describe('savePackedItem', () => {
  it('returns the updated packed ids the server sends', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify({ packedIds: PACKED_IDS }), {
        status: 200,
      })) as typeof fetch

    // Act
    const packedIds = await savePackedItem(
      ACCESS_TOKEN,
      'water',
      true,
      fakeFetch,
    )

    // Assert
    expect(packedIds).toEqual(PACKED_IDS)
  })

  it('sends a PUT to /api/go-bag/ followed by the item id', async () => {
    // Arrange
    let requestedUrl = ''
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (url: string, init?: RequestInit) => {
      requestedUrl = url
      requestedInit = init
      return new Response(JSON.stringify({ packedIds: PACKED_IDS }), {
        status: 200,
      })
    }) as typeof fetch

    // Act
    await savePackedItem(ACCESS_TOKEN, 'power-bank', true, fakeFetch)

    // Assert
    expect(requestedUrl).toBe('/api/go-bag/power-bank')
    expect(requestedInit?.method).toBe('PUT')
  })

  it('sends the access token and says the body is JSON', async () => {
    // Arrange
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (_url: string, init?: RequestInit) => {
      requestedInit = init
      return new Response(JSON.stringify({ packedIds: PACKED_IDS }), {
        status: 200,
      })
    }) as typeof fetch

    // Act
    await savePackedItem(ACCESS_TOKEN, 'water', true, fakeFetch)

    // Assert
    expect(requestedInit?.headers).toEqual({
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
    })
  })

  it('sends whether the item is packed in the body', async () => {
    // Arrange
    let requestedInit: RequestInit | undefined
    const fakeFetch = (async (_url: string, init?: RequestInit) => {
      requestedInit = init
      return new Response(JSON.stringify({ packedIds: [] }), { status: 200 })
    }) as typeof fetch

    // Act
    await savePackedItem(ACCESS_TOKEN, 'water', false, fakeFetch)

    // Assert
    expect(requestedInit?.body).toBe('{"packed":false}')
  })

  it('throws an error when the server responds with a failure status', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response('Server error', { status: 500 })) as typeof fetch

    // Act
    const act = () => savePackedItem(ACCESS_TOKEN, 'water', true, fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('Server responded with status 500')
  })
})
