import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  BookOpenText,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Target,
  UserCircle2
} from 'lucide-react'
import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { AppSelect } from '@/components/ui/app-select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useCatalogGradesQuery } from '@/hooks/queries/catalog/useCatalogOptionsQuery'
import { useCurrentLearnerProfileQuery } from '@/hooks/queries/user/useCurrentLearnerProfileQuery'
import { useUpdateCurrentUserProfileMutation } from '@/hooks/queries/user/useUpdateCurrentUserProfileMutation'
import { cn } from '@/utils/cn'
const DEFAULT_USER_TYPE = 'STUDENT'
const emptyFormValues = {
  fullName: '',
  email: '',
  phone: '',
  userType: '',
  gender: '',
  birthYear: '',
  schoolName: '',
  gradeId: '',
  learningGoal: ''
}
const userProfileTabs = [
  { key: 'account', label: 'Th\xF4ng tin chung', icon: UserCircle2 },
  { key: 'learning', label: 'B\u1ED1i c\u1EA3nh h\u1ECDc t\u1EADp', icon: GraduationCap },
  { key: 'goals', label: 'M\u1EE5c ti\xEAu h\u1ECDc t\u1EADp', icon: Target }
]
const userTypeOptions = [
  { label: 'H\u1ECDc sinh', value: 'STUDENT' },
  { label: 'Ph\u1EE5 huynh', value: 'PARENT' },
  { label: 'Sinh vi\xEAn', value: 'UNIVERSITY_STUDENT' },
  { label: 'Ng\u01B0\u1EDDi \u0111i l\xE0m', value: 'WORKING_ADULT' }
]
const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'N\u1EEF', value: 'FEMALE' },
  { label: 'Kh\xE1c', value: 'OTHER' }
]
function formatGradeLabel(name) {
  return name.replace(/^Lop\s+/i, 'L\u1EDBp ')
}
function mapProfileToFormValues(currentUser, learnerProfile) {
  return {
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone,
    userType: currentUser.userType ?? '',
    gender: learnerProfile.gender ?? '',
    birthYear: learnerProfile.birthYear ? String(learnerProfile.birthYear) : '',
    schoolName: learnerProfile.schoolName ?? '',
    gradeId: learnerProfile.gradeId ? String(learnerProfile.gradeId) : '',
    learningGoal: learnerProfile.learningGoal ?? ''
  }
}
function parseBirthYear(value) {
  const normalizedValue = value.trim()
  if (!normalizedValue) return null
  const parsedValue = Number(normalizedValue)
  return Number.isInteger(parsedValue) ? parsedValue : null
}
function isValidBirthYear(value) {
  const parsedValue = parseBirthYear(value)
  if (parsedValue === null) return true
  const currentYear = /* @__PURE__ */ new Date().getFullYear()
  return parsedValue >= 1900 && parsedValue <= currentYear
}
function areFormValuesEqual(left, right) {
  return (
    left.fullName === right.fullName &&
    left.email === right.email &&
    left.phone === right.phone &&
    left.userType === right.userType &&
    left.gender === right.gender &&
    left.birthYear === right.birthYear &&
    left.schoolName === right.schoolName &&
    left.gradeId === right.gradeId &&
    left.learningGoal === right.learningGoal
  )
}
function getProfileSaveErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c m\xE1y ch\u1EE7.'
    return (
      error.response.data?.message || 'Kh\xF4ng th\u1EC3 l\u01B0u h\u1ED3 s\u01A1 l\xFAc n\xE0y.'
    )
  }
  return 'Kh\xF4ng th\u1EC3 l\u01B0u h\u1ED3 s\u01A1 l\xFAc n\xE0y.'
}
function ProgressRing({ percent }) {
  return (
    <div
      className='relative mx-auto grid h-36 w-36 place-items-center rounded-full'
      style={{
        background: `conic-gradient(#2563eb 0 ${percent}%, #dbeafe ${percent}% 100%)`
      }}
    >
      <div className='grid h-[104px] w-[104px] place-items-center rounded-full bg-white'>
        <div className='text-center'>
          <p className='text-ink text-3xl font-bold'>{percent}%</p>
          <p className='text-sm text-slate-500'>Sẵn sàng</p>
        </div>
      </div>
    </div>
  )
}
function ProfileFormSkeleton() {
  return (
    <div className='grid gap-6 xl:grid-cols-[1.55fr_0.75fr]'>
      <div className='space-y-6'>
        <div className='h-28 animate-pulse rounded-[26px] bg-slate-100' />
        <div className='h-16 animate-pulse rounded-[22px] bg-slate-100' />
        <div className='h-[420px] animate-pulse rounded-[26px] bg-slate-100' />
      </div>
      <div className='space-y-6'>
        <div className='h-80 animate-pulse rounded-[26px] bg-slate-100' />
        <div className='h-48 animate-pulse rounded-[26px] bg-slate-100' />
      </div>
    </div>
  )
}
function InfoMiniCard({ title, description, icon: Icon }) {
  return (
    <Card className='rounded-2xl border-slate-200 bg-slate-50/70 shadow-none'>
      <CardContent className='flex items-start gap-3 p-4'>
        <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'>
          <Icon size={18} />
        </div>
        <div className='space-y-1.5'>
          <p className='text-ink font-semibold'>{title}</p>
          <p className='text-sm leading-relaxed text-slate-600'>{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
function meta() {
  return [{ title: 'H\u1ED3 s\u01A1 | H\u1ECDc vi\xEAn' }]
}
function UserProfilePage() {
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
    refetch: refetchCurrentUser
  } = useCurrentUserQuery()
  const {
    data: learnerProfile,
    isLoading: isLearnerProfileLoading,
    isError: isLearnerProfileError,
    refetch: refetchLearnerProfile
  } = useCurrentLearnerProfileQuery()
  const {
    data: grades,
    isLoading: isGradesLoading,
    isError: isGradesError,
    refetch: refetchGrades
  } = useCatalogGradesQuery()
  const updateCurrentUserProfileMutation = useUpdateCurrentUserProfileMutation()
  const [activeTab, setActiveTab] = useState('account')
  const [draftFormValues, setDraftFormValues] = useState(null)
  const [saveToastMessage, setSaveToastMessage] = useState(null)
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null)
  const sourceFormValues =
    currentUser && learnerProfile
      ? mapProfileToFormValues(currentUser, learnerProfile)
      : emptyFormValues
  const formValues = draftFormValues ?? sourceFormValues
  const completionItems = [
    {
      label: 'Th\xF4ng tin li\xEAn h\u1EC7',
      done: Boolean(formValues.fullName.trim() && formValues.phone.trim() && formValues.userType)
    },
    {
      label: 'B\u1ED1i c\u1EA3nh h\u1ECDc t\u1EADp',
      done: Boolean(
        formValues.schoolName.trim() && formValues.gradeId && formValues.birthYear.trim()
      )
    },
    {
      label: 'M\u1EE5c ti\xEAu h\u1ECDc t\u1EADp',
      done: Boolean(formValues.learningGoal.trim())
    }
  ]
  const completedCount = completionItems.filter((item) => item.done).length
  const completionPercent = Math.round((completedCount / completionItems.length) * 100)
  const selectedGrade = grades?.find((grade) => String(grade.id) === formValues.gradeId) ?? null
  const selectedUserTypeLabel =
    userTypeOptions.find((option) => option.value === formValues.userType)?.label ??
    'Ch\u01B0a ch\u1ECDn vai tr\xF2'
  const selectedGenderLabel =
    genderOptions.find((option) => option.value === formValues.gender)?.label ??
    'Ch\u01B0a b\u1ED5 sung gi\u1EDBi t\xEDnh'
  const isPageLoading =
    (!currentUser || !learnerProfile || !grades) &&
    (isCurrentUserLoading || isLearnerProfileLoading || isGradesLoading)
  const hasPageError = isCurrentUserError || isLearnerProfileError || isGradesError
  const isSubmitting = updateCurrentUserProfileMutation.isPending
  const hasUnsavedChanges = !areFormValuesEqual(formValues, sourceFormValues)
  const handleFieldChange = (field) => (event) => {
    setSubmitErrorMessage(null)
    setDraftFormValues((currentValues) => ({
      ...(currentValues ?? sourceFormValues),
      [field]: event.target.value
    }))
  }
  const handleSelectChange = (field) => (value) => {
    setSubmitErrorMessage(null)
    setDraftFormValues((currentValues) => ({
      ...(currentValues ?? sourceFormValues),
      [field]: value
    }))
  }
  const handleRetry = () => {
    setDraftFormValues(null)
    setSaveToastMessage(null)
    setSubmitErrorMessage(null)
    void refetchCurrentUser()
    void refetchLearnerProfile()
    void refetchGrades()
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!currentUser) return
    setSaveToastMessage(null)
    setSubmitErrorMessage(null)
    if (!formValues.userType) {
      setSubmitErrorMessage(
        'Vui l\xF2ng ch\u1ECDn vai tr\xF2 h\u1ECDc t\u1EADp \u0111\u1EC3 ho\xE0n thi\u1EC7n h\u1ED3 s\u01A1.'
      )
      return
    }
    if (!isValidBirthYear(formValues.birthYear)) {
      setSubmitErrorMessage(
        'N\u0103m sinh kh\xF4ng h\u1EE3p l\u1EC7. Vui l\xF2ng nh\u1EADp n\u0103m trong kho\u1EA3ng h\u1EE3p l\xFD.'
      )
      return
    }
    updateCurrentUserProfileMutation.mutate(
      {
        user: {
          fullName: formValues.fullName.trim(),
          phone: formValues.phone.trim(),
          userType: formValues.userType || currentUser.userType || DEFAULT_USER_TYPE
        },
        learnerProfile: {
          gender: formValues.gender || null,
          birthYear: parseBirthYear(formValues.birthYear),
          schoolName: formValues.schoolName.trim() || null,
          gradeId: formValues.gradeId ? Number(formValues.gradeId) : null,
          learningGoal: formValues.learningGoal.trim() || null
        }
      },
      {
        onSuccess: ({
          currentUser: updatedCurrentUser,
          learnerProfile: updatedLearnerProfile,
          message
        }) => {
          setDraftFormValues(mapProfileToFormValues(updatedCurrentUser, updatedLearnerProfile))
          setSaveToastMessage(
            message ||
              'H\u1ED3 s\u01A1 \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt th\xE0nh c\xF4ng.'
          )
        },
        onError: (error) => {
          setSubmitErrorMessage(getProfileSaveErrorMessage(error))
        }
      }
    )
  }
  useEffect(() => {
    if (!saveToastMessage) return
    const timeoutId = window.setTimeout(() => {
      setSaveToastMessage(null)
    }, 3500)
    return () => window.clearTimeout(timeoutId)
  }, [saveToastMessage])
  if (isPageLoading) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Giữ hồ sơ học viên rõ ràng để mentor hiểu nhanh bối cảnh học tập và mục tiêu hiện tại của bạn.'
        title='Hồ sơ học viên'
      >
        <ProfileFormSkeleton />
      </DashboardPage>
    )
  }
  if (hasPageError || !currentUser || !learnerProfile || !grades) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Giữ hồ sơ học viên rõ ràng để mentor hiểu nhanh bối cảnh học tập và mục tiêu hiện tại của bạn.'
        title='Hồ sơ học viên'
      >
        <ScreenErrorState
          description='Không thể tải hồ sơ học viên hoặc dữ liệu lớp học lúc này. Vui lòng thử lại để tiếp tục.'
          onRetry={handleRetry}
          retryLabel='Tải lại hồ sơ'
          title='Không tải được hồ sơ'
        />
      </DashboardPage>
    )
  }
  return (
    <DashboardPage
      className='space-y-6 md:space-y-7'
      description='Giữ hồ sơ học viên rõ ràng để mentor hiểu nhanh bối cảnh học tập và mục tiêu hiện tại của bạn.'
      title='Hồ sơ học viên'
    >
      {saveToastMessage ? (
        <div
          role='status'
          aria-live='polite'
          className='fixed top-5 right-5 z-50 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg shadow-emerald-900/10'
        >
          {saveToastMessage}
        </div>
      ) : null}

      <div className='grid gap-6 xl:grid-cols-[1.55fr_0.75fr]'>
        <div className='space-y-6'>
          <Card className='rounded-[26px] border-slate-200 shadow-none'>
            <CardContent className='p-6'>
              <div className='space-y-3'>
                <div className='flex flex-wrap items-center gap-3'>
                  <Badge variant='info'>{selectedUserTypeLabel}</Badge>
                  {selectedGrade ? (
                    <Badge variant='success'>{formatGradeLabel(selectedGrade.name)}</Badge>
                  ) : null}
                </div>
                <div className='space-y-2'>
                  <p className='text-ink text-[2rem] font-bold tracking-tight'>
                    {formValues.fullName || 'H\u1ED3 s\u01A1 h\u1ECDc vi\xEAn'}
                  </p>
                  <p className='text-slate-600'>
                    {formValues.learningGoal.trim() ||
                      'B\u1ED5 sung m\u1EE5c ti\xEAu h\u1ECDc t\u1EADp \u0111\u1EC3 mentor hi\u1EC3u nhanh \u0111i\u1EC1u b\u1EA1n \u0111ang c\u1EA7n c\u1EA3i thi\u1EC7n.'}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {[
                      selectedGenderLabel,
                      formValues.birthYear ? `Sinh n\u0103m ${formValues.birthYear}` : null,
                      formValues.phone || null
                    ]
                      .filter(Boolean)
                      .join(' \xB7 ') ||
                      'B\u1ED5 sung th\xF4ng tin c\u01A1 b\u1EA3n \u0111\u1EC3 h\u1ED3 s\u01A1 \u0111\u1EA7y \u0111\u1EE7 h\u01A1n.'}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {[
                      formValues.schoolName || null,
                      selectedGrade ? formatGradeLabel(selectedGrade.name) : null
                    ]
                      .filter(Boolean)
                      .join(' \xB7 ') ||
                      'B\u1ED5 sung tr\u01B0\u1EDDng l\u1EDBp hi\u1EC7n t\u1EA1i \u0111\u1EC3 mentor chu\u1EA9n b\u1ECB n\u1ED9i dung s\xE1t nhu c\u1EA7u.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='rounded-[24px] border-slate-200 shadow-none'>
            <CardContent className='p-2'>
              <div className='flex flex-wrap gap-2'>
                {userProfileTabs.map((tab) => {
                  const selected = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      type='button'
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        'flex items-center gap-2 rounded-[18px] px-4 py-3 text-sm font-medium transition md:px-5',
                        selected
                          ? 'bg-blue-50 text-blue-700 shadow-[inset_0_-2px_0_#2563eb]'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <form className='space-y-6' onSubmit={handleSubmit}>
            {activeTab === 'account' ? (
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Thông tin tài khoản
                    </p>
                    <p className='text-sm text-slate-500'>
                      Đây là những dữ liệu mentor nhìn đầu tiên khi chuẩn bị buổi học và liên hệ xác
                      nhận lịch.
                    </p>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-full-name'>Họ và tên</Label>
                      <Input
                        id='learner-full-name'
                        disabled={isSubmitting}
                        onChange={handleFieldChange('fullName')}
                        value={formValues.fullName}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-email'>Email</Label>
                      <Input
                        id='learner-email'
                        disabled
                        readOnly
                        type='email'
                        value={formValues.email}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-phone'>Số điện thoại</Label>
                      <Input
                        id='learner-phone'
                        disabled={isSubmitting}
                        onChange={handleFieldChange('phone')}
                        type='tel'
                        value={formValues.phone}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Giới tính</Label>
                      <AppSelect
                        ariaLabel='Chọn giới tính'
                        className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                        disabled={isSubmitting}
                        onValueChange={handleSelectChange('gender')}
                        options={genderOptions}
                        placeholder='Chọn giới tính'
                        value={formValues.gender}
                      />
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>Vai trò học tập</Label>
                      <AppSelect
                        ariaLabel='Chọn vai trò học tập'
                        className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                        disabled={isSubmitting}
                        onValueChange={handleSelectChange('userType')}
                        options={userTypeOptions}
                        placeholder='Chọn vai trò học tập'
                        value={formValues.userType}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {activeTab === 'learning' ? (
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Bối cảnh học tập
                    </p>
                    <p className='text-sm text-slate-500'>
                      Thông tin trường lớp giúp mentor căn đúng trình độ, tốc độ học và bài tập cần
                      chuẩn bị.
                    </p>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-birth-year'>Năm sinh</Label>
                      <Input
                        id='learner-birth-year'
                        className='h-11 rounded-xl'
                        disabled={isSubmitting}
                        inputMode='numeric'
                        onChange={handleFieldChange('birthYear')}
                        placeholder='Ví dụ: 2009'
                        value={formValues.birthYear}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Lớp hiện tại</Label>
                      <AppSelect
                        ariaLabel='Chọn lớp hiện tại'
                        className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                        disabled={isSubmitting}
                        onValueChange={handleSelectChange('gradeId')}
                        options={grades.map((grade) => ({
                          label: formatGradeLabel(grade.name),
                          value: String(grade.id)
                        }))}
                        placeholder='Chọn lớp hiện tại'
                        value={formValues.gradeId}
                      />
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label htmlFor='learner-school'>Trường / trung tâm</Label>
                      <Input
                        id='learner-school'
                        className='h-11 rounded-xl'
                        disabled={isSubmitting}
                        onChange={handleFieldChange('schoolName')}
                        placeholder='Ví dụ: THPT Nguyễn Thượng Hiền'
                        value={formValues.schoolName}
                      />
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <InfoMiniCard
                      title='Ngữ cảnh hiện tại'
                      icon={GraduationCap}
                      description={
                        [
                          formValues.schoolName || null,
                          selectedGrade ? formatGradeLabel(selectedGrade.name) : null
                        ]
                          .filter(Boolean)
                          .join(' \xB7 ') ||
                        'Ch\u01B0a c\xF3 \u0111\u1EE7 d\u1EEF li\u1EC7u tr\u01B0\u1EDDng l\u1EDBp \u0111\u1EC3 mentor \u0111\u1ECDc nhanh h\u1ED3 s\u01A1.'
                      }
                    />
                    <InfoMiniCard
                      title='Tín hiệu matching'
                      icon={Sparkles}
                      description='Khi trường lớp rõ ràng, mentor sẽ dễ đánh giá lịch phù hợp và chuẩn bị lộ trình học sát hơn.'
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {activeTab === 'goals' ? (
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Mục tiêu học tập
                    </p>
                    <p className='text-sm text-slate-500'>
                      Mô tả ngắn điều bạn đang muốn cải thiện để mentor hiểu rõ lý do đặt buổi học.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='learner-goal'>Mục tiêu hiện tại</Label>
                    <Textarea
                      id='learner-goal'
                      className='min-h-40 rounded-2xl'
                      disabled={isSubmitting}
                      onChange={handleFieldChange('learningGoal')}
                      placeholder='Ví dụ: Củng cố nền tảng Toán lớp 9, chuẩn bị thi vào 10 hoặc cải thiện kỹ năng IELTS...'
                      value={formValues.learningGoal}
                    />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <InfoMiniCard
                      title='Tóm tắt hiển thị với mentor'
                      icon={BookOpenText}
                      description={
                        formValues.learningGoal.trim() ||
                        'Ch\u01B0a c\xF3 m\xF4 t\u1EA3 m\u1EE5c ti\xEAu h\u1ECDc t\u1EADp \u0111\u1EC3 mentor \u0111\u1ECDc nhanh tr\u01B0\u1EDBc khi nh\u1EADn booking.'
                      }
                    />
                    <InfoMiniCard
                      title='Lưu ý khi mô tả'
                      icon={ClipboardList}
                      description='Hãy nói rõ môn học, mức hiện tại và mục tiêu gần nhất. Mô tả cụ thể sẽ giúp mentor đề xuất buổi học phù hợp hơn.'
                    />
                  </div>

                  {submitErrorMessage ? (
                    <div
                      role='alert'
                      aria-live='polite'
                      className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
                    >
                      {submitErrorMessage}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            <Card className='rounded-[24px] border-slate-200 shadow-none'>
              <CardContent className='flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-end'>
                <Button
                  className='rounded-xl px-5'
                  disabled={isSubmitting || !hasUnsavedChanges}
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setDraftFormValues(null)
                    setSaveToastMessage(null)
                    setSubmitErrorMessage(null)
                  }}
                >
                  Hủy thay đổi
                </Button>
                <Button className='rounded-xl px-5' isLoading={isSubmitting} type='submit'>
                  Lưu thông tin
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <aside className='space-y-6'>
          <Card className='rounded-[26px] border-slate-200 shadow-none'>
            <CardContent className='space-y-5 p-6'>
              <p className='text-ink text-lg font-semibold'>Mức độ hoàn thiện hồ sơ</p>
              <ProgressRing percent={completionPercent} />
              <div className='space-y-3'>
                {completionItems.map((item) => (
                  <div key={item.label} className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={cn(
                          'h-4 w-4 rounded-full border',
                          item.done
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-slate-300 bg-white'
                        )}
                      />
                      <p className='text-sm text-slate-700'>{item.label}</p>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        item.done ? 'text-emerald-700' : 'text-slate-400'
                      )}
                    >
                      {item.done ? '\u0110\xE3 c\xF3' : 'Thi\u1EBFu'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className='overflow-hidden rounded-[26px] border-slate-200 shadow-none'>
            <div className='h-20 bg-gradient-to-r from-blue-700 to-blue-500' />
            <CardContent className='space-y-4 p-6 pt-0'>
              <div className='-mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-lg font-semibold text-slate-700 shadow-sm'>
                {formValues.fullName
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase() || 'HV'}
              </div>
              <div className='space-y-1'>
                <p className='text-ink font-semibold'>
                  {formValues.fullName || 'H\u1ECDc vi\xEAn'}
                </p>
                <p className='text-sm text-slate-500'>
                  {formValues.learningGoal.trim() ||
                    '\u0110ang ho\xE0n thi\u1EC7n m\xF4 t\u1EA3 m\u1EE5c ti\xEAu h\u1ECDc t\u1EADp.'}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='info'>{selectedUserTypeLabel}</Badge>
                {selectedGrade ? (
                  <Badge variant='success'>{formatGradeLabel(selectedGrade.name)}</Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardPage>
  )
}
export { UserProfilePage as default, meta }
