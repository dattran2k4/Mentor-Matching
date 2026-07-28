import { AnimatePresence, motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { NotificationItem } from './NotificationItem'
import { useMarkAsReadMutation } from '@/hooks/queries/notifications/useMarkAsReadMutation'
import { useNotificationsQuery } from '@/hooks/queries/notifications/useNotificationsQuery'
import { useUnreadCountQuery } from '@/hooks/queries/notifications/useUnreadCountQuery'
import { useNotificationWebsocket } from '@/hooks/useNotificationWebsocket'
import { cn } from '@/utils/cn'
function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  useNotificationWebsocket()
  const { data: unreadCountData } = useUnreadCountQuery()
  const unreadCount = typeof unreadCountData === 'number' ? unreadCountData : 0
  const { data: notificationsData, isLoading } = useNotificationsQuery({ page: 1, size: 5 })
  const notifications = notificationsData?.data || []
  const markAsReadMutation = useMarkAsReadMutation()
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id)
  }
  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
          isOpen
            ? 'text-primary bg-slate-100'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        )}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className='absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='absolute top-12 right-0 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:w-96'
          >
            <div className='flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3'>
              <h3 className='font-semibold text-slate-800'>Thông báo</h3>
            </div>

            <div className='flex max-h-[400px] flex-col overflow-y-auto p-2'>
              {isLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent' />
                </div>
              ) : notifications.length > 0 ? (
                <div className='flex flex-col gap-1'>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-8 text-center'>
                  <Bell className='mb-2 text-slate-300' size={32} />
                  <p className='text-sm text-slate-500'>Bạn không có thông báo nào</p>
                </div>
              )}
            </div>

            <div className='border-t border-slate-100 p-2'>
              <Link
                to='/notifications'
                onClick={() => setIsOpen(false)}
                className='text-primary block rounded-lg py-2 text-center text-sm font-medium hover:bg-slate-50'
              >
                Xem tất cả thông báo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export { NotificationBell }
