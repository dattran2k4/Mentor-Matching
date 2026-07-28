import * as React from 'react'
import { cn } from '@/utils/cn'
const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type='checkbox'
      className={cn(
        'border-line text-primary focus:ring-primary/20 mt-0.5 h-4 w-4 rounded border bg-white accent-[var(--color-primary)] outline-none focus:ring-2',
        className
      )}
    />
  )
})
Checkbox.displayName = 'Checkbox'
export { Checkbox }
