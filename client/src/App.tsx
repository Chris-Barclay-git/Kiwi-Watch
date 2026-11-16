import styles from './App.module.css'
import { NzMap } from './components/NzMap/NzMap'

export default function App() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Kiwi Watch</h1>
      <NzMap />
    </main>
  )
}
