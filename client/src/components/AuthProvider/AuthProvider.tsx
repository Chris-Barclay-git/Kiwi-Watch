import { Auth0Provider } from '@auth0/auth0-react'
import type { AppState } from '@auth0/auth0-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

// Auth0 handles logging in and out. The values come from client/.env.local.
// The audience says which API the login token is for (our own server).
// Keeping the login in local storage means a page refresh doesn't log you out.
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  // After logging in, Auth0 sends us back here. We then go to the page
  // the user was on when they pressed "Log in" (or the home page if unknown).
  function handleRedirect(appState?: AppState) {
    navigate(appState?.returnTo ?? '/', { replace: true })
  }

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
      onRedirectCallback={handleRedirect}
    >
      {children}
    </Auth0Provider>
  )
}
