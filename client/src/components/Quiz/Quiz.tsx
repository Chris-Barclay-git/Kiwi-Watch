import { useQuiz } from '../../hooks/useQuiz'
import type { QuizState } from '../../hooks/useQuiz'
import type { AnswerResult } from '../../types/quiz'
import styles from './Quiz.module.css'

// Which look an option button gets, depending on where the quiz is up to.
function optionClass(state: QuizState, optionId: number): string {
  if (state.status === 'checking' && optionId === state.chosenOptionId) {
    return `${styles.option} ${styles.chosen}`
  }

  if (state.status === 'answered') {
    if (optionId === state.result.correctOptionId) {
      return `${styles.option} ${styles.correct}`
    }
    if (optionId === state.chosenOptionId) {
      return `${styles.option} ${styles.wrong}`
    }
    return `${styles.option} ${styles.dimmed}`
  }

  return styles.option
}

// The short line shown after an answer.
function verdictText(result: AnswerResult): string {
  if (!result.isCorrect) {
    return 'Not quite.'
  }
  if (result.xpEarned > 0) {
    return `Correct! +${result.xpEarned} XP`
  }
  return 'Correct! (No XP this time, you already got this one.)'
}

export function Quiz() {
  const { state, profile, chooseOption, nextQuestion } = useQuiz()

  return (
    <section className={styles.quiz} aria-labelledby="quiz-heading">
      <div className={styles.header}>
        <h2 id="quiz-heading" className={styles.title}>
          Prepper quiz
        </h2>
        {profile && <span className={styles.level}>Level {profile.level}</span>}
      </div>

      {profile && (
        <div className={styles.progressBlock}>
          <progress
            className={styles.progress}
            value={profile.xpIntoLevel}
            max={profile.xpPerLevel}
            aria-label={`Progress to level ${profile.level + 1}`}
          />
          <p className={styles.progressText}>
            {profile.xpIntoLevel} / {profile.xpPerLevel} XP to level{' '}
            {profile.level + 1}
          </p>
        </div>
      )}

      {state.status === 'loading' && (
        <p className={styles.message}>Loading a question…</p>
      )}

      {state.status === 'error' && (
        <>
          <p className={styles.message}>Sorry, the quiz ran into a problem.</p>
          <button
            type="button"
            className={styles.next}
            onClick={() => nextQuestion()}
          >
            Try again
          </button>
        </>
      )}

      {state.status === 'finished' && (
        <p className={styles.message}>
          You've got every question right. More are coming soon!
        </p>
      )}

      {(state.status === 'asking' ||
        state.status === 'checking' ||
        state.status === 'answered') && (
        <>
          <p className={styles.topic}>{state.question.topic}</p>
          <h3 className={styles.question}>{state.question.text}</h3>

          <ul className={styles.options}>
            {state.question.options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={optionClass(state, option.id)}
                  disabled={state.status !== 'asking'}
                  onClick={() => chooseOption(option.id)}
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>

          {/* Read out by screen readers when the answer arrives. */}
          <div aria-live="polite">
            {state.status === 'answered' && (
              <div className={styles.feedback}>
                <p className={styles.verdict}>{verdictText(state.result)}</p>
                <p className={styles.explanation}>{state.result.explanation}</p>
                <button
                  type="button"
                  className={styles.next}
                  onClick={() => nextQuestion()}
                >
                  Next question
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}
