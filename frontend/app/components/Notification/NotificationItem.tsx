import { CheckCircle2, Trash2 } from 'lucide-react'

import { NotificationStatus, type Notification } from '@/types/models/notification'
import { cn } from '@/utils/cn'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const isUnread = notification.status === NotificationStatus.UNREAD

  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(notification.createdDate))

  return (
    <div
      className={cn(
        'relative flex gap-3 rounded-lg border border-transparent p-4 transition-colors',
        isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'bg-white hover:bg-slate-50'
      )}
    >
      <div className='mt-1 flex-shrink-0'>
        {isUnread ? (
          <div className='bg-primary h-2.5 w-2.5 rounded-full' />
        ) : (
          <div className='h-2.5 w-2.5 rounded-full bg-slate-300' />
        )}
      </div>

      <div className='flex-1 space-y-1'>
        <p className={cn('text-sm font-medium', isUnread ? 'text-primary' : 'text-slate-800')}>
          {notification.title}
        </p>
        <p className='text-sm text-slate-500 line-clamp-2'>{notification.content}</p>
        <p className='text-xs text-slate-400'>{formattedDate}</p>
      </div>

      <div className='flex flex-col gap-2'>
        {isUnread && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className='text-slate-400 transition-colors hover:text-green-600'
            title='Đánh dấu đã đọc'
          >
            <CheckCircle2 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(notification.id)}
            className='text-slate-400 transition-colors hover:text-red-600'
            title='Xóa thông báo'
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
