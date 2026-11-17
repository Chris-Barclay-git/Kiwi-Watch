import { describe, it, expect } from 'vitest'
import type { GeoNetResponse } from '../types/geonet'
import { fetchQuakes } from '../lib/fetchQuakes'

// A real feature from GeoNet's /quake response, used as test data.
const GEONET_BODY: GeoNetResponse = {
  features: [
    {
      geometry: { coordinates: [176.020141602, -38.624073029] },
      properties: {
        publicID: '2026p863622',
        time: '2026-11-16T12:58:10.143Z',
        depth: 5,
        magnitude: 3.5504550748224917,
        mmi: 4,
        locality: '5 km north-west of Taupo',
        quality: 'best',
      },
    },
  ],
}

describe('fetchQuakes', () => {
  it("returns GeoNet's quakes in our Quake shape", async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify(GEONET_BODY), {
        status: 200,
      })) as typeof fetch

    // Act
    const quakes = await fetchQuakes(fakeFetch)

    // Assert
    expect(quakes).toHaveLength(1)
    expect(quakes[0].id).toBe('2026p863622')
    expect(quakes[0].magnitude).toBe(3.6)
  })
  it('asks the GeoNet quake URL for version 2 of the data', async () => {
    // Arrange
    let requestedUrl = ''
    let requestedHeaders: HeadersInit | undefined
    const fakeFetch = (async (url: string, options?: RequestInit) => {
      requestedUrl = url
      requestedHeaders = options?.headers
      return new Response(JSON.stringify(GEONET_BODY), { status: 200 })
    }) as typeof fetch

    // Act
    await fetchQuakes(fakeFetch)

    // Assert
    expect(requestedUrl).toBe('https://api.geonet.org.nz/quake?MMI=3')
    expect(requestedHeaders).toEqual({
      Accept: 'application/vnd.geo+json;version=2',
    })
  })
  it('throws an error when GeoNet responds with a failure status', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response('Service unavailable', { status: 503 })) as typeof fetch

    // Act
    const act = () => fetchQuakes(fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('GeoNet responded with status 503')
  })
})
