import { z } from 'zod'
import { createRequiredStringSchema } from '@/schemas/common.schema'
const verificationDocumentSchema = z.object({
  fileName: z.string().trim(),
  mediaId: z.number().nullable(),
  previewUrl: z.string().trim()
})
const becomeMentorVerificationSchema = z.object({
  verificationFullName: createRequiredStringSchema(
    'Vui l\xF2ng nh\u1EADp h\u1ECD t\xEAn tr\xEAn gi\u1EA5y t\u1EDD'
  ),
  idCardNumber: createRequiredStringSchema('Vui l\xF2ng nh\u1EADp s\u1ED1 gi\u1EA5y t\u1EDD'),
  documents: z
    .object({
      idFront: verificationDocumentSchema,
      idBack: verificationDocumentSchema,
      selfieWithId: verificationDocumentSchema
    })
    .superRefine((documents, context) => {
      if (!documents.idFront.mediaId) {
        context.addIssue({
          code: 'custom',
          message: 'Vui l\xF2ng t\u1EA3i \u1EA3nh m\u1EB7t tr\u01B0\u1EDBc gi\u1EA5y t\u1EDD',
          path: ['idFront', 'mediaId']
        })
      }
      if (!documents.idBack.mediaId) {
        context.addIssue({
          code: 'custom',
          message: 'Vui l\xF2ng t\u1EA3i \u1EA3nh m\u1EB7t sau gi\u1EA5y t\u1EDD',
          path: ['idBack', 'mediaId']
        })
      }
    })
})
export { becomeMentorVerificationSchema }
