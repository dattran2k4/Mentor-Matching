import { cn } from '@/utils/cn'
function Label({ className, ...props }) {
  return <label {...props} className={cn('text-ink text-sm font-medium', className)} />
}
export { Label }
