import { MentorProfileContentSection } from '@/features/mentor-profile/components/MentorProfilePageShell'
import type { MentorProfileViewModel } from '@/features/mentor-profile/mentor-profile.mapper'

type MentorProfileReviewsSectionProps = {
  mentor: MentorProfileViewModel
}

export function MentorProfileReviewsSection({ mentor }: MentorProfileReviewsSectionProps) {
  return (
    <MentorProfileContentSection id='reviews' title='Đánh giá'>
      {mentor.reviews.length ? (
        <div className='space-y-4'>
          {mentor.reviews.map((review) => (
            <div
              key={review.name}
              className='border-t border-slate-200 pt-4 first:border-0 first:pt-0'
            >
              <p className='text-ink font-bold'>{review.name}</p>
              <p className='mt-1 text-sm text-amber-500'>{'★'.repeat(Math.round(review.rating))}</p>
              <p className='text-muted mt-2 text-sm'>{review.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5'>
          <p className='text-ink text-sm font-bold'>Chưa có đánh giá</p>
          <p className='text-muted mt-1 text-sm'>
            Đánh giá sẽ xuất hiện sau khi học viên hoàn thành buổi học.
          </p>
        </div>
      )}
    </MentorProfileContentSection>
  )
}
