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
