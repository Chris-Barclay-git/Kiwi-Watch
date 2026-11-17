export interface AnswerRequest {
  questionId: number
  optionId: number
}

// Checks the body of an answer request. We need a questionId and an optionId,
// both whole numbers. Anything else gives null, so a bad request can't cause trouble.
export function parseAnswerRequest(body: unknown): AnswerRequest | null {
  if (typeof body !== 'object' || body === null) {
    return null
  }

  const { questionId, optionId } = body as Record<string, unknown>

  if (typeof questionId !== 'number' || typeof optionId !== 'number') {
    return null
  }

  if (!Number.isInteger(questionId) || !Number.isInteger(optionId)) {
    return null
  }

  return { questionId, optionId }
}
