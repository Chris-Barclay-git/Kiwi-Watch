import type { QuizQuestion } from '../types/quiz'

// Asks our own server for the next quiz question.
// The access token proves who the user is. Gives null when there are no questions left.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchQuizQuestion(
  accessToken: string,
  fetchFunction: typeof fetch = fetch,
): Promise<QuizQuestion | null> {
  const response = await fetchFunction('/api/quiz/question', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  const body = (await response.json()) as { question: QuizQuestion | null }
  return body.question
}
