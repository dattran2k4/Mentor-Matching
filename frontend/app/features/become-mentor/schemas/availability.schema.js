import { z } from 'zod'
import { createRequiredStringSchema } from '@/schemas/common.schema'
const becomeMentorAvailabilityWindowSchema = z
  .object({
    mode: z.enum(['RECURRING', 'SPECIFIC_DATE']),
    selectedDays: z.array(z.string()),
    specificDate: z.string().trim(),
    startTime: createRequiredStringSchema('Vui l\xF2ng ch\u1ECDn gi\u1EDD b\u1EAFt \u0111\u1EA7u'),
    endTime: createRequiredStringSchema('Vui l\xF2ng ch\u1ECDn gi\u1EDD k\u1EBFt th\xFAc')
  })
  .superRefine((value, context) => {
    if (value.mode === 'RECURRING' && value.selectedDays.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['selectedDays'],
        message: 'Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t ng\xE0y trong tu\u1EA7n'
      })
    }
    if (value.mode === 'SPECIFIC_DATE' && !value.specificDate) {
      context.addIssue({
        code: 'custom',
        path: ['specificDate'],
        message: 'Vui l\xF2ng ch\u1ECDn ng\xE0y c\u1EE5 th\u1EC3'
      })
    }
  })
const becomeMentorAvailabilitySchema = z.object({
  availabilities: z
    .array(becomeMentorAvailabilityWindowSchema)
    .min(1, 'Vui l\xF2ng th\xEAm \xEDt nh\u1EA5t m\u1ED9t khung gi\u1EDD r\u1EA3nh')
})
export { becomeMentorAvailabilitySchema, becomeMentorAvailabilityWindowSchema }
