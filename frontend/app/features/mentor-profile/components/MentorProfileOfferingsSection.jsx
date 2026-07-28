import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MentorProfileContentSection,
  MentorProfileInlineEmpty
} from '@/features/mentor-profile/components/MentorProfilePageShell'
import { formatMeetingTypeLabel } from '@/features/mentor-profile/mentor-profile.mapper'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
function MentorProfileOfferingsSection({ mentor, onSelectOffering, selectedOfferingId }) {
  return (
    <MentorProfileContentSection
      id='offerings'
      title='Môn học và học phí'
      subtitle='Chọn môn học phù hợp để xem lịch và gửi yêu cầu đặt buổi.'
    >
      <div className='space-y-3'>
        {mentor.offerings.length ? (
          mentor.offerings.map((offering) => (
            <OfferingCard
              key={offering.id}
              meetingTypes={mentor.meetingTypes}
              offering={offering}
              selected={offering.id === selectedOfferingId}
              onSelect={onSelectOffering}
            />
          ))
        ) : (
          <MentorProfileInlineEmpty text='Mentor chưa có môn học đang mở.' />
        )}
      </div>
    </MentorProfileContentSection>
  )
}
function OfferingCard({ meetingTypes, offering, onSelect, selected }) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition',
        selected
          ? 'border-blue-400 bg-blue-50/70 ring-2 ring-blue-100'
          : 'border-slate-200 bg-slate-50'
      )}
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-ink font-bold'>
            {offering.subject} · {offering.grade}
          </p>
          <p className='text-muted mt-1 text-sm leading-relaxed'>{offering.teachingNote}</p>
          <div className='mt-2 flex flex-wrap gap-2'>
            <Badge variant='outline'>{formatProficiency(offering.proficiency)}</Badge>
            {meetingTypes.map((type) => (
              <Badge key={type} variant='outline'>
                {formatMeetingTypeLabel(type)}
              </Badge>
            ))}
          </div>
        </div>
        <div className='flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end'>
          <p className='text-primary text-lg font-bold'>
            {formatPrice(offering.pricePerHour)} / buổi
          </p>
          <Button
            className='rounded-xl'
            type='button'
            variant={selected ? 'default' : 'outline'}
            onClick={() => onSelect(offering.id)}
          >
            {selected ? '\u0110\xE3 ch\u1ECDn' : 'Ch\u1ECDn m\xF4n n\xE0y'}
          </Button>
        </div>
      </div>
    </div>
  )
}
function formatProficiency(value) {
  if (value === 'BASIC') return 'C\u01A1 b\u1EA3n'
  if (value === 'INTERMEDIATE') return 'Trung c\u1EA5p'
  if (value === 'ADVANCED') return 'N\xE2ng cao'
  return 'Chuy\xEAn s\xE2u'
}
export { MentorProfileOfferingsSection }
