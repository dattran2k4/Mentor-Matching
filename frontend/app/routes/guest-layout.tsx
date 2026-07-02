import { Navigate, Outlet, useSearchParams } from 'react-router'

import { Spinner } from '@/components/ui/spinner'
import { path } from '@/config/path'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useAuthStore } from '@/stores/auth-store'
import { getDashboardPath } from '@/utils/get-dashboard-path'

export default function GuestLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const [searchParams] = useSearchParams()
  const { data: user, isLoading } = useCurrentUserQuery()

  if (!hasHydrated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner label='Đang xác thực phiên đăng nhập...' />
      </div>
    )
  }

  if (accessToken) {
    const redirectTo = searchParams.get('redirectTo')
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    if (isLoading) {
      return (
        <div className='flex min-h-[40vh] items-center justify-center'>
          <Spinner label='Đang chuyển hướng...' />
        </div>
      )
    }

    if (user) {
      return <Navigate to={getDashboardPath(user.roles)} replace />
    }

    return <Navigate to={path.discover} replace />
  }

  return <Outlet />
}
