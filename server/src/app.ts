import cors from 'cors'
import express from 'express'
import type {
  ErrorRequestHandler,
  Request,
  RequestHandler,
  Response,
} from 'express'
import { parseAnswerRequest } from './lib/parseAnswerRequest'
import { parseItemId, parsePacked } from './lib/parseGoBagRequest'
import type { Profile } from './types/profile'
import type { Quake } from './types/quake'
import type { AnswerResult, QuizQuestion } from './types/quiz'
import type { Warning } from './types/warning'

type GetQuakes = () => Promise<Quake[]>
type GetWarnings = () => Promise<Warning[]>

// What the quiz routes need, so the app doesn't need to know about the database.
// Each one is told who is asking, using their Auth0 id.
export interface QuizService {
  getNextQuestion: (auth0Id: string) => Promise<QuizQuestion | null>
  submitAnswer: (
    auth0Id: string,
    questionId: number,
    optionId: number,
  ) => Promise<AnswerResult | null>
  getProfile: (auth0Id: string) => Promise<Profile | null>
}

// What the go bag routes need. Like the quiz, each one is told who is asking.
export interface GoBagService {
  getPackedItemIds: (auth0Id: string) => Promise<string[]>
  setItemPacked: (
    auth0Id: string,
    itemId: string,
    packed: boolean,
  ) => Promise<void>
}

// Makes a route that sends back whatever `getData` gives us, as JSON.
// If getting the data fails, it tells the browser and logs the reason for us.
// 502 means "the outside service failed".
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

// Makes a route for logged-in users. The login check has already read their token,
// so here we pick out who they are (the token's "sub", short for "subject") and pass it on.
// If something goes wrong, we log the reason and tell the browser.
function forLoggedInUser(
  errorMessage: string,
  handle: (
    auth0Id: string,
    request: Request,
    response: Response,
  ) => Promise<void>,
): RequestHandler {
  return async (request, response) => {
    const auth0Id = request.auth?.payload.sub
    if (!auth0Id) {
      response.status(401).json({ error: 'You need to log in to do that' })
      return
    }

    try {
      await handle(auth0Id, request, response)
    } catch (error) {
      console.error(errorMessage, error)
      response.status(500).json({ error: errorMessage })
    }
  }
}

// When the login check rejects a request, send a short JSON message, not a stack trace.
const handleLoginErrors: ErrorRequestHandler = (
  error,
  _request,
  response,
  next,
) => {
  if (error?.status === 401 || error?.status === 403) {
    response.status(error.status).json({ error: 'You need to log in to do that' })
    return
  }
  next(error)
}

// Builds the Express app. The data getters, the services and the login check are passed in,
// so the app doesn't need to know about GeoNet, MetService, the caches, the database or Auth0.
export function createApp(
  getQuakes: GetQuakes,
  getWarnings: GetWarnings,
  quiz: QuizService,
  goBag: GoBagService,
  requireLogin: RequestHandler,
) {
  const app = express()

  // Lets the React app (on a different port while we develop) call this server.
  app.use(cors())

  // Reads JSON sent in the body of a request (the quiz answers).
  app.use(express.json())

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

  // Everything under /api/quiz and /api/go-bag is for logged-in users only.
  app.use('/api/quiz', requireLogin)
  app.use('/api/go-bag', requireLogin)

  // GET /api/quiz/question -> { question: ... }, or { question: null } when all are done.
  // The question never says which option is correct.
  app.get(
    '/api/quiz/question',
    forLoggedInUser(
      'Could not get a quiz question right now',
      async (auth0Id, _request, response) => {
        response.json({ question: await quiz.getNextQuestion(auth0Id) })
      },
    ),
  )

  // GET /api/quiz/profile -> the user's XP and level
  app.get(
    '/api/quiz/profile',
    forLoggedInUser(
      'Could not get your profile right now',
      async (auth0Id, _request, response) => {
        const profile = await quiz.getProfile(auth0Id)
        if (!profile) {
          response.status(404).json({ error: 'No profile found' })
          return
        }
        response.json(profile)
      },
    ),
  )

  // POST /api/quiz/answer with { questionId, optionId } -> whether it was right, and the XP
  app.post(
    '/api/quiz/answer',
    forLoggedInUser(
      'Could not save your answer right now',
      async (auth0Id, request, response) => {
        const answer = parseAnswerRequest(request.body)
        if (!answer) {
          response.status(400).json({
            error: 'Send a questionId and an optionId, both whole numbers',
          })
          return
        }

        const result = await quiz.submitAnswer(
          auth0Id,
          answer.questionId,
          answer.optionId,
        )
        if (!result) {
          response
            .status(404)
            .json({ error: 'That question or option does not exist' })
          return
        }
        response.json(result)
      },
    ),
  )

  // GET /api/go-bag -> { packedIds: [...] }, the items this user has packed
  app.get(
    '/api/go-bag',
    forLoggedInUser(
      'Could not get your go bag right now',
      async (auth0Id, _request, response) => {
        response.json({ packedIds: await goBag.getPackedItemIds(auth0Id) })
      },
    ),
  )

  // PUT /api/go-bag/:itemId with { packed: true } or { packed: false }
  // -> { packedIds: [...] }, the updated list
  app.put(
    '/api/go-bag/:itemId',
    forLoggedInUser(
      'Could not save your go bag right now',
      async (auth0Id, request, response) => {
        const itemId = parseItemId(request.params.itemId)
        if (!itemId) {
          response.status(400).json({ error: 'That is not a valid item id' })
          return
        }

        const packed = parsePacked(request.body)
        if (packed === null) {
          response
            .status(400)
            .json({ error: 'Send packed as true or false' })
          return
        }

        await goBag.setItemPacked(auth0Id, itemId, packed)
        response.json({ packedIds: await goBag.getPackedItemIds(auth0Id) })
      },
    ),
  )

  app.use(handleLoginErrors)

  return app
}
