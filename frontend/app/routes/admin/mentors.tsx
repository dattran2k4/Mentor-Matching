import { useMemo, useState } from 'react'
import { ExternalLink, Filter, Search, ShieldCheck, Users } from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  adminMentorDirectory,
  adminQueueItems,
  type AdminMentorDirectoryItem
} from '@/mocks/admin-workspace'
import { getInitials } from '@/utils/format'

type MentorDirectoryFilter = 'ALL' | 'APPROVED' | 'SUSPENDED'

const mentorDirectoryFilters: Array<{ key: MentorDirectoryFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'APPROVED', label: 'Đã duyệt' },
  { key: 'SUSPENDED', label: 'Tạm dừng' }
]

const matchesDirectoryFilter = (
  mentor: AdminMentorDirectoryItem,
  filter: MentorDirectoryFilter
) => {
  switch (filter) {
    case 'APPROVED':
      return mentor.approvalStatus === 'APPROVED'
    case 'SUSPENDED':
      return mentor.approvalStatus === 'SUSPENDED'
    default:
      return true
  }
}

export function meta() {
  return [{ title: 'Mentor | Admin' }]
}

export default function AdminMentorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [directoryFilter, setDirectoryFilter] = useState<MentorDirectoryFilter>('ALL')

  const filteredMentorDirectory = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return adminMentorDirectory.filter((mentor) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        mentor.mentorName.toLowerCase().includes(normalizedQuery) ||
        mentor.offeringsSummary.toLowerCase().includes(normalizedQuery) ||
        mentor.headline.toLowerCase().includes(normalizedQuery)

      return matchesSearch && matchesDirectoryFilter(mentor, directoryFilter)
    })
  }, [directoryFilter, searchQuery])

  const directoryCounts = useMemo(
    () =>
      mentorDirectoryFilters.reduce<Record<MentorDirectoryFilter, number>>(
        (accumulator, filter) => {
          accumulator[filter.key] = adminMentorDirectory.filter((mentor) =>
            matchesDirectoryFilter(mentor, filter.key)
          ).length

          return accumulator
        },
        {} as Record<MentorDirectoryFilter, number>
      ),
    []
  )

  return (
    <DashboardPage
      description='Tách rõ hàng chờ phê duyệt và danh sách mentor đang hoạt động để admin không trộn lẫn duyệt hồ sơ với vận hành lâu dài.'
      title='Quản lý mentor'
    >
      <div className='space-y-6'>
        <WorkspacePanel
          className='border-amber-200'
          title='Hồ sơ chờ duyệt'
          description='Approval và verification luôn hiển thị tách riêng để admin biết hồ sơ nào thiếu giấy tờ, hồ sơ nào chỉ còn bước quyết định cuối.'
        >
          {adminQueueItems.length === 0 ? (
            <EmptyState
              description='Khi có mentor mới gửi hồ sơ, hàng chờ xét duyệt sẽ xuất hiện tại đây để đội admin xử lý trước khi mentor lên marketplace.'
              title='Không có hồ sơ cần duyệt'
            />
          ) : (
            <div className='grid gap-4'>
              {adminQueueItems.map((mentor) => (
                <Card className='rounded-2xl border-amber-200 shadow-none' key={mentor.id}>
                  <CardContent className='flex flex-col gap-5 p-5 xl:flex-row xl:items-start'>
                    <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-lg font-semibold text-amber-700'>
                      {getInitials(mentor.mentorName)}
                    </div>

                    <div className='min-w-0 flex-1 space-y-4'>
                      <div className='flex flex-wrap items-start justify-between gap-3'>
                        <div>
                          <h2 className='text-ink text-lg font-semibold'>{mentor.mentorName}</h2>
                          <p className='text-muted mt-1 text-sm'>{mentor.headline}</p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <StatusBadge kind='approval' status={mentor.approvalStatus} />
                          <StatusBadge kind='verification' status={mentor.verificationStatus} />
                        </div>
                      </div>

                      <div className='text-muted grid gap-2 text-sm md:grid-cols-2 xl:grid-cols-3'>
                        <p>{mentor.offeringsSummary}</p>
                        <p>Gửi hồ sơ {mentor.submittedAtLabel}</p>
                        <p>
                          {mentor.priority === 'high'
                            ? 'Ưu tiên xử lý trong ngày'
                            : 'Cần phản hồi bổ sung'}
                        </p>
                      </div>

                      <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
                        <CardContent className='p-4 text-sm text-slate-600'>
                          {mentor.note}
                        </CardContent>
                      </Card>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 xl:border-t-0 xl:pt-0'>
                      <Button>Duyệt</Button>
                      <Button variant='destructive'>Từ chối</Button>
                      <Button variant='outline'>
                        <ExternalLink aria-hidden='true' size={16} />
                        Xem hồ sơ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </WorkspacePanel>

        <WorkspacePanel
          title='Mentor đang hoạt động'
          description='Dùng để rà soát mentor đã lên sàn, tạm dừng hồ sơ khi cần và theo dõi chất lượng hoạt động hiện tại.'
          action={
            <StatusFilterPills
              onValueChange={setDirectoryFilter}
              options={mentorDirectoryFilters.map((filter) => ({
                key: filter.key,
                label: `${filter.label} (${directoryCounts[filter.key]})`
              }))}
              value={directoryFilter}
            />
          }
        >
          <div className='flex w-full flex-wrap items-center gap-3'>
            <div className='relative min-w-[260px] flex-1'>
              <Search
                aria-hidden='true'
                className='text-muted absolute top-1/2 left-3 -translate-y-1/2'
                size={16}
              />
              <Input
                className='pl-10'
                id='admin-mentor-search'
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Tìm theo mentor, môn học hoặc headline'
                type='search'
                value={searchQuery}
              />
            </div>
            <Button variant='outline'>
              <Filter aria-hidden='true' size={16} />
              Bộ lọc mở rộng
            </Button>
          </div>

          {filteredMentorDirectory.length === 0 ? (
            <EmptyState
              description='Hãy thử đổi từ khóa hoặc quay lại trạng thái khác để xem thêm mentor phù hợp với hàng duyệt hiện tại.'
              title='Không tìm thấy mentor phù hợp'
            />
          ) : (
            <div className='grid gap-4'>
              {filteredMentorDirectory.map((mentor) => (
                <Card className='rounded-2xl shadow-none' key={mentor.id}>
                  <CardContent className='flex flex-col gap-5 p-5 xl:flex-row xl:items-center'>
                    <div className='bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold'>
                      {getInitials(mentor.mentorName)}
                    </div>

                    <div className='min-w-0 flex-1 space-y-4'>
                      <div className='flex flex-wrap items-start justify-between gap-3'>
                        <div>
                          <h2 className='text-ink text-lg font-semibold'>{mentor.mentorName}</h2>
                          <p className='text-muted mt-1 text-sm'>{mentor.headline}</p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <StatusBadge kind='approval' status={mentor.approvalStatus} />
                          <StatusBadge kind='verification' status={mentor.verificationStatus} />
                        </div>
                      </div>

                      <div className='text-muted grid gap-2 text-sm md:grid-cols-2 xl:grid-cols-4'>
                        <p>{mentor.offeringsSummary}</p>
                        <p>{mentor.ratingLabel} đánh giá</p>
                        <p className='inline-flex items-center gap-2'>
                          <Users aria-hidden='true' size={14} />
                          {mentor.activeStudentsCount} học viên đang học
                        </p>
                        <p>{mentor.submittedAtLabel}</p>
                      </div>

                      <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
                        <CardContent className='p-4 text-sm text-slate-600'>
                          {mentor.reviewNote}
                        </CardContent>
                      </Card>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 xl:border-t-0 xl:pt-0'>
                      <Button variant='outline'>
                        <ShieldCheck aria-hidden='true' size={16} />
                        Xem hồ sơ
                      </Button>
                      <Button variant='outline'>
                        {mentor.approvalStatus === 'SUSPENDED' ? 'Mở lại' : 'Tạm dừng'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </WorkspacePanel>
      </div>
    </DashboardPage>
  )
}
