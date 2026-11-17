import { Route, Routes } from 'react-router'
import styles from './App.module.css'
import { AuthButton } from './components/AuthButton/AuthButton'
import { Disclaimer } from './components/Disclaimer/Disclaimer'
import { NavBar } from './components/NavBar/NavBar'
import { GetReadyPage } from './pages/GetReadyPage/GetReadyPage'
import { GoBagPage } from './pages/GoBagPage/GoBagPage'
import { MapPage } from './pages/MapPage/MapPage'
import { QuizPage } from './pages/QuizPage/QuizPage'

// The frame shared by every page (title, login button, links, disclaimer),
// with the current page shown in the middle.
export default function App() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Kiwi Watch</h1>

      <AuthButton />

      <NavBar />

      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/go-bag" element={<GoBagPage />} />
        <Route path="/get-ready" element={<GetReadyPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>

      <Disclaimer />
    </main>
  )
}
