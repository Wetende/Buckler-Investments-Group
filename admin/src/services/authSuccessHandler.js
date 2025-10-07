// Handles OAuth token fragments coming back from backend and optional enable-host redirect
import { setAuthTokens } from '@/api/axios'

export function handleAuthFragmentAndMaybeEnableHost() {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
  const params = new URLSearchParams(hash)
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  if (access_token) {
    setAuthTokens({ accessToken: access_token, refreshToken: refresh_token })
    // Clean the fragment
    const cleanUrl = window.location.origin + window.location.pathname + window.location.search
    window.history.replaceState(null, '', cleanUrl)
  }
  // If query has become_host=1, call enable-host then go to BnB dashboard
  const sp = new URLSearchParams(window.location.search)
  if (sp.get('become_host') === '1') {
    fetchEnableHost()
      .then(() => {
        window.location.href = '/dashboard/bnb-dashboard'
      })
      .catch(() => {
        // even if it fails, proceed to dashboard
        window.location.href = '/dashboard/bnb-dashboard'
      })
  }
}

async function fetchEnableHost() {
  // Use axiosPrivate to include tokens and refresh logic
  const { axiosPrivate } = await import('@/api/axios')
  await axiosPrivate.get('/auth/enable-host')
}
