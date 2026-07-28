import { ImagePlus } from 'lucide-react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { AppSelect } from '@/components/ui/app-select'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BecomeMentorSectionCard } from './BecomeMentorSectionCard'
const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'N\u1EEF', value: 'FEMALE' },
  { label: 'Kh\xE1c', value: 'OTHER' }
]
function BecomeMentorPersonalSection({
  avatarErrorMessage,
  avatarPreviewUrl,
  cityOptions,
  control,
  currentCityId,
  districtOptions,
  eyebrow = 'B\u01B0\u1EDBc 1',
  errors,
  isCitiesLoading,
  isDistrictsLoading,
  onAvatarChange,
  onCurrentCityChange,
  onCurrentDistrictChange,
  register
}) {
  const [isAvatarActionOpen, setIsAvatarActionOpen] = useState(false)
  const handleAvatarChange = (event) => {
    onAvatarChange(event)
    setIsAvatarActionOpen(false)
  }
  return (
    <BecomeMentorSectionCard eyebrow={eyebrow} id='identity' title='Thông tin cá nhân'>
      <div className='grid gap-6'>
        <div className='grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)]'>
          <div className='rounded-[2rem] border border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white p-4'>
            <div className='flex h-full flex-col items-center justify-center rounded-[1.7rem] border border-white bg-white px-4 py-6 text-center shadow-sm'>
              <button
                aria-expanded={isAvatarActionOpen}
                className='group relative flex size-28 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-inner transition outline-none hover:border-blue-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                onClick={() => setIsAvatarActionOpen((current) => !current)}
                type='button'
              >
                {avatarPreviewUrl ? (
                  <img
                    alt='Ảnh đại diện mentor đã chọn'
                    className='size-full object-cover'
                    src={avatarPreviewUrl}
                  />
                ) : (
                  <span className='bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full transition group-hover:scale-105'>
                    <ImagePlus size={24} />
                  </span>
                )}
                <span className='absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/10' />
              </button>
              <p className='mt-4 text-sm font-semibold text-slate-900'>Ảnh đại diện mentor</p>
              <Input
                accept='image/png,image/jpeg,image/jpg'
                className='sr-only'
                id='mentor-avatar-file'
                onChange={handleAvatarChange}
                type='file'
              />
              {isAvatarActionOpen ? (
                <div className='mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm'>
                  <label
                    className={buttonVariants({
                      className: 'w-full cursor-pointer rounded-2xl',
                      variant: 'default'
                    })}
                    htmlFor='mentor-avatar-file'
                  >
                    Tải ảnh lên
                  </label>
                </div>
              ) : (
                <p className='mt-5 text-xs font-medium text-slate-500'>Nhấn vào ảnh để cập nhật</p>
              )}
              <FieldError message={avatarErrorMessage} />
            </div>
          </div>

          <div className='grid gap-4'>
            <Field>
              <Label htmlFor='mentor-full-name'>Họ và tên</Label>
              <Input
                {...register('fullName')}
                id='mentor-full-name'
                placeholder='Ví dụ: Nguyễn Văn A'
              />
              <FieldError message={errors.fullName?.message} />
            </Field>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field>
                <Label>Giới tính</Label>
                <Controller
                  control={control}
                  name='gender'
                  render={({ field }) => (
                    <AppSelect
                      ariaLabel='Chọn giới tính'
                      onValueChange={field.onChange}
                      options={genderOptions}
                      placeholder='Chọn giới tính'
                      value={field.value ?? ''}
                    />
                  )}
                />
              </Field>

              <Field>
                <Label>Quê quán</Label>
                <Controller
                  control={control}
                  name='hometownCityId'
                  render={({ field }) => (
                    <AppSelect
                      ariaLabel='Chọn quê quán'
                      disabled={isCitiesLoading}
                      onValueChange={field.onChange}
                      options={cityOptions}
                      placeholder={
                        isCitiesLoading
                          ? '\u0110ang t\u1EA3i th\xE0nh ph\u1ED1...'
                          : 'Ch\u1ECDn t\u1EC9nh/th\xE0nh ph\u1ED1'
                      }
                      value={field.value}
                    />
                  )}
                />
                <FieldError message={errors.hometownCityId?.message} />
              </Field>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field>
                <Label>Khu vực hiện tại</Label>
                <Controller
                  control={control}
                  name='currentCityId'
                  render={({ field }) => (
                    <AppSelect
                      ariaLabel='Chọn tỉnh hoặc thành phố hiện tại'
                      disabled={isCitiesLoading}
                      onValueChange={onCurrentCityChange}
                      options={cityOptions}
                      placeholder={
                        isCitiesLoading
                          ? '\u0110ang t\u1EA3i th\xE0nh ph\u1ED1...'
                          : 'Ch\u1ECDn t\u1EC9nh/th\xE0nh ph\u1ED1'
                      }
                      value={field.value}
                    />
                  )}
                />
                <FieldError message={errors.currentCityId?.message} />
              </Field>

              <Field>
                <Label>Quận/Huyện</Label>
                <Controller
                  control={control}
                  name='currentDistrictId'
                  render={({ field }) => (
                    <AppSelect
                      ariaLabel='Chọn quận hoặc huyện hiện tại'
                      disabled={!currentCityId || isDistrictsLoading}
                      onValueChange={onCurrentDistrictChange}
                      options={districtOptions}
                      placeholder={
                        !currentCityId
                          ? 'Ch\u1ECDn t\u1EC9nh/th\xE0nh ph\u1ED1 tr\u01B0\u1EDBc'
                          : isDistrictsLoading
                            ? '\u0110ang t\u1EA3i qu\u1EADn/huy\u1EC7n...'
                            : 'Ch\u1ECDn qu\u1EADn/huy\u1EC7n'
                      }
                      value={field.value}
                    />
                  )}
                />
                <FieldError message={errors.currentDistrictId?.message} />
              </Field>
            </div>
          </div>
        </div>
      </div>
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
export { BecomeMentorPersonalSection }
