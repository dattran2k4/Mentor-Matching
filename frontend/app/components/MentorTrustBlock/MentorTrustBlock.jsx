import { Award, ShieldCheck, Sparkles } from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'
function MentorTrustBlock({ className, mentor }) {
  const hasPublicTrustStatuses = Boolean(mentor.approvalStatus || mentor.verificationStatus)
  return (
    <Card className={cn('rounded-3xl', className)}>
      <CardContent className='p-6'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div>
            <p className='text-ink text-xl font-semibold'>Điểm tin cậy</p>
            <p className='text-muted mt-1 text-sm'>
              Phụ huynh và học viên có thể kiểm tra duyệt hồ sơ, xác minh danh tính và thế mạnh nổi
              bật trước khi gửi yêu cầu đặt lịch.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {mentor.approvalStatus ? (
              <StatusBadge kind='approval' status={mentor.approvalStatus} />
            ) : null}
            {mentor.verificationStatus ? (
              <StatusBadge kind='verification' status={mentor.verificationStatus} />
            ) : null}
            {!hasPublicTrustStatuses ? (
              <Badge variant='muted'>Endpoint public chưa trả về trạng thái trust</Badge>
            ) : null}
          </div>
        </div>

        <div className='mt-5 grid gap-4 md:grid-cols-2'>
          <TrustCard
            description={
              mentor.approvalStatus
                ? 'H\u1ED3 s\u01A1 c\xF4ng khai sau khi \u0111\u01B0\u1EE3c \u0111\u1ED9i ng\u0169 v\u1EADn h\xE0nh ki\u1EC3m tra n\u1ED9i dung gi\u1EA3ng d\u1EA1y, th\xF4ng tin c\u01A1 b\u1EA3n v\xE0 kh\u1EA3 n\u0103ng nh\u1EADn l\u1ECBch.'
                : 'Route public hi\u1EC7n ch\u01B0a tr\u1EA3 v\u1EC1 approval status, n\xEAn m\xE0n h\xECnh gi\u1EEF th\xF4ng tin n\xE0y \u1EDF tr\u1EA1ng th\xE1i trung th\u1EF1c thay v\xEC suy di\u1EC5n.'
            }
            icon={<ShieldCheck className='text-primary h-4 w-4' />}
            title='Duyệt hồ sơ mentor'
          />
          <TrustCard
            description={
              mentor.verificationStatus
                ? 'Tr\u1EA1ng th\xE1i x\xE1c minh \u0111\u01B0\u1EE3c theo d\xF5i ri\xEAng \u0111\u1EC3 l\xE0m r\xF5 danh t\xEDnh, kh\xF4ng thay th\u1EBF cho tr\u1EA1ng th\xE1i duy\u1EC7t c\xF4ng khai.'
                : 'Route public hi\u1EC7n ch\u01B0a tr\u1EA3 v\u1EC1 verification status, n\xEAn ch\u1EC9 hi\u1EC3n th\u1ECB ph\u1EA7n t\xEDn hi\u1EC7u c\xF3 th\u1EADt t\u1EEB contract hi\u1EC7n c\xF3.'
            }
            icon={<Award className='text-primary h-4 w-4' />}
            title='Xác minh danh tính'
          />
        </div>

        <div className='mt-5'>
          <div className='flex items-center gap-2'>
            <Sparkles className='text-primary h-4 w-4' />
            <p className='text-ink text-sm font-semibold'>Điểm nổi bật khi ra quyết định</p>
          </div>
          <div className='mt-3 flex flex-wrap gap-2'>
            {mentor.highlights.length ? (
              mentor.highlights.map((highlight) => (
                <Badge key={highlight} variant='muted'>
                  {highlight}
                </Badge>
              ))
            ) : (
              <Badge variant='outline'>Mentor chưa công khai thêm điểm nổi bật</Badge>
            )}
          </div>
        </div>

        <div className='mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
          <p className='text-ink text-sm font-semibold'>Cam kết và thành tích</p>
          <ul className='mt-3 space-y-2'>
            {mentor.achievements.map((achievement) => (
              <li key={achievement} className='flex items-start gap-2 text-sm text-slate-700'>
                <span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-500' />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
function TrustCard({ description, icon, title }) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
      <div className='flex items-center gap-2'>
        {icon}
        <p className='text-ink font-semibold'>{title}</p>
      </div>
      <p className='text-muted mt-2 text-sm leading-relaxed'>{description}</p>
    </div>
  )
}
export { MentorTrustBlock }
