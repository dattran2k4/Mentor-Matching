import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { BecomeMentorPersonalSection } from './BecomeMentorPersonalSection'
import { BecomeMentorTeachingSection } from './BecomeMentorTeachingSection'
function BecomeMentorProfileStep({
  formId,
  isError,
  isLoading,
  onRetry,
  onSubmit,
  personalSectionProps,
  status,
  teachingSectionProps
}) {
  if (isLoading) {
    return (
      <div className='flex min-h-72 items-center justify-center rounded-[28px] border border-slate-200 bg-white'>
        <Spinner label='Đang tải hồ sơ mentor của bạn...' size='lg' />
      </div>
    )
  }
  if (isError) {
    return (
      <ScreenErrorState
        description='Không thể tải hồ sơ mentor hiện tại. Hãy thử lại trước khi tiếp tục.'
        onRetry={onRetry}
        title='Không tải được hồ sơ'
      />
    )
  }
  const profileStatus = getProfileStatus(status)
  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm'>
        <div>
          <p className='text-sm font-semibold text-slate-900'>Trạng thái hồ sơ</p>
          {profileStatus.description ? (
            <p className='text-sm text-slate-500'>{profileStatus.description}</p>
          ) : null}
        </div>
        <Badge variant={profileStatus.variant}>{profileStatus.label}</Badge>
      </div>

      <form className='space-y-6' id={formId} onSubmit={onSubmit}>
        <BecomeMentorPersonalSection eyebrow='Phần 1' {...personalSectionProps} />
        <BecomeMentorTeachingSection eyebrow='Phần 2' {...teachingSectionProps} />
      </form>
    </div>
  )
}
function getProfileStatus(status) {
  if (!status?.mentorProfileCreated) {
    return {
      description:
        'B\u1EA1n ch\u01B0a t\u1EA1o h\u1ED3 s\u01A1 mentor. B\u1EA5m ti\u1EBFp t\u1EE5c \u0111\u1EC3 l\u01B0u h\u1ED3 s\u01A1 l\u1EA7n \u0111\u1EA7u.',
      label: 'Ch\u01B0a t\u1EA1o',
      variant: 'warning'
    }
  }
  if (!status.profileDetailsCompleted) {
    return {
      label: 'B\u1EA3n nh\xE1p',
      variant: 'info'
    }
  }
  if (status.approvalStatus === 'APPROVED') {
    return {
      description:
        'H\u1ED3 s\u01A1 mentor \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t v\xE0 c\xF3 th\u1EC3 s\u1EED d\u1EE5ng trong khu mentor.',
      label: '\u0110\xE3 duy\u1EC7t',
      variant: 'success'
    }
  }
  if (status.approvalStatus === 'REJECTED') {
    return {
      description:
        'H\u1ED3 s\u01A1 c\u1EA7n \u0111i\u1EC1u ch\u1EC9nh tr\u01B0\u1EDBc khi g\u1EEDi duy\u1EC7t l\u1EA1i.',
      label: 'C\u1EA7n ch\u1EC9nh s\u1EEDa',
      variant: 'destructive'
    }
  }
  return {
    description:
      'H\u1ED3 s\u01A1 \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u, b\u1EA1n c\xF3 th\u1EC3 ho\xE0n thi\u1EC7n c\xE1c b\u01B0\u1EDBc ti\u1EBFp theo.',
    label: '\u0110ang ho\xE0n thi\u1EC7n',
    variant: 'muted'
  }
}
export { BecomeMentorProfileStep }
