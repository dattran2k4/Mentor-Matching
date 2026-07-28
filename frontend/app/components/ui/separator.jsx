import { cn } from '@/utils/cn'
function Separator({ className, orientation = 'horizontal', ...props }) {
  return (
    <div
      {...props}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-slate-200',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      role='separator'
    />
  )
}
export { Separator }
