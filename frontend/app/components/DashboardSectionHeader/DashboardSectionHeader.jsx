import { cn } from '@/utils/cn'
function DashboardSectionHeader({ action, className, title }) {
  return (
    <div
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className='space-y-1'>
        <h2 className='text-ink text-lg font-semibold'>{title}</h2>
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  )
}
export { DashboardSectionHeader }
