import type { QuizQuestion } from '../types/quiz'

// Asks our own server for the next quiz question.
// Gives null when there are no questions left to answer.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchQuizQuestion(
  fetchFunction: typeof fetch = fetch,
): Promise<QuizQuestion | null> {
  const response = await fetchFunction('/api/quiz/question')

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  const body = (await response.json()) as { question: QuizQuestion | null }
  return body.question
}
