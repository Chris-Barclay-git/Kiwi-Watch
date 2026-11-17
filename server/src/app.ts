import cors from 'cors'
import express from 'express'
import type { RequestHandler } from 'express'
import type { Quake } from './types/quake'
import type { Warning } from './types/warning'

type GetQuakes = () => Promise<Quake[]>
type GetWarnings = () => Promise<Warning[]>

// Makes a route that sends back whatever `getData` gives us, as JSON.
// If getting the data fails, it tells the browser and logs the reason for us.
function jsonRoute<T>(
  getData: () => Promise<T>,
  errorMessage: string,
): RequestHandler {
  return async (_request, response) => {
    try {
      response.json(await getData())
    } catch (error) {
      console.error(errorMessage, error)
      response.status(502).json({ error: errorMessage })
    }
  }
}

// Builds the Express app. The data getters are passed in, so the app doesn't
// need to know about GeoNet, MetService or the caches.
export function createApp(getQuakes: GetQuakes, getWarnings: GetWarnings) {
  const app = express()

  // Lets the React app (on a different port while we develop) call this server.
  app.use(cors())

  // GET /api/quakes -> a list of recent quakes as JSON
  app.get(
    '/api/quakes',
    jsonRoute(getQuakes, 'Could not get quakes from GeoNet right now'),
  )

  // GET /api/warnings -> a list of current weather watches and warnings as JSON
  app.get(
    '/api/warnings',
    jsonRoute(
      getWarnings,
      'Could not get weather warnings from MetService right now',
    ),
  )

  return app
}
