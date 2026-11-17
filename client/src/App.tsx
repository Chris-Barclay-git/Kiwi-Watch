import { useCallback, useState } from 'react'
import styles from './App.module.css'
import { AuthButton } from './components/AuthButton/AuthButton'
import { Disclaimer } from './components/Disclaimer/Disclaimer'
import { NzMap } from './components/NzMap/NzMap'
import { QuakeList } from './components/QuakeList/QuakeList'
import { Quiz } from './components/Quiz/Quiz'
import { useQuakes } from './hooks/useQuakes'
import { useWarnings } from './hooks/useWarnings'
import type { Point } from './lib/projection'
import { warningsAtPoint } from './lib/warningsAtPoint'

export default function App() {
  // The quakes from our server. This is "loading", "error", or "ready" with a list.
  const quakesState = useQuakes()

  // Until the quakes arrive, we work with an empty list.
  const quakes = quakesState.status === 'ready' ? quakesState.quakes : []

  // The weather warnings, loaded the same way.
  const warningsState = useWarnings()
  const warnings =
    warningsState.status === 'ready' ? warningsState.warnings : []

  // What is selected: a quake (by id) or a spot on the map that was clicked. null means none.
  // They live here so the map and the list can both use them.
  const [selectedQuakeId, setSelectedQuakeId] = useState<string | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)

  // Look up the full quake from the selected id. "?? null" means none when nothing is selected.
  const selectedQuake =
    quakes.find((quake) => quake.id === selectedQuakeId) ?? null

  // Every warning covering the clicked spot, worst first.
  const warningsHere = selectedPoint
    ? warningsAtPoint(warnings, selectedPoint)
    : []

  // Only one card is open at a time, so picking one closes the other.
  function selectQuake(quakeId: string | null) {
    setSelectedQuakeId(quakeId)
    setSelectedPoint(null)
  }

  function selectPoint(point: Point) {
    setSelectedPoint(point)
    setSelectedQuakeId(null)
  }

  // Closing a card means "select nothing". useCallback keeps the same function
  // between renders, so the popups' Escape-key listeners aren't re-created every time.
  const clearSelection = useCallback(() => {
    setSelectedQuakeId(null)
    setSelectedPoint(null)
  }, [])

  const now = new Date()

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Kiwi Watch</h1>

      <AuthButton />

      <div className={styles.layout}>
        <NzMap
          selectedQuake={selectedQuake}
          warnings={warnings}
          selectedWarnings={warningsHere}
          now={now}
          onSelectPoint={selectPoint}
          onClosePopup={clearSelection}
        />

        <section
          className={styles.panel}
          aria-labelledby="recent-quakes-heading"
        >
          <h2 id="recent-quakes-heading" className={styles.panelTitle}>
            Recent quakes
          </h2>

          {quakesState.status === 'ready' && (
            <p className={styles.updated}>
              Updated{' '}
              {quakesState.updatedAt.toLocaleTimeString('en-NZ', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          )}

          {quakesState.status === 'loading' && (
            <p className={styles.message}>Loading quakes…</p>
          )}

          {quakesState.status === 'error' && (
            <p className={styles.message}>
              Sorry, we couldn't load the quakes. Try refreshing the page.
            </p>
          )}

          {quakesState.status === 'ready' && (
            <QuakeList
              quakes={quakes}
              selectedQuakeId={selectedQuakeId}
              onSelectQuake={selectQuake}
              now={now}
            />
          )}
        </section>
      </div>

      <Quiz />

      <Disclaimer />
    </main>
  )
}
