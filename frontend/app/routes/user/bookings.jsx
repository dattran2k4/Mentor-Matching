import axios from 'axios'
import { motion } from 'framer-motion'
import {
  BookOpenText,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Search,
  Star,
  UserRound,
  Video,
  Wallet
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SuccessModal } from '@/components/ui/success-modal'
import { path } from '@/config/path'
import { BOOKING_STATUS_CONFIG, LEARNER_BOOKING_STATUS_FILTERS } from '@/constants/booking-status'
import { useCurrentUserBookingsQuery } from '@/hooks/queries/booking/useCurrentUserBookingsQuery'
import { useMyReviewsQuery } from '@/hooks/queries/review/useMyReviewsQuery'
import { useCreatePaymentMutation } from '@/hooks/queries/payment/useCreatePaymentMutation'
import { useCreateReviewMutation } from '@/hooks/mutations/review/useCreateReviewMutation'
import { useUpdateReviewMutation } from '@/hooks/mutations/review/useUpdateReviewMutation'
import { useDeleteReviewMutation } from '@/hooks/mutations/review/useDeleteReviewMutation'
import { ReviewFormModal } from '@/features/review/components/ReviewFormModal'
import { cn } from '@/utils/cn'
import { formatPrice, formatShortBookingDate, formatTimeRange } from '@/utils/format'
const bookingFilters = [
  { key: 'ALL', label: 'T\u1EA5t c\u1EA3' },
  ...LEARNER_BOOKING_STATUS_FILTERS.map((status) => ({
    key: status,
    label: BOOKING_STATUS_CONFIG[status].label
  }))
]
function getBookingFilterLabel(filter) {
  if (filter === 'ALL') return 't\u1EA5t c\u1EA3'
  return BOOKING_STATUS_CONFIG[filter].label.toLowerCase()
}
function getPaymentErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return 'Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u thanh to\xE1n.'
    return (
      error.response.data?.message ||
      'Kh\xF4ng th\u1EC3 b\u1EAFt \u0111\u1EA7u thanh to\xE1n l\xFAc n\xE0y.'
    )
  }
  return 'Kh\xF4ng th\u1EC3 b\u1EAFt \u0111\u1EA7u thanh to\xE1n l\xFAc n\xE0y.'
}
function getReviewErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i v\u1EDBi m\xE1y ch\u1EE7.'
    return (
      error.response.data?.message ||
      'Kh\xF4ng th\u1EC3 g\u1EEDi \u0111\xE1nh gi\xE1 l\xFAc n\xE0y.'
    )
  }
  return 'Kh\xF4ng th\u1EC3 g\u1EEDi \u0111\xE1nh gi\xE1 l\xFAc n\xE0y.'
}
function getMeetingLabel(booking) {
  if (booking.meetingType === 'ONLINE') return 'Bu\u1ED5i h\u1ECDc online'
  return booking.meetingAddress?.trim() || 'Bu\u1ED5i h\u1ECDc tr\u1EF1c ti\u1EBFp'
}
function getMentorInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'M'
  return words
    .slice(-2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}
function getEffectivePaymentStatus(booking, payment) {
  if (payment) return payment.status
  if (booking.status === 'PENDING') return 'PENDING'
  if (
    booking.status === 'CONFIRMED' ||
    booking.status === 'COMPLETED' ||
    booking.status === 'NO_SHOW'
  ) {
    return 'PAID'
  }
  return null
}
function getPaymentPanelClass(booking, paymentStatus) {
  if (paymentStatus === 'FAILED') {
    return 'border-red-200 bg-gradient-to-br from-red-50 to-white'
  }
  if (booking.status === 'PENDING') {
    return 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'
  }
  if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
    return 'border-sky-200 bg-gradient-to-br from-sky-50 to-white'
  }
  return 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white'
}
function getBookingMessage(booking, paymentStatus) {
  if (booking.cancelReason?.trim()) return booking.cancelReason.trim()
  if (booking.status === 'PENDING') {
    return paymentStatus === 'PENDING'
      ? 'Ho\xE0n t\u1EA5t thanh to\xE1n \u0111\u1EC3 gi\u1EEF ch\u1ED7 v\u1EDBi mentor.'
      : 'Booking \u0111ang ch\u1EDD b\u1EA1n ho\xE0n t\u1EA5t b\u01B0\u1EDBc ti\u1EBFp theo.'
  }
  if (booking.status === 'CONFIRMED') {
    return 'L\u1ECBch h\u1ECDc \u0111\xE3 \u0111\u01B0\u1EE3c thanh to\xE1n. H\xE3y ki\u1EC3m tra th\xF4ng tin v\xE0 tham gia \u0111\xFAng gi\u1EDD.'
  }
  if (booking.status === 'COMPLETED') {
    return 'Bu\u1ED5i h\u1ECDc \u0111\xE3 ho\xE0n th\xE0nh.'
  }
  if (booking.status === 'NO_SHOW') {
    return 'Bu\u1ED5i h\u1ECDc \u0111\u01B0\u1EE3c ghi nh\u1EADn l\xE0 kh\xF4ng tham gia.'
  }
  if (booking.status === 'REJECTED') {
    return 'Mentor kh\xF4ng th\u1EC3 nh\u1EADn booking n\xE0y.'
  }
  return 'Booking n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c h\u1EE7y.'
}
function BookingFact({ icon: Icon, label, value }) {
  return (
    <div className='rounded-[20px] border border-slate-200 bg-white p-4'>
      <div className='flex items-start gap-3'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600'>
          <Icon aria-hidden='true' size={16} />
        </div>
        <div className='min-w-0 space-y-1'>
          <p className='text-muted text-xs'>{label}</p>
          <p className='text-ink text-sm font-semibold wrap-break-word'>{value}</p>
        </div>
      </div>
    </div>
  )
}
function BookingListSkeleton() {
  return (
    <div className='space-y-4'>
      {[1, 2, 3].map((item) => (
        <Card className='rounded-[28px] shadow-none' key={item}>
          <CardContent className='grid animate-pulse gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_260px]'>
            <div className='space-y-4'>
              <div className='h-8 w-72 rounded-xl bg-slate-100' />
              <div className='h-14 w-48 rounded-xl bg-slate-100' />
              <div className='grid gap-3 md:grid-cols-2'>
                <div className='h-24 rounded-2xl bg-slate-100' />
                <div className='h-24 rounded-2xl bg-slate-100' />
              </div>
            </div>
            <div className='h-64 rounded-3xl bg-slate-100' />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
function meta() {
  return [{ title: 'L\u1ECBch h\u1ECDc | H\u1ECDc vi\xEAn' }]
}
function UserBookingsPage() {
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const bookingQueryParams = useMemo(
    () => ({
      page: 1,
      size: 100,
      status: activeFilter === 'ALL' ? void 0 : activeFilter
    }),
    [activeFilter]
  )
  const bookingsQuery = useCurrentUserBookingsQuery(bookingQueryParams)
  const myReviewsQuery = useMyReviewsQuery()
  const createPaymentMutation = useCreatePaymentMutation()
  const createReviewMutation = useCreateReviewMutation()
  const updateReviewMutation = useUpdateReviewMutation()
  const deleteReviewMutation = useDeleteReviewMutation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activePaymentBookingId, setActivePaymentBookingId] = useState(null)
  const [activeReviewBooking, setActiveReviewBooking] = useState(null)
  const [paymentSnapshots, setPaymentSnapshots] = useState({})
  const [paymentFeedbackByBookingId, setPaymentFeedbackByBookingId] = useState({})
  const [successModalMessage, setSuccessModalMessage] = useState(null)
  const [reviewSubmitError, setReviewSubmitError] = useState(null)
  const createdBookingIdParam = searchParams.get('createdBookingId')
  const createdBookingId = createdBookingIdParam ? Number(createdBookingIdParam) : null
  const shouldShowCreatedBanner = searchParams.get('bookingCreated') === '1'
  const bookings = useMemo(() => bookingsQuery.data?.data ?? [], [bookingsQuery.data?.data])
  const createdBooking = useMemo(
    () =>
      createdBookingId !== null && Number.isInteger(createdBookingId)
        ? (bookings.find((booking) => booking.id === createdBookingId) ?? null)
        : null,
    [bookings, createdBookingId]
  )
  const reviewByBookingId = useMemo(() => {
    const map = {}
    if (myReviewsQuery.data) {
      myReviewsQuery.data.forEach((review) => {
        map[review.bookingId] = review
      })
    }
    return map
  }, [myReviewsQuery.data])
  const filteredBookings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return bookings.filter((booking) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        booking.mentorName.toLowerCase().includes(normalizedQuery) ||
        booking.subjectName.toLowerCase().includes(normalizedQuery) ||
        booking.gradeName.toLowerCase().includes(normalizedQuery)
      return matchesSearch
    })
  }, [bookings, searchQuery])
  const handleCreatePayment = (booking) => {
    setActivePaymentBookingId(booking.id)
    setPaymentFeedbackByBookingId((currentState) => {
      const nextState = { ...currentState }
      delete nextState[booking.id]
      return nextState
    })
    createPaymentMutation.mutate(
      { bookingId: booking.id },
      {
        onSuccess: ({ payment }) => {
          const checkoutUrl = payment.checkoutUrl?.trim()
          setPaymentSnapshots((currentState) => ({
            ...currentState,
            [booking.id]: payment
          }))
          setPaymentFeedbackByBookingId((currentState) => ({
            ...currentState,
            [booking.id]: {
              tone: 'success',
              message: checkoutUrl
                ? 'Trang thanh to\xE1n \u0111\xE3 s\u1EB5n s\xE0ng.'
                : 'Y\xEAu c\u1EA7u thanh to\xE1n \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o. Vui l\xF2ng th\u1EED l\u1EA1i sau \xEDt ph\xFAt.'
            }
          }))
          if (checkoutUrl) {
            window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
          }
          void bookingsQuery.refetch()
        },
        onError: (error) => {
          setPaymentFeedbackByBookingId((currentState) => ({
            ...currentState,
            [booking.id]: {
              tone: 'error',
              message: getPaymentErrorMessage(error)
            }
          }))
        },
        onSettled: () => {
          setActivePaymentBookingId(null)
        }
      }
    )
  }
  const activeReview = activeReviewBooking ? reviewByBookingId[activeReviewBooking.id] : null
  const isReviewExpired = activeReview
    ? new Date(activeReview.createdAt).getTime() + 30 * 24 * 60 * 60 * 1e3 < Date.now()
    : false
  const handleReviewSubmit = (data) => {
    if (!activeReviewBooking) return
    setReviewSubmitError(null)
    if (activeReview) {
      updateReviewMutation.mutate(
        {
          id: activeReview.id,
          payload: { rating: data.rating, comment: data.comment }
        },
        {
          onSuccess: () => {
            setActiveReviewBooking(null)
            setTimeout(() => {
              setSuccessModalMessage('C\u1EADp nh\u1EADt \u0111\xE1nh gi\xE1 th\xE0nh c\xF4ng!')
            }, 150)
            void myReviewsQuery.refetch()
          },
          onError: (error) => {
            setReviewSubmitError(getReviewErrorMessage(error))
          }
        }
      )
    } else {
      createReviewMutation.mutate(
        {
          bookingId: activeReviewBooking.id,
          rating: data.rating,
          comment: data.comment
        },
        {
          onSuccess: () => {
            setActiveReviewBooking(null)
            setTimeout(() => {
              setSuccessModalMessage('G\u1EEDi \u0111\xE1nh gi\xE1 th\xE0nh c\xF4ng!')
            }, 150)
            void myReviewsQuery.refetch()
          },
          onError: (error) => {
            setReviewSubmitError(getReviewErrorMessage(error))
          }
        }
      )
    }
  }
  const handleDeleteReview = () => {
    if (!activeReviewBooking || !activeReview) return
    setReviewSubmitError(null)
    deleteReviewMutation.mutate(activeReview.id, {
      onSuccess: () => {
        setActiveReviewBooking(null)
        setTimeout(() => {
          setSuccessModalMessage('X\xF3a \u0111\xE1nh gi\xE1 th\xE0nh c\xF4ng!')
        }, 150)
        void myReviewsQuery.refetch()
      },
      onError: (error) => {
        setReviewSubmitError(getReviewErrorMessage(error))
      }
    })
  }
  if (bookingsQuery.isLoading && !bookingsQuery.data) {
    return (
      <DashboardPage title='Quản lý lịch học'>
        <div className='space-y-6'>
          <div className='h-12 animate-pulse rounded-2xl bg-slate-100' />
          <BookingListSkeleton />
        </div>
      </DashboardPage>
    )
  }
  if (bookingsQuery.isError) {
    return (
      <DashboardPage title='Quản lý lịch học'>
        <ScreenErrorState
          description='Không thể tải lịch học lúc này. Vui lòng thử lại sau ít phút.'
          onRetry={() => void bookingsQuery.refetch()}
          retryLabel='Tải lại'
          title='Chưa tải được lịch học'
        />
      </DashboardPage>
    )
  }
  return (
    <DashboardPage title='Quản lý lịch học'>
      <div className='space-y-6'>
        <div className='relative'>
          <Search
            aria-hidden='true'
            className='text-muted absolute top-1/2 left-4 -translate-y-1/2'
            size={18}
          />
          <Input
            className='h-12 rounded-2xl bg-white pl-11 shadow-sm'
            id='booking-search'
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder='Tìm kiếm mentor, lớp học...'
            type='search'
            value={searchQuery}
          />
        </div>

        {shouldShowCreatedBanner ? (
          <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800'>
            {createdBooking
              ? `${createdBooking.subjectName} \xB7 ${createdBooking.gradeName} \u0111\xE3 \u0111\u01B0\u1EE3c th\xEAm v\xE0o l\u1ECBch h\u1ECDc.`
              : 'Booking m\u1EDBi \u0111\xE3 \u0111\u01B0\u1EE3c th\xEAm v\xE0o l\u1ECBch h\u1ECDc.'}
          </div>
        ) : null}

        <StatusFilterPills
          onValueChange={setActiveFilter}
          options={bookingFilters}
          value={activeFilter}
        />

        {filteredBookings.length === 0 ? (
          <Card className='overflow-hidden rounded-[28px] border-slate-200 bg-white shadow-sm'>
            <CardContent className='grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-center'>
              <div className='flex items-start gap-4'>
                <div className='bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl'>
                  <BookOpenText aria-hidden='true' size={22} />
                </div>
                <div className='min-w-0 space-y-2'>
                  <p className='text-ink text-2xl font-semibold tracking-tight'>
                    Chưa có booking trong mục {getBookingFilterLabel(activeFilter)}
                  </p>
                  <p className='text-muted max-w-2xl text-sm leading-relaxed'>
                    Bạn có thể đặt một buổi học mới từ danh sách mentor. Sau khi tạo booking, trạng
                    thái thanh toán và lịch học sẽ được cập nhật tại đây.
                  </p>
                </div>
              </div>

              <Link
                className={buttonVariants({
                  className: 'h-11 rounded-xl md:justify-self-end',
                  size: 'lg'
                })}
                to={path.discover}
              >
                <Search aria-hidden='true' size={16} />
                Đặt lịch với mentor
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {filteredBookings.map((booking, index) => {
              const payment = paymentSnapshots[booking.id] ?? null
              const paymentStatus = getEffectivePaymentStatus(booking, payment)
              const checkoutUrl = payment?.checkoutUrl?.trim() || null
              const paymentFeedback = paymentFeedbackByBookingId[booking.id]
              const isCreatedBooking = createdBookingId !== null && booking.id === createdBookingId
              const isCreatingPayment =
                activePaymentBookingId === booking.id && createPaymentMutation.isPending
              const canCreatePayment =
                booking.status === 'PENDING' && (!payment || payment.status === 'PENDING')
              const canJoinSession =
                booking.status === 'CONFIRMED' &&
                booking.meetingType === 'ONLINE' &&
                Boolean(booking.meetingLink?.trim())
              const hasReview = !!reviewByBookingId[booking.id]
              const canReview = booking.status === 'COMPLETED' && !hasReview
              const hasReviewed = booking.status === 'COMPLETED' && hasReview
              const shouldFindAnotherMentor =
                booking.status === 'CANCELLED' || booking.status === 'REJECTED'
              return (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  key={booking.id}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card
                    className={cn(
                      'overflow-hidden rounded-[28px] border-slate-200 shadow-sm',
                      isCreatedBooking && 'border-emerald-300'
                    )}
                  >
                    <CardContent className='grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_260px]'>
                      <div className='min-w-0 space-y-5'>
                        <div className='flex flex-wrap items-center gap-2.5'>
                          <h2 className='text-ink text-2xl font-semibold tracking-tight'>
                            {booking.subjectName} · {booking.gradeName}
                          </h2>
                          <StatusBadge kind='booking' status={booking.status} />
                          {isCreatedBooking ? <Badge variant='success'>Vừa tạo</Badge> : null}
                        </div>

                        <div className='flex items-center gap-3'>
                          <div className='bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
                            {getMentorInitials(booking.mentorName)}
                          </div>
                          <div>
                            <p className='text-muted text-xs'>Mentor</p>
                            <p className='text-ink font-semibold'>{booking.mentorName}</p>
                            <Link
                              className='text-primary text-sm hover:underline'
                              to={path.mentorProfile(String(booking.mentorId))}
                            >
                              Xem hồ sơ
                            </Link>
                          </div>
                        </div>

                        <div className='grid gap-3 md:grid-cols-2'>
                          <BookingFact
                            icon={Calendar}
                            label='Ngày học'
                            value={formatShortBookingDate(booking.bookingDate)}
                          />
                          <BookingFact
                            icon={Clock}
                            label='Giờ học'
                            value={formatTimeRange(booking.startTime, booking.endTime)}
                          />
                          <BookingFact
                            icon={MapPin}
                            label='Hình thức'
                            value={getMeetingLabel(booking)}
                          />
                          <BookingFact
                            icon={Wallet}
                            label='Học phí'
                            value={formatPrice(booking.totalAmount)}
                          />
                        </div>

                        <p className='text-muted text-sm leading-relaxed'>
                          {getBookingMessage(booking, paymentStatus)}
                        </p>
                      </div>

                      <aside
                        className={cn(
                          'flex flex-col rounded-[24px] border p-5',
                          getPaymentPanelClass(booking, paymentStatus)
                        )}
                      >
                        <div className='text-center'>
                          <p className='text-xs font-semibold tracking-wide text-slate-600 uppercase'>
                            Tổng thanh toán
                          </p>
                          <p className='text-ink mt-1 text-3xl font-semibold'>
                            {formatPrice(booking.totalAmount)}
                          </p>
                          <div className='mt-2 flex justify-center'>
                            {paymentStatus ? (
                              <StatusBadge kind='payment' status={paymentStatus} />
                            ) : (
                              <Badge variant='muted'>Không phát sinh thanh toán</Badge>
                            )}
                          </div>
                        </div>

                        <div className='mt-5 space-y-2.5'>
                          {checkoutUrl ? (
                            <a
                              className={buttonVariants({ className: 'w-full', size: 'lg' })}
                              href={checkoutUrl}
                              rel='noreferrer'
                              target='_blank'
                            >
                              <ExternalLink aria-hidden='true' size={16} />
                              Tiếp tục thanh toán
                            </a>
                          ) : canCreatePayment ? (
                            <Button
                              className='w-full'
                              isLoading={isCreatingPayment}
                              onClick={() => handleCreatePayment(booking)}
                              size='lg'
                            >
                              <Wallet aria-hidden='true' size={16} />
                              Thanh toán ngay
                            </Button>
                          ) : canJoinSession ? (
                            <a
                              className={buttonVariants({ className: 'w-full', size: 'lg' })}
                              href={booking.meetingLink ?? void 0}
                              rel='noreferrer'
                              target='_blank'
                            >
                              <Video aria-hidden='true' size={16} />
                              Vào lớp học
                            </a>
                          ) : canReview ? (
                            <Button
                              className='w-full'
                              onClick={() => {
                                setReviewSubmitError(null)
                                setActiveReviewBooking(booking)
                              }}
                              size='lg'
                            >
                              <Star aria-hidden='true' size={16} />
                              Viết đánh giá
                            </Button>
                          ) : hasReviewed ? (
                            <Button
                              className='w-full'
                              variant='outline'
                              onClick={() => {
                                setReviewSubmitError(null)
                                setActiveReviewBooking(booking)
                              }}
                              size='lg'
                            >
                              <Star
                                className='fill-amber-400 text-amber-400'
                                aria-hidden='true'
                                size={16}
                              />
                              Đã đánh giá
                            </Button>
                          ) : shouldFindAnotherMentor ? (
                            <Link
                              className={buttonVariants({ className: 'w-full', size: 'lg' })}
                              to={path.discover}
                            >
                              Tìm mentor khác
                            </Link>
                          ) : (
                            <Link
                              className={buttonVariants({
                                className: 'w-full',
                                size: 'lg',
                                variant: 'outline'
                              })}
                              to={path.mentorProfile(String(booking.mentorId))}
                            >
                              Xem mentor
                            </Link>
                          )}

                          <Link
                            className={buttonVariants({
                              className: 'w-full',
                              size: 'default',
                              variant: 'outline'
                            })}
                            to={path.mentorProfile(String(booking.mentorId))}
                          >
                            <UserRound aria-hidden='true' size={15} />
                            Hồ sơ mentor
                          </Link>
                        </div>

                        {paymentFeedback ? (
                          <div
                            className={cn(
                              'mt-4 rounded-2xl border p-3 text-sm leading-relaxed',
                              paymentFeedback.tone === 'success'
                                ? 'border-emerald-200 bg-white/70 text-emerald-800'
                                : 'border-red-200 bg-white/70 text-red-700'
                            )}
                            role='alert'
                          >
                            {paymentFeedback.message}
                          </div>
                        ) : null}
                      </aside>
                    </CardContent>
                  </Card>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>

      <ReviewFormModal
        open={!!activeReviewBooking}
        onOpenChange={(open) => !open && setActiveReviewBooking(null)}
        initialData={
          activeReview
            ? { rating: activeReview.rating, comment: activeReview.comment || '' }
            : void 0
        }
        onSubmit={handleReviewSubmit}
        isSubmitting={createReviewMutation.isPending || updateReviewMutation.isPending}
        title={
          activeReviewBooking
            ? `\u0110\xE1nh gi\xE1 mentor ${activeReviewBooking.mentorName}`
            : 'Vi\u1EBFt \u0111\xE1nh gi\xE1'
        }
        isExpired={isReviewExpired}
        submitError={reviewSubmitError}
        onDelete={activeReview ? handleDeleteReview : void 0}
        isDeleting={deleteReviewMutation.isPending}
      />

      <SuccessModal
        open={!!successModalMessage}
        onOpenChange={(open) => !open && setSuccessModalMessage(null)}
        title={successModalMessage || ''}
      />
    </DashboardPage>
  )
}
export { UserBookingsPage as default, meta }
