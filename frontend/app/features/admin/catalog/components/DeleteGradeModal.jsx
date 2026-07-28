import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { catalogApi } from '@/services/catalog.api'
function DeleteGradeModal({ isOpen, onClose, onSuccess, grade }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  if (typeof document === 'undefined' || !isOpen || !grade) return null
  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')
    try {
      await catalogApi.deleteGrade(grade.id)
      onSuccess('X\xF3a l\u1EDBp h\u1ECDc / c\u1EA5p \u0111\u1ED9 th\xE0nh c\xF4ng.')
      onClose()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Kh\xF4ng th\u1EC3 x\xF3a c\u1EA5p \u0111\u1ED9 n\xE0y (C\xF3 th\u1EC3 \u0111ang \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng)'
      )
    } finally {
      setIsDeleting(false)
    }
  }
  return createPortal(
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm md:p-6'>
      <div className='w-full max-w-[400px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22)]'>
        <div className='mb-4 flex items-center justify-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600'>
            <AlertTriangle size={24} />
          </div>
        </div>

        <h3 className='mb-2 text-center text-lg font-bold text-slate-900'>Xóa lớp học / cấp độ?</h3>
        <p className='mb-6 text-center text-sm text-slate-500'>
          Bạn có chắc chắn muốn xóa lớp <strong>{grade.name}</strong>? Thao tác này không thể hoàn
          tác.
        </p>

        {error && (
          <div className='mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700'>
            {error}
          </div>
        )}

        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='h-11 flex-1 rounded-xl'
            onClick={onClose}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            variant='destructive'
            className='h-11 flex-1 rounded-xl bg-red-600 hover:bg-red-700'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '\u0110ang x\xF3a...' : 'X\xF3a ngay'}
          </Button>
        </div>

        <button
          aria-label='Đóng modal'
          className='absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
    </div>,
    document.body
  )
}
export { DeleteGradeModal }
