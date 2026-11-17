import { useAuth0 } from '@auth0/auth0-react'
import { useLocation } from 'react-router'
import styles from './AuthButton.module.css'

// A "Log in" button, or the user's name with a "Log out" button once they're logged in.
export function AuthButton() {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } =
    useAuth0()

  // The page we're on, so we can come back to it after logging in.
  const { pathname } = useLocation()

  // Auth0 is still checking if we're logged in. Show nothing so the button doesn't flash.
  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className={styles.button}
        onClick={() => loginWithRedirect({ appState: { returnTo: pathname } })}
      >
        Log in
      </button>
    )
  }

  return (
    <div className={styles.loggedIn}>
      <span className={styles.name}>
        {user?.name ?? user?.email ?? 'Prepper'}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log out
      </button>
    </div>
  )
}
