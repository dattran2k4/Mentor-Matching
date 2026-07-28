import { AlertTriangle } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
function ScreenErrorState({
  description = 'Kh\xF4ng th\u1EC3 t\u1EA3i d\u1EEF li\u1EC7u m\xE0n h\xECnh l\xFAc n\xE0y. Vui l\xF2ng th\u1EED l\u1EA1i \u0111\u1EC3 ti\u1EBFp t\u1EE5c.',
  onRetry,
  retryLabel = 'Th\u1EED l\u1EA1i',
  title = '\u0110\xE3 c\xF3 l\u1ED7i x\u1EA3y ra'
}) {
  return (
    <EmptyState
      className='border-red-100 bg-red-50/40'
      description={description}
      icon={<AlertTriangle aria-hidden='true' size={26} />}
      title={title}
      action={
        onRetry ? (
          <Button className='rounded-full' onClick={onRetry} type='button' variant='destructive'>
            {retryLabel}
          </Button>
        ) : null
      }
    />
  )
}
export { ScreenErrorState }
