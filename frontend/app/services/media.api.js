import { env } from '@/config/env'
import http from '@/libs/http'
import { mockMediaApi } from '@/services/mock/media.mock.api'
const MEDIA_ENDPOINTS = {
  uploadIntents: 'media/upload-intents',
  confirmUpload: (mediaAssetId) => `media/${mediaAssetId}/confirm`
}
const defaultMediaApi = {
  createUploadIntent: async (payload) =>
    (await http.post(MEDIA_ENDPOINTS.uploadIntents, payload)).data,
  confirmUpload: async (mediaAssetId, payload) =>
    (await http.post(MEDIA_ENDPOINTS.confirmUpload(mediaAssetId), payload)).data
}
const mediaApi = env.useMock ? mockMediaApi : defaultMediaApi
export { mediaApi }
