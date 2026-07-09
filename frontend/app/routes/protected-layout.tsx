import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { path } from '@/config/path'
import { useAuthStore } from '@/stores/auth-store'

export default function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!accessToken) {
      const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`)
      navigate(`${path.login}?redirectTo=${redirectTo}`, { replace: true })
    }
  }, [accessToken, location, navigate])

  if (!accessToken) {
    return null
  }

  return <Outlet />
}
