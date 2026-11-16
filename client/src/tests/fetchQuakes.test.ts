import { describe, it, expect } from 'vitest'
import type { Quake } from '../types/quake'
import { fetchQuakes } from '../lib/fetchQuakes'

const TAUPO_QUAKE: Quake = {
  id: '2026p863622',
  magnitude: 3.6,
  depthKm: 5,
  locality: '5 km north-west of Taupo',
  time: '2026-11-16T12:58:10.143Z',
  latitude: -38.624073029,
  longitude: 176.020141602,
  mmi: 4,
}

describe('fetchQuakes', () => {
  it('returns the quakes the server sends', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify([TAUPO_QUAKE]), {
        status: 200,
      })) as typeof fetch

    // Act
    const quakes = await fetchQuakes(fakeFetch)

    // Assert
    expect(quakes).toEqual([TAUPO_QUAKE])
  })
  it('asks the server for /api/quakes', async () => {
    // Arrange
    let requestedUrl = ''
    const fakeFetch = (async (url: string) => {
      requestedUrl = url
      return new Response(JSON.stringify([TAUPO_QUAKE]), { status: 200 })
    }) as typeof fetch

    // Act
    await fetchQuakes(fakeFetch)

    // Assert
    expect(requestedUrl).toBe('/api/quakes')
  })

  it('throws an error when the server responds with a failure status', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response('Bad gateway', { status: 502 })) as typeof fetch

    // Act
    const act = () => fetchQuakes(fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('Server responded with status 502')
  })
})
