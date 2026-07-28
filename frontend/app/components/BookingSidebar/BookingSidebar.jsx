import axios from 'axios'
import { CalendarDays, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { path } from '@/config/path'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useCreateBookingMutation } from '@/hooks/queries/booking/useCreateBookingMutation'
import {
  formatMeetingTypeLabel,
  formatTimeLabel
} from '@/features/mentor-profile/mentor-profile.mapper'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
const BookingSidebar = ({
  calendarSlots,
  className,
  isCalendarLoading = false,
  mentor,
  onSelectSlot,
  selectedOfferingId,
  selectedSlotId
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentUserQuery = useCurrentUserQuery()
  const createBookingMutation = useCreateBookingMutation()
  const activeOffering =
    mentor.offerings.find((offering) => offering.id === selectedOfferingId) ??
    mentor.offerings.find((offering) => offering.active) ??
    mentor.offerings[0]
  const availableSlots = calendarSlots.filter((slot) => slot.isBookable)
  const selectedSlot = availableSlots.find((slot) => slot.id === selectedSlotId)
  const nearestSlots = availableSlots.slice(0, 3)
  const visibleSlots =
    selectedSlot && !nearestSlots.some((slot) => slot.id === selectedSlot.id)
      ? [selectedSlot, ...nearestSlots.slice(0, 2)]
      : nearestSlots
  const currentUser = currentUserQuery.data
  const isLearner = currentUser?.roles.includes('LEARNER') ?? false
  const isLoggedIn = Boolean(accessToken)
  const resolvedPrice = activeOffering?.pricePerHour ?? mentor.startingPrice
  const [selectedMeetingTypeState, setSelectedMeetingType] = useState(null)
  const selectedMeetingType = mentor.bookableMeetingType ?? selectedMeetingTypeState
  const requiresMeetingTypeSelection =
    mentor.bookableMeetingType === null && mentor.meetingTypes.includes('HYBRID')
  const canSubmit = Boolean(
    isLoggedIn &&
    isLearner &&
    activeOffering &&
    selectedSlot &&
    selectedMeetingType &&
    !createBookingMutation.isPending
  )
  const redirectTo = `${path.login}?redirectTo=${encodeURIComponent(`${location.pathname}${location.search}`)}`
  const actionHint = (() => {
    if (!activeOffering) return 'Mentor ch\u01B0a c\xF3 m\xF4n h\u1ECDc \u0111ang m\u1EDF.'
    if (isCalendarLoading) return '\u0110ang t\u1EA3i l\u1ECBch tr\u1ED1ng c\u1EE7a mentor.'
    if (!visibleSlots.length) return 'Mentor ch\u01B0a m\u1EDF l\u1ECBch trong tu\u1EA7n n\xE0y.'
    if (!selectedMeetingType)
      return requiresMeetingTypeSelection
        ? 'Ch\u1ECDn h\xECnh th\u1EE9c h\u1ECDc tr\u01B0\u1EDBc khi g\u1EEDi y\xEAu c\u1EA7u \u0111\u1EB7t l\u1ECBch.'
        : 'H\xECnh th\u1EE9c h\u1ECDc n\xE0y ch\u01B0a h\u1ED7 tr\u1EE3 \u0111\u1EB7t l\u1ECBch tr\u1EF1c ti\u1EBFp.'
    if (!isLoggedIn)
      return '\u0110\u0103ng nh\u1EADp b\u1EB1ng t\xE0i kho\u1EA3n h\u1ECDc vi\xEAn \u0111\u1EC3 g\u1EEDi y\xEAu c\u1EA7u.'
    if (!isLearner && !currentUserQuery.isLoading)
      return 'Ch\u1EC9 t\xE0i kho\u1EA3n h\u1ECDc vi\xEAn c\xF3 th\u1EC3 g\u1EEDi y\xEAu c\u1EA7u \u0111\u1EB7t l\u1ECBch.'
    return null
  })()
  const handleCreateBooking = () => {
    if (!activeOffering || !selectedSlot || !selectedMeetingType) return
    createBookingMutation.mutate(
      {
        mentorId: mentor.mentorId,
        mentorSubjectId: activeOffering.mentorSubjectId,
        bookingDate: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        meetingType: selectedMeetingType
      },
      {
        onSuccess: ({ bookingId }) => {
          void navigate(`${path.user.bookings}?createdBookingId=${bookingId}&bookingCreated=1`)
        }
      }
    )
  }
  return (
    <Card
      className={cn(
        'rounded-2xl border-slate-200 bg-white shadow-lg shadow-slate-900/5 lg:sticky lg:top-24',
        className
      )}
    >
      <CardContent className='p-5'>
        <h2 className='text-ink text-lg font-bold'>Đặt lịch với {mentor.name}</h2>

        <div className='mt-4'>
          <p className='text-muted text-[10px] font-bold tracking-[0.12em] uppercase'>
            Môn học đã chọn
          </p>
          <div className='mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3'>
            {activeOffering ? (
              <>
                <div className='flex items-start justify-between gap-3'>
                  <p className='text-ink text-sm font-bold'>
                    {activeOffering.subject} · {activeOffering.grade}
                  </p>
                  <span className='text-ink shrink-0 text-sm font-bold'>
                    {formatPrice(activeOffering.pricePerHour)}
                  </span>
                </div>
                <p className='text-muted mt-1 line-clamp-2 text-xs'>
                  {activeOffering.teachingNote}
                </p>
              </>
            ) : (
              <p className='text-muted text-sm'>Chưa có môn học để lựa chọn.</p>
            )}
          </div>
        </div>

        <div className='mt-5 border-t border-slate-200 pt-5'>
          <p className='text-ink text-sm font-bold'>Hình thức học</p>
          <div className='mt-3 flex gap-2'>
            {renderMeetingTypeOptions(mentor, selectedMeetingType, setSelectedMeetingType)}
          </div>
        </div>

        <div className='mt-5 border-t border-slate-200 pt-5'>
          <div className='flex items-center gap-2 text-sm font-bold text-slate-900'>
            <CalendarDays size={16} />
            Lịch gần nhất
          </div>
          <div className='mt-3 space-y-2'>
            {isCalendarLoading ? (
              <p className='rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-600'>
                Đang tải lịch gần nhất...
              </p>
            ) : visibleSlots.length ? (
              visibleSlots.map((slot) => {
                const selected = slot.id === selectedSlotId
                return (
                  <button
                    key={slot.id}
                    className={cn(
                      'w-full rounded-xl border px-3 py-2.5 text-left transition',
                      selected
                        ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                    type='button'
                    onClick={() => onSelectSlot(slot.id)}
                  >
                    <div className='flex justify-between gap-3'>
                      <span className='text-ink text-sm font-bold'>
                        {formatCalendarDateLabel(slot.date)}
                      </span>
                    </div>
                    <p className='text-muted mt-1 text-xs'>
                      {formatTimeLabel(slot.startTime)} - {formatTimeLabel(slot.endTime)}
                    </p>
                  </button>
                )
              })
            ) : (
              <p className='rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-600'>
                Chưa có lịch cụ thể để gửi yêu cầu.
              </p>
            )}
          </div>
        </div>

        <div className='mt-5 border-t border-slate-200 pt-5'>
          <p className='text-ink text-sm font-bold'>Tóm tắt đặt lịch</p>
          <dl className='mt-3 space-y-2.5 text-xs'>
            <SummaryRow
              label='Môn học'
              value={
                activeOffering
                  ? `${activeOffering.subject} \xB7 ${activeOffering.grade}`
                  : 'Ch\u01B0a ch\u1ECDn'
              }
            />
            <SummaryRow
              label='Hình thức'
              value={
                selectedMeetingType
                  ? formatMeetingTypeLabel(selectedMeetingType)
                  : 'Ch\u01B0a ch\u1ECDn'
              }
            />
            <SummaryRow
              label='Khung giờ'
              value={
                selectedSlot
                  ? `${formatCalendarDateLabel(selectedSlot.date)}, ${formatTimeLabel(selectedSlot.startTime)}-${formatTimeLabel(selectedSlot.endTime)}`
                  : 'Ch\u01B0a ch\u1ECDn'
              }
            />
            <div className='flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-bold'>
              <dt>Tạm tính</dt>
              <dd>{resolvedPrice !== null ? formatPrice(resolvedPrice) : 'Ch\u01B0a c\xF3'}</dd>
            </div>
          </dl>
        </div>

        {createBookingMutation.isError ? (
          <p className='mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700'>
            {getBookingErrorMessage(createBookingMutation.error)}
          </p>
        ) : null}

        {!isLoggedIn ? (
          <Link
            className={cn(buttonVariants({ size: 'lg' }), 'mt-5 w-full rounded-xl')}
            to={redirectTo}
          >
            Đăng nhập để đặt lịch
          </Link>
        ) : (
          <Button
            className='mt-5 w-full rounded-xl'
            disabled={!canSubmit}
            isLoading={createBookingMutation.isPending}
            size='lg'
            onClick={handleCreateBooking}
          >
            Gửi yêu cầu đặt lịch
          </Button>
        )}

        {actionHint ? (
          <p className='text-muted mt-3 flex items-start gap-2 text-xs leading-relaxed'>
            <CheckCircle2 className='mt-0.5 shrink-0 text-emerald-600' size={14} />
            {actionHint}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
function formatCalendarDateLabel(value) {
  const date = /* @__PURE__ */ new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      }).format(date)
}
function renderMeetingTypeOptions(mentor, selectedMeetingType, onSelectMeetingType) {
  const selectableMeetingTypes = getSelectableMeetingTypes(mentor)
  if (!selectableMeetingTypes.length) {
    return (
      <p className='rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600'>
        Mentor chưa mở hình thức học để đặt lịch trực tiếp.
      </p>
    )
  }
  return selectableMeetingTypes.map((meetingType) => {
    const selected = selectedMeetingType === meetingType
    const isFixedOption =
      mentor.bookableMeetingType !== null && mentor.bookableMeetingType === meetingType
    return (
      <button
        key={meetingType}
        className={cn(
          'flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition',
          selected
            ? 'border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
          isFixedOption && 'cursor-default'
        )}
        type='button'
        onClick={() => onSelectMeetingType(meetingType)}
      >
        {formatMeetingTypeLabel(meetingType)}
      </button>
    )
  })
}
function getSelectableMeetingTypes(mentor) {
  if (mentor.bookableMeetingType) return [mentor.bookableMeetingType]
  if (mentor.meetingTypes.includes('HYBRID')) return ['ONLINE', 'OFFLINE']
  return []
}
function SummaryRow({ label, value }) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <dt className='text-muted'>{label}</dt>
      <dd className='text-ink max-w-[60%] text-right font-medium'>{value}</dd>
    </div>
  )
}
function getBookingErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return 'Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c m\xE1y ch\u1EE7 \u0111\u1EC3 g\u1EEDi y\xEAu c\u1EA7u.'
    return (
      error.response.data?.message || 'Kh\xF4ng th\u1EC3 g\u1EEDi y\xEAu c\u1EA7u l\xFAc n\xE0y.'
    )
  }
  return 'Kh\xF4ng th\u1EC3 g\u1EEDi y\xEAu c\u1EA7u l\xFAc n\xE0y.'
}
var stdin_default = BookingSidebar
export { stdin_default as default }
