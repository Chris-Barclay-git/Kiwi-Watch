import { describe, it, expect } from 'vitest'
import type { Quake } from '../types/quake'
import { createCache } from '../lib/createCache'
import { createGetQuakes } from '../lib/createGetQuakes'

const ONE_MINUTE = 60_000

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

describe('createGetQuakes', () => {
  it('asks GeoNet when the cache is empty', async () => {
    // Arrange
    const cache = createCache<Quake[]>(ONE_MINUTE, () => 0)
    const fetchQuakes = async () => [TAUPO_QUAKE]
    const getQuakes = createGetQuakes(fetchQuakes, cache)

    // Act
    const quakes = await getQuakes()

    // Assert
    expect(quakes).toEqual([TAUPO_QUAKE])
  })

  it('saves what GeoNet returns so the next call can reuse it', async () => {
    // Arrange
    const cache = createCache<Quake[]>(ONE_MINUTE, () => 0)
    const fetchQuakes = async () => [TAUPO_QUAKE]
    const getQuakes = createGetQuakes(fetchQuakes, cache)

    // Act
    await getQuakes()

    // Assert
    expect(cache.get()).toEqual([TAUPO_QUAKE])
  })

  it('does not ask GeoNet again while the cache is fresh', async () => {
    // Arrange
    let timesGeoNetWasAsked = 0
    const cache = createCache<Quake[]>(ONE_MINUTE, () => 0)
    const fetchQuakes = async () => {
      timesGeoNetWasAsked += 1
      return [TAUPO_QUAKE]
    }
    const getQuakes = createGetQuakes(fetchQuakes, cache)

    // Act
    await getQuakes()
    await getQuakes()
    await getQuakes()

    // Assert
    expect(timesGeoNetWasAsked).toBe(1)
  })
  it('passes the error on when GeoNet fails', async () => {
    // Arrange
    const cache = createCache<Quake[]>(ONE_MINUTE, () => 0)
    const fetchQuakes = async (): Promise<Quake[]> => {
      throw new Error('GeoNet responded with status 503')
    }
    const getQuakes = createGetQuakes(fetchQuakes, cache)

    // Act
    const act = () => getQuakes()

    // Assert
    await expect(act()).rejects.toThrow('GeoNet responded with status 503')
  })

  it('saves nothing in the cache when GeoNet fails', async () => {
    // Arrange
    const cache = createCache<Quake[]>(ONE_MINUTE, () => 0)
    const fetchQuakes = async (): Promise<Quake[]> => {
      throw new Error('GeoNet responded with status 503')
    }
    const getQuakes = createGetQuakes(fetchQuakes, cache)

    // Act
    await getQuakes().catch(() => {})

    // Assert
    expect(cache.get()).toBeNull()
  })
})
