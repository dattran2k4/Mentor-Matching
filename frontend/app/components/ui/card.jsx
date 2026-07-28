import { cn } from '@/utils/cn'
function Card({ className, ...props }) {
  return (
    <div
      {...props}
      className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}
    />
  )
}
function CardHeader({ className, ...props }) {
  return <div {...props} className={cn('flex flex-col gap-2 p-6', className)} />
}
function CardTitle({ className, ...props }) {
  return <h3 {...props} className={cn('text-ink text-lg font-semibold', className)} />
}
function CardDescription({ className, ...props }) {
  return <p {...props} className={cn('text-muted text-sm leading-relaxed', className)} />
}
function CardContent({ className, ...props }) {
  return <div {...props} className={cn('p-6 pt-0', className)} />
}
function CardFooter({ className, ...props }) {
  return <div {...props} className={cn('flex items-center p-6 pt-0', className)} />
}
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
