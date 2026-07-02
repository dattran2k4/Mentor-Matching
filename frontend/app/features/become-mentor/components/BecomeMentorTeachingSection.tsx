import type { ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumericInput } from '@/components/ui/numeric-input'
import { Textarea } from '@/components/ui/textarea'
import type { BecomeMentorProfileFormValues } from '@/features/become-mentor/schemas'

import { BecomeMentorSectionCard } from './BecomeMentorSectionCard'

type BecomeMentorTeachingSectionProps = {
  control: Control<BecomeMentorProfileFormValues>
  eyebrow?: string
  errors: FieldErrors<BecomeMentorProfileFormValues>
  register: UseFormRegister<BecomeMentorProfileFormValues>
}

export function BecomeMentorTeachingSection({
  control,
  eyebrow = 'Bước 2',
  errors,
  register
}: BecomeMentorTeachingSectionProps) {
  return (
    <BecomeMentorSectionCard
      description='Phần này giúp học viên hiểu bạn dạy cho ai, theo phong cách nào và vì sao nên đặt lịch với bạn.'
      eyebrow={eyebrow}
      id='teaching'
      title='Định vị chuyên môn'
    >
      <div className='grid gap-4'>
        <Field>
          <Label htmlFor='mentor-headline'>Tiêu đề ngắn</Label>
          <Input
            {...register('headline')}
            id='mentor-headline'
            placeholder='Ví dụ: Giáo viên Toán THPT chuyên luyện thi và xây nền tảng tư duy'
          />
          <FieldError message={errors.headline?.message} />
        </Field>

        <Field>
          <Label htmlFor='mentor-introduction'>Giới thiệu bản thân</Label>
          <Textarea
            {...register('introduction')}
            className='min-h-32'
            id='mentor-introduction'
            placeholder='Chia sẻ về kinh nghiệm, đối tượng học viên phù hợp và lý do bạn muốn làm mentor.'
          />
          <FieldError message={errors.introduction?.message} />
        </Field>

        <Field>
          <Label htmlFor='mentor-teaching-style'>Phong cách giảng dạy</Label>
          <Textarea
            {...register('teachingStyle')}
            className='min-h-28'
            id='mentor-teaching-style'
            placeholder='Mô tả cách bạn giao bài, sửa bài, ôn tập và giữ động lực cho học viên.'
          />
          <FieldError message={errors.teachingStyle?.message} />
        </Field>

        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <Label htmlFor='mentor-experience-years'>Số năm kinh nghiệm</Label>
            <Controller
              control={control}
              name='experienceYears'
              render={({ field }) => (
                <NumericInput
                  id='mentor-experience-years'
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  placeholder='Ví dụ: 3'
                  ref={field.ref}
                  value={field.value}
                />
              )}
            />
            <FieldError message={errors.experienceYears?.message} />
          </Field>

          <Field>
            <Label htmlFor='mentor-current-position'>Vị trí hiện tại</Label>
            <Input
              {...register('currentPosition')}
              id='mentor-current-position'
              placeholder='Ví dụ: Giáo viên, Software Engineer, IELTS Tutor'
            />
          </Field>
        </div>

        <Field>
          <Label htmlFor='mentor-workplace'>Nơi công tác / học tập</Label>
          <Input
            {...register('workplace')}
            id='mentor-workplace'
            placeholder='Tên công ty, trung tâm, trường đại học hoặc tổ chức liên quan'
          />
        </Field>
      </div>
    </BecomeMentorSectionCard>
  )
}

function Field({ children }: { children: ReactNode }) {
  return <div className='space-y-2'>{children}</div>
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className='text-sm font-medium text-red-500'>{message}</p>
}
