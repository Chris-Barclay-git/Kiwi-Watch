import cors from 'cors'
import express from 'express'
import type { Quake } from './types/quake'

type GetQuakes = () => Promise<Quake[]>

// Builds the Express app. `getQuakes` is passed in, so the app doesn't need
// to know about GeoNet or the cache.
export function createApp(getQuakes: GetQuakes) {
  const app = express()

  // Lets the React app (on a different port while we develop) call this server.
  app.use(cors())

  // GET /api/quakes -> a list of recent quakes as JSON
  app.get('/api/quakes', async (_request, response) => {
    try {
      const quakes = await getQuakes()
      response.json(quakes)
    } catch (error) {
      // GeoNet failed or sent something odd. Tell the browser, and log it for us.
      console.error('Could not get quakes:', error)
      response
        .status(502)
        .json({ error: 'Could not get quakes from GeoNet right now' })
    }
  })

  return app
}
