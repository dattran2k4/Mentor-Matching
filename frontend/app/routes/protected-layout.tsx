import { Navigate, Outlet, useLocation } from 'react-router'

import { Spinner } from '@/components/ui/spinner'
import { path } from '@/config/path'
import { useAuthStore } from '@/stores/auth-store'

export default function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const location = useLocation()

  if (!hasHydrated) {
    return (
      <div className='bg-base flex min-h-screen items-center justify-center'>
        <Spinner label='Đang xác thực phiên đăng nhập...' />
      </div>
    )
  }

  if (!accessToken) {
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`${path.login}?redirectTo=${redirectTo}`} replace />
  }

  return <Outlet />
}
