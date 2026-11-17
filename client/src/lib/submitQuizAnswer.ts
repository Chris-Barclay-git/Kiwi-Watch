import type { AnswerResult } from '../types/quiz'

// Sends the user's chosen option to our server, which marks it.
// The access token proves who the user is.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function submitQuizAnswer(
  accessToken: string,
  questionId: number,
  optionId: number,
  fetchFunction: typeof fetch = fetch,
): Promise<AnswerResult> {
  const response = await fetchFunction('/api/quiz/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ questionId, optionId }),
  })

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  return (await response.json()) as AnswerResult
}
