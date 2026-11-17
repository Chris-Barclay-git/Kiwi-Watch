import { useEffect, useState } from 'react'
import { fetchQuizQuestion } from '../lib/fetchQuizQuestion'
import { submitQuizAnswer } from '../lib/submitQuizAnswer'
import type { AnswerResult, QuizQuestion } from '../types/quiz'

// Where the quiz is up to. Each state carries what the screen needs to show it.
export type QuizState =
  | { status: 'loading' } // fetching a question
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

export function useQuiz() {
  const [state, setState] = useState<QuizState>({ status: 'loading' })

  // The user's total XP after their latest answer. null until they answer something.
  const [totalXp, setTotalXp] = useState<number | null>(null)

  // Get the first question when the quiz appears.
  useEffect(() => {
    let cancelled = false

    fetchQuizQuestion()
      .then((question) => {
        if (!cancelled) setState(stateForQuestion(question))
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    // If the quiz disappears before the answer arrives, ignore the answer.
    return () => {
      cancelled = true
    }
  }, [])

  // The user picked an option. Send it to the server and show what it says.
  async function chooseOption(optionId: number) {
    if (state.status !== 'asking') {
      return
    }

    const { question } = state
    setState({ status: 'checking', question, chosenOptionId: optionId })

    try {
      const result = await submitQuizAnswer(question.id, optionId)
      setTotalXp(result.totalXp)
      setState({
        status: 'answered',
        question,
        chosenOptionId: optionId,
        result,
      })
    } catch {
      setState({ status: 'error' })
    }
  }

  // Move on to the next question (also used by "try again" after an error).
  async function nextQuestion() {
    setState({ status: 'loading' })

    try {
      setState(stateForQuestion(await fetchQuizQuestion()))
    } catch {
      setState({ status: 'error' })
    }
  }

  return { state, totalXp, chooseOption, nextQuestion }
}
