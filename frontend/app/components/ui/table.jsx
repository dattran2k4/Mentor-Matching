import { cn } from '@/utils/cn'
function Table({ className, ...props }) {
  return <table {...props} className={cn('w-full caption-bottom text-sm', className)} />
}
function TableHeader({ className, ...props }) {
  return <thead {...props} className={cn('[&_tr]:border-b', className)} />
}
function TableBody({ className, ...props }) {
  return <tbody {...props} className={cn('[&_tr:last-child]:border-0', className)} />
}
function TableRow({ className, ...props }) {
  return <tr {...props} className={cn('border-b border-slate-100 align-top', className)} />
}
function TableHead({ className, ...props }) {
  return (
    <th
      {...props}
      className={cn(
        'h-11 px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase',
        className
      )}
    />
  )
}
function TableCell({ className, ...props }) {
  return <td {...props} className={cn('px-4 py-4', className)} />
}
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
