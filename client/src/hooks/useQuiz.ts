import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { fetchProfile } from '../lib/fetchProfile'
import { fetchQuizQuestion } from '../lib/fetchQuizQuestion'
import { submitQuizAnswer } from '../lib/submitQuizAnswer'
import type { Profile } from '../types/profile'
import type { AnswerResult, QuizQuestion } from '../types/quiz'

// Where the quiz is up to. Each state carries what the screen needs to show it.
export type QuizState =
  | { status: 'loading' } // fetching a question
  | { status: 'loggedOut' } // the quiz is only for logged-in users
  | { status: 'error' } // something went wrong
  | { status: 'finished' } // every question has been answered correctly
  | { status: 'asking'; question: QuizQuestion } // waiting for the user to pick
  | { status: 'checking'; question: QuizQuestion; chosenOptionId: number } // answer sent, waiting for the server
  | {
      status: 'answered' // the server has marked it
      question: QuizQuestion
      chosenOptionId: number
      result: AnswerResult
    }

// A question means we ask it. No question means there are none left.
function stateForQuestion(question: QuizQuestion | null): QuizState {
  return question ? { status: 'asking', question } : { status: 'finished' }
}

// Gets the user's login token from Auth0. If Auth0 gives us nothing, that is an error.
async function requireToken(
  getToken: () => Promise<string | undefined>,
): Promise<string> {
  const accessToken = await getToken()
  if (!accessToken) {
    throw new Error('Could not get a login token')
  }
  return accessToken
}

export function useQuiz() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [state, setState] = useState<QuizState>({ status: 'loading' })

  // The user's XP and level. null until it has loaded.
  const [profile, setProfile] = useState<Profile | null>(null)

  // Once we know the user is logged in, get their first question and their profile.
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let cancelled = false

    requireToken(getAccessTokenSilently)
      .then((accessToken) => fetchQuizQuestion(accessToken))
      .then((question) => {
        if (!cancelled) setState(stateForQuestion(question))
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    // The quiz works without the profile, so if this fails we just don't show the level.
    requireToken(getAccessTokenSilently)
      .then((accessToken) => fetchProfile(accessToken))
      .then((loadedProfile) => {
        if (!cancelled) setProfile(loadedProfile)
      })
      .catch(() => {})

    // If the quiz disappears before the answers arrive, ignore them.
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, getAccessTokenSilently])

  // The user picked an option. Send it to the server and show what it says.
  async function chooseOption(optionId: number) {
    if (state.status !== 'asking') {
      return
    }

    const { question } = state
    setState({ status: 'checking', question, chosenOptionId: optionId })

    try {
      const accessToken = await requireToken(getAccessTokenSilently)
      const result = await submitQuizAnswer(accessToken, question.id, optionId)
      setState({
        status: 'answered',
        question,
        chosenOptionId: optionId,
        result,
      })

      // Update the level and progress bar. If this fails we keep the old ones.
      fetchProfile(accessToken)
        .then(setProfile)
        .catch(() => {})
    } catch {
      setState({ status: 'error' })
    }
  }

  // Move on to the next question (also used by "try again" after an error).
  async function nextQuestion() {
    setState({ status: 'loading' })

    try {
      const accessToken = await requireToken(getAccessTokenSilently)
      setState(stateForQuestion(await fetchQuizQuestion(accessToken)))
    } catch {
      setState({ status: 'error' })
    }
  }

  // Once Auth0 has finished checking, a logged-out visitor sees the "log in" message,
  // whatever the quiz state was before.
  const isLoggedOut = !isLoading && !isAuthenticated
  const visibleState: QuizState = isLoggedOut ? { status: 'loggedOut' } : state

  return {
    state: visibleState,
    profile: isAuthenticated ? profile : null,
    chooseOption,
    nextQuestion,
  }
}
