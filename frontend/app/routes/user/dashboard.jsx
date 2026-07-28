import { Link } from 'react-router'
import {
  ArrowRight,
  Bell,
  BookMarked,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  ReceiptText,
  Sparkles,
  UserRound,
  Wallet
} from 'lucide-react'
import { useMemo } from 'react'
import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { WorkspaceNotice } from '@/components/WorkspaceNotice'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { path } from '@/config/path'
import { BOOKING_STATUS_CONFIG } from '@/constants/booking-status'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useCurrentUserBookingsQuery } from '@/hooks/queries/booking/useCurrentUserBookingsQuery'
import { useCurrentLearnerProfileQuery } from '@/hooks/queries/user/useCurrentLearnerProfileQuery'
import { cn } from '@/utils/cn'
import { formatPrice, formatShortBookingDate, formatTimeRange } from '@/utils/format'
function toBookingStartDate(booking) {
  const parsedDate = /* @__PURE__ */ new Date(`${booking.bookingDate}T${booking.startTime}`)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}
function compareUpcomingBookings(left, right) {
  return (
    (toBookingStartDate(left)?.getTime() ?? Number.MAX_SAFE_INTEGER) -
      (toBookingStartDate(right)?.getTime() ?? Number.MAX_SAFE_INTEGER) ||
    left.bookingDate.localeCompare(right.bookingDate) ||
    left.startTime.localeCompare(right.startTime)
  )
}
function compareRecentBookings(left, right) {
  return (
    (right.createdAt ?? '').localeCompare(left.createdAt ?? '') ||
    right.bookingDate.localeCompare(left.bookingDate) ||
    right.startTime.localeCompare(left.startTime)
  )
}
function needsPayment(booking) {
  return booking.status === 'PENDING'
}
function getPaymentCueLabel(booking) {
  if (!needsPayment(booking)) return null
  return 'C\u1EA7n thanh to\xE1n'
}
function getBookingSummary(booking) {
  if (booking.note?.trim()) return booking.note.trim()
  if (booking.cancelReason?.trim()) return `L\xFD do h\u1EE7y: ${booking.cancelReason.trim()}`
  if (booking.meetingType === 'ONLINE') {
    return needsPayment(booking)
      ? 'Booking n\xE0y \u0111ang ch\u1EDD b\u1EA1n thanh to\xE1n \u0111\u1EC3 gi\u1EEF ch\u1ED7 v\u1EDBi mentor.'
      : 'Chi ti\u1EBFt bu\u1ED5i h\u1ECDc online s\u1EBD hi\u1EC3n th\u1ECB \u0111\u1EA7y \u0111\u1EE7 trong m\u1EE5c l\u1ECBch h\u1ECDc.'
  }
  return (
    booking.meetingAddress?.trim() ||
    'Chi ti\u1EBFt bu\u1ED5i h\u1ECDc s\u1EBD hi\u1EC3n th\u1ECB \u0111\u1EA7y \u0111\u1EE7 trong m\u1EE5c l\u1ECBch h\u1ECDc.'
  )
}
function DashboardSkeleton() {
  return (
    <div className='space-y-8 lg:space-y-10'>
      <div className={topGridClass}>
        <WorkspacePanel title='Buổi học sắp tới'>
          <div className='animate-pulse space-y-4'>
            <div className='h-9 w-32 rounded-xl bg-slate-100' />
            <div className='h-[380px] rounded-[28px] bg-slate-100' />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title='Tóm tắt tuần này'>
          <div className='animate-pulse space-y-4'>
            <div className='h-24 rounded-[24px] bg-slate-100' />
            <div className='h-24 rounded-[24px] bg-slate-100' />
            <div className='h-24 rounded-[24px] bg-slate-100' />
          </div>
        </WorkspacePanel>
      </div>

      <WorkspacePanel title='Gần đây'>
        <div className='animate-pulse space-y-3'>
          <div className='h-12 rounded-2xl bg-slate-100' />
          <div className='h-16 rounded-2xl bg-slate-100' />
          <div className='h-16 rounded-2xl bg-slate-100' />
          <div className='h-16 rounded-2xl bg-slate-100' />
        </div>
      </WorkspacePanel>

      <WorkspacePanel title='Hành động nhanh'>
        <div className='grid gap-4 md:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className='h-32 animate-pulse rounded-[24px] bg-slate-100' key={index} />
          ))}
        </div>
      </WorkspacePanel>

      <div className='h-24 animate-pulse rounded-[28px] bg-slate-100' />
    </div>
  )
}
function meta() {
  return [{ title: 'T\u1ED5ng quan | H\u1ECDc vi\xEAn' }]
}
const topGridClass = 'grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_320px] xl:items-start'
function BookingFact({ accent = 'default', icon: Icon, label, value }) {
  return (
    <div
      className={cn(
        'rounded-[20px] border p-4',
        accent === 'warning' ? 'border-amber-200 bg-amber-50/70' : 'border-slate-200 bg-white'
      )}
    >
      <div className='mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500'>
        <Icon aria-hidden='true' size={16} />
      </div>
      <p className='text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase'>
        {label}
      </p>
      <p className='text-ink mt-1 text-base font-semibold'>{value}</p>
    </div>
  )
}
function SummaryStatCard({ helper, icon: Icon, label, tone, value }) {
  return (
    <Card className='rounded-[24px] border-slate-200 shadow-none'>
      <CardContent className='flex items-start gap-4 p-5'>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
            tone === 'warning'
              ? 'bg-amber-50 text-amber-700'
              : tone === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-700'
          )}
        >
          <Icon aria-hidden='true' size={18} />
        </div>
        <div className='space-y-1'>
          <p className='text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase'>
            {label}
          </p>
          <p className='text-ink text-4xl leading-none font-semibold'>{value}</p>
          <p className='text-muted text-sm leading-relaxed'>{helper}</p>
        </div>
      </CardContent>
    </Card>
  )
}
function QuickActionCard({ description, href, icon: Icon, title }) {
  return (
    <Link
      className='group flex h-full items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm'
      to={href}
    >
      <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'>
        <Icon aria-hidden='true' size={20} />
      </div>
      <div className='min-w-0 flex-1 space-y-1.5'>
        <div className='flex items-start justify-between gap-3'>
          <p className='text-ink text-lg font-semibold'>{title}</p>
          <ChevronRight
            aria-hidden='true'
            className='mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700'
            size={18}
          />
        </div>
        <p className='text-muted text-sm leading-relaxed'>{description}</p>
      </div>
    </Link>
  )
}
function UserDashboardPage() {
  const currentUserQuery = useCurrentUserQuery()
  const learnerProfileQuery = useCurrentLearnerProfileQuery()
  const bookingsQuery = useCurrentUserBookingsQuery()
  const bookings = useMemo(() => bookingsQuery.data?.data ?? [], [bookingsQuery.data?.data])
  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((booking) => {
          if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') return false
          return Boolean(toBookingStartDate(booking))
        })
        .sort(compareUpcomingBookings),
    [bookings]
  )
  const nextBooking = upcomingBookings[0] ?? null
  const paymentDueBookings = useMemo(() => bookings.filter(needsPayment), [bookings])
  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === 'COMPLETED'),
    [bookings]
  )
  const recentBookings = useMemo(
    () => bookings.slice().sort(compareRecentBookings).slice(0, 4),
    [bookings]
  )
  const learnerProfile = learnerProfileQuery.data
  const isLearnerProfileIncomplete = Boolean(
    !learnerProfile ||
    !learnerProfile.gradeId ||
    !learnerProfile.schoolName?.trim() ||
    !learnerProfile.learningGoal?.trim()
  )
  const quickActions = useMemo(
    () => [
      {
        title: 'T\xECm mentor ph\xF9 h\u1EE3p',
        description:
          'Kh\xE1m ph\xE1 th\xEAm m\xF4n h\u1ECDc, l\u1EDBp v\xE0 l\u1ECBch ph\xF9 h\u1EE3p v\u1EDBi m\u1EE5c ti\xEAu hi\u1EC7n t\u1EA1i.',
        href: path.discover,
        icon: BookMarked
      },
      {
        title: 'L\u1ECBch s\u1EED thanh to\xE1n',
        description:
          paymentDueBookings.length > 0
            ? `${paymentDueBookings.length} kho\u1EA3n h\u1ECDc ph\xED \u0111ang ch\u1EDD b\u1EA1n ho\xE0n t\u1EA5t.`
            : 'Xem l\u1EA1i t\xECnh tr\u1EA1ng thanh to\xE1n v\xE0 c\xE1c kho\u1EA3n h\u1ECDc ph\xED g\u1EA7n \u0111\xE2y.',
        href: path.user.payments,
        icon: Wallet
      },
      {
        title: 'Qu\u1EA3n l\xFD l\u1ECBch h\u1ECDc',
        description:
          'Theo d\xF5i c\xE1c bu\u1ED5i \u0111\xE3 \u0111\u1EB7t, kho\u1EA3n c\u1EA7n thanh to\xE1n v\xE0 l\u1ECBch s\u1EED h\u1ECDc g\u1EA7n \u0111\xE2y.',
        href: path.user.bookings,
        icon: Calendar
      },
      {
        title: isLearnerProfileIncomplete
          ? 'Ho\xE0n thi\u1EC7n h\u1ED3 s\u01A1'
          : 'C\u1EADp nh\u1EADt h\u1ED3 s\u01A1',
        description: learnerProfileQuery.isError
          ? 'M\u1EDF h\u1ED3 s\u01A1 \u0111\u1EC3 ki\u1EC3m tra v\xE0 c\u1EADp nh\u1EADt l\u1EA1i th\xF4ng tin h\u1ECDc t\u1EADp.'
          : isLearnerProfileIncomplete
            ? 'B\u1ED5 sung l\u1EDBp h\u1ECDc, tr\u01B0\u1EDDng v\xE0 m\u1EE5c ti\xEAu \u0111\u1EC3 mentor hi\u1EC3u r\xF5 nhu c\u1EA7u c\u1EE7a b\u1EA1n.'
            : '\u0110i\u1EC1u ch\u1EC9nh m\u1EE5c ti\xEAu h\u1ECDc t\u1EADp v\xE0 th\xF4ng tin c\xE1 nh\xE2n khi k\u1EBF ho\u1EA1ch h\u1ECDc thay \u0111\u1ED5i.',
        href: path.user.profile,
        icon: UserRound
      }
    ],
    [isLearnerProfileIncomplete, learnerProfileQuery.isError, paymentDueBookings.length]
  )
  const summaryItems = useMemo(
    () => [
      {
        label: 'Bu\u1ED5i h\u1ECDc s\u1EAFp t\u1EDBi',
        value: `${upcomingBookings.length}`,
        helper:
          upcomingBookings.length > 0
            ? 'B\u1EA1n \u0111\xE3 c\xF3 l\u1ECBch h\u1ECDc s\u1EAFp t\u1EDBi'
            : 'Ch\u01B0a c\xF3 l\u1ECBch h\u1ECDc m\u1EDBi',
        icon: Calendar,
        tone: upcomingBookings.length > 0 ? 'info' : 'neutral'
      },
      {
        label: 'C\u1EA7n thanh to\xE1n',
        value: `${paymentDueBookings.length}`,
        helper:
          paymentDueBookings.length > 0
            ? '\u0110i t\u1EDBi m\u1EE5c l\u1ECBch h\u1ECDc \u0111\u1EC3 ti\u1EBFp t\u1EE5c'
            : 'Hi\u1EC7n ch\u01B0a c\xF3 kho\u1EA3n c\u1EA7n thanh to\xE1n',
        icon: Clock3,
        tone: paymentDueBookings.length > 0 ? 'warning' : 'neutral'
      },
      {
        label: 'Bu\u1ED5i \u0111\xE3 ho\xE0n th\xE0nh',
        value: `${completedBookings.length}`,
        helper:
          completedBookings.length > 0
            ? 'B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh m\u1ED9t s\u1ED1 bu\u1ED5i h\u1ECDc'
            : 'Ch\u01B0a c\xF3 bu\u1ED5i ho\xE0n th\xE0nh n\xE0o',
        icon: CheckCircle2,
        tone: completedBookings.length > 0 ? 'success' : 'neutral'
      }
    ],
    [completedBookings.length, paymentDueBookings.length, upcomingBookings.length]
  )
  const notice = useMemo(() => {
    if (paymentDueBookings.length > 0) {
      return {
        title: 'Th\xF4ng b\xE1o h\u1EC7 th\u1ED1ng',
        description: `B\u1EA1n \u0111ang c\xF3 ${paymentDueBookings.length} booking ch\u1EDD thanh to\xE1n. H\xE3y v\xE0o l\u1ECBch h\u1ECDc \u0111\u1EC3 gi\u1EEF ch\u1ED7 v\u1EDBi mentor \u0111\xFAng h\u1EA1n.`,
        icon: Bell,
        tone: 'warning'
      }
    }
    if (learnerProfileQuery.isError) {
      return {
        title: 'Th\xF4ng b\xE1o h\u1EC7 th\u1ED1ng',
        description:
          'M\u1ED9t ph\u1EA7n th\xF4ng tin h\u1ECDc t\u1EADp hi\u1EC7n ch\u01B0a hi\u1EC3n th\u1ECB \u0111\u1EA7y \u0111\u1EE7. B\u1EA1n c\xF3 th\u1EC3 m\u1EDF h\u1ED3 s\u01A1 \u0111\u1EC3 ki\u1EC3m tra l\u1EA1i.',
        icon: UserRound,
        tone: 'neutral'
      }
    }
    if (isLearnerProfileIncomplete) {
      return {
        title: 'Th\xF4ng b\xE1o h\u1EC7 th\u1ED1ng',
        description:
          'Ho\xE0n thi\u1EC7n h\u1ED3 s\u01A1 h\u1ECDc t\u1EADp s\u1EBD gi\xFAp mentor hi\u1EC3u r\xF5 nhu c\u1EA7u c\u1EE7a b\u1EA1n h\u01A1n khi nh\u1EADn booking m\u1EDBi.',
        icon: UserRound,
        tone: 'info'
      }
    }
    if (bookings.length === 0) {
      return {
        title: 'Th\xF4ng b\xE1o h\u1EC7 th\u1ED1ng',
        description:
          'B\u1EA1n ch\u01B0a c\xF3 booking n\xE0o. H\xE3y b\u1EAFt \u0111\u1EA7u t\u1EEB trang kh\xE1m ph\xE1 \u0111\u1EC3 t\xECm mentor ph\xF9 h\u1EE3p.',
        icon: Sparkles,
        tone: 'info'
      }
    }
    return {
      title: 'Th\xF4ng b\xE1o h\u1EC7 th\u1ED1ng',
      description:
        'M\u1ECDi th\xF4ng tin quan tr\u1ECDng v\u1EC1 l\u1ECBch h\u1ECDc v\xE0 thanh to\xE1n s\u1EBD \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt t\u1EA1i \u0111\xE2y.',
      icon: Bell,
      tone: 'info'
    }
  }, [
    bookings.length,
    isLearnerProfileIncomplete,
    learnerProfileQuery.isError,
    paymentDueBookings.length
  ])
  const isLoading =
    (currentUserQuery.isLoading && !currentUserQuery.data) ||
    (bookingsQuery.isLoading && !bookingsQuery.data)
  if (isLoading) {
    return (
      <DashboardPage title='Tổng quan'>
        <DashboardSkeleton />
      </DashboardPage>
    )
  }
  if (currentUserQuery.isError || bookingsQuery.isError || !currentUserQuery.data) {
    return (
      <DashboardPage title='Tổng quan'>
        <ScreenErrorState
          description='Không thể tải trang tổng quan lúc này. Vui lòng thử lại sau ít phút.'
          onRetry={() => {
            void currentUserQuery.refetch()
            void bookingsQuery.refetch()
            void learnerProfileQuery.refetch()
          }}
          retryLabel='Tải lại'
          title='Chưa tải được tổng quan'
        />
      </DashboardPage>
    )
  }
  const nextBookingStatusLabel =
    nextBooking && needsPayment(nextBooking)
      ? BOOKING_STATUS_CONFIG.PENDING.label
      : nextBooking?.status === 'CONFIRMED'
        ? BOOKING_STATUS_CONFIG.CONFIRMED.label
        : 'C\u1EADp nh\u1EADt l\u1ECBch h\u1ECDc'
  return (
    <DashboardPage title='Tổng quan'>
      <div className='space-y-8 lg:space-y-10'>
        <div className={topGridClass}>
          <WorkspacePanel
            className='overflow-hidden'
            contentClassName='space-y-4'
            title='Buổi học sắp tới'
            description='Ưu tiên xem buổi gần nhất để chuẩn bị và biết ngay khi nào cần thanh toán.'
            action={
              <Link
                className={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'h-auto px-0')}
                to={path.user.bookings}
              >
                Xem tất cả
                <ArrowRight aria-hidden='true' size={14} />
              </Link>
            }
          >
            {bookings.length === 0 ? (
              <EmptyState
                actionHref={path.discover}
                actionLabel='Tìm mentor'
                description='Bắt đầu từ trang khám phá để đặt buổi học đầu tiên và theo dõi lịch học ngay trên màn hình này.'
                title='Bạn chưa có booking nào'
              />
            ) : nextBooking ? (
              <Card className='overflow-hidden rounded-[28px] border-slate-200 shadow-none'>
                <div
                  className={cn(
                    'border-b px-5 py-3',
                    needsPayment(nextBooking) ? 'bg-amber-300/85' : 'bg-slate-100'
                  )}
                >
                  <Badge
                    className='bg-white/90 text-slate-800 shadow-none'
                    variant={needsPayment(nextBooking) ? 'warning' : 'secondary'}
                  >
                    {nextBookingStatusLabel}
                  </Badge>
                </div>
                <CardContent className='space-y-5 p-5 md:p-6'>
                  <div className='space-y-1.5'>
                    <p className='text-ink text-4xl font-semibold tracking-tight'>
                      {nextBooking.subjectName} · {nextBooking.gradeName}
                    </p>
                    <p className='text-muted text-lg'>
                      Mentor{' '}
                      <span className='text-ink font-semibold'>{nextBooking.mentorName}</span>
                    </p>
                  </div>

                  <div className='grid gap-3 md:grid-cols-2'>
                    <BookingFact
                      icon={Calendar}
                      label='Ngày học'
                      value={formatShortBookingDate(nextBooking.bookingDate)}
                    />
                    <BookingFact
                      icon={ReceiptText}
                      label='Hình thức'
                      value={
                        nextBooking.meetingType === 'ONLINE'
                          ? 'Bu\u1ED5i h\u1ECDc online'
                          : nextBooking.meetingAddress?.trim() ||
                            'Bu\u1ED5i h\u1ECDc tr\u1EF1c ti\u1EBFp'
                      }
                    />
                    <BookingFact
                      icon={Clock3}
                      label='Khung giờ'
                      value={formatTimeRange(nextBooking.startTime, nextBooking.endTime)}
                    />
                    <BookingFact
                      accent={needsPayment(nextBooking) ? 'warning' : 'default'}
                      icon={CreditCard}
                      label='Học phí'
                      value={formatPrice(nextBooking.totalAmount)}
                    />
                  </div>

                  <div className='grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-center'>
                    <div className='space-y-1.5'>
                      <p className='text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase'>
                        Bước tiếp theo
                      </p>
                      <p className='text-ink text-2xl font-semibold'>
                        {needsPayment(nextBooking)
                          ? 'Ho\xE0n t\u1EA5t thanh to\xE1n'
                          : nextBooking.status === 'CONFIRMED'
                            ? 'Chu\u1EA9n b\u1ECB v\xE0o l\u1EDBp'
                            : 'Theo d\xF5i l\u1ECBch h\u1ECDc'}
                      </p>
                      <p className='text-muted text-sm leading-relaxed'>
                        {needsPayment(nextBooking)
                          ? 'M\u1EDF l\u1ECBch h\u1ECDc \u0111\u1EC3 ho\xE0n t\u1EA5t thanh to\xE1n cho bu\u1ED5i n\xE0y.'
                          : nextBooking.status === 'CONFIRMED'
                            ? 'Ki\u1EC3m tra l\u1EA1i th\xF4ng tin bu\u1ED5i h\u1ECDc v\xE0 v\xE0o l\u1EDBp \u0111\xFAng gi\u1EDD.'
                            : 'M\u1EDF l\u1ECBch h\u1ECDc \u0111\u1EC3 xem \u0111\u1EA7y \u0111\u1EE7 c\xE1c bu\u1ED5i li\xEAn quan.'}
                      </p>
                    </div>

                    <div className='flex flex-col gap-2.5'>
                      {needsPayment(nextBooking) ? (
                        <Link
                          className={buttonVariants({
                            className: 'w-full shadow-none',
                            size: 'lg'
                          })}
                          to={path.user.bookings}
                        >
                          Hoàn tất thanh toán
                        </Link>
                      ) : nextBooking.status === 'CONFIRMED' &&
                        nextBooking.meetingType === 'ONLINE' &&
                        nextBooking.meetingLink?.trim() ? (
                        <a
                          className={buttonVariants({
                            className: 'w-full shadow-none',
                            size: 'lg'
                          })}
                          href={nextBooking.meetingLink}
                          rel='noreferrer'
                          target='_blank'
                        >
                          Vào buổi học
                        </a>
                      ) : (
                        <Link
                          className={buttonVariants({
                            className: 'w-full shadow-none',
                            size: 'lg'
                          })}
                          to={path.user.bookings}
                        >
                          Xem lịch học
                        </Link>
                      )}

                      <Link
                        className={buttonVariants({
                          className: 'w-full shadow-none',
                          size: 'lg',
                          variant: 'outline'
                        })}
                        to={path.discover}
                      >
                        Tìm thêm mentor
                      </Link>
                    </div>
                  </div>

                  <p className='text-sm text-slate-600'>{getBookingSummary(nextBooking)}</p>
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                actionHref={path.user.bookings}
                actionLabel='Xem lịch học'
                description='Bạn đã có booking trong hệ thống nhưng hiện chưa có buổi nào ở phía trước.'
                title='Hiện chưa có buổi sắp tới'
              />
            )}
          </WorkspacePanel>

          <WorkspacePanel contentClassName='space-y-4' title='Tóm tắt tuần này'>
            {summaryItems.map((item) => (
              <SummaryStatCard {...item} key={item.label} />
            ))}
          </WorkspacePanel>
        </div>

        <WorkspacePanel
          contentClassName='space-y-4'
          title='Gần đây'
          description='Các booking gần nhất được gói gọn để bạn nhìn nhanh trạng thái, lịch học và giá tiền.'
        >
          {recentBookings.length > 0 ? (
            <div className='overflow-hidden rounded-[24px] border border-slate-200 bg-white'>
              <div className='overflow-x-auto'>
                <Table className='min-w-[760px]'>
                  <TableHeader>
                    <TableRow className='bg-slate-50'>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Môn học / Cấp độ
                      </TableHead>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Mentor
                      </TableHead>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Thời gian
                      </TableHead>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Học phí
                      </TableHead>
                      <TableHead className='text-right text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow className='border-slate-100' key={booking.id}>
                        <TableCell className='space-y-2'>
                          <p className='text-ink text-lg font-semibold'>
                            {booking.subjectName} · {booking.gradeName}
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            <StatusBadge kind='booking' status={booking.status} />
                            {getPaymentCueLabel(booking) ? (
                              <Badge variant='warning'>{getPaymentCueLabel(booking)}</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className='text-ink font-medium'>{booking.mentorName}</TableCell>
                        <TableCell>
                          <div className='space-y-1 text-sm'>
                            <p className='text-ink font-medium'>
                              {formatShortBookingDate(booking.bookingDate)}
                            </p>
                            <p className='text-muted'>
                              {formatTimeRange(booking.startTime, booking.endTime)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className='text-ink font-semibold'>
                          {formatPrice(booking.totalAmount)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Link
                            className={buttonVariants({ size: 'sm', variant: 'outline' })}
                            to={path.user.bookings}
                          >
                            Xem chi tiết
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <EmptyState
              actionHref={path.discover}
              actionLabel='Tìm mentor'
              description='Khi có booking đầu tiên, lịch sử học gần đây sẽ xuất hiện tại đây.'
              title='Chưa có lịch sử booking'
            />
          )}
        </WorkspacePanel>

        <WorkspacePanel
          contentClassName='space-y-4'
          title='Hành động nhanh'
          description='Chọn nhanh việc bạn muốn thực hiện tiếp theo.'
        >
          <div className='grid gap-4 md:grid-cols-2'>
            {quickActions.map((action) => (
              <QuickActionCard
                description={action.description}
                href={action.href}
                icon={action.icon}
                key={action.title}
                title={action.title}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspaceNotice
          className='rounded-[28px]'
          description={notice.description}
          icon={notice.icon}
          title={notice.title}
          tone={notice.tone}
        />
      </div>
    </DashboardPage>
  )
}
export { UserDashboardPage as default, meta }
