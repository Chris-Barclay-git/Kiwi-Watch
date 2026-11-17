// Rough outlines of NZ's main islands as [latitude, longitude] points,
// listed clockwise. Few points on purpose: the map is meant to look chunky and cute,
// not like a survey map.

export type LatLng = [latitude: number, longitude: number]

export const NORTH_ISLAND: LatLng[] = [
  [-34.43, 172.68], // Cape Reinga
  [-34.45, 173.1],
  [-34.85, 173.45],
  [-35.2, 174.2], // Bay of Islands
  [-35.8, 174.55], // Whangarei
  [-36.3, 174.8],
  [-36.85, 174.85], // Auckland
  [-37.2, 175.35], // Firth of Thames
  [-36.75, 175.45],
  [-36.45, 175.35], // Cape Colville
  [-36.85, 175.8],
  [-37.6, 176.2], // Tauranga
  [-37.95, 177.0], // Whakatane
  [-37.68, 178.55], // East Cape
  [-38.65, 178.0], // Gisborne
  [-39.1, 177.9], // Mahia
  [-39.65, 177.08], // Hawke's Bay
  [-40.5, 176.6],
  [-41.6, 175.3], // Cape Palliser
  [-41.35, 174.75], // Wellington
  [-41.3, 174.6],
  [-40.95, 174.95], // Kapiti Coast
  [-40.4, 175.2],
  [-39.9, 174.95], // Whanganui
  [-39.3, 173.75], // Cape Egmont (Taranaki)
  [-38.7, 174.6],
  [-38.05, 174.8], // Kawhia
  [-37.05, 174.5],
  [-36.4, 174.0],
  [-35.6, 173.4], // Hokianga
  [-35.15, 173.1],
  [-34.5, 172.65],
]

export const SOUTH_ISLAND: LatLng[] = [
  [-40.5, 172.65], // Cape Farewell
  [-40.5, 173.0], // tip of Farewell Spit
  [-40.85, 172.8], // Golden Bay
  [-41.25, 173.25], // Nelson
  [-40.9, 173.8], // Marlborough Sounds
  [-40.98, 174.3],
  [-41.73, 174.27], // Cape Campbell
  [-42.4, 173.7], // Kaikoura
  [-43.0, 173.1],
  [-43.75, 173.2], // Banks Peninsula
  [-44.4, 171.25], // Timaru
  [-45.1, 171.0], // Oamaru
  [-45.8, 170.7], // Dunedin
  [-46.45, 169.8], // Nugget Point
  [-46.6, 168.35], // Bluff
  [-46.15, 166.6], // Puysegur Point
  [-45.3, 166.9], // Fiordland
  [-44.4, 167.9],
  [-43.97, 168.6], // Jackson Bay
  [-42.7, 170.9], // Hokitika
  [-41.75, 171.6], // Westport
  [-41.25, 172.1], // Karamea
]

export const STEWART_ISLAND: LatLng[] = [
  [-46.9, 168.0],
  [-46.95, 168.4],
  [-47.25, 167.9],
  [-47.3, 167.5],
  [-47.05, 167.4],
]

export const NZ_ISLANDS: LatLng[][] = [
  NORTH_ISLAND,
  SOUTH_ISLAND,
  STEWART_ISLAND,
]
