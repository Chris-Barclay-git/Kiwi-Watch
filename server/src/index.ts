import { auth } from 'express-oauth2-jwt-bearer'
import { createApp } from './app'
import type { QuizService } from './app'
import { QUIZ_QUESTIONS } from './data/quizQuestions'
import { db } from './db/connection'
import { findOrCreateUser } from './db/findOrCreateUser'
import { getNextQuestion } from './db/getNextQuestion'
import { getProfile } from './db/getProfile'
import { setupDatabase } from './db/setupDatabase'
import { submitAnswer } from './db/submitAnswer'
import { createCache } from './lib/createCache'
import { createCachedGetter } from './lib/createCachedGetter'
import { fetchQuakes } from './lib/fetchQuakes'
import { fetchWarnings } from './lib/fetchWarnings'
import type { Quake } from './types/quake'
import type { Warning } from './types/warning'

const PORT = 3001
const ONE_MINUTE = 60_000
const FIVE_MINUTES = 5 * ONE_MINUTE

// Where logins come from, and which API the tokens are for. These are public values.
// When the app is deployed, they can be set with environment variables instead.
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? 'koanga-chris.au.auth0.com'
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE ?? 'https://kiwi-watch/api'

// Put the pieces together. Each one is: cache + outside service -> getter.
// Quakes can change any minute. Weather warnings change much less often.
const getQuakes = createCachedGetter(
  () => fetchQuakes(),
  createCache<Quake[]>(ONE_MINUTE),
)
const getWarnings = createCachedGetter(
  () => fetchWarnings(),
  createCache<Warning[]>(FIVE_MINUTES),
)

// Checks that a request comes with a valid login token for our API.
const requireLogin = auth({
  issuerBaseURL: `https://${AUTH0_DOMAIN}`,
  audience: AUTH0_AUDIENCE,
})

// Get the database ready first, then start listening for requests.
async function start() {
  await setupDatabase(db, QUIZ_QUESTIONS)
  console.log('Database ready')

  // The quiz works out which user is asking from their Auth0 id.
  // A user we haven't seen before is created the first time they play.
  const quiz: QuizService = {
    getNextQuestion: async (auth0Id) =>
      getNextQuestion(db, await findOrCreateUser(db, auth0Id)),
    submitAnswer: async (auth0Id, questionId, optionId) =>
      submitAnswer(
        db,
        await findOrCreateUser(db, auth0Id),
        questionId,
        optionId,
      ),
    getProfile: async (auth0Id) =>
      getProfile(db, await findOrCreateUser(db, auth0Id)),
  }

  const app = createApp(getQuakes, getWarnings, quiz, requireLogin)

  app.listen(PORT, () => {
    console.log(`Kiwi Watch server running at http://localhost:${PORT}`)
  })
}

start().catch((error) => {
  console.error('The server could not start:', error)
  process.exit(1)
})
