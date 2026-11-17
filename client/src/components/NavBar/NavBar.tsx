import { useAuth0 } from '@auth0/auth0-react'
import { NavLink } from 'react-router'
import styles from './NavBar.module.css'

// Picks the link's style, highlighting the page we're on.
function linkClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}

// Links between pages. The Quiz link only shows once you're logged in.
export function NavBar() {
  const { isAuthenticated } = useAuth0()

  return (
    <nav className={styles.nav} aria-label="Main">
      <NavLink to="/" end className={linkClass}>
        Map
      </NavLink>

      <NavLink to="/go-bag" className={linkClass}>
        Go bag
      </NavLink>

      {isAuthenticated && (
        <NavLink to="/quiz" className={linkClass}>
          Quiz
        </NavLink>
      )}
    </nav>
  )
}
