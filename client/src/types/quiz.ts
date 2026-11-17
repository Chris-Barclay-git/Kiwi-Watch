// One answer choice. There is no "correct" flag: the server keeps that to itself.
export interface QuizOption {
  id: number
  text: string
}

// One quiz question, as the server sends it.
export interface QuizQuestion {
  id: number
  topic: string
  text: string
  options: QuizOption[]
}

// What the server says after an answer is sent.
export interface AnswerResult {
  isCorrect: boolean
  correctOptionId: number
  explanation: string
  xpEarned: number // 0 if wrong, or if the question was already answered correctly
  totalXp: number // the user's XP after this answer
}
