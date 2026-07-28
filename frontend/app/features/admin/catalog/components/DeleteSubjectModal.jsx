import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { catalogApi } from '@/services/catalog.api'
function DeleteSubjectModal({ isOpen, onClose, onSuccess, subject }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (isOpen) {
      setError('')
    }
  }, [isOpen])
  if (typeof document === 'undefined' || !isOpen || !subject) return null
  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')
    try {
      await catalogApi.deleteSubject(subject.id)
      onSuccess('X\xF3a m\xF4n h\u1ECDc th\xE0nh c\xF4ng.')
      onClose()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Kh\xF4ng th\u1EC3 x\xF3a m\xF4n h\u1ECDc (C\xF3 th\u1EC3 \u0111ang \u0111\u01B0\u1EE3c Gia s\u01B0 gi\u1EA3ng d\u1EA1y)'
      )
    } finally {
      setIsDeleting(false)
    }
  }
  return createPortal(
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm md:p-6'>
      <div className='w-full max-w-[480px] rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]'>
        <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-7 py-5'>
          <h3 className='text-ink flex items-center gap-2 text-[1.25rem] font-bold tracking-tight'>
            <AlertTriangle className='text-red-500' size={24} />
            Xác nhận xóa môn học
          </h3>
          <button
            aria-label='Đóng modal'
            className='flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
            onClick={onClose}
            type='button'
          >
            <X size={22} />
          </button>
        </div>

        <div className='space-y-4 px-7 py-6'>
          <p className='text-slate-600'>
            Bạn có chắc chắn muốn xóa môn học{' '}
            <strong className='text-slate-900'>{subject.name}</strong> không? Hành động này không
            thể hoàn tác.
          </p>

          {error && (
            <div
              className='rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700'
              role='alert'
            >
              {error}
            </div>
          )}
        </div>

        <div className='flex items-center justify-end gap-3 rounded-b-[24px] border-t border-slate-200 bg-slate-50/50 px-7 py-4'>
          <Button
            type='button'
            className='h-11 rounded-xl px-5'
            variant='outline'
            onClick={onClose}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            type='button'
            variant='destructive'
            className='h-11 rounded-xl bg-red-600 px-6 hover:bg-red-700'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '\u0110ang x\u1EED l\xFD...' : 'X\xF3a m\xF4n h\u1ECDc'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
export { DeleteSubjectModal }
