import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { catalogApi } from '@/services/catalog.api'
const LEVEL_GROUPS = [
  { value: 'PRIMARY', label: 'C\u1EA5p 1 (Ti\u1EC3u h\u1ECDc)' },
  { value: 'SECONDARY', label: 'C\u1EA5p 2 (THCS)' },
  { value: 'HIGH_SCHOOL', label: 'C\u1EA5p 3 (THPT)' }
]
function GradeFormModal({ isOpen, onClose, onSuccess, initialData }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    levelGroup: 'PRIMARY'
  })
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          levelGroup: initialData.levelGroup
        })
      } else {
        setFormData({
          name: '',
          levelGroup: 'PRIMARY'
        })
      }
      setError('')
    }
  }, [isOpen, initialData])
  if (typeof document === 'undefined' || !isOpen) return null
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      if (initialData) {
        await catalogApi.updateGrade(initialData.id, formData)
        onSuccess('C\u1EADp nh\u1EADt l\u1EDBp h\u1ECDc / c\u1EA5p \u0111\u1ED9 th\xE0nh c\xF4ng.')
      } else {
        await catalogApi.createGrade(formData)
        onSuccess('Th\xEAm l\u1EDBp h\u1ECDc / c\u1EA5p \u0111\u1ED9 th\xE0nh c\xF4ng.')
      }
      onClose()
    } catch (err) {
      setError(
        err?.response?.data?.message || 'C\xF3 l\u1ED7i x\u1EA3y ra, vui l\xF2ng th\u1EED l\u1EA1i'
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  return createPortal(
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm md:p-6'>
      <div className='w-full max-w-[500px] rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]'>
        <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-7 py-5'>
          <h3 className='text-ink text-[1.5rem] font-bold tracking-tight'>
            {initialData
              ? 'Ch\u1EC9nh s\u1EEDa C\u1EA5p \u0111\u1ED9'
              : 'Th\xEAm C\u1EA5p \u0111\u1ED9 m\u1EDBi'}
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

        <form onSubmit={handleSubmit}>
          <div className='space-y-5 px-7 py-6'>
            {error && (
              <div className='rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label className='text-ink text-sm font-medium' htmlFor='levelGroup'>
                Nhóm Cấp bậc
              </Label>
              <select
                id='levelGroup'
                value={formData.levelGroup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    levelGroup: e.target.value
                  })
                }
                className='focus:border-primary focus:ring-primary flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required
              >
                {LEVEL_GROUPS.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <Label className='text-ink text-sm font-medium' htmlFor='name'>
                Tên Lớp học / Trình độ
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className='h-12 rounded-xl'
                placeholder='Ví dụ: Lớp 1, Lớp 12, Tiếng Anh B1...'
              />
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-slate-200 px-7 py-4'>
            <Button
              type='button'
              className='h-11 rounded-xl px-5'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type='submit' className='h-11 rounded-xl px-6' disabled={isSubmitting}>
              {isSubmitting ? '\u0110ang x\u1EED l\xFD...' : 'L\u01B0u th\xF4ng tin'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
export { GradeFormModal }
