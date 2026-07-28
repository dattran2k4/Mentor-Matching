import {
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UploadCloud
} from 'lucide-react'
import { Controller } from 'react-hook-form'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumericInput } from '@/components/ui/numeric-input'
import { Spinner } from '@/components/ui/spinner'
import { useBecomeMentorVerificationForm } from '@/features/become-mentor/hooks'
import { verificationDocumentMeta } from '../become-mentor.constants'
import { BecomeMentorSectionCard } from './BecomeMentorSectionCard'
function BecomeMentorVerificationSection({
  documents,
  formId,
  idCardNumber,
  onHydrate,
  onSubmit,
  verificationFullName
}) {
  const verificationForm = useBecomeMentorVerificationForm({
    documents,
    idCardNumber,
    onHydrate,
    onSubmit,
    verificationFullName
  })
  if (verificationForm.isLoading) {
    return (
      <div className='flex min-h-72 items-center justify-center rounded-[28px] border border-slate-200 bg-white'>
        <Spinner label='Đang tải thông tin xác minh...' size='lg' />
      </div>
    )
  }
  if (verificationForm.isError) {
    return (
      <ScreenErrorState
        description='Không thể tải thông tin xác minh hiện tại. Hãy thử lại trước khi tiếp tục.'
        onRetry={verificationForm.onRetry}
        title='Không tải được xác minh'
      />
    )
  }
  return (
    <BecomeMentorSectionCard
      description='Chọn ảnh giấy tờ trực tiếp từ máy để hoàn thiện bước xác minh trước khi gửi duyệt.'
      eyebrow='Bước 5'
      id='verification'
      title='Xác minh danh tính'
    >
      {verificationForm.requiresProfile ? (
        <div className='rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800'>
          Cần hoàn thiện và lưu hồ sơ mentor trước khi gửi thông tin xác minh danh tính.
        </div>
      ) : (
        <VerificationStatusBanner
          rejectionReason={verificationForm.rejectionReason}
          status={verificationForm.status}
        />
      )}

      <form className='mt-5 space-y-5' id={formId} onSubmit={verificationForm.onSubmit}>
        <div className='rounded-[24px] border border-blue-200 bg-blue-50/70 p-4'>
          <div className='flex items-center gap-3'>
            <div className='text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm'>
              <Shield size={18} />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900'>
                Chỉ mentor đã được xác minh và phê duyệt mới hiển thị trên trang kết nối
              </p>
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <Label htmlFor='mentor-verification-name'>Họ tên trên giấy tờ</Label>
            <Input
              {...verificationForm.register('verificationFullName')}
              disabled={verificationForm.isLocked || verificationForm.requiresProfile}
              id='mentor-verification-name'
              placeholder='Nhập giống với CCCD / ID'
            />
            <FieldError message={verificationForm.errors.verificationFullName?.message} />
          </Field>

          <Field>
            <Label htmlFor='mentor-id-card-number'>Số giấy tờ</Label>
            <Controller
              control={verificationForm.control}
              name='idCardNumber'
              render={({ field }) => (
                <NumericInput
                  disabled={verificationForm.isLocked || verificationForm.requiresProfile}
                  id='mentor-id-card-number'
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  placeholder='012345678901'
                  ref={field.ref}
                  value={field.value}
                />
              )}
            />
            <FieldError message={verificationForm.errors.idCardNumber?.message} />
          </Field>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          {verificationDocumentMeta.map((document) => {
            const documentValue = verificationForm.selectedDocuments[document.key]
            const done = Boolean(documentValue.mediaId)
            const isUploading = verificationForm.uploadingDocumentKey === document.key
            return (
              <div
                className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-4'
                key={document.key}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='text-primary flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm'>
                    {done ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />}
                  </div>
                  <Badge variant={done ? 'success' : 'muted'}>
                    {isUploading
                      ? '\u0110ang t\u1EA3i l\xEAn'
                      : done
                        ? '\u0110\xE3 s\u1EB5n s\xE0ng'
                        : 'Ch\u01B0a c\xF3'}
                  </Badge>
                </div>

                <div className='mt-4 space-y-2'>
                  <p className='text-sm font-semibold text-slate-900'>{document.label}</p>
                  <p className='text-sm leading-6 text-slate-500'>{document.description}</p>
                  {documentValue.previewUrl ? (
                    <img
                      alt={document.label}
                      className='mt-2 h-28 w-full rounded-2xl object-cover'
                      src={documentValue.previewUrl}
                    />
                  ) : null}
                  <p className='min-h-6 text-sm leading-6 text-slate-500'>
                    {documentValue.fileName
                      ? `\u0110\xE3 ch\u1ECDn: ${documentValue.fileName}`
                      : done
                        ? '\u0110\xE3 c\xF3 \u1EA3nh x\xE1c minh \u0111\xE3 l\u01B0u.'
                        : 'Ch\u01B0a c\xF3 t\u1EC7p n\xE0o \u0111\u01B0\u1EE3c ch\u1ECDn.'}
                  </p>
                  <FieldError
                    message={verificationForm.errors.documents?.[document.key]?.mediaId?.message}
                  />
                </div>

                <Input
                  accept='image/png,image/jpeg,image/jpg'
                  className='sr-only'
                  disabled={
                    verificationForm.isLocked ||
                    verificationForm.requiresProfile ||
                    verificationForm.isSubmitting
                  }
                  id={`mentor-document-${document.key}`}
                  onChange={verificationForm.handleDocumentFileChange(document.key)}
                  type='file'
                />
                <div className='mt-5 flex flex-col gap-2'>
                  <label
                    className={buttonVariants({
                      className: 'w-full cursor-pointer rounded-2xl',
                      variant: done ? 'secondary' : 'outline'
                    })}
                    htmlFor={`mentor-document-${document.key}`}
                  >
                    {isUploading
                      ? '\u0110ang t\u1EA3i \u1EA3nh...'
                      : done
                        ? '\u0110\u1ED5i \u1EA3nh gi\u1EA5y t\u1EDD'
                        : 'Ch\u1ECDn \u1EA3nh gi\u1EA5y t\u1EDD'}
                  </label>
                  {done ? (
                    <button
                      className='text-sm font-medium text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60'
                      disabled={
                        verificationForm.isLocked ||
                        verificationForm.requiresProfile ||
                        verificationForm.isSubmitting
                      }
                      onClick={() => verificationForm.clearDocument(document.key)}
                      type='button'
                    >
                      Xóa tệp đã chọn
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        {verificationForm.submitErrorMessage ? (
          <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {verificationForm.submitErrorMessage}
          </div>
        ) : null}

        {verificationForm.isLocked ? (
          <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600'>
            {verificationForm.status === 'PENDING'
              ? 'H\u1ED3 s\u01A1 x\xE1c minh \u0111ang ch\u1EDD duy\u1EC7t n\xEAn t\u1EA1m th\u1EDDi ch\u01B0a th\u1EC3 ch\u1EC9nh s\u1EEDa.'
              : 'H\u1ED3 s\u01A1 x\xE1c minh \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t n\xEAn kh\xF4ng c\u1EA7n c\u1EADp nh\u1EADt th\xEAm.'}
          </div>
        ) : null}
      </form>
    </BecomeMentorSectionCard>
  )
}
function Field({ children }) {
  return <div className='space-y-2'>{children}</div>
}
function FieldError({ message }) {
  if (!message) return null
  return <p className='text-sm font-medium text-red-500'>{message}</p>
}
function VerificationStatusBanner({ status, rejectionReason }) {
  const config =
    status === 'VERIFIED'
      ? {
          body: 'Th\xF4ng tin danh t\xEDnh c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c minh th\xE0nh c\xF4ng.',
          className: 'border-emerald-200 bg-emerald-50',
          icon: ShieldCheck,
          label: '\u0110\xE3 x\xE1c th\u1EF1c'
        }
      : status === 'REJECTED'
        ? {
            body:
              rejectionReason ||
              'H\u1ED3 s\u01A1 tr\u01B0\u1EDBc \u0111\xF3 b\u1ECB t\u1EEB ch\u1ED1i. B\u1EA1n c\xF3 th\u1EC3 c\u1EADp nh\u1EADt v\xE0 g\u1EEDi l\u1EA1i.',
            className: 'border-red-200 bg-red-50',
            icon: ShieldAlert,
            label: 'C\u1EA7n b\u1ED5 sung h\u1ED3 s\u01A1'
          }
        : status === 'PENDING'
          ? {
              body: 'H\u1ED3 s\u01A1 \u0111ang \u0111\u01B0\u1EE3c \u0111\u1ED9i ng\u0169 ki\u1EC3m tra. B\u1EA1n ch\u01B0a th\u1EC3 ch\u1EC9nh s\u1EEDa \u1EDF tr\u1EA1ng th\xE1i n\xE0y.',
              className: 'border-amber-200 bg-amber-50',
              icon: Clock3,
              label: '\u0110ang ch\u1EDD ph\xEA duy\u1EC7t'
            }
          : {
              body: 'B\u1ED5 sung th\xF4ng tin th\u1EADt ch\xEDnh x\xE1c \u0111\u1EC3 qu\xE1 tr\xECnh duy\u1EC7t di\u1EC5n ra thu\u1EADn l\u1EE3i h\u01A1n.',
              className: 'border-slate-200 bg-slate-50',
              icon: LockKeyhole,
              label: 'Ch\u01B0a g\u1EEDi x\xE1c th\u1EF1c'
            }
  return (
    <div className={`rounded-[24px] border px-4 py-4 ${config.className}`}>
      <div className='flex items-start gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/80'>
          <config.icon size={18} />
        </div>
        <div className='space-y-1'>
          <p className='text-sm font-semibold text-slate-900'>{config.label}</p>
          <p className='text-sm leading-6 text-slate-600'>{config.body}</p>
        </div>
      </div>
    </div>
  )
}
export { BecomeMentorVerificationSection }
