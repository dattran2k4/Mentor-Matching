import { Bell, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'

import { BrandLogo } from '@/components/BrandLogo'
import { buttonVariants } from '@/components/ui/button'
import { path } from '@/config/path'
import { useDashboardPath } from '@/hooks/useDashboardPath'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/utils/cn'

const Navbar = () => {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const accessToken = useAuthStore((state) => state.accessToken)
  const logout = useAuthStore((state) => state.logout)
  const dashboardPath = useDashboardPath()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors px-1 py-2 ${
      isActive ? 'text-primary' : 'text-slate-600 hover:text-primary-dark'
    }`

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  const navLinks = (
    <>
      <NavLink to='/' className={linkClass} onClick={() => setMobileOpen(false)}>
        {({ isActive }) => (
          <>
            Trang chủ
            {isActive && (
              <motion.div
                layoutId='underline'
                className='bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full'
              />
            )}
          </>
        )}
      </NavLink>
      <NavLink to={path.discover} className={linkClass} onClick={() => setMobileOpen(false)}>
        {({ isActive }) => (
          <>
            Tìm mentor
            {isActive && (
              <motion.div
                layoutId='underline'
                className='bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full'
              />
            )}
          </>
        )}
      </NavLink>
      {dashboardPath ? (
        <NavLink to={dashboardPath} className={linkClass} onClick={() => setMobileOpen(false)}>
          {({ isActive }) => (
            <>
              Bảng điều khiển
              {isActive && (
                <motion.div
                  layoutId='underline'
                  className='bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full'
                />
              )}
            </>
          )}
        </NavLink>
      ) : null}
    </>
  )

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel border-b border-white/20' : 'bg-transparent'}`}
    >
      <nav
        className={`page-container flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}
      >
        <div className='flex items-center gap-8'>
          <BrandLogo />
          <div className='hidden items-center gap-6 md:flex'>{navLinks}</div>
        </div>

        <div className='flex items-center gap-4'>
          <Link
            className={cn(
              buttonVariants({
                className: 'hidden rounded-full md:inline-flex',
                variant: 'outline'
              })
            )}
            to={path.becomeMentor}
          >
            Trở thành Mentor
          </Link>

          {accessToken ? (
            <>
              <button
                className={cn(
                  buttonVariants({
                    className: 'relative hidden rounded-full md:flex',
                    size: 'icon',
                    variant: 'outline'
                  })
                )}
                type='button'
              >
                <Bell size={18} />
                <span className='absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500' />
              </button>
              {dashboardPath ? (
                <Link
                  className={cn(
                    buttonVariants({
                      className: 'hidden rounded-full md:flex',
                      size: 'icon'
                    })
                  )}
                  to={dashboardPath}
                >
                  EM
                </Link>
              ) : null}
              <button
                className={cn(
                  buttonVariants({
                    className: 'hidden rounded-full md:inline-flex',
                    variant: 'outline'
                  }),
                  'hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                )}
                type='button'
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              className={cn(
                buttonVariants({
                  className: 'hidden rounded-full md:inline-flex',
                  size: 'lg'
                })
              )}
              to={path.login}
            >
              Đăng nhập
            </Link>
          )}

          <button
            className={cn(
              buttonVariants({
                className: 'rounded-full md:hidden',
                size: 'icon',
                variant: 'outline'
              })
            )}
            type='button'
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='border-t border-slate-200/50 bg-white/95 py-4 backdrop-blur-xl md:hidden'
          >
            <div className='page-container'>
              <div className='flex flex-col gap-2'>{navLinks}</div>
              <div className='mt-5 flex flex-col gap-3 border-t border-slate-200/50 pt-5'>
                <Link
                  className={cn(buttonVariants({ className: 'rounded-xl', variant: 'outline' }))}
                  to={path.becomeMentor}
                  onClick={() => setMobileOpen(false)}
                >
                  Trở thành Mentor
                </Link>
                {accessToken ? (
                  <button
                    className={cn(
                      buttonVariants({ className: 'rounded-xl', variant: 'outline' }),
                      'hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                    )}
                    type='button'
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                ) : (
                  <Link
                    className={cn(buttonVariants({ className: 'rounded-xl', size: 'lg' }))}
                    to={path.login}
                    onClick={() => setMobileOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
