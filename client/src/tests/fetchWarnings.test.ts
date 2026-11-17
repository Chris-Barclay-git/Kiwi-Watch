import { describe, it, expect } from 'vitest'
import type { Warning } from '../types/warning'
import { fetchWarnings } from '../lib/fetchWarnings'

const HEAVY_RAIN_WATCH: Warning = {
  id: '2.49.0.0.554.0.severeweather.nz.20261116205009359.0',
  headline: 'Heavy Rain Watch',
  level: 'yellow',
  description: 'Periods of heavy rain, with thunderstorms possible.',
  instruction: 'Action: Monitor for updates.',
  areaDescription: 'The ranges of Bay of Plenty east of Opotiki',
  onset: '2026-11-18T11:00:00+13:00',
  expires: '2026-11-18T23:00:00+13:00',
  polygons: [
    [
      { latitude: -38.385, longitude: 177.337 },
      { latitude: -37.9, longitude: 177.5 },
      { latitude: -38.385, longitude: 177.337 },
    ],
  ],
}

describe('fetchWarnings', () => {
  it('returns the warnings the server sends', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response(JSON.stringify([HEAVY_RAIN_WATCH]), {
        status: 200,
      })) as typeof fetch

    // Act
    const warnings = await fetchWarnings(fakeFetch)

    // Assert
    expect(warnings).toEqual([HEAVY_RAIN_WATCH])
  })

  it('asks the server for /api/warnings', async () => {
    // Arrange
    let requestedUrl = ''
    const fakeFetch = (async (url: string) => {
      requestedUrl = url
      return new Response(JSON.stringify([HEAVY_RAIN_WATCH]), { status: 200 })
    }) as typeof fetch

    // Act
    await fetchWarnings(fakeFetch)

    // Assert
    expect(requestedUrl).toBe('/api/warnings')
  })

  it('throws an error when the server responds with a failure status', async () => {
    // Arrange
    const fakeFetch = (async () =>
      new Response('Bad gateway', { status: 502 })) as typeof fetch

    // Act
    const act = () => fetchWarnings(fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('Server responded with status 502')
  })
})
