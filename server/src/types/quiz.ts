// One answer choice, as the browser sees it. There is deliberately no "isCorrect" here:
// the right answer stays on the server.
export interface QuizOption {
  id: number
  text: string
}

// One question, as the browser sees it.
export interface QuizQuestion {
  id: number
  topic: string
  text: string
  options: QuizOption[]
}

// What the server tells the browser after an answer is submitted.
export interface AnswerResult {
  isCorrect: boolean
  correctOptionId: number
  explanation: string
  xpEarned: number // 0 if the answer was wrong, or the question was already answered correctly
  totalXp: number // the user's XP after this answer
}
