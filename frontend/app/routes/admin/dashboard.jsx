import { Link } from 'react-router'
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  DollarSign,
  FileWarning,
  Settings2,
  ShieldCheck,
  UserPlus,
  Users
} from 'lucide-react'
import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { WorkspaceActionCard } from '@/components/WorkspaceActionCard'
import { WorkspaceMetricCard } from '@/components/WorkspaceMetricCard'
import { WorkspaceNotice } from '@/components/WorkspaceNotice'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { path } from '@/config/path'
import { DailyTrendChart } from '@/features/admin/dashboard/components/DailyTrendChart'
import { useAdminStatsOverviewQuery } from '@/hooks/queries/admin/useAdminStatsOverviewQuery'
import { useAdminStatsTimeseriesQuery } from '@/hooks/queries/admin/useAdminStatsTimeseriesQuery'
import { adminDashboardSummary, adminQueueItems, adminReports } from '@/mocks/admin-workspace'
import { formatPrice } from '@/utils/format'
import { cn } from '@/utils/cn'
const quickLinks = [
  {
    title: 'M\u1EDF h\xE0ng duy\u1EC7t mentor',
    description:
      '\u0110i th\u1EB3ng \u0111\u1EBFn c\xE1c h\u1ED3 s\u01A1 c\u1EA7n ch\u1ED1t duy\u1EC7t ho\u1EB7c t\u1EEB ch\u1ED1i.',
    href: path.admin.mentors,
    icon: BookOpenCheck
  },
  {
    title: 'R\xE0 so\xE1t ng\u01B0\u1EDDi d\xF9ng',
    description:
      'Ki\u1EC3m tra t\xE0i kho\u1EA3n mentor, h\u1ECDc vi\xEAn v\xE0 ph\u1EE5 huynh c\u1EA7n theo d\xF5i.',
    href: path.admin.users,
    icon: Users
  },
  {
    title: 'Ki\u1EC3m tra c\xE0i \u0111\u1EB7t v\u1EADn h\xE0nh',
    description:
      'Xem c\xE1c nh\xF3m c\u1EA5u h\xECnh \u0111ang c\xF3 quy \u01B0\u1EDBc v\xE0 ph\u1EA7n n\xE0o c\xF2n ch\u1EDD backend.',
    href: path.admin.settings,
    icon: Settings2
  }
]
const systemHealth = [
  {
    label: 'H\xE0ng \u0111\u1EE3i duy\u1EC7t mentor',
    value: '\u1ED4n \u0111\u1ECBnh',
    helper:
      '\u0110ang c\xF2n 6 h\u1ED3 s\u01A1, trong \u0111\xF3 2 h\u1ED3 s\u01A1 c\u1EA7n x\u1EED l\xFD ngay trong h\xF4m nay.'
  },
  {
    label: 'B\xE1o c\xE1o ng\u01B0\u1EDDi d\xF9ng',
    value: 'C\u1EA7n ch\xFA \xFD',
    helper:
      'C\xF3 m\u1ED9t b\xE1o c\xE1o m\u1EE9c cao m\u1EDBi g\u1EEDi, n\xEAn \u01B0u ti\xEAn ki\u1EC3m tra tr\u01B0\u1EDBc c\xE1c vi\u1EC7c theo d\xF5i kh\xE1c.'
  },
  {
    label: 'Thi\u1EBFt l\u1EADp v\u1EADn h\xE0nh',
    value: 'M\u1ED9t ph\u1EA7n th\u1EE7 c\xF4ng',
    helper:
      'Reports v\xE0 payment operations v\u1EABn c\u1EA7n backend r\xF5 h\u01A1n tr\u01B0\u1EDBc khi m\u1EDF c\u1EA5u h\xECnh tr\u1EF1c ti\u1EBFp.'
  }
]
function meta() {
  return [{ title: 'T\u1ED5ng quan | Admin' }]
}
function AdminDashboardPage() {
  const highlightedReports = adminReports.filter((report) => report.status !== 'CLOSED').slice(0, 2)
  const { data: statsOverview } = useAdminStatsOverviewQuery()
  const { data: statsTimeseries } = useAdminStatsTimeseriesQuery()
  const bookingTrendData = (statsTimeseries ?? []).map((point) => ({
    date: point.date,
    value: point.bookingsCount
  }))
  const revenueTrendData = (statsTimeseries ?? []).map((point) => ({
    date: point.date,
    value: point.revenue
  }))
  return (
    <DashboardPage
      description='Ưu tiên hàng chờ duyệt, báo cáo mở và các tín hiệu vận hành ảnh hưởng trực tiếp đến marketplace.'
      title='Tổng quan Admin'
    >
      <WorkspacePanel
        description='Số liệu tăng trưởng người dùng, booking và doanh thu trong 30 ngày gần nhất.'
        title='Thống kê tổng quan'
      >
        <div className='grid gap-4 xl:grid-cols-4'>
          <WorkspaceMetricCard
            helper={
              statsOverview
                ? `T\u1EEB ${statsOverview.from} \u0111\u1EBFn ${statsOverview.to}`
                : void 0
            }
            icon={UserPlus}
            label='Người dùng mới'
            value={statsOverview ? statsOverview.newUsersCount : '\u2014'}
          />
          <WorkspaceMetricCard
            helper='Mentor đăng ký mới trong khoảng thời gian'
            icon={Users}
            label='Mentor mới'
            value={statsOverview ? statsOverview.newMentorsCount : '\u2014'}
          />
          <WorkspaceMetricCard
            helper={
              statsOverview
                ? `${statsOverview.completedBookings}/${statsOverview.totalBookings} booking ho\xE0n th\xE0nh`
                : void 0
            }
            icon={BookOpenCheck}
            label='Tỷ lệ hoàn thành Booking'
            tone='success'
            value={statsOverview ? `${Math.round(statsOverview.completionRate * 100)}%` : '\u2014'}
          />
          <WorkspaceMetricCard
            helper='Tổng giao dịch đã thanh toán qua Stripe'
            icon={DollarSign}
            label='Doanh thu'
            tone='warning'
            value={statsOverview ? formatPrice(statsOverview.totalRevenue) : '\u2014'}
          />
        </div>

        <div className='grid gap-4 xl:grid-cols-2'>
          <DailyTrendChart
            color='var(--primary)'
            data={bookingTrendData}
            title='Booking theo ngày'
            valueFormatter={(value) => String(value)}
          />
          <DailyTrendChart
            color='var(--secondary)'
            data={revenueTrendData}
            title='Doanh thu theo ngày'
            valueFormatter={(value) => formatPrice(value)}
          />
        </div>
      </WorkspacePanel>

      <WorkspacePanel
        title='Cần xử lý hôm nay'
        description='Đưa các đầu việc cần quyết định lên trước metric để admin biết nên mở màn hình nào ngay.'
        action={
          <Link
            className={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'h-auto px-0')}
            to={path.admin.mentors}
          >
            Mở duyệt mentor
            <ArrowRight aria-hidden='true' size={14} />
          </Link>
        }
      >
        {adminQueueItems.length === 0 ? (
          <EmptyState
            description='Khi không còn hồ sơ mentor nào chờ xử lý, phần tổng quan sẽ chuyển sang tập trung vào báo cáo và theo dõi hệ thống.'
            title='Không có mục cần xử lý gấp'
          />
        ) : (
          <div className='grid gap-4'>
            {adminQueueItems.map((item) => (
              <Card className='rounded-2xl shadow-none' key={item.id}>
                <CardContent className='flex flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='space-y-3'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='text-ink text-lg font-semibold'>{item.mentorName}</h2>
                      <StatusBadge kind='approval' status={item.approvalStatus} />
                      <StatusBadge kind='verification' status={item.verificationStatus} />
                    </div>
                    <p className='text-muted text-sm'>{item.headline}</p>
                    <div className='text-muted grid gap-2 text-sm md:grid-cols-2'>
                      <p>{item.offeringsSummary}</p>
                      <p>Gửi hồ sơ {item.submittedAtLabel}</p>
                    </div>
                    <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
                      <CardContent className='p-4 text-sm text-slate-600'>{item.note}</CardContent>
                    </Card>
                  </div>

                  <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0'>
                    <Badge variant={item.priority === 'high' ? 'destructive' : 'warning'}>
                      {item.priority === 'high' ? '\u01AFu ti\xEAn cao' : 'Theo d\xF5i'}
                    </Badge>
                    <Link className={buttonVariants()} to={path.admin.mentors}>
                      Rà soát hồ sơ
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </WorkspacePanel>

      <div className='grid gap-4 xl:grid-cols-4'>
        {adminDashboardSummary.map((item, index) => {
          const icons = [BookOpenCheck, ShieldCheck, FileWarning, AlertTriangle]
          return (
            <WorkspaceMetricCard
              helper={item.helper}
              icon={icons[index]}
              key={item.label}
              label={item.label}
              value={item.value}
            />
          )
        })}
      </div>

      <div className='grid gap-6 xl:grid-cols-[1.3fr_1fr]'>
        <WorkspacePanel
          title='Báo cáo và cờ vận hành'
          description='Giữ màn hình này trung thực: chỉ hiển thị hàng đợi và bối cảnh xử lý, chưa giả lập moderation workflow đầy đủ.'
          action={
            <Link
              className={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'h-auto px-0')}
              to={path.admin.reports}
            >
              Xem tất cả báo cáo
              <ArrowRight aria-hidden='true' size={14} />
            </Link>
          }
        >
          <div className='space-y-4'>
            {highlightedReports.map((report) => (
              <Card className='rounded-2xl shadow-none' key={report.id}>
                <CardContent className='flex items-start gap-4 p-4'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700'>
                    <FileWarning aria-hidden='true' size={20} />
                  </div>
                  <div className='min-w-0 flex-1 space-y-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-ink font-semibold'>{report.title}</p>
                      <Badge variant={report.severity === 'HIGH' ? 'destructive' : 'warning'}>
                        {report.severity === 'HIGH' ? 'M\u1EE9c cao' : 'M\u1EE9c trung b\xECnh'}
                      </Badge>
                    </div>
                    <p className='text-muted text-sm'>
                      {report.reportType} · {report.relatedEntity} · {report.submittedAtLabel}
                    </p>
                    <p className='text-muted text-sm'>{report.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title='Tình trạng vận hành'
          description='Các tín hiệu ngắn giúp admin biết phần nào đang ổn, phần nào còn cần thao tác thủ công.'
        >
          <div className='grid gap-3'>
            {systemHealth.map((item) => (
              <WorkspaceMetricCard
                helper={item.helper}
                icon={ShieldCheck}
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </WorkspacePanel>
      </div>

      <WorkspacePanel
        title='Đi nhanh tới màn hình cần dùng'
        description='Giữ điều hướng admin thực dụng: mentor, users, reports và settings đều có entry point rõ ràng.'
      >
        <div className='grid gap-3 lg:grid-cols-3'>
          {quickLinks.map((item) => (
            <WorkspaceActionCard
              description={item.description}
              icon={item.icon}
              key={item.title}
              title={item.title}
              to={item.href}
            />
          ))}
        </div>
      </WorkspacePanel>

      <WorkspaceNotice
        description='Reports và settings mới mô tả hàng đợi, quy ước vận hành và phạm vi backend hiện có. Chúng chưa đại diện cho workflow moderation hoặc cấu hình hệ thống hoàn chỉnh.'
        icon={AlertTriangle}
        title='Lưu ý ở giai đoạn UI tĩnh'
        tone='warning'
      />
    </DashboardPage>
  )
}
export { AdminDashboardPage as default, meta }
