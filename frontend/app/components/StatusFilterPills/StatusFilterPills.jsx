import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
function StatusFilterPills({ options, value, onValueChange, className }) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.key
        return (
          <Button
            aria-pressed={isSelected}
            className={cn(
              'rounded-xl border px-3 shadow-none transition-colors',
              isSelected
                ? 'border-sky-600 bg-sky-600 text-white hover:border-sky-700 hover:bg-sky-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800'
            )}
            key={option.key}
            onClick={() => onValueChange(option.key)}
            size='sm'
            type='button'
            variant='outline'
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
export { StatusFilterPills }
