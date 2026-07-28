import axios from 'axios'
import { useMemo, useState } from 'react'
import { Camera, Clock3, IdCard, LockKeyhole, ShieldAlert, ShieldCheck } from 'lucide-react'
import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCurrentMentorVerificationQuery } from '@/hooks/queries/mentor/useCurrentMentorVerificationQuery'
import { useUpsertCurrentMentorVerificationMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorVerificationMutation'
function mapVerificationToDraft(verification) {
  return {
    fullName: verification?.fullName ?? '',
    idCardNumber: verification?.idCardNumber ?? '',
    idCardFrontUrl: verification?.idCardFrontUrl ?? '',
    idCardFrontMediaId: verification?.idCardFrontMediaId ?? null,
    idCardBackUrl: verification?.idCardBackUrl ?? '',
    idCardBackMediaId: verification?.idCardBackMediaId ?? null,
    selfieWithIdUrl: verification?.selfieWithIdUrl ?? '',
    selfieWithIdMediaId: verification?.selfieWithIdMediaId ?? null
  }
}
function areVerificationDraftsEqual(left, right) {
  return (
    left.fullName === right.fullName &&
    left.idCardNumber === right.idCardNumber &&
    left.idCardFrontUrl === right.idCardFrontUrl &&
    left.idCardFrontMediaId === right.idCardFrontMediaId &&
    left.idCardBackUrl === right.idCardBackUrl &&
    left.idCardBackMediaId === right.idCardBackMediaId &&
    left.selfieWithIdUrl === right.selfieWithIdUrl &&
    left.selfieWithIdMediaId === right.selfieWithIdMediaId
  )
}
function getVerificationErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c m\xE1y ch\u1EE7.'
    return (
      error.response.data?.message ||
      'Kh\xF4ng th\u1EC3 g\u1EEDi h\u1ED3 s\u01A1 x\xE1c th\u1EF1c l\xFAc n\xE0y.'
    )
  }
  return 'Kh\xF4ng th\u1EC3 g\u1EEDi h\u1ED3 s\u01A1 x\xE1c th\u1EF1c l\xFAc n\xE0y.'
}
function VerificationSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='h-12 animate-pulse rounded-2xl bg-slate-100' />
      <div className='h-[520px] animate-pulse rounded-[28px] bg-slate-100' />
    </div>
  )
}
function VerificationStatusBanner({ status, rejectionReason }) {
  const config =
    status === 'VERIFIED'
      ? {
          icon: ShieldCheck,
          className: 'border-emerald-200 bg-emerald-50',
          iconClassName: 'text-emerald-800',
          labelClassName: 'text-emerald-800!',
          bodyClassName: 'text-emerald-700!',
          label: '\u0110\xE3 x\xE1c th\u1EF1c'
        }
      : status === 'REJECTED'
        ? {
            icon: ShieldAlert,
            className: 'border-red-200 bg-red-50',
            iconClassName: 'text-red-800',
            labelClassName: 'text-red-800!',
            bodyClassName: 'text-red-700!',
            label: 'C\u1EA7n b\u1ED5 sung h\u1ED3 s\u01A1'
          }
        : status === 'PENDING'
          ? {
              icon: Clock3,
              className: 'border-amber-200 bg-amber-50',
              iconClassName: 'text-amber-800',
              labelClassName: 'text-amber-800!',
              bodyClassName: 'text-amber-700!',
              label: '\u0110ang ch\u1EDD ph\xEA duy\u1EC7t'
            }
          : {
              icon: LockKeyhole,
              className: 'border-slate-200 bg-slate-50',
              iconClassName: 'text-slate-700',
              labelClassName: 'text-slate-900!',
              bodyClassName: 'text-slate-700!',
              label: 'Ch\u01B0a g\u1EEDi x\xE1c th\u1EF1c'
            }
  return (
    <div className={`rounded-2xl border px-4 py-3 ${config.className}`}>
      <div className='flex items-start gap-3'>
        <config.icon className={`mt-0.5 shrink-0 ${config.iconClassName}`} size={18} />
        <div className='space-y-1'>
          <p className={`text-base font-semibold ${config.labelClassName}`}>{config.label}</p>
          {status === 'REJECTED' && rejectionReason ? (
            <p className={`text-sm leading-relaxed ${config.bodyClassName}`}>{rejectionReason}</p>
          ) : (
            <p className={`text-sm leading-relaxed ${config.bodyClassName}`}>
              {status === 'VERIFIED'
                ? 'Th\xF4ng tin danh t\xEDnh c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c minh th\xE0nh c\xF4ng.'
                : status === 'PENDING'
                  ? 'H\u1ED3 s\u01A1 \u0111ang \u0111\u01B0\u1EE3c \u0111\u1ED9i ng\u0169 ki\u1EC3m tra. B\u1EA1n v\u1EABn c\xF3 th\u1EC3 c\u1EADp nh\u1EADt l\u1EA1i n\u1EBFu c\u1EA7n b\u1ED5 sung.'
                  : 'B\u1ED5 sung th\xF4ng tin th\u1EADt ch\xEDnh x\xE1c \u0111\u1EC3 qu\xE1 tr\xECnh duy\u1EC7t di\u1EC5n ra thu\u1EADn l\u1EE3i h\u01A1n.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
function VerificationUploadCard({ title, hint, value, inputId, onFileChange }) {
  return (
    <div className='space-y-3'>
      <Label htmlFor={inputId}>{title}</Label>
      <label
        className='flex min-h-[184px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center transition hover:border-blue-300 hover:bg-blue-50/40'
        htmlFor={inputId}
      >
        {value ? (
          <img alt={title} className='h-24 w-24 rounded-2xl object-cover shadow-sm' src={value} />
        ) : (
          <Camera className='text-slate-400' size={40} />
        )}
        <p className='mt-4 text-lg font-medium text-slate-700'>
          {value ? '\u0110\xE3 ch\u1ECDn \u1EA3nh' : 'T\u1EA3i \u1EA3nh l\xEAn'}
        </p>
        <p className='mt-1 text-sm text-slate-500'>
          {value
            ? 'B\u1EA5m \u0111\u1EC3 thay \u1EA3nh kh\xE1c'
            : '\u1EA2nh r\xF5 n\xE9t, kh\xF4ng l\xF3a s\xE1ng'}
        </p>
      </label>
      <input
        accept='image/png,image/jpeg,image/webp'
        className='hidden'
        id={inputId}
        onChange={onFileChange}
        type='file'
      />

      <div className='flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3'>
        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm'>
          <IdCard size={24} />
        </div>
        <div className='space-y-1 text-sm leading-relaxed text-slate-600'>
          <p className='font-medium text-slate-700'>Guidelines:</p>
          {hint.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
function meta() {
  return [{ title: 'X\xE1c th\u1EF1c danh t\xEDnh | Mentor' }]
}
function MentorVerificationPage() {
  const { data: verification, isLoading, isError, refetch } = useCurrentMentorVerificationQuery()
  const upsertVerificationMutation = useUpsertCurrentMentorVerificationMutation()
  const [draftValues, setDraftValues] = useState(null)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(null)
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null)
  const sourceValues = mapVerificationToDraft(verification)
  const formValues = draftValues ?? sourceValues
  const hasUnsavedChanges = !areVerificationDraftsEqual(formValues, sourceValues)
  const isSubmitting = upsertVerificationMutation.isPending
  const canSubmit = useMemo(
    () =>
      Boolean(
        formValues.fullName.trim() && formValues.idCardFrontMediaId && formValues.idCardBackMediaId
      ),
    [formValues]
  )
  const handleRetry = () => {
    setDraftValues(null)
    setSaveSuccessMessage(null)
    setSubmitErrorMessage(null)
    void refetch()
  }
  const handleFieldChange = (field) => (event) => {
    setSaveSuccessMessage(null)
    setSubmitErrorMessage(null)
    setDraftValues((currentValues) => ({
      ...(currentValues ?? sourceValues),
      [field]: event.target.value
    }))
  }
  const handleFileChange = (field, mediaIdField) => (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setSaveSuccessMessage(null)
      setSubmitErrorMessage(null)
      setDraftValues((currentValues) => ({
        ...(currentValues ?? sourceValues),
        [field]: result,
        [mediaIdField]: null
      }))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formValues.idCardFrontMediaId || !formValues.idCardBackMediaId) {
      setSubmitErrorMessage(
        'Vui l\xF2ng t\u1EA3i \u1EA3nh gi\u1EA5y t\u1EDD l\xEAn tr\u01B0\u1EDBc khi g\u1EEDi x\xE1c th\u1EF1c.'
      )
      return
    }
    const payload = {
      fullName: formValues.fullName.trim(),
      idCardNumber: formValues.idCardNumber.trim() || null,
      idCardFrontMediaId: formValues.idCardFrontMediaId,
      idCardBackMediaId: formValues.idCardBackMediaId,
      selfieWithIdMediaId: formValues.selfieWithIdMediaId
    }
    setSaveSuccessMessage(null)
    setSubmitErrorMessage(null)
    upsertVerificationMutation.mutate(payload, {
      onSuccess: ({ verification: nextVerification, message }) => {
        setDraftValues(mapVerificationToDraft(nextVerification))
        setSaveSuccessMessage(
          message || '\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u x\xE1c th\u1EF1c th\xE0nh c\xF4ng.'
        )
      },
      onError: (error) => {
        setSubmitErrorMessage(getVerificationErrorMessage(error))
      }
    })
  }
  if (isLoading && !verification) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Để bảo vệ cộng đồng học viên, chúng tôi cần xác minh danh tính của bạn. Thông tin này được bảo mật tuyệt đối.'
        title='Xác thực danh tính'
      >
        <VerificationSkeleton />
      </DashboardPage>
    )
  }
  if (isError || !verification) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Để bảo vệ cộng đồng học viên, chúng tôi cần xác minh danh tính của bạn. Thông tin này được bảo mật tuyệt đối.'
        title='Xác thực danh tính'
      >
        <ScreenErrorState
          description='Không thể tải hồ sơ xác thực danh tính hiện tại. Vui lòng thử lại.'
          onRetry={handleRetry}
          retryLabel='Tải lại hồ sơ xác thực'
          title='Không tải được xác thực danh tính'
        />
      </DashboardPage>
    )
  }
  return (
    <DashboardPage
      className='space-y-8 md:space-y-10'
      description='Để bảo vệ cộng đồng học viên, chúng tôi cần xác minh danh tính của bạn. Thông tin này được bảo mật tuyệt đối.'
      title='Xác thực danh tính'
    >
      <form className='space-y-6' onSubmit={handleSubmit}>
        <VerificationStatusBanner
          rejectionReason={verification.rejectionReason}
          status={verification.verificationStatus}
        />

        <Card className='rounded-[28px] border-slate-200 shadow-none'>
          <CardContent className='space-y-6 p-6'>
            <div className='space-y-4'>
              <p className='text-ink text-[1.45rem] font-bold tracking-tight'>Thông tin cá nhân</p>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='verification-full-name'>Họ và tên thật</Label>
                  <Input
                    className='h-12 rounded-xl'
                    id='verification-full-name'
                    onChange={handleFieldChange('fullName')}
                    placeholder='Họ và tên thật'
                    value={formValues.fullName}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='verification-id-card'>Số CMND/CCCD/Hộ chiếu</Label>
                  <Input
                    className='h-12 rounded-xl'
                    id='verification-id-card'
                    onChange={handleFieldChange('idCardNumber')}
                    placeholder='Số CMND/CCCD/Hộ chiếu'
                    value={formValues.idCardNumber}
                  />
                </div>
              </div>
            </div>

            <div className='rounded-[24px] border border-slate-200 p-4 md:p-5'>
              <div className='grid gap-5 xl:grid-cols-3'>
                <VerificationUploadCard
                  hint={[
                    '\u1EA2nh r\xF5 n\xE9t, kh\xF4ng l\xF3a s\xE1ng',
                    '\u1EA2nh c\u01B0\u1EDBc m\u1EB7t tr\u01B0\u1EDBc CCCD/h\u1ED9 chi\u1EBFu'
                  ]}
                  inputId='verification-front'
                  onFileChange={handleFileChange('idCardFrontUrl', 'idCardFrontMediaId')}
                  title='Mặt trước CCCD'
                  value={formValues.idCardFrontUrl}
                />
                <VerificationUploadCard
                  hint={[
                    '\u1EA2nh r\xF5 n\xE9t, kh\xF4ng l\xF3a s\xE1ng',
                    '\u1EA2nh sau: M\u1EB7t sau/CCCD/h\u1ED9 chi\u1EBFu'
                  ]}
                  inputId='verification-back'
                  onFileChange={handleFileChange('idCardBackUrl', 'idCardBackMediaId')}
                  title='Mặt sau CCCD'
                  value={formValues.idCardBackUrl}
                />
                <VerificationUploadCard
                  hint={[
                    '\u1EA2nh r\xF5 n\xE9t, kh\xF4ng l\xF3a s\xE1ng',
                    '\u1EA2nh selfie c\xF9ng CCCD'
                  ]}
                  inputId='verification-selfie'
                  onFileChange={handleFileChange('selfieWithIdUrl', 'selfieWithIdMediaId')}
                  title='Ảnh Selfie cùng CCCD'
                  value={formValues.selfieWithIdUrl}
                />
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700'>
              <ShieldCheck className='mt-0.5 shrink-0 text-slate-500' size={18} />
              <p className='text-sm leading-relaxed'>
                Chúng tôi tuân thủ quy định bảo mật dữ liệu và sẽ không chia sẻ thông tin này cho
                bất kỳ ai.
              </p>
            </div>

            {submitErrorMessage ? (
              <div
                aria-live='polite'
                className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
                role='alert'
              >
                {submitErrorMessage}
              </div>
            ) : null}

            {saveSuccessMessage ? (
              <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                {saveSuccessMessage}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className='flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end'>
          <Button
            className='rounded-xl px-5'
            disabled={isSubmitting || !hasUnsavedChanges}
            type='button'
            variant='outline'
            onClick={() => {
              setDraftValues(null)
              setSaveSuccessMessage(null)
              setSubmitErrorMessage(null)
            }}
          >
            Hủy
          </Button>
          <Button
            className='rounded-xl px-6'
            disabled={!canSubmit}
            isLoading={isSubmitting}
            type='submit'
          >
            Gửi yêu cầu xác thực
          </Button>
        </div>
      </form>
    </DashboardPage>
  )
}
export { MentorVerificationPage as default, meta }
