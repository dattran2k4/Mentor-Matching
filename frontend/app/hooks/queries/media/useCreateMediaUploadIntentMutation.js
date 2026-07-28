import { useMutation } from '@tanstack/react-query'
import { mediaApi } from '@/services/media.api'
function useCreateMediaUploadIntentMutation() {
  return useMutation({
    mutationFn: async (payload) => mediaApi.createUploadIntent(payload)
  })
}
export { useCreateMediaUploadIntentMutation }
