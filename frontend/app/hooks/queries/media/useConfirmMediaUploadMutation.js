import { useMutation } from '@tanstack/react-query'
import { mediaApi } from '@/services/media.api'
function useConfirmMediaUploadMutation() {
  return useMutation({
    mutationFn: async ({ mediaAssetId, payload }) => mediaApi.confirmUpload(mediaAssetId, payload)
  })
}
export { useConfirmMediaUploadMutation }
