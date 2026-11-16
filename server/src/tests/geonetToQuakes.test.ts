import { describe, it, expect } from 'vitest'
import type { GeoNetFeature, GeoNetResponse } from '../types/geonet'
import { geonetToQuakes } from '../lib/geonetToQuakes'

// Real features from GeoNet's /quake response, used as test data.
const TAUPO_QUAKE: GeoNetFeature = {
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
}

const GISBORNE_QUAKE: GeoNetFeature = {
  geometry: { coordinates: [177.810256958, -38.618331909] },
  properties: {
    publicID: '2026p863208',
    time: '2026-11-16T09:17:28.486Z',
    depth: 28.60700798034668,
    magnitude: 3.0926257479975505,
    mmi: 3,
    locality: '15 km west of Gisborne',
    quality: 'best',
  },
}

const DELETED_QUAKE: GeoNetFeature = {
  geometry: { coordinates: [176.236984253, -40.621032715] },
  properties: {
    publicID: '2026p858260',
    time: '2026-11-14T13:21:01.196Z',
    depth: 5,
    magnitude: 2.455658286481331,
    mmi: 3,
    locality: '5 km south-east of Pongaroa',
    quality: 'deleted',
  },
}

const SEDDON_QUAKE: GeoNetFeature = {
  geometry: { coordinates: [174.181182861, -41.650585175] },
  properties: {
    publicID: '2026p860876',
    time: '2026-11-15T12:34:54.553Z',
    depth: 10.000789642333984,
    magnitude: 2.3465788913757017,
    mmi: 3,
    locality: '5 km east of Seddon',
    quality: 'best',
  },
}

describe('geonetToQuakes', () => {
  it('converts a GeoNet feature to our Quake shape', () => {
    // Arrange
    const response: GeoNetResponse = { features: [TAUPO_QUAKE] }

    // Act
    const [quake] = geonetToQuakes(response)

    // Assert
    expect(quake).toEqual({
      id: '2026p863622',
      magnitude: 3.6,
      depthKm: 5,
      locality: '5 km north-west of Taupo',
      time: '2026-11-16T12:58:10.143Z',
      latitude: -38.624073029,
      longitude: 176.020141602,
      mmi: 4,
    })
  })

  it("swaps GeoNet's [longitude, latitude] into latitude and longitude", () => {
    // Arrange
    const response: GeoNetResponse = { features: [TAUPO_QUAKE] }

    // Act
    const [quake] = geonetToQuakes(response)

    // Assert
    expect(quake.latitude).toBeLessThan(0) // south of the equator
    expect(quake.longitude).toBeGreaterThan(160) // NZ is around 166 to 179 degrees east
  })

  it('rounds magnitude to one decimal place', () => {
    // Arrange
    const response: GeoNetResponse = { features: [GISBORNE_QUAKE] }

    // Act
    const [quake] = geonetToQuakes(response)

    // Assert
    expect(quake.magnitude).toBe(3.1)
  })

  it('rounds depth to the nearest whole kilometre', () => {
    // Arrange
    const response: GeoNetResponse = { features: [GISBORNE_QUAKE] }

    // Act
    const [quake] = geonetToQuakes(response)

    // Assert
    expect(quake.depthKm).toBe(29)
  })

  it('drops quakes that GeoNet has marked as deleted', () => {
    // Arrange
    const response: GeoNetResponse = { features: [TAUPO_QUAKE, DELETED_QUAKE] }

    // Act
    const quakes = geonetToQuakes(response)

    // Assert
    expect(quakes.map((quake) => quake.id)).toEqual(['2026p863622'])
  })

  it('puts the newest quake first', () => {
    // Arrange: given oldest first on purpose
    const response: GeoNetResponse = {
      features: [GISBORNE_QUAKE, SEDDON_QUAKE, TAUPO_QUAKE],
    }

    // Act
    const quakes = geonetToQuakes(response)

    // Assert
    expect(quakes.map((quake) => quake.id)).toEqual([
      '2026p863622', // Taupo, 16 Nov 12:58
      '2026p863208', // Gisborne, 16 Nov 09:17
      '2026p860876', // Seddon, 15 Nov
    ])
  })

  it('returns an empty list when there are no features', () => {
    // Arrange
    const response: GeoNetResponse = { features: [] }

    // Act
    const quakes = geonetToQuakes(response)

    // Assert
    expect(quakes).toEqual([])
  })
})
