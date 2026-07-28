import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'
const toneClassMap = {
  info: 'border-blue-100 bg-blue-50 text-blue-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  neutral: 'border-slate-200 bg-slate-50 text-slate-900'
}
const iconToneClassMap = {
  info: 'text-blue-700',
  warning: 'text-amber-700',
  neutral: 'text-slate-700'
}
const bodyToneClassMap = {
  info: 'text-blue-800',
  warning: 'text-amber-800',
  neutral: 'text-slate-700'
}
function WorkspaceNotice({ className, description, icon: Icon, title, tone = 'info' }) {
  return (
    <Card className={cn('rounded-3xl shadow-sm', toneClassMap[tone], className)}>
      <CardContent className='flex items-start gap-3 p-4 md:p-5'>
        <div className={cn('mt-0.5 shrink-0', iconToneClassMap[tone])}>
          <Icon aria-hidden='true' size={18} />
        </div>
        <div className='space-y-1.5'>
          <p className='font-semibold'>{title}</p>
          <p className={cn('text-sm leading-relaxed', bodyToneClassMap[tone])}>{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
export { WorkspaceNotice }
