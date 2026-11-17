import { createApp } from './app'
import type { QuizService } from './app'
import { QUIZ_QUESTIONS } from './data/quizQuestions'
import { db } from './db/connection'
import { findOrCreateUser } from './db/findOrCreateUser'
import { getNextQuestion } from './db/getNextQuestion'
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

// Until login is added, everyone plays the quiz as this one test user.
const TEST_USER_AUTH0_ID = 'test-user'

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

// Get the database ready first, then start listening for requests.
async function start() {
  await setupDatabase(db, QUIZ_QUESTIONS)
  console.log('Database ready')

  const testUserId = await findOrCreateUser(db, TEST_USER_AUTH0_ID)
  const quiz: QuizService = {
    getNextQuestion: () => getNextQuestion(db, testUserId),
    submitAnswer: (questionId, optionId) =>
      submitAnswer(db, testUserId, questionId, optionId),
  }

  const app = createApp(getQuakes, getWarnings, quiz)

  app.listen(PORT, () => {
    console.log(`Kiwi Watch server running at http://localhost:${PORT}`)
  })
}

start().catch((error) => {
  console.error('The server could not start:', error)
  process.exit(1)
})
