import { useCallback, useState } from 'react'
import styles from './App.module.css'
import { Disclaimer } from './components/Disclaimer/Disclaimer'
import { NzMap } from './components/NzMap/NzMap'
import { QuakeList } from './components/QuakeList/QuakeList'
import { useQuakes } from './hooks/useQuakes'
import { useWarnings } from './hooks/useWarnings'

export default function App() {
  // The quakes from our server. This is "loading", "error", or "ready" with a list.
  const quakesState = useQuakes()

  // Until the quakes arrive, we work with an empty list.
  const quakes = quakesState.status === 'ready' ? quakesState.quakes : []

  // The weather warnings, loaded the same way.
  const warningsState = useWarnings()
  const warnings =
    warningsState.status === 'ready' ? warningsState.warnings : []

  // Which quake is selected. null means none yet.
  // It lives here so the map and the list can both use it.
  const [selectedQuakeId, setSelectedQuakeId] = useState<string | null>(null)

  // Look up the full quake from the selected id. "?? null" means none when nothing is selected.
  const selectedQuake =
    quakes.find((quake) => quake.id === selectedQuakeId) ?? null

  // Closing the popup means "select nothing". useCallback keeps the same function
  // between renders, so the popup's Escape-key listener isn't re-created every time.
  const clearSelection = useCallback(() => setSelectedQuakeId(null), [])

  const now = new Date()

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Kiwi Watch</h1>

      <div className={styles.layout}>
        <NzMap
          selectedQuake={selectedQuake}
          warnings={warnings}
          now={now}
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
              onSelectQuake={setSelectedQuakeId}
              now={now}
            />
          )}
        </section>
      </div>

      <Disclaimer />
    </main>
  )
}
