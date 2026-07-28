const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))
function buildSuccessResponse(data, message = 'Success') {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
function buildCreatedResponse(data, message = 'Created') {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
const mockMediaApi = {
  async createUploadIntent(payload) {
    await delay()
    const mediaAssetId = Date.now()
    const objectKey = `mock/users/current/${payload.purpose.toLowerCase()}/${mediaAssetId}`
    return buildCreatedResponse(
      {
        mediaAssetId,
        provider: 'CLOUDINARY',
        uploadUrl: 'https://api.cloudinary.com/v1_1/mock/image/upload',
        objectKey,
        formFields: {
          api_key: 'mock-api-key',
          public_id: objectKey,
          timestamp: String(Math.floor(Date.now() / 1e3)),
          signature: 'mock-signature'
        }
      },
      'Create media upload intent successfully'
    )
  },
  async confirmUpload(mediaAssetId, payload) {
    await delay()
    return buildSuccessResponse(
      {
        id: mediaAssetId,
        provider: 'CLOUDINARY',
        objectKey: payload.objectKey,
        deliveryUrl: payload.deliveryUrl,
        resourceType: 'IMAGE',
        mimeType: 'image/jpeg',
        fileSizeBytes: payload.fileSizeBytes ?? null,
        width: payload.width ?? null,
        height: payload.height ?? null,
        accessType: 'PUBLIC',
        purpose: 'AVATAR',
        status: 'READY'
      },
      'Confirm media upload successfully'
    )
  }
}
export { mockMediaApi }
