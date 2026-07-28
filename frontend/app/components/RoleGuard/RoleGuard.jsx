import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Spinner } from '@/components/ui/spinner'
import { path } from '@/config/path'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useAuthStore } from '@/stores/auth-store'
function RoleGuard({ role, children }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const location = useLocation()
  const navigate = useNavigate()
  const { data: user, isLoading, isError } = useCurrentUserQuery()
  useEffect(() => {
    if (!hasHydrated) return
    if (!accessToken) {
      const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`)
      navigate(`${path.login}?redirectTo=${redirectTo}`, { replace: true })
    } else if (!isLoading && (isError || !user?.roles.includes(role))) {
      navigate(path.forbidden, { replace: true })
    }
  }, [hasHydrated, accessToken, isLoading, isError, user, role, location, navigate])
  if (!hasHydrated) {
    return (
      <div className='bg-base flex min-h-screen items-center justify-center'>
        <Spinner label='Đang xác thực phiên đăng nhập...' />
      </div>
    )
  }
  if (!accessToken) return null
  if (isLoading) {
    return (
      <div className='bg-base flex min-h-screen items-center justify-center'>
        <Spinner label='Đang tải thông tin tài khoản...' />
      </div>
    )
  }
  if (isError || !user?.roles.includes(role)) {
    return null
  }
  return children ?? <Outlet />
}
export { RoleGuard }
