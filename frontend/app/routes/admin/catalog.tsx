import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardPage } from '@/components/DashboardPage'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { EmptyState } from '@/components/EmptyState'
import { catalogApi } from '@/services/catalog.api'
import type { CatalogOptionsApiResponse, CatalogSubjectApiResponse } from '@/types/api/catalog'
import { SubjectTable } from '@/features/admin/catalog/components/SubjectTable'
import { SubjectFormModal } from '@/features/admin/catalog/components/SubjectFormModal'
import { Spinner } from '@/components/ui/spinner'

export default function AdminCatalogPage() {
  const [data, setData] = useState<CatalogOptionsApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<CatalogSubjectApiResponse | null>(null)

  const fetchData = async (message?: string) => {
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    try {
      const response = await catalogApi.getCatalogOptions()
      setData(response.data)
      if (message) {
        setSuccessMessage(message)
      }
    } catch (err: any) {
      setError('Lỗi khi tải dữ liệu danh mục.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenSubjectModal = (subject?: CatalogSubjectApiResponse) => {
    setEditingSubject(subject || null)
    setIsSubjectModalOpen(true)
  }

  if (isLoading) {
    return (
      <DashboardPage title="Quản lý Danh mục">
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </DashboardPage>
    )
  }

  if (error) {
    return (
      <DashboardPage title="Quản lý Danh mục">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm">
          <p className="font-medium">{error}</p>
          <Button onClick={() => fetchData()} className="mt-4" variant="outline">Thử lại</Button>
        </div>
      </DashboardPage>
    )
  }

  return (
    <DashboardPage
      title="Quản lý Danh mục"
      description="Quản lý và quy hoạch danh sách môn học, lớp học được áp dụng trên toàn hệ thống."
    >
      <WorkspacePanel
        title="Danh sách Môn học (Subjects)"
        description="Định nghĩa các môn học chính khóa và kỹ năng mà Mentor có thể đăng ký giảng dạy."
        action={
          <Button onClick={() => handleOpenSubjectModal()} className="rounded-xl px-5 h-10">
            <Plus size={16} className="mr-2" />
            Thêm Môn học
          </Button>
        }
      >
        {successMessage ? (
          <div className='mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700' role='alert'>
            {successMessage}
          </div>
        ) : null}

        {!data?.subjects || data.subjects.length === 0 ? (
          <EmptyState
            title="Chưa có môn học nào"
            description="Bắt đầu thêm các môn học đầu tiên để Mentor có thể lựa chọn."
          />
        ) : (
          <SubjectTable
            subjects={data.subjects}
            categories={data.categories || []}
            onEdit={handleOpenSubjectModal}
            onRefresh={fetchData}
          />
        )}
      </WorkspacePanel>

      <SubjectFormModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSuccess={fetchData}
        categories={data?.categories || []}
        initialData={editingSubject}
      />
    </DashboardPage>
  )
}
