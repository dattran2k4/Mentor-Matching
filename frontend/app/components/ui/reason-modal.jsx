import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, X } from 'lucide-react'
import { Button } from './button'
import { Textarea } from './textarea'
function ReasonModal({
  open,
  onOpenChange,
  title,
  description = 'Vui l\xF2ng nh\u1EADp l\xFD do \u0111\u1EC3 ti\u1EBFp t\u1EE5c.',
  placeholder = 'Nh\u1EADp l\xFD do...',
  confirmLabel = 'X\xE1c nh\u1EADn',
  confirmingLabel = '\u0110ang x\u1EED l\xFD...',
  onConfirm,
  isConfirming
}) {
  const [reason, setReason] = useState('')
  if (typeof document === 'undefined' || !open) return null
  return createPortal(
    <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4'>
      <div className='animate-in fade-in zoom-in relative flex w-full max-w-[440px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22)] duration-200'>
        <button
          aria-label='Đóng'
          className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
          onClick={() => onOpenChange(false)}
          type='button'
          disabled={isConfirming}
        >
          <X size={20} />
        </button>

        <div className='mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500'>
          <AlertCircle size={32} />
        </div>

        <h3 className='text-ink text-xl font-bold tracking-tight'>{title}</h3>
        <p className='text-muted mt-2 text-sm'>{description}</p>

        <div className='mt-5'>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={placeholder}
            className='min-h-[100px] resize-none'
          />
        </div>

        <div className='mt-7 flex w-full gap-3'>
          <Button
            type='button'
            variant='outline'
            className='h-11 flex-1 rounded-2xl'
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            Hủy
          </Button>
          <Button
            type='button'
            variant='destructive'
            className='h-11 flex-1 rounded-2xl font-semibold'
            onClick={() => onConfirm(reason)}
            disabled={isConfirming || !reason.trim()}
          >
            {isConfirming ? confirmingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
export { ReasonModal }
