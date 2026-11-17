import cors from 'cors'
import express from 'express'
import type { RequestHandler } from 'express'
import { parseAnswerRequest } from './lib/parseAnswerRequest'
import type { Profile } from './types/profile'
import type { Quake } from './types/quake'
import type { AnswerResult, QuizQuestion } from './types/quiz'
import type { Warning } from './types/warning'

type GetQuakes = () => Promise<Quake[]>
type GetWarnings = () => Promise<Warning[]>

// What the quiz routes need, so the app doesn't need to know about the database.
export interface QuizService {
  getNextQuestion: () => Promise<QuizQuestion | null>
  submitAnswer: (
    questionId: number,
    optionId: number,
  ) => Promise<AnswerResult | null>
  getProfile: () => Promise<Profile | null>
}

// Makes a route that sends back whatever `getData` gives us, as JSON.
// If getting the data fails, it tells the browser and logs the reason for us.
// 502 means "the outside service failed". Our own failures use 500.
function jsonRoute<T>(
  getData: () => Promise<T>,
  errorMessage: string,
  failureStatus = 502,
): RequestHandler {
  return async (_request, response) => {
    try {
      response.json(await getData())
    } catch (error) {
      console.error(errorMessage, error)
      response.status(failureStatus).json({ error: errorMessage })
    }
  }
}

// Builds the Express app. The data getters and the quiz are passed in, so the app
// doesn't need to know about GeoNet, MetService, the caches or the database.
export function createApp(
  getQuakes: GetQuakes,
  getWarnings: GetWarnings,
  quiz: QuizService,
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

  // GET /api/quiz/question -> { question: ... }, or { question: null } when all are done.
  // The question never says which option is correct.
  app.get(
    '/api/quiz/question',
    jsonRoute(
      async () => ({ question: await quiz.getNextQuestion() }),
      'Could not get a quiz question right now',
      500,
    ),
  )

  // GET /api/quiz/profile -> the user's XP and level
  app.get('/api/quiz/profile', async (_request, response) => {
    try {
      const profile = await quiz.getProfile()
      if (!profile) {
        response.status(404).json({ error: 'No profile found' })
        return
      }
      response.json(profile)
    } catch (error) {
      console.error('Could not get the profile', error)
      response
        .status(500)
        .json({ error: 'Could not get your profile right now' })
    }
  })

  // POST /api/quiz/answer with { questionId, optionId } -> whether it was right, and the XP
  app.post('/api/quiz/answer', async (request, response) => {
    const answer = parseAnswerRequest(request.body)
    if (!answer) {
      response
        .status(400)
        .json({
          error: 'Send a questionId and an optionId, both whole numbers',
        })
      return
    }

    try {
      const result = await quiz.submitAnswer(answer.questionId, answer.optionId)
      if (!result) {
        response
          .status(404)
          .json({ error: 'That question or option does not exist' })
        return
      }
      response.json(result)
    } catch (error) {
      console.error('Could not save a quiz answer', error)
      response
        .status(500)
        .json({ error: 'Could not save your answer right now' })
    }
  })

  return app
}
