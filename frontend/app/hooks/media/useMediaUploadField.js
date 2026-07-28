import axios from 'axios'
import { useState } from 'react'
import { useUploadMediaMutation } from '@/hooks/queries/media/useUploadMediaMutation'
const emptyMediaUploadFieldValue = {
  fileName: '',
  mediaId: null,
  previewUrl: ''
}
function useMediaUploadField({
  initialValue = emptyMediaUploadFieldValue,
  purpose,
  resourceType = 'IMAGE'
}) {
  const [value, setValue] = useState(initialValue)
  const [errorMessage, setErrorMessage] = useState(null)
  const uploadMediaMutation = useUploadMediaMutation()
  const syncValue = (nextValue) => {
    setValue(nextValue)
    setErrorMessage(null)
  }
  const clear = () => {
    setValue(emptyMediaUploadFieldValue)
    setErrorMessage(null)
  }
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setErrorMessage(null)
    const localPreviewUrl = await readFileAsDataUrl(file)
    setValue({
      fileName: file.name,
      mediaId: null,
      previewUrl: localPreviewUrl
    })
    try {
      const uploadResponse = await uploadMediaMutation.mutateAsync({
        file,
        purpose,
        resourceType
      })
      setValue({
        fileName: file.name,
        mediaId: uploadResponse.data.id,
        previewUrl: uploadResponse.data.deliveryUrl ?? localPreviewUrl
      })
    } catch (error) {
      const nextErrorMessage = getMediaUploadErrorMessage(error)
      setErrorMessage(nextErrorMessage)
      throw error
    } finally {
      event.target.value = ''
    }
  }
  return {
    clear,
    errorMessage,
    handleFileChange,
    isUploading: uploadMediaMutation.isPending,
    setErrorMessage,
    syncValue,
    value
  }
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.onerror = () => {
      reject(new Error('Kh\xF4ng th\u1EC3 \u0111\u1ECDc t\u1EC7p \u0111\xE3 ch\u1ECDn.'))
    }
    reader.readAsDataURL(file)
  })
}
function getMediaUploadErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c m\xE1y ch\u1EE7.'
    return (
      error.response.data?.message || 'Kh\xF4ng th\u1EC3 t\u1EA3i \u1EA3nh l\xEAn l\xFAc n\xE0y.'
    )
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Kh\xF4ng th\u1EC3 t\u1EA3i \u1EA3nh l\xEAn l\xFAc n\xE0y.'
}
export { useMediaUploadField }
