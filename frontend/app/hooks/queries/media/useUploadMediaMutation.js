import { useMutation } from '@tanstack/react-query'
import { mediaApi } from '@/services/media.api'
function useUploadMediaMutation() {
  return useMutation({
    mutationFn: async ({
      file,
      metadata,
      purpose,
      resourceType = resolveMediaResourceType(file)
    }) => {
      const uploadIntentResponse = await mediaApi.createUploadIntent({
        fileSizeBytes: file.size,
        mimeType: file.type || null,
        originalFilename: file.name || null,
        purpose,
        resourceType
      })
      const uploadIntent = uploadIntentResponse.data
      const providerUpload = await uploadToProvider(uploadIntent.uploadUrl, {
        file,
        formFields: uploadIntent.formFields
      })
      return mediaApi.confirmUpload(uploadIntent.mediaAssetId, {
        deliveryUrl: providerUpload.secure_url ?? '',
        etag: providerUpload.etag ?? null,
        fileSizeBytes: providerUpload.bytes ?? file.size,
        height: providerUpload.height ?? null,
        metadataJson: metadata ? JSON.stringify(metadata) : null,
        objectKey: providerUpload.public_id ?? uploadIntent.objectKey,
        providerAssetId:
          providerUpload.asset_id ?? providerUpload.public_id ?? uploadIntent.objectKey,
        version: providerUpload.version === void 0 ? null : String(providerUpload.version),
        width: providerUpload.width ?? null
      })
    }
  })
}
async function uploadToProvider(uploadUrl, { file, formFields }) {
  if (isMockUploadUrl(uploadUrl)) {
    return buildMockUploadResponse(file, formFields)
  }
  const formData = new FormData()
  Object.entries(formFields).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', file)
  const response = await fetch(uploadUrl, {
    body: formData,
    method: 'POST'
  })
  if (!response.ok) {
    throw new Error(
      'Kh\xF4ng th\u1EC3 t\u1EA3i t\u1EC7p l\xEAn nh\xE0 cung c\u1EA5p l\u01B0u tr\u1EEF.'
    )
  }
  return await response.json()
}
function buildMockUploadResponse(file, formFields) {
  const publicId = formFields.public_id ?? `mock/${Date.now()}`
  return {
    asset_id: `mock-asset-${Date.now()}`,
    bytes: file.size,
    public_id: publicId,
    secure_url: `https://example.com/${publicId}.jpg`,
    version: Date.now()
  }
}
function isMockUploadUrl(uploadUrl) {
  return uploadUrl.includes('/mock/')
}
function resolveMediaResourceType(file) {
  if (file.type.startsWith('image/')) return 'IMAGE'
  if (file.type.startsWith('video/')) return 'VIDEO'
  return 'RAW'
}
export { useUploadMediaMutation }
